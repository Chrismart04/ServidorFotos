import { NextResponse } from "next/server";
import { deleteAllStoredPhotos } from "@/features/photos/photoStorage";

export async function DELETE() {
  try {
    const deletedCount = await deleteAllStoredPhotos();

    return NextResponse.json({
      message: `${deletedCount} fotos eliminadas exitosamente`,
      deletedCount,
    });
  } catch (error) {
    console.error("Error deleting all photos:", error);
    return NextResponse.json(
      { error: "Error eliminando todas las fotos" },
      { status: 500 }
    );
  }
}
