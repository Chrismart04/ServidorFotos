import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { PHOTOS_DIR } from "@/lib/utils";
import { existsSync } from "fs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const filePath = join(PHOTOS_DIR, filename);

    if (!existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    const file = await readFile(filePath);
    const extension = filename.split('.').pop()?.toLowerCase();
    
    let contentType = "application/octet-stream";
    switch (extension) {
      case "jpg":
      case "jpeg":
        contentType = "image/jpeg";
        break;
      case "png":
        contentType = "image/png";
        break;
      case "gif":
        contentType = "image/gif";
        break;
      case "webp":
        contentType = "image/webp";
        break;
    }

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Error serving photo:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}