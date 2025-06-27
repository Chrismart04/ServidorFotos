import { NextResponse } from "next/server";
import { readdir, unlink } from "fs/promises";
import { join } from "path";
import { PHOTOS_DIR, isImageFile } from "@/lib/utils";

export async function DELETE() {
  try {
    const files = await readdir(PHOTOS_DIR);
    const imageFiles = files.filter(isImageFile);

    let deletedCount = 0;
    for (const file of imageFiles) {
      const filePath = join(PHOTOS_DIR, file);
      try {
        await unlink(filePath);
        deletedCount++;
      } catch (error) {
        console.error(`Error deleting ${file}:`, error);
      }
    }

    return NextResponse.json({
      message: `${deletedCount} fotos eliminadas exitosamente`,
      deletedCount: deletedCount,
    });
  } catch (error) {
    console.error("Error deleting all photos:", error);
    return NextResponse.json(
      { error: "Error eliminando todas las fotos" },
      { status: 500 }
    );
  }
}