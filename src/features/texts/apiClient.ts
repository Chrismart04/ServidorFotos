export interface TextItem {
  id: string;
  content: string;
  createdAt: string;
}

export interface SaveTextResponse {
  id: string;
  content: string;
  createdAt: string;
}

export interface DeleteTextResponse {
  message: string;
}

// Fetch all texts
export async function fetchTexts(): Promise<TextItem[]> {
  const response = await fetch("/api/texts");

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error fetching texts");
  }

  return response.json();
}

// Save a new text
export async function saveText(content: string): Promise<SaveTextResponse> {
  const response = await fetch("/api/texts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error saving text");
  }

  return response.json();
}

// Delete a text
export async function deleteText(id: string): Promise<DeleteTextResponse> {
  const response = await fetch(`/api/texts/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error deleting text");
  }

  return response.json();
}
