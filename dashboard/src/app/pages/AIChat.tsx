import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, MoreHorizontal, AlertCircle, MessageSquare, BarChart, FileText, ShoppingCart } from "lucide-react";
import { useChat, Message } from "../context/ChatContext";

const suggestionCards = [
  { icon: <MessageSquare className="w-4 h-4" />, title: "Summarize today's calls", desc: "Get an overview of call volume and outcomes" },
  { icon: <FileText className="w-4 h-4" />, title: "Show recent ticket reasons", desc: "See patterns in customer issues" },
  { icon: <ShoppingCart className="w-4 h-4" />, title: "How many pending checkouts?", desc: "Check abandoned cart metrics" },
  { icon: <BarChart className="w-4 h-4" />, title: "Recovery stats overview", desc: "Understand your recovery performance" },
];

const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://voicera-dashboard-production-3c5b.up.railway.app';

export default function AIChat() {
  const { threads, activeThreadId, createThread, addMessage } = useChat();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeThread = threads.find((t) => t.id === activeThreadId) || null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeThread?.messages, isTyping]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 150) + "px";
    }
  }, [input]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    let targetId = activeThreadId;
    if (!targetId) {
      targetId = createThread(trimmed);
    }

    const currentThread = threads.find((t) => t.id === targetId) || (targetId === activeThreadId ? activeThread : null);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    addMessage(targetId, userMsg);
    setInput("");
    setIsTyping(true);

    try {
      const history = currentThread?.messages.map(m => ({
        role: m.role,
        content: m.content
      })) || [];
      
      const messages = [...history, { role: "user", content: trimmed }];
      
      const token = localStorage.getItem('voicera_token');
      let activeTools: string[] = [];
      
      try {
        const statusRes = await fetch(`${BACKEND_URL}/api/v1/oauth/status`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (statusRes.ok) {
          const enabledTools = await statusRes.json();
          activeTools = Object.entries(enabledTools)
            .filter(([_, enabled]) => enabled)
            .map(([name]) => name);
        }
      } catch (e) {
        console.warn("Failed to fetch oauth status", e);
      }

      const res = await fetch(`${BACKEND_URL}/api/v1/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ messages, enabled_tools: activeTools })
      });
      
      const data = await res.json();
      
      const errorMessage = data.detail || 'Sorry, an error occurred while connecting to the AI.';
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: res.ok ? (data.reply || data.response) : errorMessage,
        timestamp: new Date(),
      };
      addMessage(targetId!, aiMsg);
    } catch (err: any) {
      console.error('Chat error:', err);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Failed to connect to the server. ${err.message || ''}`,
        timestamp: new Date(),
      };
      addMessage(targetId!, aiMsg);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => sendMessage(input);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasMessages = activeThread && activeThread.messages.length > 0;

  return (
    <div className="flex h-full bg-background flex-col w-full relative">
      {/* Header */}
      <div className="h-[52px] border-b border-border flex items-center px-5 shrink-0 w-full bg-background relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <Sparkles className="size-3.5 text-primary-foreground" strokeWidth={2} />
          </div>
          <span className="text-[14px] font-semibold text-foreground">Voicera AI</span>
        </div>
        <div className="ml-auto">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-muted-foreground transition-colors">
            <MoreHorizontal className="size-4" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto w-full">
        {!hasMessages ? (
          /* ─── Empty / Welcome state ─── */
          <div className="flex flex-col items-start justify-center h-full px-8 max-w-4xl mx-auto">
            <h2 className="text-[26px] font-semibold text-foreground mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Ask Voicera AI
            </h2>
            <p className="text-[14px] text-muted-foreground mb-10 max-w-md">
              Ask me about your calls, metrics, team performance, or recent tickets.
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-2xl w-full">
              {suggestionCards.map((card, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(card.title)}
                  className="text-left p-4 border border-border rounded-lg hover:bg-muted/50 hover:border-border/80 transition-all group flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2.5 text-foreground/80 group-hover:text-foreground">
                    {card.icon}
                    <span className="text-[14px] font-medium">
                      {card.title}
                    </span>
                  </div>
                  <span className="text-[12px] text-muted-foreground">{card.desc}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ─── Conversation ─── */
          <div className="max-w-3xl mx-auto w-full px-4 py-6 pb-32">
            {activeThread.messages.map((msg) => (
              <div key={msg.id} className="mb-6">
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      msg.role === "assistant"
                        ? "bg-primary text-primary-foreground"
                        : "bg-neutral-200 text-muted-foreground"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <Sparkles className="size-4" strokeWidth={2} />
                    ) : (
                      <User className="size-4" strokeWidth={2} />
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-foreground mb-1">
                      <span className="flex items-center gap-2">
                        {msg.role === "assistant" ? "Voicera AI" : "You"}
                        {msg.syncStatus === "error" && (
                          <span className="flex items-center text-[11px] text-destructive font-medium gap-1">
                            <AlertCircle className="size-3" /> Failed to save
                          </span>
                        )}
                      </span>
                    </p>
                    <div className="text-[14px] text-foreground leading-relaxed whitespace-pre-wrap">
                      {msg.content.split(/(\*\*.*?\*\*)/).map((part, i) => {
                        if (part.startsWith("**") && part.endsWith("**")) {
                          return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
                        }
                        return <span key={i}>{part}</span>;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="mb-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="size-4" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-foreground mb-2">Voicera AI</p>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ─── Input area (Centered floating) ─── */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-background via-background to-transparent pt-6 pb-6 px-4 z-20">
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex items-end gap-2 bg-background rounded-md px-3 py-2 border border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all shadow-sm">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Voicera AI..."
              rows={1}
              className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground outline-none resize-none leading-relaxed py-1 min-h-[24px] max-h-[150px]"
              style={{ scrollbarWidth: "none" }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 mb-0.5 transition-all ${
                input.trim() && !isTyping
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
          <p className="text-[12px] text-muted-foreground mt-3 text-center">
            Voicera AI can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
}
