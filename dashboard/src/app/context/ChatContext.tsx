import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  timestamp: Date;
  syncStatus?: "sending" | "sent" | "error";
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
  createThread: (firstMessage?: string) => Promise<string>;
  addMessage: (threadId: string, message: Message) => void;
  deleteThread: (id: string) => void;
  deleteThreads: (ids: string[]) => void;
  togglePinThread: (id: string) => void;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const ACTIVE_THREAD_KEY = "voicera_active_thread";
const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://voicera-dashboard-production-3c5b.up.railway.app';

export function ChatProvider({ children }: { children: ReactNode }) {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeThreadId, setActiveThreadId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ACTIVE_THREAD_KEY) || null;
    } catch (e) {
      return null;
    }
  });

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

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('voicera_token');
        if (!token) {
          setIsLoading(false);
          return;
        }
        const res = await fetch(`${BACKEND_URL}/api/v1/chat-history`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const parsedThreads = data.map((t: any) => ({
            id: t.id,
            title: t.title,
            isPinned: t.isPinned,
            createdAt: new Date(t.createdAt),
            messages: t.messages.map((m: any) => ({
              id: m.id,
              role: m.role,
              content: m.content,
              timestamp: new Date(m.timestamp)
            }))
          }));
          setThreads(parsedThreads);
        }
      } catch (err) {
        console.error("Failed to load chat history", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const createThread = async (firstMessage?: string) => {
    const id = Date.now().toString();
    const title = firstMessage
        ? firstMessage.slice(0, 40) + (firstMessage.length > 40 ? "..." : "")
        : "New chat";
        
    const thread: ChatThread = {
      id,
      title,
      messages: [],
      createdAt: new Date(),
    };
    setThreads((prev) => [thread, ...prev]);
    setActiveThreadId(id);
    
    // Sync to backend asynchronously
    const token = localStorage.getItem('voicera_token');
    if (token) {
      try {
        await fetch(`${BACKEND_URL}/api/v1/chat-history/thread`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ id, title, isPinned: false })
        });
      } catch(err) {
        console.error("Failed to create thread on backend", err);
      }
    }
    
    return id;
  };

  const updateMessageStatus = (threadId: string, messageId: string, status: "sent" | "error") => {
    setThreads(prev => prev.map(t => {
      if (t.id !== threadId) return t;
      return {
        ...t,
        messages: t.messages.map(m => m.id === messageId ? { ...m, syncStatus: status } : m)
      };
    }));
  };

  const addMessage = (threadId: string, message: Message) => {
    const msgWithStatus = { ...message, syncStatus: "sending" as const };
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== threadId) return t;
        const updated = { ...t, messages: [...t.messages, msgWithStatus] };
        if (t.messages.length === 0 && message.role === "user") {
          updated.title =
            message.content.slice(0, 40) +
            (message.content.length > 40 ? "..." : "");
        }
        return updated;
      })
    );
    
    // Sync to backend asynchronously
    const token = localStorage.getItem('voicera_token');
    if (token) {
      fetch(`${BACKEND_URL}/api/v1/chat-history/thread/${threadId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: message.id,
          role: message.role,
          content: message.content,
          timestamp: message.timestamp.toISOString()
        })
      })
      .then(res => {
        if (!res.ok) updateMessageStatus(threadId, message.id, "error");
        else updateMessageStatus(threadId, message.id, "sent");
      })
      .catch(err => {
        console.error("Failed to append message on backend", err);
        updateMessageStatus(threadId, message.id, "error");
      });
    }
  };

  const deleteThread = (id: string) => {
    setThreads((prev) => prev.filter((t) => t.id !== id));
    if (activeThreadId === id) {
      setActiveThreadId(null);
    }
    const token = localStorage.getItem('voicera_token');
    if (token) {
      fetch(`${BACKEND_URL}/api/v1/chat-history/thread/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(err => console.error("Failed to delete thread on backend", err));
    }
  };

  const deleteThreads = (ids: string[]) => {
    setThreads((prev) => prev.filter((t) => !ids.includes(t.id)));
    if (activeThreadId && ids.includes(activeThreadId)) {
      setActiveThreadId(null);
    }
    ids.forEach(id => {
      const token = localStorage.getItem('voicera_token');
      if (token) {
        fetch(`${BACKEND_URL}/api/v1/chat-history/thread/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(err => console.error("Failed to delete thread on backend", err));
      }
    });
  };

  const togglePinThread = (id: string) => {
    let isPinnedNow = false;
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === id) {
            isPinnedNow = !t.isPinned;
            return { ...t, isPinned: isPinnedNow };
        }
        return t;
      })
    );
    const token = localStorage.getItem('voicera_token');
    if (token) {
      fetch(`${BACKEND_URL}/api/v1/chat-history/thread/${id}/pin`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isPinned: isPinnedNow })
      }).catch(err => console.error("Failed to toggle pin thread on backend", err));
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
        deleteThreads,
        togglePinThread,
        isLoading
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
