import { NextResponse } from "next/server";
import { readdir, stat } from "fs/promises";
import { join } from "path";
import { PHOTOS_DIR, isImageFile } from "@/lib/utils";

export async function GET() {
  try {
    const files = await readdir(PHOTOS_DIR);
    const imageFiles = files.filter(isImageFile);
    
    const photos = await Promise.all(
      imageFiles.map(async (file) => {
        const filePath = join(PHOTOS_DIR, file);
        const stats = await stat(filePath);
        return {
          filename: file,
          uploadDate: stats.mtime,
          size: stats.size,
        };
      })
    );

    photos.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());

    return NextResponse.json(photos);
  } catch (error) {
    console.error("Error listing photos:", error);
    return NextResponse.json(
      { error: "Error listando fotos" },
      { status: 500 }
    );
  }
}