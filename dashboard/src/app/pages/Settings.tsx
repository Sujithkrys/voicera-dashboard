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
    <div className="p-6 space-y-8 max-w-7xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your account, team, and integrations</p>
        </div>
      </div>

      <div className="flex gap-8 flex-1 min-h-0 overflow-y-auto pb-10 flex-col md:flex-row">
        {/* Left Side Navigation */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'profile' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <User className="h-4 w-4" /> Profile Settings
          </button>
          
          <button 
            onClick={() => setActiveTab('api')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'api' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Key className="h-4 w-4" /> API Keys
          </button>
          
          <button 
            onClick={() => setActiveTab('billing')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'billing' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <CreditCard className="h-4 w-4" /> Billing & Usage
          </button>
          
          <button 
            onClick={() => setActiveTab('integrations')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'integrations' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Puzzle className="h-4 w-4" /> Integrations
          </button>
        </div>

        {/* Right Side Content */}
        <div className="flex-1 max-w-4xl space-y-6">
          
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="text-lg">Profile Settings</CardTitle>
                <CardDescription>Update your personal information and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-md">
                    AS
                  </div>
                  <div>
                    <Button variant="outline" className="mb-2 bg-white">Change Avatar</Button>
                    <p className="text-xs text-slate-500 font-medium">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">First Name</label>
                    <Input defaultValue="Alex" className="bg-slate-50 font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Last Name</label>
                    <Input defaultValue="Smith" className="bg-slate-50 font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                    <Input defaultValue="alex@acmecorp.com" className="bg-slate-50 font-medium" type="email" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role</label>
                    <Select defaultValue="admin">
                      <SelectTrigger className="bg-slate-50 font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="specialist">Specialist</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* API Keys */}
          {activeTab === 'api' && (
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardHeader className="pb-4 border-b border-slate-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">API Keys</CardTitle>
                  <CardDescription className="mt-1">Manage keys for external services and widget embedding.</CardDescription>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-9">
                  Generate Key
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  <div className="p-6 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <div className="font-semibold text-sm text-slate-900">Deepgram API Key</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Speech-to-Text</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="font-mono text-sm bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 flex-1 text-slate-700">
                        sk-deepgram-••••••••••••••••••••••••••••••••
                      </div>
                      <Button variant="outline" size="icon" className="bg-white shrink-0"><Eye className="h-4 w-4" /></Button>
                      <Button variant="outline" size="icon" className="bg-white shrink-0"><Copy className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <div className="font-semibold text-sm text-slate-900">Voicera Widget Key</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Frontend Auth</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="font-mono text-sm bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 flex-1 text-slate-700">
                        vwk_live_84kx9f2m4nv93nx1••••••••••••
                      </div>
                      <Button variant="outline" size="icon" className="bg-white shrink-0"><Eye className="h-4 w-4" /></Button>
                      <Button variant="outline" size="icon" className="bg-white shrink-0"><Copy className="h-4 w-4" /></Button>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <div className="font-semibold text-sm text-slate-900">Webhook Secret</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Server Validation</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="font-mono text-sm bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 flex-1 text-slate-700">
                        whsec_29fj49d03kd92kdl••••••••••••
                      </div>
                      <Button variant="outline" size="icon" className="bg-white shrink-0"><Eye className="h-4 w-4" /></Button>
                      <Button variant="outline" size="icon" className="bg-white shrink-0"><Copy className="h-4 w-4" /></Button>
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
                <Card className="border-slate-200 shadow-sm bg-indigo-600 text-white border-0 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-white">Current Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-extrabold tracking-tight mb-1">Pro</div>
                    <p className="text-indigo-200 text-sm font-medium mb-6">$99/month, billed annually</p>
                    <Button className="w-full bg-white text-indigo-600 hover:bg-slate-50 font-bold shadow-sm">
                      Manage Subscription
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col h-[calc(100%-60px)]">
                    <div className="flex-1 flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="w-12 h-8 bg-white border border-slate-200 rounded flex items-center justify-center font-bold text-slate-800 text-xs italic">
                        VISA
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-900">•••• •••• •••• 4242</div>
                        <div className="text-xs text-slate-500 font-medium">Expires 12/25</div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-auto bg-white">Update Method</Button>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-slate-200 shadow-sm bg-white">
                <CardHeader className="pb-4 border-b border-slate-100 flex flex-row justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Current Usage</CardTitle>
                    <CardDescription className="mt-1">Billing cycle resets in 12 days.</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="text-indigo-600 hover:bg-indigo-50 font-bold">
                    View History <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent className="pt-6 space-y-8">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <div className="font-semibold text-sm text-slate-900">Voice Minutes</div>
                      <div className="text-sm font-bold text-slate-900">4,821 <span className="text-slate-400 font-medium text-xs">/ 10,000</span></div>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '48%' }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <div className="font-semibold text-sm text-slate-900">Support Tickets</div>
                      <div className="text-sm font-bold text-slate-900">842 <span className="text-slate-400 font-medium text-xs">/ 2,000</span></div>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '42%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <div className="font-semibold text-sm text-slate-900">Automations</div>
                      <div className="text-sm font-bold text-rose-500">95% <span className="text-slate-400 font-medium text-xs">of limit</span></div>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: '95%' }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Integrations */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
                <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-lg">CRM Integrations</CardTitle>
                  <CardDescription>Connect Voicera with your existing tools.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                          <Zap className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">HubSpot</h4>
                          <p className="text-sm text-slate-500 font-medium mt-0.5">Sync contacts and log support calls to deals automatically.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 ml-6 shrink-0">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md"><CheckCircle2 className="h-3.5 w-3.5" /> Connected</span>
                        <Switch defaultChecked />
                      </div>
                    </div>

                    <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                          <Zap className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">Salesforce</h4>
                          <p className="text-sm text-slate-500 font-medium mt-0.5">Enterprise-grade sync for cases and accounts.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 ml-6 shrink-0">
                        <Button variant="outline" size="sm" className="bg-white">Configure</Button>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
                <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-lg">Support Platforms</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                          <Zap className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">Zendesk</h4>
                          <p className="text-sm text-slate-500 font-medium mt-0.5">Automatically create tickets from support calls.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 ml-6 shrink-0">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-9">Connect</Button>
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
