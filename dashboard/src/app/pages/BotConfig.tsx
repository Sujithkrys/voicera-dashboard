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
  '#6366f1', // Indigo
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bot Config</h1>
          <p className="text-muted-foreground text-sm mt-1">Configure your AI agent's voice, personality, and widget appearance</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0 overflow-y-auto pb-10">
        {/* Left Column: Settings */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-indigo-500" />
                <CardTitle className="text-lg">General Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Bot Name</label>
                <Input 
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  className="bg-slate-50 font-medium"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Prompt (Personality)</label>
                  <Button variant="ghost" size="sm" className="h-6 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                    <Sparkles className="h-3 w-3 mr-1" /> Auto-generate
                  </Button>
                </div>
                <Textarea 
                  defaultValue="You are a helpful customer support agent for Voicera. You answer questions politely and concisely."
                  className="min-h-[120px] bg-slate-50 font-medium leading-relaxed resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Initial Greeting</label>
                <Input 
                  defaultValue="Hi there! How can I help you today?"
                  className="bg-slate-50 font-medium"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-indigo-500" />
                <CardTitle className="text-lg">Voice Selection</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {voices.map(voice => (
                  <div 
                    key={voice.id}
                    onClick={() => setSelectedVoice(voice.id)}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedVoice === voice.id 
                        ? 'border-indigo-500 bg-indigo-50/50' 
                        : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {voice.tag && (
                      <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                        {voice.tag}
                      </span>
                    )}
                    <div className="font-bold text-sm text-slate-900 mb-1">{voice.name}</div>
                    <div className="text-xs text-slate-500 font-medium">{voice.type}</div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="mt-4 h-8 w-8 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
                      onClick={(e) => { e.stopPropagation(); /* Play sound */ }}
                    >
                      <Play className="h-3.5 w-3.5 ml-0.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Widget Customizer & Preview */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-indigo-500" />
                <CardTitle className="text-lg">Widget Appearance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Brand Color</label>
                <div className="flex flex-wrap gap-3">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setPrimaryColor(color)}
                      className={`w-8 h-8 rounded-full transition-transform outline-offset-2 ${primaryColor === color ? 'scale-110 outline outline-2 outline-slate-400 shadow-sm' : 'hover:scale-110'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Widget Subtitle</label>
                <Input 
                  value={widgetSubtitle}
                  onChange={(e) => setWidgetSubtitle(e.target.value)}
                  className="bg-slate-50 font-medium"
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Embed Code</label>
                <div className="bg-slate-900 rounded-xl p-4 relative group cursor-pointer hover:bg-slate-800 transition-colors">
                  <div className="font-mono text-xs text-indigo-400 break-all leading-relaxed">
                    &lt;script src="https://cdn.voicera.ai/widget.js" data-id="v_84kx9"&gt;&lt;/script&gt;
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl backdrop-blur-sm">
                    <span className="text-white text-xs font-bold flex items-center gap-2">
                      <Link className="h-4 w-4" /> Copy to Clipboard
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Widget Preview Mockup */}
          <div className="bg-slate-100 rounded-3xl p-8 flex items-center justify-center relative overflow-hidden border border-slate-200 shadow-inner">
            <div className="absolute top-0 right-0 bg-slate-200/50 w-full h-full transform translate-x-1/2 -skew-x-12" />
            
            <div className="w-[300px] bg-white rounded-2xl shadow-2xl relative z-10 overflow-hidden border border-slate-100 flex flex-col">
              {/* Widget Header */}
              <div 
                className="p-5 flex items-center gap-3 transition-colors"
                style={{ backgroundColor: primaryColor }}
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-md">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm leading-tight">{botName}</div>
                  <div className="text-white/80 text-[10px] font-medium mt-0.5">{widgetSubtitle}</div>
                </div>
              </div>
              
              {/* Widget Body */}
              <div className="p-5 flex-1 bg-slate-50 flex flex-col gap-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-1">
                    <Sparkles className="h-3 w-3 text-indigo-600" />
                  </div>
                  <div className="bg-white border border-slate-100 shadow-sm text-slate-700 text-xs p-3 rounded-2xl rounded-tl-none leading-relaxed">
                    Hi there! How can I help you today?
                  </div>
                </div>
                
                <div className="mt-8 space-y-2">
                  <button className="w-full bg-white border border-slate-200 shadow-sm text-slate-600 text-xs font-semibold py-2.5 px-4 rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-colors text-left">
                    Help with billing
                  </button>
                  <button className="w-full bg-white border border-slate-200 shadow-sm text-slate-600 text-xs font-semibold py-2.5 px-4 rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-colors text-left">
                    Speak to a human
                  </button>
                </div>
              </div>
              
              {/* Widget Footer */}
              <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-2">
                <div className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-xs text-slate-400 font-medium">
                  Type a message...
                </div>
                <button 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md transition-transform hover:scale-105"
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
