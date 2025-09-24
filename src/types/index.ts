export interface Photo {
  filename: string;
  uploadDate: string; // ISO string
  size: number;
}

export interface QRResponse {
  qrCode: string;
  url: string;
}

export interface UploadResponse {
  message: string;
  filename: string;
  originalName: string;
}

export interface DeleteResponse {
  message: string;
  deletedCount?: number;
}
