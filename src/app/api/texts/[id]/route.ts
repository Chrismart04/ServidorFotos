import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const TEXTS_FILE = path.join(process.cwd(), "texts.json");

interface TextItem {
  id: string;
  content: string;
  createdAt: string;
}

// DELETE - Delete a specific text
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Read existing texts
    let texts: TextItem[] = [];
    try {
      await fs.access(TEXTS_FILE);
      const data = await fs.readFile(TEXTS_FILE, "utf8");
      texts = JSON.parse(data);
    } catch {
      return NextResponse.json(
        { error: "Texts file not found" },
        { status: 404 }
      );
    }

    // Find and remove the text
    const initialLength = texts.length;
    texts = texts.filter((text) => text.id !== id);

    if (texts.length === initialLength) {
      return NextResponse.json({ error: "Text not found" }, { status: 404 });
    }

    // Save back to file
    await fs.writeFile(TEXTS_FILE, JSON.stringify(texts, null, 2));

    return NextResponse.json({ message: "Text deleted successfully" });
  } catch (error) {
    console.error("Error deleting text:", error);
    return NextResponse.json({ error: "Error deleting text" }, { status: 500 });
  }
}
