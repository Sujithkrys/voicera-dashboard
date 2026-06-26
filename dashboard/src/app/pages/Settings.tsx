import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { User, Key, CreditCard, Puzzle, Eye, Copy, CheckCircle2, ChevronRight, Zap, RefreshCw } from 'lucide-react';
import { Switch } from '../components/ui/switch';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'api' | 'billing' | 'integrations'>('profile');

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto h-full flex flex-col bg-[#fafafa]">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-[24px] font-manrope font-extrabold tracking-tight text-slate-900">Settings</h1>
          <p className="text-slate-500 font-inter text-[13px] mt-1 font-medium">Manage your account, team, and integrations</p>
        </div>
      </div>

      <div className="flex gap-8 flex-1 min-h-0 overflow-y-auto pb-10 flex-col md:flex-row">
        {/* Left Side Navigation */}
        <div className="w-full md:w-[260px] shrink-0 space-y-1.5">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold font-inter transition-all ${
              activeTab === 'profile' 
                ? 'bg-indigo-50/80 text-indigo-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <User className={`h-4 w-4 ${activeTab === 'profile' ? 'text-indigo-600' : 'text-slate-400'}`} strokeWidth={2.5} /> Profile Settings
          </button>
          
          <button 
            onClick={() => setActiveTab('api')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold font-inter transition-all ${
              activeTab === 'api' 
                ? 'bg-indigo-50/80 text-indigo-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Key className={`h-4 w-4 ${activeTab === 'api' ? 'text-indigo-600' : 'text-slate-400'}`} strokeWidth={2.5} /> API Keys
          </button>
          
          <button 
            onClick={() => setActiveTab('billing')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold font-inter transition-all ${
              activeTab === 'billing' 
                ? 'bg-indigo-50/80 text-indigo-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <CreditCard className={`h-4 w-4 ${activeTab === 'billing' ? 'text-indigo-600' : 'text-slate-400'}`} strokeWidth={2.5} /> Billing & Usage
          </button>
          
          <button 
            onClick={() => setActiveTab('integrations')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold font-inter transition-all ${
              activeTab === 'integrations' 
                ? 'bg-indigo-50/80 text-indigo-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Puzzle className={`h-4 w-4 ${activeTab === 'integrations' ? 'text-indigo-600' : 'text-slate-400'}`} strokeWidth={2.5} /> Integrations
          </button>
        </div>

        {/* Right Side Content */}
        <div className="flex-1 max-w-4xl space-y-6">
          
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <Card className="border border-slate-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] bg-white rounded-[20px]">
              <CardHeader className="pb-5 border-b border-slate-100/60 px-8 pt-8">
                <CardTitle className="text-[18px] font-manrope font-bold text-slate-900">Profile Settings</CardTitle>
                <CardDescription className="text-[13px] font-inter mt-1">Update your personal information and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center gap-6 pb-8 border-b border-slate-100/60">
                  <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[28px] font-bold text-white shadow-lg shadow-indigo-500/20">
                    AS
                  </div>
                  <div>
                    <Button variant="outline" className="mb-2 bg-white border-slate-200/60 font-bold font-inter rounded-xl hover:bg-slate-50 shadow-sm h-10 px-5 text-[13px]">Change Avatar</Button>
                    <p className="text-[12px] text-slate-500 font-medium font-inter">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-inter">First Name</label>
                    <Input defaultValue="Alex" className="bg-slate-50/80 border-slate-200/60 font-medium font-inter rounded-xl h-11 text-[14px] focus-visible:bg-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-inter">Last Name</label>
                    <Input defaultValue="Smith" className="bg-slate-50/80 border-slate-200/60 font-medium font-inter rounded-xl h-11 text-[14px] focus-visible:bg-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-inter">Email Address</label>
                    <Input defaultValue="alex@acmecorp.com" className="bg-slate-50/80 border-slate-200/60 font-medium font-inter rounded-xl h-11 text-[14px] focus-visible:bg-white" type="email" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-inter">Role</label>
                    <Select defaultValue="admin">
                      <SelectTrigger className="bg-slate-50/80 border-slate-200/60 font-medium font-inter rounded-xl h-11 text-[14px] focus-visible:bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200 shadow-lg">
                        <SelectItem value="admin" className="font-inter">Administrator</SelectItem>
                        <SelectItem value="specialist" className="font-inter">Specialist</SelectItem>
                        <SelectItem value="viewer" className="font-inter">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold font-inter h-11 px-8 rounded-xl shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:-translate-y-[1px] transition-all text-[14px]">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* API Keys */}
          {activeTab === 'api' && (
            <Card className="border border-slate-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] bg-white rounded-[20px]">
              <CardHeader className="pb-5 border-b border-slate-100/60 px-8 pt-8 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-[18px] font-manrope font-bold text-slate-900">API Keys</CardTitle>
                  <CardDescription className="text-[13px] font-inter mt-1">Manage keys for external services and widget embedding.</CardDescription>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold font-inter h-10 px-5 rounded-xl shadow-[0_4px_14px_rgba(79,70,229,0.3)] text-[13px] transition-all">
                  Generate Key
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100/80">
                  <div className="p-8 flex flex-col gap-4 group hover:bg-slate-50/50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-[14px] font-inter text-slate-900">Deepgram API Key</div>
                      <div className="text-[10px] text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md font-bold uppercase tracking-widest font-inter">Speech-to-Text</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="font-mono text-[13px] bg-slate-50 px-4 py-3 rounded-xl border border-slate-200/60 flex-1 text-slate-600 group-hover:border-slate-300 transition-colors">
                        sk-deepgram-••••••••••••••••••••••••••••••••
                      </div>
                      <Button variant="outline" size="icon" className="bg-white border-slate-200/60 rounded-xl h-11 w-11 hover:bg-slate-50 hover:text-indigo-600 shadow-sm shrink-0"><Eye className="h-4 w-4" /></Button>
                      <Button variant="outline" size="icon" className="bg-white border-slate-200/60 rounded-xl h-11 w-11 hover:bg-slate-50 hover:text-indigo-600 shadow-sm shrink-0"><Copy className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col gap-4 group hover:bg-slate-50/50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-[14px] font-inter text-slate-900">Voicera Widget Key</div>
                      <div className="text-[10px] text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md font-bold uppercase tracking-widest font-inter">Frontend Auth</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="font-mono text-[13px] bg-slate-50 px-4 py-3 rounded-xl border border-slate-200/60 flex-1 text-slate-600 group-hover:border-slate-300 transition-colors">
                        vwk_live_84kx9f2m4nv93nx1••••••••••••
                      </div>
                      <Button variant="outline" size="icon" className="bg-white border-slate-200/60 rounded-xl h-11 w-11 hover:bg-slate-50 hover:text-indigo-600 shadow-sm shrink-0"><Eye className="h-4 w-4" /></Button>
                      <Button variant="outline" size="icon" className="bg-white border-slate-200/60 rounded-xl h-11 w-11 hover:bg-slate-50 hover:text-indigo-600 shadow-sm shrink-0"><Copy className="h-4 w-4" /></Button>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col gap-4 group hover:bg-slate-50/50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-[14px] font-inter text-slate-900">Webhook Secret</div>
                      <div className="text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md font-bold uppercase tracking-widest font-inter">Server Validation</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="font-mono text-[13px] bg-slate-50 px-4 py-3 rounded-xl border border-slate-200/60 flex-1 text-slate-600 group-hover:border-slate-300 transition-colors">
                        whsec_29fj49d03kd92kdl••••••••••••
                      </div>
                      <Button variant="outline" size="icon" className="bg-white border-slate-200/60 rounded-xl h-11 w-11 hover:bg-slate-50 hover:text-indigo-600 shadow-sm shrink-0"><Eye className="h-4 w-4" /></Button>
                      <Button variant="outline" size="icon" className="bg-white border-slate-200/60 rounded-xl h-11 w-11 hover:bg-slate-50 hover:text-indigo-600 shadow-sm shrink-0"><Copy className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Billing & Usage */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border border-indigo-500/20 shadow-[0_10px_40px_rgba(79,70,229,0.15)] bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-[20px] overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                  <CardHeader className="pb-2 pt-6 px-6">
                    <CardTitle className="text-[15px] font-manrope font-bold text-indigo-100 uppercase tracking-widest">Current Plan</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <div className="text-[40px] font-manrope font-extrabold tracking-tight mb-1 text-white">Pro</div>
                    <p className="text-indigo-200 text-[13px] font-medium font-inter mb-6">$99/month, billed annually</p>
                    <Button className="w-full bg-white text-indigo-600 hover:bg-slate-50 font-bold font-inter h-11 rounded-xl shadow-md transition-all text-[13px]">
                      Manage Subscription
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] bg-white rounded-[20px]">
                  <CardHeader className="pb-2 pt-6 px-6">
                    <CardTitle className="text-[16px] font-manrope font-bold text-slate-900">Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6 flex flex-col h-[calc(100%-60px)]">
                    <div className="flex-1 flex items-center gap-4 bg-slate-50/80 p-5 rounded-xl border border-slate-200/60">
                      <div className="w-14 h-9 bg-white border border-slate-200/80 rounded-md flex items-center justify-center font-bold text-slate-800 text-[13px] italic shadow-sm">
                        VISA
                      </div>
                      <div>
                        <div className="font-bold text-[14px] text-slate-900 font-inter">•••• •••• •••• 4242</div>
                        <div className="text-[12px] text-slate-500 font-medium font-inter mt-0.5">Expires 12/25</div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-5 bg-white border-slate-200/60 font-bold font-inter h-11 rounded-xl text-[13px] shadow-sm hover:bg-slate-50">Update Method</Button>
                  </CardContent>
                </Card>
              </div>

              <Card className="border border-slate-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] bg-white rounded-[20px]">
                <CardHeader className="pb-5 border-b border-slate-100/60 px-8 pt-8 flex flex-row justify-between items-center">
                  <div>
                    <CardTitle className="text-[18px] font-manrope font-bold text-slate-900">Current Usage</CardTitle>
                    <CardDescription className="text-[13px] font-inter mt-1">Billing cycle resets in 12 days.</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="text-indigo-600 hover:bg-indigo-50 font-bold font-inter h-10 px-4 rounded-xl text-[13px]">
                    View History <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent className="p-8 space-y-10">
                  <div>
                    <div className="flex justify-between items-end mb-3">
                      <div className="font-bold text-[14px] text-slate-900 font-inter">Voice Minutes</div>
                      <div className="text-[14px] font-bold text-slate-900 font-inter">4,821 <span className="text-slate-400 font-medium text-[12px]">/ 10,000</span></div>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '48%' }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-end mb-3">
                      <div className="font-bold text-[14px] text-slate-900 font-inter">Support Tickets</div>
                      <div className="text-[14px] font-bold text-slate-900 font-inter">842 <span className="text-slate-400 font-medium text-[12px]">/ 2,000</span></div>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '42%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-3">
                      <div className="font-bold text-[14px] text-slate-900 font-inter">Automations</div>
                      <div className="text-[14px] font-bold text-rose-500 font-inter">95% <span className="text-slate-400 font-medium text-[12px]">of limit</span></div>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
                      <div className="h-full bg-rose-500 rounded-full relative" style={{ width: '95%' }}>
                        <div className="absolute top-0 bottom-0 left-0 right-0 bg-white/20 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Integrations */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <Card className="border border-slate-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] bg-white rounded-[20px] overflow-hidden">
                <CardHeader className="pb-5 border-b border-slate-100/60 px-8 pt-8 bg-slate-50/50">
                  <CardTitle className="text-[18px] font-manrope font-bold text-slate-900">CRM Integrations</CardTitle>
                  <CardDescription className="text-[13px] font-inter mt-1">Connect Voicera with your existing tools.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100/80">
                    <div className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0 border border-orange-100 shadow-sm group-hover:scale-105 transition-transform">
                          <Zap className="h-7 w-7" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[15px] font-inter text-slate-900 tracking-tight">HubSpot</h4>
                          <p className="text-[13px] text-slate-500 font-medium font-inter mt-1 leading-relaxed">Sync contacts and log support calls to deals automatically.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 ml-6 shrink-0">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md font-inter uppercase tracking-widest"><CheckCircle2 className="h-3.5 w-3.5" /> Connected</span>
                        <Switch defaultChecked />
                      </div>
                    </div>

                    <div className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0 border border-blue-100 shadow-sm group-hover:scale-105 transition-transform">
                          <Zap className="h-7 w-7" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[15px] font-inter text-slate-900 tracking-tight">Salesforce</h4>
                          <p className="text-[13px] text-slate-500 font-medium font-inter mt-1 leading-relaxed">Enterprise-grade sync for cases and accounts.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 ml-6 shrink-0">
                        <Button variant="outline" size="sm" className="bg-white border-slate-200/60 font-bold font-inter h-9 px-4 rounded-lg shadow-sm text-[12px] hover:bg-slate-50 hover:text-indigo-600">Configure</Button>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-slate-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] bg-white rounded-[20px] overflow-hidden">
                <CardHeader className="pb-5 border-b border-slate-100/60 px-8 pt-8 bg-slate-50/50">
                  <CardTitle className="text-[18px] font-manrope font-bold text-slate-900">Support Platforms</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100/80">
                    <div className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-100 shadow-sm group-hover:scale-105 transition-transform">
                          <RefreshCw className="h-7 w-7" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[15px] font-inter text-slate-900 tracking-tight">Zendesk</h4>
                          <p className="text-[13px] text-slate-500 font-medium font-inter mt-1 leading-relaxed">Automatically create tickets from support calls.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 ml-6 shrink-0">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold font-inter h-10 px-5 rounded-xl shadow-[0_4px_14px_rgba(79,70,229,0.3)] transition-all">Connect</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
