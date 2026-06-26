import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { User, Key, CreditCard, Puzzle, Eye, Copy, CheckCircle2, ChevronRight, Zap } from "lucide-react";
import { Switch } from "../components/ui/switch";

export default function Settings() {
  const [activeTab, setActiveTab] = useState<"profile" | "api" | "billing" | "integrations">("profile");

  const navItem = (tab: string) =>
    `w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
      activeTab === tab
        ? "bg-neutral-100 text-neutral-900"
        : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50"
    }`;

  return (
    <div className="p-6 space-y-5 h-full flex flex-col">
      <h1 className="text-[18px] font-semibold text-neutral-900">Settings</h1>

      <div className="flex gap-8 flex-1 min-h-0 overflow-y-auto">
        {/* Nav */}
        <div className="w-[200px] shrink-0 space-y-0.5">
          <button onClick={() => setActiveTab("profile")} className={navItem("profile")}>
            <User className="h-4 w-4" strokeWidth={1.8} /> Profile
          </button>
          <button onClick={() => setActiveTab("api")} className={navItem("api")}>
            <Key className="h-4 w-4" strokeWidth={1.8} /> API Keys
          </button>
          <button onClick={() => setActiveTab("billing")} className={navItem("billing")}>
            <CreditCard className="h-4 w-4" strokeWidth={1.8} /> Billing
          </button>
          <button onClick={() => setActiveTab("integrations")} className={navItem("integrations")}>
            <Puzzle className="h-4 w-4" strokeWidth={1.8} /> Integrations
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 max-w-3xl">
          {activeTab === "profile" && (
            <div className="border border-neutral-200 rounded-lg p-6 space-y-6">
              <h2 className="text-[14px] font-semibold text-neutral-900">Profile Settings</h2>
              <div className="flex items-center gap-5 pb-5 border-b border-neutral-100">
                <div className="h-16 w-16 rounded-full bg-neutral-200 flex items-center justify-center text-[20px] font-semibold text-neutral-600">AS</div>
                <div>
                  <Button variant="outline" size="sm" className="h-8 text-[13px] rounded-md border-neutral-200 mb-1">Change Avatar</Button>
                  <p className="text-[11px] text-neutral-400">JPG, GIF or PNG. Max 800K</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5 block">First Name</label>
                  <Input defaultValue="Alex" className="h-9 text-[13px] border-neutral-200 rounded-md" />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5 block">Last Name</label>
                  <Input defaultValue="Smith" className="h-9 text-[13px] border-neutral-200 rounded-md" />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5 block">Email</label>
                  <Input defaultValue="alex@acmecorp.com" className="h-9 text-[13px] border-neutral-200 rounded-md" type="email" />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5 block">Role</label>
                  <Select defaultValue="admin">
                    <SelectTrigger className="h-9 text-[13px] border-neutral-200 rounded-md">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-md">
                      <SelectItem value="admin" className="text-[13px]">Administrator</SelectItem>
                      <SelectItem value="specialist" className="text-[13px]">Specialist</SelectItem>
                      <SelectItem value="viewer" className="text-[13px]">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button className="bg-neutral-900 text-white hover:bg-neutral-800 h-8 text-[13px] font-medium rounded-md px-5">Save Changes</Button>
              </div>
            </div>
          )}

          {activeTab === "api" && (
            <div className="border border-neutral-200 rounded-lg overflow-hidden">
              <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
                <h2 className="text-[14px] font-semibold text-neutral-900">API Keys</h2>
                <Button className="bg-neutral-900 text-white hover:bg-neutral-800 h-8 text-[13px] font-medium rounded-md">Generate Key</Button>
              </div>
              {[
                { name: "Deepgram API Key", tag: "Speech-to-Text", value: "sk-deepgram-••••••••••••••••••••••••" },
                { name: "Voicera Widget Key", tag: "Frontend Auth", value: "vwk_live_84kx9f2m4nv93nx1••••••••" },
                { name: "Webhook Secret", tag: "Server Validation", value: "whsec_29fj49d03kd92kdl••••••••" },
              ].map((key, i) => (
                <div key={i} className="p-5 border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[13px] font-medium text-neutral-900">{key.name}</span>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">{key.tag}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="font-mono text-[12px] bg-neutral-50 px-3 py-2 rounded-md border border-neutral-200 flex-1 text-neutral-500">{key.value}</div>
                    <button className="p-2 rounded-md border border-neutral-200 hover:bg-neutral-50 text-neutral-400"><Eye className="h-3.5 w-3.5" /></button>
                    <button className="p-2 rounded-md border border-neutral-200 hover:bg-neutral-50 text-neutral-400"><Copy className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "billing" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-neutral-900 text-white rounded-lg p-5 relative overflow-hidden">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 mb-1">Current Plan</div>
                  <div className="text-[32px] font-semibold tracking-tight mb-0.5">Pro</div>
                  <p className="text-[13px] text-neutral-400 mb-5">$99/month, billed annually</p>
                  <Button className="w-full bg-white text-neutral-900 hover:bg-neutral-100 h-8 text-[13px] font-medium rounded-md">
                    Manage Subscription
                  </Button>
                </div>
                <div className="border border-neutral-200 rounded-lg p-5">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 mb-3">Payment Method</div>
                  <div className="flex items-center gap-3 bg-neutral-50 p-3 rounded-md border border-neutral-100 mb-4">
                    <div className="w-10 h-7 bg-white border border-neutral-200 rounded flex items-center justify-center font-bold text-neutral-800 text-[10px] italic">VISA</div>
                    <div>
                      <div className="text-[13px] font-medium text-neutral-900">•••• 4242</div>
                      <div className="text-[11px] text-neutral-400">Expires 12/25</div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full h-8 text-[13px] font-medium border-neutral-200 rounded-md">Update</Button>
                </div>
              </div>
              <div className="border border-neutral-200 rounded-lg p-5">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-[14px] font-semibold text-neutral-900">Usage</h2>
                  <span className="text-[12px] text-neutral-400">Resets in 12 days</span>
                </div>
                {[
                  { label: "Voice Minutes", used: "4,821", total: "10,000", pct: 48, color: "bg-neutral-700" },
                  { label: "Support Tickets", used: "842", total: "2,000", pct: 42, color: "bg-neutral-500" },
                  { label: "Automations", used: "95%", total: "of limit", pct: 95, color: "bg-red-500" },
                ].map((item, i) => (
                  <div key={i} className="mb-5 last:mb-0">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[13px] text-neutral-700">{item.label}</span>
                      <span className="text-[13px] font-medium text-neutral-900">{item.used} <span className="text-neutral-400 font-normal">/ {item.total}</span></span>
                    </div>
                    <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="space-y-5">
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-neutral-100 bg-neutral-50">
                  <h2 className="text-[14px] font-semibold text-neutral-900">CRM Integrations</h2>
                </div>
                {[
                  { name: "HubSpot", desc: "Sync contacts and log support calls.", color: "bg-orange-50 text-orange-500", connected: true },
                  { name: "Salesforce", desc: "Enterprise-grade sync for cases.", color: "bg-blue-50 text-blue-500", connected: true },
                ].map((item, i) => (
                  <div key={i} className="p-5 border-b border-neutral-50 last:border-0 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-md ${item.color} flex items-center justify-center`}>
                        <Zap className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-[13px] font-medium text-neutral-900">{item.name}</div>
                        <div className="text-[12px] text-neutral-500">{item.desc}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.connected && <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Connected</span>}
                      <Switch defaultChecked />
                    </div>
                  </div>
                ))}
              </div>
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-neutral-100 bg-neutral-50">
                  <h2 className="text-[14px] font-semibold text-neutral-900">Support Platforms</h2>
                </div>
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-emerald-50 text-emerald-500 flex items-center justify-center">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-neutral-900">Zendesk</div>
                      <div className="text-[12px] text-neutral-500">Create tickets from support calls.</div>
                    </div>
                  </div>
                  <Button className="bg-neutral-900 text-white hover:bg-neutral-800 h-8 text-[13px] font-medium rounded-md">Connect</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
