"use client";

import { useState, useRef, useCallback } from "react";
import { requestPhotoUpload } from "@/features/photos/apiClient";
import { useFlashMessages } from "@/features/ui/useFlashMessages";

interface UploadSectionProps {
  onUploadComplete: () => void;
}

export default function UploadSection({
  onUploadComplete,
}: UploadSectionProps) {
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { messages, showMessage, clearMessages } = useFlashMessages();

  const processUploadResult = useCallback(
    async (file: File) => {
      try {
        const result = await requestPhotoUpload(file);
        showMessage(`${result.originalName} subido exitosamente`, "success");
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Error desconocido durante la carga";
        showMessage(`Error subiendo ${file.name}: ${message}`, "error");
      }
    },
    [showMessage]
  );

  const uploadFiles = useCallback(
    async (files: FileList) => {
      if (files.length === 0) return;

      setLoading(true);
      clearMessages();

      const items = Array.from(files);

      for (const file of items) {
        if (!file.type.startsWith("image/")) {
          showMessage(
            `${file.name} no es un archivo de imagen válido`,
            "error"
          );
          continue;
        }

        await processUploadResult(file);
      }

      setLoading(false);
      onUploadComplete();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [clearMessages, onUploadComplete, processUploadResult, showMessage]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const files = e.dataTransfer.files;
    uploadFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      uploadFiles(files);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 mb-8 shadow-2xl">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          📤 Subir Fotos
        </h2>

        <div
          className={`border-3 border-dashed rounded-2xl p-12 mb-6 transition-all duration-300 cursor-pointer ${
            dragOver
              ? "border-blue-500 bg-blue-50 transform -translate-y-1"
              : "border-blue-400 bg-blue-50/50 hover:bg-blue-50 hover:transform hover:-translate-y-1"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-6xl mb-6 text-blue-500">📷</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Arrastra fotos aquí o haz clic para seleccionar
          </h3>
          <p className="text-gray-600">
            Formatos soportados: JPG, PNG, GIF, WebP (máx. 10MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
          />
        </div>

        <button
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 mb-6"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
        >
          Seleccionar Fotos
        </button>

        {loading && (
          <div className="text-center mb-6">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Subiendo fotos...</p>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-xl text-center font-medium ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
