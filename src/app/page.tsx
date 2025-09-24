"use client";

import { useState } from "react";
import QRSection from "@/components/QRSection";
import UploadSection from "@/components/UploadSection";
import TextBox from "@/components/TextBox";
import PhotoGallery from "@/components/PhotoGallery";

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadComplete = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            📸 Compartir Fotos
          </h1>
          <p className="text-xl text-white/90">
            Comparte fotos fácilmente entre tus dispositivos
          </p>
        </div>

        <QRSection />
        <UploadSection onUploadComplete={handleUploadComplete} />
        <div className="mb-8">
          <TextBox />
        </div>
        <PhotoGallery refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}
