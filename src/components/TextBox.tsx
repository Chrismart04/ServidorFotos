"use client";

import { useState, useEffect, useCallback } from "react";
import { useFlashMessages } from "@/features/ui/useFlashMessages";
import {
  fetchTexts,
  saveText,
  deleteText,
  type TextItem,
} from "@/features/texts/apiClient";

export default function TextBox() {
  const [text, setText] = useState("");
  const [savedTexts, setSavedTexts] = useState<TextItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { messages, showMessage } = useFlashMessages();

  const loadTexts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchTexts();
      setSavedTexts(data);
    } catch (error) {
      console.error("Error loading texts:", error);
      showMessage("Error cargando textos", "error");
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    loadTexts();
  }, [loadTexts]);

  const copyToClipboard = async (textToCopy: string) => {
    if (!textToCopy || !textToCopy.trim()) {
      showMessage("No hay texto para copiar", "error");
      return;
    }

    console.log("Attempting to copy:", textToCopy); // Debug log

    try {
      // Try modern clipboard API first (works in secure contexts)
      if (navigator.clipboard && window.isSecureContext) {
        console.log("Using modern clipboard API");
        await navigator.clipboard.writeText(textToCopy);
        showMessage("¡Texto copiado al portapapeles!", "success");
        return;
      }

      // Fallback for older browsers or non-secure contexts
      console.log("Using fallback copy method");
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      textArea.style.opacity = "0";
      textArea.setAttribute("readonly", "");
      document.body.appendChild(textArea);

      // Select the text
      textArea.select();
      textArea.setSelectionRange(0, 99999); // For mobile devices

      // Copy the text
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        showMessage("¡Texto copiado al portapapeles!", "success");
      } else {
        showMessage(
          "Error al copiar el texto. Intenta seleccionar y copiar manualmente.",
          "error"
        );
      }
    } catch (error) {
      console.error("Copy error:", error);
      showMessage(
        "Error al copiar el texto. Intenta seleccionar y copiar manualmente.",
        "error"
      );
    }
  };

  const saveTextToServer = async () => {
    if (!text.trim()) {
      showMessage("No hay texto para guardar", "error");
      return;
    }

    try {
      setSaving(true);
      await saveText(text);
      showMessage("¡Texto guardado exitosamente!", "success");
      setText("");
      loadTexts(); // Reload the list
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      showMessage(`Error guardando texto: ${message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteSavedText = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este texto?")) {
      return;
    }

    try {
      await deleteText(id);
      showMessage("Texto eliminado exitosamente", "success");
      loadTexts(); // Reload the list
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      showMessage(`Error eliminando texto: ${message}`, "error");
    }
  };

  const clearText = () => {
    setText("");
    showMessage("Texto limpiado", "success");
  };

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        📝 Caja de Texto
      </h2>

      <div className="space-y-4 mb-6">
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

      <div className="space-y-4">
        <div>
          <label
            htmlFor="text-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Escribe tu texto aquí:
          </label>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe cualquier texto que quieras copiar y pegar en otros dispositivos..."
            className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800 placeholder-gray-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              console.log("Copy button clicked for current text");
              copyToClipboard(text);
            }}
            disabled={!text.trim()}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full font-medium hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            📋 Copiar Texto
          </button>
          <button
            onClick={saveTextToServer}
            disabled={!text.trim() || saving}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-medium hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {saving ? "💾 Guardando..." : "💾 Guardar"}
          </button>
          <button
            onClick={clearText}
            disabled={!text.trim()}
            className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-full font-medium hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            🗑️ Limpiar
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-800 mb-2">💡 Consejos:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Escribe cualquier texto que quieras compartir</li>
            <li>• Haz clic en "Guardar" para sincronizar entre dispositivos</li>
            <li>• Haz clic en "Copiar Texto" para copiarlo al portapapeles</li>
            <li>
              • Pega el texto (Ctrl+V o Cmd+V) en cualquier otro dispositivo
            </li>
            <li>• Útil para compartir enlaces, códigos, notas, etc.</li>
          </ul>
        </div>
      </div>

      {/* Saved Texts Section */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          📚 Textos Guardados
        </h3>

        {loading ? (
          <div className="text-center py-8">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando textos...</p>
          </div>
        ) : savedTexts.length === 0 ? (
          <p className="text-center text-gray-600 py-8">
            No hay textos guardados aún. ¡Guarda tu primer texto para empezar!
          </p>
        ) : (
          <div className="space-y-4">
            {savedTexts.map((savedText) => (
              <div
                key={savedText.id}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="text-sm text-gray-500">
                    {formatDate(savedText.createdAt)}
                  </div>
                  <button
                    onClick={() => deleteSavedText(savedText.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3">
                  <p className="text-gray-800 whitespace-pre-wrap break-words">
                    {savedText.content}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      console.log(
                        "Copy button clicked for text:",
                        savedText.id
                      );
                      copyToClipboard(savedText.content);
                    }}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-medium hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                  >
                    📋 Copiar
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      // Create a temporary textarea to select the text
                      const textArea = document.createElement("textarea");
                      textArea.value = savedText.content;
                      textArea.style.position = "fixed";
                      textArea.style.top = "50%";
                      textArea.style.left = "50%";
                      textArea.style.transform = "translate(-50%, -50%)";
                      textArea.style.width = "80%";
                      textArea.style.height = "200px";
                      textArea.style.zIndex = "9999";
                      textArea.style.border = "2px solid #3b82f6";
                      textArea.style.borderRadius = "8px";
                      textArea.style.padding = "10px";
                      textArea.style.fontSize = "14px";
                      textArea.style.backgroundColor = "white";
                      textArea.style.boxShadow = "0 10px 25px rgba(0,0,0,0.3)";
                      document.body.appendChild(textArea);
                      textArea.focus();
                      textArea.select();

                      // Remove after 5 seconds
                      setTimeout(() => {
                        if (document.body.contains(textArea)) {
                          document.body.removeChild(textArea);
                        }
                      }, 5000);

                      showMessage(
                        "Texto seleccionado. Usa Ctrl+C (Cmd+C en Mac) para copiar.",
                        "success"
                      );
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                  >
                    📝 Seleccionar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
