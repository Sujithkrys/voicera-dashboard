import React, { useState, useEffect, useRef } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Mic, Play, Sparkles, MessageSquare, Save, Link, Copy, Workflow, Send, RefreshCw } from "lucide-react";
import VisualBuilder from "../components/flow/VisualBuilder";
import { apiClient } from "../../api/client";
import { jwtDecode } from "jwt-decode";

const voices = [
  { id: "v1", name: "Aria", type: "Female, Professional", tag: "Top Choice" },
  { id: "v2", name: "Marcus", type: "Male, Friendly", tag: "" },
  { id: "v3", name: "Sofia", type: "Female, Empathetic", tag: "" },
  { id: "v4", name: "Liam", type: "Male, Confident", tag: "" },
];

const colors = ["#1a1a1a", "#3b82f6", "#8b5cf6", "#10b981", "#f43f5e", "#f59e0b"];

export default function BotConfig() {
  const [selectedVoice, setSelectedVoice] = useState("v1");
  const [primaryColor, setPrimaryColor] = useState(colors[0]);
  const [botName, setBotName] = useState("Voicera Assistant");
  const [widgetSubtitle, setWidgetSubtitle] = useState("Typically replies in seconds");
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful customer support agent for Voicera. You answer questions politely and concisely.");
  const [initialGreeting, setInitialGreeting] = useState("Hi there! How can I help you today?");
  
  const [showVisualBuilder, setShowVisualBuilder] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Interactive Chat State
  const [previewMessages, setPreviewMessages] = useState<{role: string, content: string}[]>([]);
  const [previewInput, setPreviewInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const data = await apiClient('/bot-config');
      if (data) {
        if (data.bot_name) setBotName(data.bot_name);
        if (data.system_prompt) setSystemPrompt(data.system_prompt);
        if (data.default_greeting) setInitialGreeting(data.default_greeting);
        
        // Reset preview chat
        setPreviewMessages([
          { role: "assistant", content: data.default_greeting || initialGreeting }
        ]);
      }
    } catch (e) {
      console.error("Failed to load bot config:", e);
      setPreviewMessages([
        { role: "assistant", content: initialGreeting }
      ]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiClient('/bot-config', {
        method: 'POST',
        body: JSON.stringify({
          bot_name: botName,
          system_prompt: systemPrompt,
          default_greeting: initialGreeting,
          chat_response_length: "balanced",
          response_format: "bullets",
          escalation_keywords: "speak to human,agent,specialist,manager,cancel,refund",
          escalation_message: "Let me connect you with a specialist.",
          blacklisted_topics: ""
        })
      });
      alert("Configuration saved successfully!");
      // Reset chat using new greeting
      setPreviewMessages([
        { role: "assistant", content: initialGreeting }
      ]);
    } catch (e: any) {
      console.error("Save failed:", e);
      alert(`Save failed: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestChat = async () => {
    if (!previewInput.trim()) return;
    
    const userText = previewInput.trim();
    setPreviewInput("");
    setPreviewMessages(prev => [...prev, { role: "user", content: userText }]);
    setIsBotTyping(true);
    
    try {
      const token = localStorage.getItem('voicera_token');
      if (!token) throw new Error("No token");
      const decoded: any = jwtDecode(token);
      const clientId = decoded.client_id || (decoded.user && decoded.user.client_id);
      
      const history = previewMessages.map(m => ({
        role: m.role,
        content: m.content
      }));
      
      const BACKEND_URL = 'https://voicera-dashboard-production.up.railway.app';
      
      const res = await fetch(`${BACKEND_URL}/api/v1/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          session_id: "preview-session",
          client_id: clientId,
          message: userText,
          conversation_history: history
        })
      });
      
      const data = await res.json();
      setPreviewMessages(prev => [...prev, { role: "assistant", content: data.response || "No response" }]);
    } catch (e) {
      console.error("Test chat failed:", e);
      setPreviewMessages(prev => [...prev, { role: "assistant", content: "Error connecting to backend test endpoint." }]);
    } finally {
      setIsBotTyping(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [previewMessages, isBotTyping]);

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-[18px] font-semibold text-foreground">Bot Config</h1>
        <div className="flex gap-3">
          <Button 
            onClick={() => setShowVisualBuilder(true)}
            className="bg-background border border-border text-foreground hover:bg-muted h-8 text-[13px] font-medium rounded-md shadow-sm"
          >
            <Workflow className="mr-1.5 h-3.5 w-3.5 text-blue-500" />
            Visual Builder
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-primary text-primary-foreground hover:bg-primary h-8 text-[13px] font-medium rounded-md shadow-sm"
          >
            {isSaving ? <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Save className="mr-1.5 h-3.5 w-3.5" />}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 max-w-6xl">
        {/* Left: Settings */}
        <div className="col-span-7 space-y-6">
          <section className="border border-border rounded-lg p-5">
            <h2 className="text-[14px] font-semibold text-foreground mb-4">General Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Bot Name</label>
                <Input value={botName} onChange={(e) => setBotName(e.target.value)} className="h-9 text-[13px] border-border rounded-md" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">System Prompt</label>
                  <button className="text-[12px] font-medium text-muted-foreground hover:text-foreground flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Auto-generate
                  </button>
                </div>
                <Textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="min-h-[100px] text-[13px] border-border rounded-md resize-none leading-relaxed"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Initial Greeting</label>
                <Input value={initialGreeting} onChange={(e) => setInitialGreeting(e.target.value)} className="h-9 text-[13px] border-border rounded-md" />
              </div>
            </div>
          </section>

          <section className="border border-border rounded-lg p-5">
            <h2 className="text-[14px] font-semibold text-foreground mb-4">Voice Selection</h2>
            <div className="grid grid-cols-2 gap-3">
              {voices.map((voice) => (
                <div
                  key={voice.id}
                  onClick={() => setSelectedVoice(voice.id)}
                  className={`relative p-3.5 rounded-lg border cursor-pointer transition-colors ${
                    selectedVoice === voice.id
                      ? "border-neutral-900 bg-muted"
                      : "border-border hover:border-border"
                  }`}
                >
                  {voice.tag && (
                    <span className="absolute top-2.5 right-2.5 text-[9px] font-medium uppercase tracking-wider bg-secondary text-muted-foreground px-1.5 py-0.5 rounded">
                      {voice.tag}
                    </span>
                  )}
                  <div className="text-[13px] font-semibold text-foreground mb-0.5">{voice.name}</div>
                  <div className="text-[12px] text-muted-foreground">{voice.type}</div>
                  <button
                    className="mt-2.5 w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    onClick={(e) => { e.stopPropagation(); }}
                  >
                    <Play className="h-3 w-3 ml-0.5" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Widget */}
        <div className="col-span-5 space-y-6">
          <section className="border border-border rounded-lg p-5">
            <h2 className="text-[14px] font-semibold text-foreground mb-4">Widget Appearance</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Brand Color</label>
                <div className="flex gap-2.5">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setPrimaryColor(color)}
                      className={`w-7 h-7 rounded-full transition-all ${primaryColor === color ? "ring-2 ring-offset-2 ring-neutral-400" : "hover:scale-110"}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Widget Subtitle</label>
                <Input value={widgetSubtitle} onChange={(e) => setWidgetSubtitle(e.target.value)} className="h-9 text-[13px] border-border rounded-md" />
              </div>
              <div className="pt-3 border-t border-border">
                <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Embed Code</label>
                <div className="bg-primary rounded-md p-3 relative group cursor-pointer">
                  <div className="font-mono text-[11px] text-muted-foreground break-all leading-relaxed">
                    &lt;script src="https://cdn.voicera.ai/widget.js" data-id="v_84kx9"&gt;&lt;/script&gt;
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                    <span className="text-primary-foreground text-[12px] font-medium flex items-center gap-1.5">
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Widget Preview */}
          <div className="bg-muted rounded-lg border border-border p-6 flex flex-col items-center justify-center relative">
            <div className="absolute top-2 right-4 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Test Sandbox</div>
            <div className="w-[300px] h-[450px] bg-background rounded-xl shadow-lg border border-border overflow-hidden flex flex-col mt-3">
              <div className="p-4 flex items-center gap-2.5 shrink-0" style={{ backgroundColor: primaryColor }}>
                <div className="w-8 h-8 rounded-md bg-background/20 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-primary-foreground">{botName}</div>
                  <div className="text-[10px] text-primary-foreground/70">{widgetSubtitle}</div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 bg-muted/30 space-y-4">
                {previewMessages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="h-3 w-3 text-primary" style={{ color: primaryColor }} />
                      </div>
                    )}
                    <div className={`text-[12px] p-2.5 rounded-lg max-w-[80%] leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-br-sm' 
                        : 'bg-background border border-border text-foreground rounded-bl-sm whitespace-pre-wrap'
                    }`}
                    style={msg.role === 'user' ? { backgroundColor: primaryColor } : {}}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isBotTyping && (
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="h-3 w-3 text-primary" style={{ color: primaryColor }} />
                    </div>
                    <div className="bg-background border border-border p-3 rounded-lg rounded-bl-sm flex gap-1.5 items-center h-9">
                      <div className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-3 bg-background border-t border-border shrink-0">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleTestChat(); }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={previewInput}
                    onChange={(e) => setPreviewInput(e.target.value)}
                    placeholder="Test your bot..."
                    className="flex-1 bg-muted/50 rounded-full px-4 py-2 text-[12px] text-foreground border border-transparent focus:bg-background focus:border-border outline-none transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={!previewInput.trim() || isBotTyping}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-opacity" 
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Send className="h-3.5 w-3.5 ml-0.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showVisualBuilder && <VisualBuilder onClose={() => setShowVisualBuilder(false)} />}
    </div>
  );
}
