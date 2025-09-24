import { join } from "path";

export const PHOTO_STORAGE_DIR = join(process.cwd(), "photos");
export const ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp"] as const;
export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const PHOTO_DOWNLOAD_CACHE_CONTROL = "public, max-age=31536000";
