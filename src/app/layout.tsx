import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "📸 Compartir Fotos",
  description: "Comparte fotos fácilmente entre tus dispositivos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
