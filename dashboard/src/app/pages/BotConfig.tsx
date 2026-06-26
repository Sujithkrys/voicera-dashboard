import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Mic, Play, Sparkles, MessageSquare, Save, Link, Copy } from "lucide-react";

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

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-[18px] font-semibold text-neutral-900">Bot Config</h1>
        <Button className="bg-neutral-900 text-white hover:bg-neutral-800 h-8 text-[13px] font-medium rounded-md">
          <Save className="mr-1.5 h-3.5 w-3.5" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-8 max-w-6xl">
        {/* Left: Settings */}
        <div className="col-span-7 space-y-6">
          <section className="border border-neutral-200 rounded-lg p-5">
            <h2 className="text-[14px] font-semibold text-neutral-900 mb-4">General Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5 block">Bot Name</label>
                <Input value={botName} onChange={(e) => setBotName(e.target.value)} className="h-9 text-[13px] border-neutral-200 rounded-md" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider">System Prompt</label>
                  <button className="text-[12px] font-medium text-neutral-500 hover:text-neutral-700 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Auto-generate
                  </button>
                </div>
                <Textarea
                  defaultValue="You are a helpful customer support agent for Voicera. You answer questions politely and concisely."
                  className="min-h-[100px] text-[13px] border-neutral-200 rounded-md resize-none leading-relaxed"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5 block">Initial Greeting</label>
                <Input defaultValue="Hi there! How can I help you today?" className="h-9 text-[13px] border-neutral-200 rounded-md" />
              </div>
            </div>
          </section>

          <section className="border border-neutral-200 rounded-lg p-5">
            <h2 className="text-[14px] font-semibold text-neutral-900 mb-4">Voice Selection</h2>
            <div className="grid grid-cols-2 gap-3">
              {voices.map((voice) => (
                <div
                  key={voice.id}
                  onClick={() => setSelectedVoice(voice.id)}
                  className={`relative p-3.5 rounded-lg border cursor-pointer transition-colors ${
                    selectedVoice === voice.id
                      ? "border-neutral-900 bg-neutral-50"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  {voice.tag && (
                    <span className="absolute top-2.5 right-2.5 text-[9px] font-medium uppercase tracking-wider bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">
                      {voice.tag}
                    </span>
                  )}
                  <div className="text-[13px] font-semibold text-neutral-900 mb-0.5">{voice.name}</div>
                  <div className="text-[12px] text-neutral-500">{voice.type}</div>
                  <button
                    className="mt-2.5 w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 transition-colors"
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
          <section className="border border-neutral-200 rounded-lg p-5">
            <h2 className="text-[14px] font-semibold text-neutral-900 mb-4">Widget Appearance</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider mb-2 block">Brand Color</label>
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
                <label className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5 block">Widget Subtitle</label>
                <Input value={widgetSubtitle} onChange={(e) => setWidgetSubtitle(e.target.value)} className="h-9 text-[13px] border-neutral-200 rounded-md" />
              </div>
              <div className="pt-3 border-t border-neutral-100">
                <label className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5 block">Embed Code</label>
                <div className="bg-neutral-900 rounded-md p-3 relative group cursor-pointer">
                  <div className="font-mono text-[11px] text-neutral-400 break-all leading-relaxed">
                    &lt;script src="https://cdn.voicera.ai/widget.js" data-id="v_84kx9"&gt;&lt;/script&gt;
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                    <span className="text-white text-[12px] font-medium flex items-center gap-1.5">
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Widget Preview */}
          <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-6 flex items-center justify-center">
            <div className="w-[260px] bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <div className="p-4 flex items-center gap-2.5" style={{ backgroundColor: primaryColor }}>
                <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-white">{botName}</div>
                  <div className="text-[10px] text-white/70">{widgetSubtitle}</div>
                </div>
              </div>
              <div className="p-4 bg-neutral-50 space-y-3">
                <div className="flex gap-2">
                  <div className="w-5 h-5 rounded-full bg-neutral-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="h-2.5 w-2.5 text-neutral-500" />
                  </div>
                  <div className="bg-white border border-neutral-200 text-[11px] text-neutral-700 p-2.5 rounded-md leading-relaxed">
                    Hi there! How can I help you today?
                  </div>
                </div>
                <div className="space-y-1.5 mt-4">
                  <button className="w-full bg-white border border-neutral-200 text-neutral-600 text-[11px] font-medium py-2 px-3 rounded-md text-left hover:bg-neutral-50 transition-colors">
                    Help with billing
                  </button>
                  <button className="w-full bg-white border border-neutral-200 text-neutral-600 text-[11px] font-medium py-2 px-3 rounded-md text-left hover:bg-neutral-50 transition-colors">
                    Speak to a human
                  </button>
                </div>
              </div>
              <div className="p-3 bg-white border-t border-neutral-100 flex items-center gap-2">
                <div className="flex-1 bg-neutral-100 rounded-full px-3 py-1.5 text-[11px] text-neutral-400">
                  Type a message...
                </div>
                <button className="w-7 h-7 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: primaryColor }}>
                  <Mic className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
