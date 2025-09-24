import { NextRequest, NextResponse } from "next/server";
import {
  PhotoStorageError,
  saveUploadedPhoto,
} from "@/features/photos/photoStorage";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("photo");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No se seleccionó ningún archivo" },
        { status: 400 }
      );
    }

    const result = await saveUploadedPhoto(file);

    return NextResponse.json({
      message: "Foto subida exitosamente",
      filename: result.filename,
      originalName: result.originalName,
    });
  } catch (error) {
    console.error("Error uploading file:", error);

    if (error instanceof PhotoStorageError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { error: "Error subiendo archivo" },
      { status: 500 }
    );
  }
}
