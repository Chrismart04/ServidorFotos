import { useState, useCallback } from "react";

export type FlashMessageType = "success" | "error";

export interface FlashMessage {
  id: string;
  text: string;
  type: FlashMessageType;
}

function createMessageId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useFlashMessages(initialMessages: FlashMessage[] = [], ttl = 5000) {
  const [messages, setMessages] = useState<FlashMessage[]>(initialMessages);

  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((message) => message.id !== id));
  }, []);

  const showMessage = useCallback(
    (text: string, type: FlashMessageType) => {
      const id = createMessageId();
      const message: FlashMessage = { id, text, type };
      setMessages((prev) => [...prev, message]);

      if (ttl > 0) {
        setTimeout(() => removeMessage(id), ttl);
      }
    },
    [removeMessage, ttl]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    showMessage,
    clearMessages,
    removeMessage,
  };
}
