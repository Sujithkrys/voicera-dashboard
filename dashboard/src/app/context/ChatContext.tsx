import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatThread {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

interface ChatContextType {
  threads: ChatThread[];
  activeThreadId: string | null;
  setActiveThreadId: (id: string | null) => void;
  createThread: (firstMessage?: string) => string;
  addMessage: (threadId: string, message: Message) => void;
  deleteThread: (id: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  const createThread = (firstMessage?: string) => {
    const id = Date.now().toString();
    const thread: ChatThread = {
      id,
      title: firstMessage
        ? firstMessage.slice(0, 40) + (firstMessage.length > 40 ? "..." : "")
        : "New chat",
      messages: [],
      createdAt: new Date(),
    };
    setThreads((prev) => [thread, ...prev]);
    setActiveThreadId(id);
    return id;
  };

  const addMessage = (threadId: string, message: Message) => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== threadId) return t;
        const updated = { ...t, messages: [...t.messages, message] };
        if (t.messages.length === 0 && message.role === "user") {
          updated.title =
            message.content.slice(0, 40) +
            (message.content.length > 40 ? "..." : "");
        }
        return updated;
      })
    );
  };

  const deleteThread = (id: string) => {
    setThreads((prev) => prev.filter((t) => t.id !== id));
    if (activeThreadId === id) {
      setActiveThreadId(null);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        threads,
        activeThreadId,
        setActiveThreadId,
        createThread,
        addMessage,
        deleteThread,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
