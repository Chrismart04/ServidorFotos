"use client";

import { useState, useEffect } from "react";
import type { QRResponse } from "@/types";
import React from "react";

export default function QRSection() {
  const [qrData, setQrData] = useState<QRResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateQR = async () => {
      try {
        const response = await fetch("/api/qr");
        if (!response.ok) throw new Error("Error generating QR");
        const data: QRResponse = await response.json();
        setQrData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error generando código QR"
        );
      } finally {
        setLoading(false);
      }
    };

    generateQR();
  }, []);

  return (
    <div className="bg-white rounded-3xl p-8 mb-8 shadow-2xl">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          🔗 Conectar otros dispositivos
        </h2>
        <p className="text-gray-600 mb-6">
          Escanea este código QR con tu teléfono o tablet para acceder desde
          otros dispositivos:
        </p>

        <div className="bg-white p-6 rounded-2xl inline-block shadow-lg mb-6">
          {loading && (
            <div className="text-center">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-gray-600">Generando código QR...</p>
            </div>
          )}

          {error && <p className="text-red-500">Error generando código QR</p>}

          {qrData && (
            <img
              src={qrData.qrCode}
              alt="Código QR"
              className="max-w-[200px] mx-auto"
            />
          )}
        </div>

        {qrData && <p className="text-blue-600 font-medium">{qrData.url}</p>}
      </div>
    </div>
  );
}
