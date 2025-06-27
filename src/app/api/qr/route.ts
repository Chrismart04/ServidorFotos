import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { getLocalIP } from "@/lib/utils";

export async function GET() {
  try {
    const localIP = getLocalIP();
    const port = process.env.PORT || 3000;
    const url = `http://${localIP}:${port}`;
    const qrCode = await QRCode.toDataURL(url);
    
    return NextResponse.json({ qrCode, url });
  } catch (error) {
    console.error("Error generating QR code:", error);
    return NextResponse.json(
      { error: "Error generando código QR" },
      { status: 500 }
    );
  }
}