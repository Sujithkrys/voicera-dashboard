import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestionChips = [
  "Show me today's call summary",
  "What's the escalation trend?",
  "Help me configure the bot",
  "Analyze resolution rate",
];

export function AIChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(text),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChipClick = (chip: string) => {
    setInput(chip);
    setTimeout(() => {
      handleSend();
    }, 50);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-background">
      {/* Chat body */}
      <div
        className="overflow-y-auto transition-all duration-300"
        style={{ maxHeight: hasMessages ? 360 : "auto" }}
      >
        {!hasMessages ? (
          /* Empty state — greeting */
          <div className="flex flex-col items-center justify-center py-10 px-6">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mb-4">
              <Sparkles className="size-5 text-primary-foreground" strokeWidth={1.8} />
            </div>
            <h3 className="text-[16px] font-semibold text-foreground mb-1">
              Voicera AI Assistant
            </h3>
            <p className="text-[13px] text-muted-foreground mb-6 text-center max-w-md">
              Ask me anything about your calls, metrics, or get help configuring your bot.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestionChips.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => handleChipClick(chip)}
                  className="px-3.5 py-2 text-[12px] font-medium text-muted-foreground bg-muted border border-border rounded-lg hover:bg-secondary hover:border-border transition-all cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages */
          <div className="px-5 py-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    msg.role === "assistant"
                      ? "bg-primary text-primary-foreground"
                      : "bg-neutral-200 text-muted-foreground"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Sparkles className="size-3.5" strokeWidth={2} />
                  ) : (
                    <User className="size-3.5" strokeWidth={2} />
                  )}
                </div>
                {/* Bubble */}
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-xl text-[13px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted text-foreground border border-border rounded-tl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                  <Sparkles className="size-3.5" strokeWidth={2} />
                </div>
                <div className="bg-muted border border-border rounded-xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="border-t border-border px-4 py-3">
        <div className="flex items-end gap-2 bg-muted border border-border rounded-xl px-4 py-2.5 focus-within:border-neutral-400 focus-within:bg-background transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Voicera AI anything..."
            rows={1}
            className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none resize-none leading-relaxed min-h-[20px] max-h-[100px]"
            style={{ scrollbarWidth: "none" }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
              input.trim() && !isTyping
                ? "bg-primary text-primary-foreground hover:bg-primary cursor-pointer"
                : "bg-neutral-200 text-muted-foreground cursor-not-allowed"
            }`}
          >
            <Send className="size-3.5" strokeWidth={2} />
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2 text-center">
          AI responses are simulated. Press Enter to send, Shift+Enter for new line.
        </p>
      </div>
    </div>
  );
}

/** Generate a contextual mock response */
function getAIResponse(input: string): string {
  const lower = input.toLowerCase();

  if (lower.includes("call") && (lower.includes("summary") || lower.includes("today"))) {
    return "Today you've handled 4,821 total calls with 856 active sessions. Your resolution rate is at 92%, which is above your weekly average. Escalations are down 8% compared to yesterday — great progress!";
  }
  if (lower.includes("escalation") || lower.includes("escalated")) {
    return "Escalation trend is improving. You had 80 escalations today, down 8% from yesterday. The main drivers are billing disputes (38%) and technical issues (45%). I'd recommend reviewing the billing FAQ in your knowledge base to further reduce these.";
  }
  if (lower.includes("bot") || lower.includes("config")) {
    return "To configure your bot, head to Bot Config in the sidebar. You can adjust the greeting message, set up auto-responses for common queries, and define escalation triggers. Would you like me to walk you through any specific setting?";
  }
  if (lower.includes("resolution") || lower.includes("rate")) {
    return "Your resolution rate is currently 92%, which is in the 'Normal' range. Over the past 7 days, it's ranged from 88% to 94%. The top resolved categories are Technical Issues (72%) and Account Access (38%).";
  }
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return "Hello! I'm your Voicera AI assistant. I can help you understand your call metrics, analyze trends, or navigate dashboard features. What would you like to know?";
  }

  return "I can help you with call analytics, session insights, escalation trends, and bot configuration. Try asking about today's call summary, escalation patterns, or resolution rate analysis.";
}
