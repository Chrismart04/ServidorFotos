import { NextResponse } from "next/server";
import { listStoredPhotos } from "@/features/photos/photoStorage";

export async function GET() {
  try {
    const photos = await listStoredPhotos();
    return NextResponse.json(photos);
  } catch (error) {
    console.error("Error listing photos:", error);
    return NextResponse.json(
      { error: "Error listando fotos" },
      { status: 500 }
    );
  }
}
