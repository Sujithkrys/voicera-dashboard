import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Mic, Play, Settings2, Sparkles, MessageSquare, Save, Palette, Link } from 'lucide-react';

const voices = [
  { id: 'v1', name: 'Aria', type: 'Female, Professional', tag: 'Top Choice' },
  { id: 'v2', name: 'Marcus', type: 'Male, Friendly', tag: '' },
  { id: 'v3', name: 'Sofia', type: 'Female, Empathetic', tag: '' },
  { id: 'v4', name: 'Liam', type: 'Male, Confident', tag: '' },
];

const colors = [
  '#bd9dff', // Primary
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f43f5e', // Rose
  '#8b5cf6', // Violet
  '#f59e0b', // Amber
  '#000000', // Black
];

export default function BotConfig() {
  const [selectedVoice, setSelectedVoice] = useState('v1');
  const [primaryColor, setPrimaryColor] = useState(colors[0]);
  const [botName, setBotName] = useState('Voicera Assistant');
  const [widgetSubtitle, setWidgetSubtitle] = useState('Typically replies in seconds');

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col pb-10">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0 mb-2">
        <div>
          <h1 className="font-manrope text-[24px] font-extrabold tracking-[-0.5px] text-on-surface">Bot Config</h1>
          <p className="font-inter text-[13px] text-on-surface-med mt-1">Configure your AI agent's voice, personality, and widget appearance</p>
        </div>
        <Button className="bg-gradient-to-r from-primary-dim to-primary hover:-translate-y-[1px] transition-transform text-white font-inter font-bold text-[13px] rounded-xl shadow-[0_4px_18px_var(--color-primary-glow)] border-none px-5 py-2.5 h-auto">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-surface-highest scrollbar-track-transparent pr-1">
        {/* Left Column: Settings */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-surface rounded-[1.5rem] shadow-[0_0_40px_rgba(6,14,32,0.5)] border-none relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-dim to-primary opacity-0 transition-opacity" />
            <div className="p-[20px_24px] border-b border-ghost-med flex items-center gap-3">
              <div className="w-8 h-8 rounded-[10px] bg-primary-glow-sm flex items-center justify-center text-primary">
                <Settings2 className="h-4 w-4" />
              </div>
              <h2 className="font-manrope font-extrabold text-[16px] text-on-surface">General Settings</h2>
            </div>
            
            <div className="p-[24px] space-y-6">
              <div>
                <label className="font-inter text-[10px] font-bold text-on-surface-low uppercase tracking-[0.6px] mb-2.5 block">Bot Name</label>
                <Input 
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  className="bg-surface-hi border-transparent focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary text-on-surface font-inter text-[14px] rounded-xl h-[42px] px-4"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="font-inter text-[10px] font-bold text-on-surface-low uppercase tracking-[0.6px]">System Prompt (Personality)</label>
                  <Button variant="ghost" size="sm" className="h-7 px-3 text-[11px] font-bold text-primary hover:text-white hover:bg-primary bg-primary-glow-sm rounded-lg transition-colors font-inter">
                    <Sparkles className="h-3 w-3 mr-1.5" /> Auto-generate
                  </Button>
                </div>
                <Textarea 
                  defaultValue="You are a helpful customer support agent for Voicera. You answer questions politely and concisely."
                  className="min-h-[140px] bg-surface-hi border-transparent focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary text-on-surface font-inter text-[14px] leading-relaxed rounded-xl p-4 resize-none"
                />
              </div>

              <div>
                <label className="font-inter text-[10px] font-bold text-on-surface-low uppercase tracking-[0.6px] mb-2.5 block">Initial Greeting</label>
                <Input 
                  defaultValue="Hi there! How can I help you today?"
                  className="bg-surface-hi border-transparent focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary text-on-surface font-inter text-[14px] rounded-xl h-[42px] px-4"
                />
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-[1.5rem] shadow-[0_0_40px_rgba(6,14,32,0.5)] border-none relative overflow-hidden">
            <div className="p-[20px_24px] border-b border-ghost-med flex items-center gap-3">
              <div className="w-8 h-8 rounded-[10px] bg-primary-glow-sm flex items-center justify-center text-primary">
                <Mic className="h-4 w-4" />
              </div>
              <h2 className="font-manrope font-extrabold text-[16px] text-on-surface">Voice Selection</h2>
            </div>
            
            <div className="p-[24px]">
              <div className="grid grid-cols-2 gap-4">
                {voices.map(voice => (
                  <div 
                    key={voice.id}
                    onClick={() => setSelectedVoice(voice.id)}
                    className={`relative p-[20px] rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedVoice === voice.id 
                        ? 'border-primary bg-primary-glow-sm shadow-[0_0_24px_var(--color-primary-glow)]' 
                        : 'border-ghost bg-surface-hi hover:border-ghost-med hover:bg-surface-highest'
                    }`}
                  >
                    {voice.tag && (
                      <span className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-wider bg-primary text-white px-2.5 py-0.5 rounded-md font-inter">
                        {voice.tag}
                      </span>
                    )}
                    <div className="font-manrope font-extrabold text-[15px] text-on-surface mb-1">{voice.name}</div>
                    <div className="text-[12px] text-on-surface-med font-medium font-inter">{voice.type}</div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`mt-5 h-[34px] w-[34px] rounded-[10px] transition-colors ${selectedVoice === voice.id ? 'bg-primary text-white' : 'bg-surface-highest text-primary hover:bg-primary hover:text-white'}`}
                      onClick={(e) => { e.stopPropagation(); /* Play sound */ }}
                    >
                      <Play className="h-3.5 w-3.5 ml-0.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Widget Customizer & Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface rounded-[1.5rem] shadow-[0_0_40px_rgba(6,14,32,0.5)] border-none relative overflow-hidden">
            <div className="p-[20px_24px] border-b border-ghost-med flex items-center gap-3">
              <div className="w-8 h-8 rounded-[10px] bg-primary-glow-sm flex items-center justify-center text-primary">
                <Palette className="h-4 w-4" />
              </div>
              <h2 className="font-manrope font-extrabold text-[16px] text-on-surface">Widget Appearance</h2>
            </div>
            
            <div className="p-[24px] space-y-6">
              <div>
                <label className="font-inter text-[10px] font-bold text-on-surface-low uppercase tracking-[0.6px] mb-3 block">Brand Color</label>
                <div className="flex flex-wrap gap-3.5">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setPrimaryColor(color)}
                      className={`w-9 h-9 rounded-full transition-transform outline-offset-[3px] ${primaryColor === color ? 'scale-110 outline outline-2 outline-primary shadow-[0_0_12px_var(--color-primary-glow)]' : 'hover:scale-110 shadow-sm'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="font-inter text-[10px] font-bold text-on-surface-low uppercase tracking-[0.6px] mb-2.5 block">Widget Subtitle</label>
                <Input 
                  value={widgetSubtitle}
                  onChange={(e) => setWidgetSubtitle(e.target.value)}
                  className="bg-surface-hi border-transparent focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary text-on-surface font-inter text-[14px] rounded-xl h-[42px] px-4"
                />
              </div>

              <div className="pt-6 border-t border-ghost-med">
                <label className="font-inter text-[10px] font-bold text-on-surface-low uppercase tracking-[0.6px] mb-2.5 block">Embed Code</label>
                <div className="bg-[#0a0a0f] rounded-[14px] p-4 relative group cursor-pointer border border-ghost transition-colors hover:border-ghost-med shadow-inner">
                  <div className="font-mono text-[12px] text-[#a5b4fc] break-all leading-[1.6]">
                    &lt;script src="https://cdn.voicera.ai/widget.js" data-id="v_84kx9"&gt;&lt;/script&gt;
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0f]/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-[14px] backdrop-blur-[2px]">
                    <span className="text-white text-[12px] font-bold flex items-center gap-2 font-inter">
                      <Link className="h-3.5 w-3.5" /> Copy to Clipboard
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Widget Preview Mockup */}
          <div className="bg-surface-highest rounded-[1.5rem] p-8 flex items-center justify-center relative overflow-hidden border border-ghost shadow-inner h-[400px]">
            <div className="absolute top-0 right-0 bg-primary-glow-sm w-full h-full transform translate-x-1/2 -skew-x-12 blur-3xl opacity-50" />
            
            <div className="w-[300px] bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative z-10 overflow-hidden border border-white/20 flex flex-col">
              {/* Widget Header */}
              <div 
                className="p-[18px_20px] flex items-center gap-3.5 transition-colors shadow-sm relative overflow-hidden"
                style={{ backgroundColor: primaryColor }}
              >
                <div className="absolute inset-0 bg-black/5 mix-blend-overlay" />
                <div className="w-[42px] h-[42px] rounded-[12px] bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-md relative z-10 shadow-sm border border-white/30">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div className="relative z-10">
                  <div className="font-manrope font-extrabold text-white text-[15px] leading-tight drop-shadow-sm">{botName}</div>
                  <div className="text-white/90 text-[11px] font-medium mt-0.5 font-inter drop-shadow-sm">{widgetSubtitle}</div>
                </div>
              </div>
              
              {/* Widget Body */}
              <div className="p-5 flex-1 bg-[#f8fafc] flex flex-col gap-4">
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0 mt-1 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundColor: primaryColor }} />
                    <Sparkles className="h-3.5 w-3.5" style={{ color: primaryColor }} />
                  </div>
                  <div className="bg-white border border-slate-100 shadow-sm text-slate-700 text-[13px] font-inter p-3.5 rounded-2xl rounded-tl-none leading-[1.6]">
                    Hi there! How can I help you today?
                  </div>
                </div>
                
                <div className="mt-8 space-y-2.5">
                  <button className="w-full bg-white border border-slate-200 shadow-sm text-slate-600 text-[13px] font-bold font-inter py-3 px-4 rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-colors text-left flex items-center justify-between group">
                    Help with billing
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                  </button>
                  <button className="w-full bg-white border border-slate-200 shadow-sm text-slate-600 text-[13px] font-bold font-inter py-3 px-4 rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-colors text-left flex items-center justify-between group">
                    Speak to a human
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                  </button>
                </div>
              </div>
              
              {/* Widget Footer */}
              <div className="p-[14px_20px] bg-white border-t border-slate-100 flex items-center gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.02)] relative z-10">
                <div className="flex-1 bg-slate-100 rounded-full px-4 py-2.5 text-[12px] font-inter text-slate-400 font-medium">
                  Type a message...
                </div>
                <button 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Mic className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ChevronRight = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
)
