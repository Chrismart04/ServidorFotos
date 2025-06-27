import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { ensurePhotosDir, PHOTOS_DIR } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    await ensurePhotosDir();
    
    const formData = await request.formData();
    const file = formData.get("photo") as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "No se seleccionó ningún archivo" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Solo se permiten archivos de imagen" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "El archivo debe ser menor a 10MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.name.split('.').pop();
    const filename = `${uniqueSuffix}.${extension}`;
    const filepath = join(PHOTOS_DIR, filename);

    await writeFile(filepath, buffer);

    return NextResponse.json({
      message: "Foto subida exitosamente",
      filename: filename,
      originalName: file.name,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Error subiendo archivo" },
      { status: 500 }
    );
  }
}