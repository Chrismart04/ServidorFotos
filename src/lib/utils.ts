import { promises as fs } from "fs";
import { join } from "path";
import os from "os";

export const PHOTOS_DIR = join(process.cwd(), "photos");

export function getLocalIP(): string {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    if (!iface) continue;
    
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }
  return "localhost";
}

export async function ensurePhotosDir(): Promise<void> {
  try {
    await fs.access(PHOTOS_DIR);
  } catch {
    await fs.mkdir(PHOTOS_DIR, { recursive: true });
  }
}

export function isImageFile(filename: string): boolean {
  const ext = filename.toLowerCase().split('.').pop();
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '');
}