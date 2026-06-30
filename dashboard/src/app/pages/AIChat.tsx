import React, { useState, useRef, useEffect } from "react";
import { Send, Plus, Sparkles, User, MoreHorizontal, PanelLeftClose } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatThread {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

const suggestionCards = [
  { icon: "📊", title: "Summarize today's calls", desc: "Get an overview of call volume and outcomes" },
  { icon: "📈", title: "Analyze escalation trends", desc: "See patterns in escalated issues" },
  { icon: "🤖", title: "Help configure the bot", desc: "Set up auto-responses and triggers" },
  { icon: "🎯", title: "Resolution rate insights", desc: "Understand your team's performance" },
];

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("call") && (lower.includes("summary") || lower.includes("today"))) {
    return "Here's your call summary for today:\n\n**Total Calls:** 4,821 (+12% from yesterday)\n**Active Sessions:** 856 (+14%)\n**Escalations:** 80 (-8%)\n**Resolution Rate:** 92%\n**Avg Handle Time:** 2m 44s\n\nYour team is performing above average today. Escalations are trending down, which is a great sign. The main call drivers are Technical Issues (72%) and Billing (51%).";
  }
  if (lower.includes("escalation") || lower.includes("escalated")) {
    return "Here's the escalation analysis:\n\n**Current Count:** 80 escalations today (-8% vs yesterday)\n\n**Top Escalation Reasons:**\n1. Technical Issues — 45% of escalations\n2. Billing Disputes — 38%\n3. Account Access — 12%\n4. Other — 5%\n\n**Recommendation:** The billing-related escalations could be reduced by updating the FAQ in your Knowledge Base with the latest pricing changes. Would you like me to help draft those entries?";
  }
  if (lower.includes("bot") || lower.includes("config")) {
    return "I can help you configure your bot. Here are the main settings you can adjust:\n\n1. **Greeting Message** — The first message callers hear\n2. **Auto-Responses** — Set up keyword-triggered replies\n3. **Escalation Triggers** — Define when to route to a human agent\n4. **Business Hours** — Set availability windows\n5. **Language Settings** — Configure supported languages\n\nHead to **Bot Config** in the sidebar to access these settings, or tell me which one you'd like to learn more about.";
  }
  if (lower.includes("resolution") || lower.includes("rate") || lower.includes("performance")) {
    return "Here's your resolution rate breakdown:\n\n**Overall Rate:** 92% (Normal range)\n**7-Day Trend:** 88% → 90% → 91% → 89% → 94% → 91% → 92%\n\n**By Category:**\n- Technical Issues: 89% resolution\n- Billing: 95% resolution\n- Account Access: 91% resolution\n- Feature Help: 97% resolution\n\nYour billing resolution rate is excellent. Technical issues could use improvement — consider adding more troubleshooting guides to the Knowledge Base.";
  }
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return "Hello! 👋 I'm your Voicera AI assistant. I can help you with:\n\n- **Call analytics** — summaries, trends, and breakdowns\n- **Team performance** — resolution rates and handle times\n- **Bot configuration** — setup and optimization tips\n- **Troubleshooting** — identify and resolve common issues\n\nWhat would you like to explore?";
  }
  return "I can help you with call analytics, session insights, escalation trends, and bot configuration. Here are some things you can ask me:\n\n- \"Summarize today's calls\"\n- \"What's the escalation trend?\"\n- \"Help me configure the bot\"\n- \"Analyze resolution rate\"\n\nWhat would you like to know?";
}

