import { promises as fs } from "fs";
import { existsSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import type { Photo } from "@/types";
import {
  ALLOWED_IMAGE_EXTENSIONS,
  MAX_UPLOAD_SIZE_BYTES,
  PHOTO_DOWNLOAD_CACHE_CONTROL,
  PHOTO_STORAGE_DIR,
} from "@/config/photos";

export class PhotoStorageError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "PhotoStorageError";
  }
}

const MIME_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
};

async function ensurePhotoStorageDir(): Promise<void> {
  if (!existsSync(PHOTO_STORAGE_DIR)) {
    await fs.mkdir(PHOTO_STORAGE_DIR, { recursive: true });
  }
}

function getExtension(filename: string): string | undefined {
  return filename.split(".").pop()?.toLowerCase();
}

function assertAllowedExtension(extension: string | undefined): asserts extension {
  if (!extension || !ALLOWED_IMAGE_EXTENSIONS.includes(extension as typeof ALLOWED_IMAGE_EXTENSIONS[number])) {
    throw new PhotoStorageError("Formato de imagen no soportado", 400);
  }
}

export function resolvePhotoPath(filename: string): string {
  return join(PHOTO_STORAGE_DIR, filename);
}

export function inferMimeType(filename: string): string {
  const extension = getExtension(filename);
  return (extension && MIME_BY_EXTENSION[extension]) || "application/octet-stream";
}

export interface UploadResult {
  filename: string;
  originalName: string;
  size: number;
}

export async function saveUploadedPhoto(file: File): Promise<UploadResult> {
  if (!file.size) {
    throw new PhotoStorageError("El archivo está vacío", 400);
  }

  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    throw new PhotoStorageError("El archivo debe ser menor a 10MB", 400);
  }

  const candidateExtension = (getExtension(file.name) ?? file.type.split("/").pop() ?? "").toLowerCase();
  assertAllowedExtension(candidateExtension);
  const extension = candidateExtension;

  await ensurePhotoStorageDir();

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${Date.now()}-${randomUUID()}.${extension}`;
  const filepath = resolvePhotoPath(filename);

  await fs.writeFile(filepath, buffer);

  return {
    filename,
    originalName: file.name,
    size: file.size,
  };
}

export async function listStoredPhotos(): Promise<Photo[]> {
  await ensurePhotoStorageDir();

  const entries = await fs.readdir(PHOTO_STORAGE_DIR);
  const photos = await Promise.all(
    entries
      .filter((entry) => {
        const extension = getExtension(entry);
        return extension ? ALLOWED_IMAGE_EXTENSIONS.includes(extension as typeof ALLOWED_IMAGE_EXTENSIONS[number]) : false;
      })
      .map(async (filename) => {
        const stats = await fs.stat(resolvePhotoPath(filename));
        return {
          filename,
          uploadDate: stats.mtime.toISOString(),
          size: stats.size,
        } satisfies Photo;
      })
  );

  return photos.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
}

export async function deleteStoredPhoto(filename: string): Promise<void> {
  await ensurePhotoStorageDir();
  const filePath = resolvePhotoPath(filename);
  if (!existsSync(filePath)) {
    throw new PhotoStorageError("Foto no encontrada", 404);
  }

  await fs.unlink(filePath);
}

export async function deleteAllStoredPhotos(): Promise<number> {
  await ensurePhotoStorageDir();

  const entries = await fs.readdir(PHOTO_STORAGE_DIR);
  const deletions = await Promise.all(
    entries.map(async (filename) => {
      const extension = getExtension(filename);
      if (!extension || !ALLOWED_IMAGE_EXTENSIONS.includes(extension as typeof ALLOWED_IMAGE_EXTENSIONS[number])) {
        return 0;
      }

      try {
        await fs.unlink(resolvePhotoPath(filename));
        return 1;
      } catch (error) {
        console.error(`Error deleting ${filename}:`, error);
        return 0;
      }
    })
  );

  return deletions.reduce((acc, current) => acc + current, 0);
}

export async function readStoredPhoto(filename: string) {
  await ensurePhotoStorageDir();
  const filePath = resolvePhotoPath(filename);
  if (!existsSync(filePath)) {
    throw new PhotoStorageError("Foto no encontrada", 404);
  }

  const file = await fs.readFile(filePath);
  const contentType = inferMimeType(filename);

  return {
    file,
    contentType,
    cacheControl: PHOTO_DOWNLOAD_CACHE_CONTROL,
  };
}

export function isImageFile(filename: string): boolean {
  const extension = getExtension(filename);
  return extension ? ALLOWED_IMAGE_EXTENSIONS.includes(extension as typeof ALLOWED_IMAGE_EXTENSIONS[number]) : false;
}
