import { NextResponse } from "next/server";
import {
  PhotoStorageError,
  deleteStoredPhoto,
} from "@/features/photos/photoStorage";

export async function DELETE(
  _request: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;
    await deleteStoredPhoto(filename);

    return NextResponse.json({
      message: "Foto eliminada exitosamente",
    });
  } catch (error) {
    if (error instanceof PhotoStorageError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    console.error("Error deleting photo:", error);
    return NextResponse.json(
      { error: "Error eliminando foto" },
      { status: 500 }
    );
  }
}