export default function AIChat() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
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

  const createThread = (firstMessage?: string) => {
    const id = Date.now().toString();
    const thread: ChatThread = {
      id,
      title: firstMessage ? firstMessage.slice(0, 40) + (firstMessage.length > 40 ? "..." : "") : "New chat",
      messages: [],
      createdAt: new Date(),
    };
    setThreads((prev) => [thread, ...prev]);
    setActiveThreadId(id);
    return id;
  };

  const sendMessage = (text: string, threadId?: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    let targetId = threadId || activeThreadId;
    if (!targetId) {
      targetId = createThread(trimmed);
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== targetId) return t;
        const updated = { ...t, messages: [...t.messages, userMsg] };
        if (t.messages.length === 0) {
          updated.title = trimmed.slice(0, 40) + (trimmed.length > 40 ? "..." : "");
        }
        return updated;
      })
    );

    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(trimmed),
        timestamp: new Date(),
      };
      setThreads((prev) =>
        prev.map((t) =>
          t.id === targetId ? { ...t, messages: [...t.messages, aiMsg] } : t
        )
      );
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
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
    <div className="flex h-full bg-white">
      {/* ─── Chat history sidebar ─── */}
      {showSidebar && (
        <div className="w-[260px] border-r border-neutral-100 flex flex-col bg-[#fafafa] shrink-0">
          <div className="p-3 flex items-center gap-2">
            <button
              onClick={() => {
                setActiveThreadId(null);
                setInput("");
              }}
              className="flex-1 flex items-center gap-2 h-[38px] px-3 bg-white border border-neutral-200 rounded-lg text-[13px] font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <Plus className="size-4" strokeWidth={2} />
              New chat
            </button>
            <button
              onClick={() => setShowSidebar(false)}
              className="w-[38px] h-[38px] flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
            >
              <PanelLeftClose className="size-4" strokeWidth={1.8} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-1">
            {threads.length === 0 ? (
              <p className="text-[12px] text-neutral-400 text-center mt-8 px-4">
                No conversations yet. Start a new chat!
              </p>
            ) : (
              <div className="space-y-0.5">
                {threads.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveThreadId(t.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-[13px] transition-colors truncate ${
                      t.id === activeThreadId
                        ? "bg-white text-neutral-900 font-medium shadow-sm border border-neutral-100"
                        : "text-neutral-600 hover:bg-white hover:text-neutral-900"
                    }`}
                  >
                    {t.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-neutral-100">
            <div className="flex items-center gap-2.5 px-2">
              <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center text-[11px] font-semibold">
                {localStorage.getItem("voicera_name")?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="text-[13px] text-neutral-700 truncate">
                {localStorage.getItem("voicera_name") || "User"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ─── Main chat area ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-[52px] border-b border-neutral-100 flex items-center px-5 shrink-0">
          {!showSidebar && (
            <button
              onClick={() => setShowSidebar(true)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors mr-3"
            >
              <PanelLeftClose className="size-4 rotate-180" strokeWidth={1.8} />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-neutral-900 flex items-center justify-center">
              <Sparkles className="size-3.5 text-white" strokeWidth={2} />
            </div>
            <span className="text-[14px] font-semibold text-neutral-900">Voicera AI</span>
          </div>
          <div className="ml-auto">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors">
              <MoreHorizontal className="size-4" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">
          {!hasMessages ? (
            /* ─── Empty / Welcome state ─── */
            <div className="flex flex-col items-center justify-center h-full px-6">
              <div className="w-14 h-14 rounded-2xl bg-neutral-900 flex items-center justify-center mb-5">
                <Sparkles className="size-7 text-white" strokeWidth={1.6} />
              </div>
              <h2 className="text-[22px] font-semibold text-neutral-900 mb-2">
                How can I help you today?
              </h2>
              <p className="text-[14px] text-neutral-400 mb-8 text-center max-w-md">
                Ask me about your calls, metrics, team performance, or get help with bot configuration.
              </p>
              <div className="grid grid-cols-2 gap-3 max-w-lg w-full">
                {suggestionCards.map((card, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(card.title)}
                    className="text-left p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 hover:border-neutral-300 transition-all group"
                  >
                    <span className="text-[18px] mb-2 block">{card.icon}</span>
                    <span className="text-[13px] font-medium text-neutral-900 block mb-0.5 group-hover:text-neutral-900">
                      {card.title}
                    </span>
                    <span className="text-[12px] text-neutral-400">{card.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* ─── Conversation ─── */
            <div className="max-w-3xl mx-auto w-full px-4 py-6">
              {activeThread.messages.map((msg) => (
                <div key={msg.id} className="mb-6">
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        msg.role === "assistant"
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-200 text-neutral-600"
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
                      <p className="text-[13px] font-semibold text-neutral-900 mb-1">
                        {msg.role === "assistant" ? "Voicera AI" : "You"}
                      </p>
                      <div className="text-[14px] text-neutral-700 leading-relaxed whitespace-pre-wrap">
                        {msg.content.split(/(\*\*.*?\*\*)/).map((part, i) => {
                          if (part.startsWith("**") && part.endsWith("**")) {
                            return <strong key={i} className="font-semibold text-neutral-900">{part.slice(2, -2)}</strong>;
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
                    <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="size-4" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold text-neutral-900 mb-2">Voicera AI</p>
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

        {/* ─── Input area ─── */}
        <div className="shrink-0 border-t border-neutral-100 px-4 py-4">
          <div className="max-w-3xl mx-auto w-full">
            <div className="flex items-end gap-3 bg-neutral-50 border border-neutral-200 rounded-2xl px-5 py-3 focus-within:border-neutral-400 focus-within:bg-white focus-within:shadow-sm transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Voicera AI..."
                rows={1}
                className="flex-1 bg-transparent text-[14px] text-neutral-900 placeholder:text-neutral-400 outline-none resize-none leading-relaxed min-h-[24px] max-h-[150px]"
                style={{ scrollbarWidth: "none" }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  input.trim() && !isTyping
                    ? "bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer"
                    : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                }`}
              >
                <Send className="size-4" strokeWidth={2} />
              </button>
            </div>
            <p className="text-[11px] text-neutral-400 mt-2.5 text-center">
              Voicera AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
