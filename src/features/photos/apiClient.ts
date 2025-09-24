import type { DeleteResponse, Photo, UploadResponse } from "@/types";

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json() as Promise<T>;
  }

  let errorMessage = "Error en la solicitud";
  try {
    const data = await response.json();
    errorMessage = data.error ?? errorMessage;
  } catch (error) {
    console.error("Error parsing response:", error);
  }

  throw new Error(errorMessage);
}

export async function fetchPhotoList(): Promise<Photo[]> {
  const response = await fetch("/api/photos-list", {
    cache: "no-store",
  });
  return parseResponse<Photo[]>(response);
}

export async function requestPhotoUpload(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("photo", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  return parseResponse<UploadResponse>(response);
}

export async function requestPhotoDeletion(filename: string): Promise<void> {
  const response = await fetch(`/api/photos/${filename}`, {
    method: "DELETE",
  });

  await parseResponse<{ message: string }>(response);
}

export async function requestDeleteAllPhotos(): Promise<DeleteResponse> {
  const response = await fetch("/api/photos", {
    method: "DELETE",
  });

  return parseResponse<DeleteResponse>(response);
}
