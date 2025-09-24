import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const TEXTS_FILE = path.join(process.cwd(), "texts.json");

interface TextItem {
  id: string;
  content: string;
  createdAt: string;
}

// GET - Retrieve all texts
export async function GET() {
  try {
    // Check if texts file exists
    try {
      await fs.access(TEXTS_FILE);
    } catch {
      // File doesn't exist, return empty array
      return NextResponse.json([]);
    }

    const data = await fs.readFile(TEXTS_FILE, "utf8");
    const texts: TextItem[] = JSON.parse(data);

    // Sort by creation date (newest first)
    texts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(texts);
  } catch (error) {
    console.error("Error reading texts:", error);
    return NextResponse.json({ error: "Error reading texts" }, { status: 500 });
  }
}

// POST - Save a new text
export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (
      !content ||
      typeof content !== "string" ||
      content.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Content is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // Read existing texts
    let texts: TextItem[] = [];
    try {
      await fs.access(TEXTS_FILE);
      const data = await fs.readFile(TEXTS_FILE, "utf8");
      texts = JSON.parse(data);
    } catch {
      // File doesn't exist, start with empty array
    }

    // Create new text item
    const newText: TextItem = {
      id: Date.now().toString() + "-" + Math.random().toString(36).substr(2, 9),
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    // Add to texts array
    texts.unshift(newText); // Add to beginning

    // Save back to file
    await fs.writeFile(TEXTS_FILE, JSON.stringify(texts, null, 2));

    return NextResponse.json(newText, { status: 201 });
  } catch (error) {
    console.error("Error saving text:", error);
    return NextResponse.json({ error: "Error saving text" }, { status: 500 });
  }
}
