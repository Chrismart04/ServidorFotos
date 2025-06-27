import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import { join } from "path";
import { PHOTOS_DIR } from "@/lib/utils";
import { existsSync } from "fs";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const filePath = join(PHOTOS_DIR, filename);

    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: "Foto no encontrada" },
        { status: 404 }
      );
    }

    await unlink(filePath);

    return NextResponse.json({
      message: "Foto eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error deleting photo:", error);
    return NextResponse.json(
      { error: "Error eliminando foto" },
      { status: 500 }
    );
  }
}