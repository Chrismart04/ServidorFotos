import { NextResponse } from "next/server";
import {
  PhotoStorageError,
  readStoredPhoto,
} from "@/features/photos/photoStorage";

export async function GET(
  _request: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;
    const resource = await readStoredPhoto(filename);

    return new NextResponse(resource.file, {
      headers: {
        "Content-Type": resource.contentType,
        "Cache-Control": resource.cacheControl,
      },
    });
  } catch (error) {
    if (error instanceof PhotoStorageError) {
      return new NextResponse(error.message, { status: error.status });
    }

    console.error("Error serving photo:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
