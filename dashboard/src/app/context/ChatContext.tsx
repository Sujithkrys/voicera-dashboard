import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  isPinned?: boolean;
}

interface ChatContextType {
  threads: ChatThread[];
  activeThreadId: string | null;
  setActiveThreadId: (id: string | null) => void;
  createThread: (firstMessage?: string) => string;
  addMessage: (threadId: string, message: Message) => void;
  deleteThread: (id: string) => void;
  togglePinThread: (id: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const STORAGE_KEY = "voicera_chat_threads";
const ACTIVE_THREAD_KEY = "voicera_active_thread";

export function ChatProvider({ children }: { children: ReactNode }) {
  const [threads, setThreads] = useState<ChatThread[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          messages: t.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }))
        }));
      }
    } catch (e) {
      console.error("Error loading chat history", e);
    }
    return [];
  });

  const [activeThreadId, setActiveThreadId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ACTIVE_THREAD_KEY) || null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
    } catch (e) {
      console.error("Error saving chat history", e);
    }
  }, [threads]);

  useEffect(() => {
    try {
      if (activeThreadId) {
        localStorage.setItem(ACTIVE_THREAD_KEY, activeThreadId);
      } else {
        localStorage.removeItem(ACTIVE_THREAD_KEY);
      }
    } catch (e) {
      console.error("Error saving active thread", e);
    }
  }, [activeThreadId]);

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

  const togglePinThread = (id: string) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isPinned: !t.isPinned } : t))
    );
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
        togglePinThread,
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
