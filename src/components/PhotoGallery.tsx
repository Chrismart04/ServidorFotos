"use client";

import { useState, useEffect, useCallback } from "react";
import type { Photo, DeleteResponse } from "@/types";

interface PhotoGalleryProps {
  refreshTrigger: number;
}

export default function PhotoGallery({ refreshTrigger }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteAllLoading, setDeleteAllLoading] = useState(false);
  const [messages, setMessages] = useState<{ text: string; type: "success" | "error" }[]>([]);

  const showMessage = useCallback((text: string, type: "success" | "error") => {
    const message = { text, type };
    setMessages(prev => [...prev, message]);
    
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m !== message));
    }, 5000);
  }, []);

  const loadPhotos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/photos-list");
      if (!response.ok) throw new Error("Error loading photos");
      const data: Photo[] = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error("Error loading photos:", error);
      showMessage("Error cargando fotos", "error");
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos, refreshTrigger]);

  const downloadPhoto = (filename: string) => {
    const link = document.createElement("a");
    link.href = `/photos/${filename}`;
    link.download = filename;
    link.click();
  };

  const deletePhoto = async (filename: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta foto?")) {
      return;
    }

    try {
      const response = await fetch(`/api/photos/${filename}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showMessage("Foto eliminada exitosamente", "success");
        loadPhotos();
      } else {
        const error = await response.json();
        showMessage(`Error eliminando foto: ${error.error}`, "error");
      }
    } catch (error) {
      showMessage(`Error eliminando foto: ${error instanceof Error ? error.message : 'Error desconocido'}`, "error");
    }
  };

  const downloadAllPhotos = async () => {
    if (photos.length === 0) {
      showMessage("No hay fotos para descargar", "error");
      return;
    }

    showMessage(`Iniciando descarga de ${photos.length} fotos...`, "success");

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      downloadPhoto(photo.filename);

      if (i < photos.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    showMessage(`¡${photos.length} fotos descargadas exitosamente!`, "success");
  };

  const deleteAllPhotos = async () => {
    if (!confirm("⚠️ ¿Estás seguro de que quieres ELIMINAR TODAS las fotos?\n\nEsta acción NO SE PUEDE DESHACER.")) {
      return;
    }

    if (!confirm("🚨 ÚLTIMA CONFIRMACIÓN\n\n¿Realmente quieres borrar TODAS las fotos del servidor?\n\nTodas las fotos se perderán PERMANENTEMENTE.")) {
      return;
    }

    try {
      setDeleteAllLoading(true);
      const response = await fetch("/api/photos", {
        method: "DELETE",
      });

      if (response.ok) {
        const result: DeleteResponse = await response.json();
        showMessage(result.message, "success");
        loadPhotos();
      } else {
        const error = await response.json();
        showMessage(`Error eliminando fotos: ${error.error}`, "error");
      }
    } catch (error) {
      showMessage(`Error eliminando fotos: ${error instanceof Error ? error.message : 'Error desconocido'}`, "error");
    } finally {
      setDeleteAllLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🖼️ Galería de Fotos</h2>
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando fotos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">🖼️ Galería de Fotos</h2>
      
      <div className="space-y-4 mb-6">
        {messages.map((message, index) => (
          <div
            key={index}
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

      {photos.length === 0 ? (
        <p className="text-center text-gray-600 py-12">
          No hay fotos subidas aún. ¡Sube algunas fotos para empezar!
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {photos.map((photo) => (
              <div
                key={photo.filename}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="relative">
                  <img
                    src={`/photos/${photo.filename}`}
                    alt="Foto"
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-x-2">
                    <button
                      onClick={() => downloadPhoto(photo.filename)}
                      className="bg-black/70 text-white w-9 h-9 rounded-full hover:bg-black/90 hover:scale-110 transition-all duration-200 flex items-center justify-center"
                      title="Descargar"
                    >
                      ⬇️
                    </button>
                    <button
                      onClick={() => deletePhoto(photo.filename)}
                      className="bg-black/70 text-white w-9 h-9 rounded-full hover:bg-black/90 hover:scale-110 transition-all duration-200 flex items-center justify-center"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-semibold text-gray-800 text-sm mb-1 truncate">
                    {photo.filename}
                  </div>
                  <div className="text-gray-600 text-xs">
                    {formatDate(photo.uploadDate)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center space-x-4">
            <button
              onClick={downloadAllPhotos}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              📥 Descargar Todos
            </button>
            <button
              onClick={deleteAllPhotos}
              disabled={deleteAllLoading}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full font-medium hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleteAllLoading ? "Eliminando..." : "🗑️ Borrar Todo"}
            </button>
          </div>

          {deleteAllLoading && (
            <div className="text-center mt-6">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-gray-600">Eliminando todas las fotos...</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}