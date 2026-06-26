import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { User, Key, CreditCard, Puzzle, Eye, Copy, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { Switch } from '../components/ui/switch';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'api' | 'billing' | 'integrations'>('profile');

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col pb-10">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0 mb-2">
        <div>
          <h1 className="font-manrope text-[24px] font-extrabold tracking-[-0.5px] text-on-surface">Settings</h1>
          <p className="font-inter text-[13px] text-on-surface-med mt-1">Manage your account, team, and integrations</p>
        </div>
      </div>

      <div className="flex gap-8 flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-surface-highest scrollbar-track-transparent flex-col md:flex-row pr-1">
        {/* Left Side Navigation */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          {[
            { id: 'profile', icon: User, label: 'Profile Settings' },
            { id: 'api', icon: Key, label: 'API Keys' },
            { id: 'billing', icon: CreditCard, label: 'Billing & Usage' },
            { id: 'integrations', icon: Puzzle, label: 'Integrations' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3.5 px-5 py-3.5 rounded-[14px] text-[13px] font-bold transition-all font-inter border ${
                activeTab === tab.id 
                  ? 'bg-primary-glow-sm text-primary border-primary/20 shadow-[0_0_20px_var(--color-primary-glow)]' 
                  : 'text-on-surface-med hover:bg-surface-hi hover:text-on-surface border-transparent'
              }`}
            >
              <tab.icon className="h-[18px] w-[18px]" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Right Side Content */}
        <div className="flex-1 max-w-4xl space-y-6 pb-6">
          
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="bg-surface rounded-[1.5rem] shadow-[0_0_40px_rgba(6,14,32,0.5)] border-none relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-dim to-primary opacity-0 transition-opacity" />
              <div className="p-[24px_28px] border-b border-ghost-med">
                <h2 className="font-manrope font-extrabold text-[18px] text-on-surface mb-1">Profile Settings</h2>
                <p className="font-inter text-[13px] text-on-surface-med">Update your personal information and preferences.</p>
              </div>
              
              <div className="p-[28px] space-y-8">
                <div className="flex items-center gap-6 pb-8 border-b border-ghost-med">
                  <div className="h-[84px] w-[84px] rounded-2xl bg-gradient-to-br from-primary-dim to-primary flex items-center justify-center text-[28px] font-manrope font-extrabold text-white shadow-[0_8px_24px_var(--color-primary-glow)]">
                    AS
                  </div>
                  <div>
                    <Button variant="outline" className="mb-2 bg-surface-hi border-ghost text-on-surface hover:bg-surface-highest hover:text-on-surface transition-colors font-inter rounded-xl h-9 px-4 text-[13px] font-bold">
                      Change Avatar
                    </Button>
                    <p className="text-[12px] text-on-surface-low font-inter font-medium">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-7">
                  <div className="space-y-2.5">
                    <label className="font-inter text-[10px] font-bold text-on-surface-low uppercase tracking-[0.6px]">First Name</label>
                    <Input defaultValue="Alex" className="bg-surface-hi border-transparent focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary text-on-surface font-inter text-[14px] rounded-xl h-[42px] px-4" />
                  </div>
                  <div className="space-y-2.5">
                    <label className="font-inter text-[10px] font-bold text-on-surface-low uppercase tracking-[0.6px]">Last Name</label>
                    <Input defaultValue="Smith" className="bg-surface-hi border-transparent focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary text-on-surface font-inter text-[14px] rounded-xl h-[42px] px-4" />
                  </div>
                  <div className="space-y-2.5">
                    <label className="font-inter text-[10px] font-bold text-on-surface-low uppercase tracking-[0.6px]">Email Address</label>
                    <Input defaultValue="alex@acmecorp.com" className="bg-surface-hi border-transparent focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary text-on-surface font-inter text-[14px] rounded-xl h-[42px] px-4" type="email" />
                  </div>
                  <div className="space-y-2.5">
                    <label className="font-inter text-[10px] font-bold text-on-surface-low uppercase tracking-[0.6px]">Role</label>
                    <Select defaultValue="admin">
                      <SelectTrigger className="bg-surface-hi border-transparent text-on-surface font-inter text-[14px] rounded-xl h-[42px] px-4 focus:ring-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-surface-highest border-ghost-med text-on-surface font-inter text-[13px]">
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="specialist">Specialist</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <Button className="bg-gradient-to-r from-primary-dim to-primary hover:-translate-y-[1px] transition-transform text-white font-inter font-bold text-[13px] rounded-xl shadow-[0_4px_18px_var(--color-primary-glow)] border-none h-[42px] px-6">
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* API Keys */}
          {activeTab === 'api' && (
            <div className="bg-surface rounded-[1.5rem] shadow-[0_0_40px_rgba(6,14,32,0.5)] border-none relative overflow-hidden">
              <div className="p-[24px_28px] border-b border-ghost-med flex flex-row items-center justify-between">
                <div>
                  <h2 className="font-manrope font-extrabold text-[18px] text-on-surface mb-1">API Keys</h2>
                  <p className="font-inter text-[13px] text-on-surface-med">Manage keys for external services and widget embedding.</p>
                </div>
                <Button className="bg-gradient-to-r from-primary-dim to-primary hover:-translate-y-[1px] transition-transform text-white font-inter font-bold text-[13px] rounded-xl shadow-[0_4px_18px_var(--color-primary-glow)] border-none h-[42px] px-5">
                  Generate Key
                </Button>
              </div>
              
              <div className="p-0">
                <div className="divide-y divide-ghost-med">
                  {[
                    { name: 'Deepgram API Key', type: 'Speech-to-Text', key: 'sk-deepgram-••••••••••••••••••••••••••••••••' },
                    { name: 'Voicera Widget Key', type: 'Frontend Auth', key: 'vwk_live_84kx9f2m4nv93nx1••••••••••••' },
                    { name: 'Webhook Secret', type: 'Server Validation', key: 'whsec_29fj49d03kd92kdl••••••••••••' }
                  ].map((item, i) => (
                    <div key={i} className="p-[24px_28px] flex flex-col gap-3.5 hover:bg-surface-hi transition-colors">
                      <div className="flex justify-between items-center">
                        <div className="font-semibold text-[14px] text-on-surface font-inter">{item.name}</div>
                        <div className="font-inter text-[10px] text-on-surface-low font-bold uppercase tracking-[0.6px] bg-surface-highest px-2 py-1 rounded-md">{item.type}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="font-mono text-[13px] bg-[#0a0a0f] px-4 py-3.5 rounded-xl border border-ghost flex-1 text-primary shadow-inner">
                          {item.key}
                        </div>
                        <Button variant="outline" size="icon" className="bg-surface-highest border-ghost text-on-surface hover:bg-surface-hi hover:text-white rounded-xl h-[46px] w-[46px] shrink-0 transition-colors"><Eye className="h-4 w-4" /></Button>
                        <Button variant="outline" size="icon" className="bg-surface-highest border-ghost text-on-surface hover:bg-surface-hi hover:text-white rounded-xl h-[46px] w-[46px] shrink-0 transition-colors"><Copy className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Billing & Usage */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-primary-dim to-primary rounded-[1.5rem] text-white border-0 overflow-hidden relative shadow-[0_8px_32px_var(--color-primary-glow)]">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                  <div className="p-[24px_28px] pb-4">
                    <h2 className="font-manrope font-extrabold text-[16px] text-white/90">Current Plan</h2>
                  </div>
                  <div className="p-[0_28px_28px_28px]">
                    <div className="font-manrope text-[40px] font-extrabold tracking-tight mb-1">Pro</div>
                    <p className="text-white/80 font-inter text-[13px] font-medium mb-8">$99/month, billed annually</p>
                    <Button className="w-full bg-white text-primary hover:bg-white/90 transition-colors font-bold shadow-lg h-[46px] rounded-xl text-[14px]">
                      Manage Subscription
                    </Button>
                  </div>
                </div>

                <div className="bg-surface rounded-[1.5rem] shadow-[0_0_40px_rgba(6,14,32,0.5)] border-none flex flex-col relative overflow-hidden">
                  <div className="p-[24px_28px] border-b border-ghost-med">
                    <h2 className="font-manrope font-extrabold text-[16px] text-on-surface">Payment Method</h2>
                  </div>
                  <div className="p-[24px_28px] flex flex-col flex-1">
                    <div className="flex-1 flex items-center gap-5 bg-surface-hi p-5 rounded-[1.25rem] border border-ghost">
                      <div className="w-[52px] h-[36px] bg-white rounded-md flex items-center justify-center font-extrabold text-blue text-sm italic shadow-sm">
                        VISA
                      </div>
                      <div>
                        <div className="font-inter font-semibold text-[14px] text-on-surface mb-0.5">•••• •••• •••• 4242</div>
                        <div className="font-inter text-[12px] text-on-surface-med font-medium">Expires 12/25</div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-6 bg-surface-hi border-ghost text-on-surface hover:bg-surface-highest transition-colors rounded-xl h-[46px] font-bold">Update Method</Button>
                  </div>
                </div>
              </div>

              <div className="bg-surface rounded-[1.5rem] shadow-[0_0_40px_rgba(6,14,32,0.5)] border-none relative overflow-hidden">
                <div className="p-[24px_28px] border-b border-ghost-med flex flex-row justify-between items-center">
                  <div>
                    <h2 className="font-manrope font-extrabold text-[18px] text-on-surface mb-1">Current Usage</h2>
                    <p className="font-inter text-[13px] text-on-surface-med">Billing cycle resets in 12 days.</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-white hover:bg-primary-glow-sm transition-colors font-bold bg-transparent font-inter h-9 px-4 rounded-xl">
                    View History <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                
                <div className="p-[28px] space-y-9">
                  {[
                    { label: 'Voice Minutes', value: '4,821', limit: '/ 10,000', pct: 48, color: 'bg-primary shadow-[0_0_12px_var(--color-primary)]' },
                    { label: 'Support Tickets', value: '842', limit: '/ 2,000', pct: 42, color: 'bg-blue shadow-[0_0_12px_var(--color-blue)]' },
                    { label: 'Automations', value: '95%', limit: 'of limit', pct: 95, color: 'bg-red shadow-[0_0_12px_var(--color-red)]', valueColor: 'text-red' }
                  ].map((usage, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-end mb-3">
                        <div className="font-inter font-semibold text-[14px] text-on-surface">{usage.label}</div>
                        <div className={`font-inter text-[14px] font-bold ${usage.valueColor || 'text-on-surface'}`}>{usage.value} <span className="text-on-surface-low font-medium text-[12px] ml-1">{usage.limit}</span></div>
                      </div>
                      <div className="h-2 w-full bg-surface-highest rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-1000 ${usage.color}`} style={{ width: `${usage.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Integrations */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div className="bg-surface rounded-[1.5rem] shadow-[0_0_40px_rgba(6,14,32,0.5)] border-none relative overflow-hidden">
                <div className="p-[24px_28px] border-b border-ghost-med bg-surface/50">
                  <h2 className="font-manrope font-extrabold text-[18px] text-on-surface mb-1">CRM Integrations</h2>
                  <p className="font-inter text-[13px] text-on-surface-med">Connect Voicera with your existing tools.</p>
                </div>
                
                <div className="p-0">
                  <div className="divide-y divide-ghost-med">
                    <div className="p-[24px_28px] flex items-center justify-between hover:bg-surface-hi transition-colors">
                      <div className="flex items-center gap-5">
                        <div className="w-[52px] h-[52px] rounded-2xl bg-[#ff7a59]/10 flex items-center justify-center text-[#ff7a59] shrink-0 border border-[#ff7a59]/20 shadow-[0_0_16px_rgba(255,122,89,0.1)]">
                          <Zap className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-manrope font-extrabold text-[16px] text-on-surface mb-1">HubSpot</h4>
                          <p className="text-[13px] text-on-surface-med font-inter">Sync contacts and log support calls to deals automatically.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-5 ml-6 shrink-0">
                        <span className="inline-flex items-center gap-1.5 font-inter text-[11px] font-bold text-tertiary bg-tertiary-dim px-3 py-1.5 rounded-lg uppercase tracking-[0.5px]"><CheckCircle2 className="h-3.5 w-3.5" /> Connected</span>
                        <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                      </div>
                    </div>

                    <div className="p-[24px_28px] flex items-center justify-between hover:bg-surface-hi transition-colors">
                      <div className="flex items-center gap-5">
                        <div className="w-[52px] h-[52px] rounded-2xl bg-[#00a1e0]/10 flex items-center justify-center text-[#00a1e0] shrink-0 border border-[#00a1e0]/20 shadow-[0_0_16px_rgba(0,161,224,0.1)]">
                          <Zap className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-manrope font-extrabold text-[16px] text-on-surface mb-1">Salesforce</h4>
                          <p className="text-[13px] text-on-surface-med font-inter">Enterprise-grade sync for cases and accounts.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-5 ml-6 shrink-0">
                        <Button variant="outline" className="bg-surface-hi border-ghost text-on-surface hover:bg-surface-highest transition-colors rounded-xl h-[38px] font-bold text-[12px]">Configure</Button>
                        <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-surface rounded-[1.5rem] shadow-[0_0_40px_rgba(6,14,32,0.5)] border-none relative overflow-hidden">
                <div className="p-[24px_28px] border-b border-ghost-med bg-surface/50">
                  <h2 className="font-manrope font-extrabold text-[18px] text-on-surface mb-1">Support Platforms</h2>
                  <p className="font-inter text-[13px] text-on-surface-med">Route tickets to your helpdesk.</p>
                </div>
                
                <div className="p-0">
                  <div className="divide-y divide-ghost-med">
                    <div className="p-[24px_28px] flex items-center justify-between hover:bg-surface-hi transition-colors">
                      <div className="flex items-center gap-5">
                        <div className="w-[52px] h-[52px] rounded-2xl bg-[#03363d]/40 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-500/20 shadow-[0_0_16px_rgba(16,185,129,0.1)]">
                          <Zap className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-manrope font-extrabold text-[16px] text-on-surface mb-1">Zendesk</h4>
                          <p className="text-[13px] text-on-surface-med font-inter">Automatically create tickets from support calls.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 ml-6 shrink-0">
                        <Button className="bg-surface-highest hover:bg-surface-bright text-on-surface transition-colors font-inter font-bold text-[13px] rounded-xl h-[38px] px-6 border-none">Connect</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
