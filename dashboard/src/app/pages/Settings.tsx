import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { User, Key, CreditCard, Puzzle, Eye, Copy, CheckCircle2, ChevronRight, Zap, Bell, Shield, Globe, Trash2, LogOut } from "lucide-react";
import { Switch } from "../components/ui/switch";

interface SettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function Settings({ open, onOpenChange }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "api" | "billing" | "integrations" | "notifications" | "security">("profile");

  const navItem = (tab: string) =>
    `w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
      activeTab === tab
        ? "bg-neutral-100 text-neutral-900"
        : "text-neutral-500 hover:text-neutral-700 hover:bg-transparent"
    }`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1000px] sm:max-w-[1000px] w-[95vw] h-[85vh] p-0 overflow-hidden flex gap-0 border-none rounded-2xl shadow-2xl bg-white [&>button]:top-4 [&>button]:right-4">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <div className="flex h-full w-full">
          {/* Nav Sidebar */}
          <div className="w-[240px] shrink-0 border-r border-neutral-100 bg-[#FDFCFB] p-6 space-y-6 flex flex-col">
            <div className="text-[11px] font-semibold tracking-[0.2em] text-neutral-400 uppercase ml-1">Settings</div>
            <div className="space-y-1 flex-1">
              <button onClick={() => setActiveTab("profile")} className={navItem("profile")}>
            <User className="h-4 w-4" strokeWidth={1.8} /> Profile
          </button>
          <button onClick={() => setActiveTab("notifications")} className={navItem("notifications")}>
            <Bell className="h-4 w-4" strokeWidth={1.8} /> Notifications
          </button>
          <button onClick={() => setActiveTab("security")} className={navItem("security")}>
            <Shield className="h-4 w-4" strokeWidth={1.8} /> Security
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
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-10 bg-white">
            <div className="max-w-2xl space-y-8">

              {/* ───── Profile ───── */}
          {activeTab === "profile" && (
            <>
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
                    <label className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5 block">Phone</label>
                    <Input defaultValue="+1 (555) 012-3456" className="h-9 text-[13px] border-neutral-200 rounded-md" type="tel" />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5 block">Role</label>
                    <Select defaultValue="admin">
                      <SelectTrigger className="h-9 text-[13px] border-neutral-200 rounded-md"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-md">
                        <SelectItem value="admin" className="text-[13px]">Administrator</SelectItem>
                        <SelectItem value="specialist" className="text-[13px]">Specialist</SelectItem>
                        <SelectItem value="viewer" className="text-[13px]">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5 block">Department</label>
                    <Select defaultValue="all">
                      <SelectTrigger className="h-9 text-[13px] border-neutral-200 rounded-md"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-md">
                        <SelectItem value="all" className="text-[13px]">All Departments</SelectItem>
                        <SelectItem value="technical" className="text-[13px]">Technical</SelectItem>
                        <SelectItem value="billing" className="text-[13px]">Billing</SelectItem>
                        <SelectItem value="sales" className="text-[13px]">Sales</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button className="bg-neutral-900 text-white hover:bg-neutral-800 h-8 text-[13px] font-medium rounded-md px-5">Save Changes</Button>
                </div>
              </div>

              {/* Preferences */}
              <div className="border border-neutral-200 rounded-lg p-6 space-y-5">
                <h2 className="text-[14px] font-semibold text-neutral-900">Preferences</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5 block">Language</label>
                    <Select defaultValue="en">
                      <SelectTrigger className="h-9 text-[13px] border-neutral-200 rounded-md"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-md">
                        <SelectItem value="en" className="text-[13px]">English</SelectItem>
                        <SelectItem value="es" className="text-[13px]">Español</SelectItem>
                        <SelectItem value="fr" className="text-[13px]">Français</SelectItem>
                        <SelectItem value="de" className="text-[13px]">Deutsch</SelectItem>
                        <SelectItem value="hi" className="text-[13px]">हिन्दी</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5 block">Timezone</label>
                    <Select defaultValue="ist">
                      <SelectTrigger className="h-9 text-[13px] border-neutral-200 rounded-md"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-md">
                        <SelectItem value="ist" className="text-[13px]">IST (UTC+5:30)</SelectItem>
                        <SelectItem value="est" className="text-[13px]">EST (UTC-5)</SelectItem>
                        <SelectItem value="pst" className="text-[13px]">PST (UTC-8)</SelectItem>
                        <SelectItem value="utc" className="text-[13px]">UTC</SelectItem>
                        <SelectItem value="gmt" className="text-[13px]">GMT (UTC+0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5 block">Date Format</label>
                    <Select defaultValue="dmy">
                      <SelectTrigger className="h-9 text-[13px] border-neutral-200 rounded-md"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-md">
                        <SelectItem value="dmy" className="text-[13px]">DD/MM/YYYY</SelectItem>
                        <SelectItem value="mdy" className="text-[13px]">MM/DD/YYYY</SelectItem>
                        <SelectItem value="ymd" className="text-[13px]">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5 block">Theme</label>
                    <Select defaultValue="light">
                      <SelectTrigger className="h-9 text-[13px] border-neutral-200 rounded-md"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-md">
                        <SelectItem value="light" className="text-[13px]">Light</SelectItem>
                        <SelectItem value="dark" className="text-[13px]">Dark</SelectItem>
                        <SelectItem value="system" className="text-[13px]">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ───── Notifications ───── */}
          {activeTab === "notifications" && (
            <div className="border border-neutral-200 rounded-lg overflow-hidden">
              <div className="p-5 border-b border-neutral-100">
                <h2 className="text-[14px] font-semibold text-neutral-900">Notification Preferences</h2>
                <p className="text-[12px] text-neutral-400 mt-0.5">Choose how and when you get notified.</p>
              </div>
              {[
                { label: "New call received", desc: "Get notified when a new customer call comes in.", email: true, push: true },
                { label: "Call escalated", desc: "Alert when a call is escalated to a human agent.", email: true, push: true },
                { label: "Ticket created", desc: "Notification when a new support ticket is generated.", email: true, push: false },
                { label: "Knowledge gap detected", desc: "AI found a question it couldn't answer.", email: true, push: false },
                { label: "Weekly summary", desc: "Digest of call volume, resolutions, and trends.", email: true, push: false },
                { label: "Team member joined", desc: "Someone accepts your team invitation.", email: false, push: true },
                { label: "Usage limit warning", desc: "Alert when you reach 80% of plan limits.", email: true, push: true },
                { label: "System maintenance", desc: "Scheduled downtime and update notices.", email: true, push: false },
              ].map((item, i) => (
                <div key={i} className="px-5 py-4 border-b border-neutral-50 last:border-0 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                  <div className="flex-1 mr-8">
                    <div className="text-[13px] font-medium text-neutral-900">{item.label}</div>
                    <div className="text-[12px] text-neutral-400 mt-0.5">{item.desc}</div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="flex flex-col items-center gap-1">
                      {i === 0 && <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Email</span>}
                      <Switch defaultChecked={item.email} />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      {i === 0 && <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Push</span>}
                      <Switch defaultChecked={item.push} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ───── Security ───── */}
          {activeTab === "security" && (
            <>
              <div className="border border-neutral-200 rounded-lg p-6 space-y-5">
                <h2 className="text-[14px] font-semibold text-neutral-900">Change Password</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5 block">Current Password</label>
                    <Input type="password" placeholder="••••••••" className="h-9 text-[13px] border-neutral-200 rounded-md" />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5 block">New Password</label>
                    <Input type="password" placeholder="••••••••" className="h-9 text-[13px] border-neutral-200 rounded-md" />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5 block">Confirm New Password</label>
                    <Input type="password" placeholder="••••••••" className="h-9 text-[13px] border-neutral-200 rounded-md" />
                  </div>
                  <Button className="bg-neutral-900 text-white hover:bg-neutral-800 h-8 text-[13px] font-medium rounded-md px-5">Update Password</Button>
                </div>
              </div>

              <div className="border border-neutral-200 rounded-lg p-6 space-y-4">
                <h2 className="text-[14px] font-semibold text-neutral-900">Two-Factor Authentication</h2>
                <p className="text-[13px] text-neutral-500">Add an extra layer of security to your account by requiring a verification code on login.</p>
                <div className="flex items-center justify-between bg-neutral-50 border border-neutral-100 rounded-md p-4">
                  <div>
                    <div className="text-[13px] font-medium text-neutral-900">2FA is currently disabled</div>
                    <div className="text-[12px] text-neutral-400 mt-0.5">Recommended for all admin accounts</div>
                  </div>
                  <Button variant="outline" className="h-8 text-[13px] font-medium border-neutral-200 rounded-md">Enable 2FA</Button>
                </div>
              </div>

              <div className="border border-neutral-200 rounded-lg p-6 space-y-4">
                <h2 className="text-[14px] font-semibold text-neutral-900">Active Sessions</h2>
                {[
                  { device: "Chrome on Windows", location: "Mumbai, India", current: true, time: "Now" },
                  { device: "Safari on iPhone", location: "Mumbai, India", current: false, time: "2 hours ago" },
                  { device: "Firefox on macOS", location: "New York, US", current: false, time: "3 days ago" },
                ].map((session, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b border-neutral-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${session.current ? "bg-emerald-500" : "bg-neutral-300"}`} />
                      <div>
                        <div className="text-[13px] font-medium text-neutral-900">
                          {session.device}
                          {session.current && <span className="ml-2 text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Current</span>}
                        </div>
                        <div className="text-[12px] text-neutral-400">{session.location} · {session.time}</div>
                      </div>
                    </div>
                    {!session.current && (
                      <button className="text-[12px] font-medium text-red-500 hover:text-red-600">Revoke</button>
                    )}
                  </div>
                ))}
              </div>

              {/* Danger Zone */}
              <div className="border border-red-200 rounded-lg p-6 space-y-4 bg-red-50/30">
                <h2 className="text-[14px] font-semibold text-red-600">Danger Zone</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-medium text-neutral-900">Delete Account</div>
                    <div className="text-[12px] text-neutral-500">Permanently delete your account and all data. This action cannot be undone.</div>
                  </div>
                  <Button variant="outline" className="h-8 text-[13px] font-medium border-red-300 text-red-600 hover:bg-red-50 rounded-md">
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-medium text-neutral-900">Export Data</div>
                    <div className="text-[12px] text-neutral-500">Download all your data as a JSON file.</div>
                  </div>
                  <Button variant="outline" className="h-8 text-[13px] font-medium border-neutral-200 rounded-md">Export</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-medium text-neutral-900">Sign out everywhere</div>
                    <div className="text-[12px] text-neutral-500">Log out from all devices and sessions.</div>
                  </div>
                  <Button variant="outline" className="h-8 text-[13px] font-medium border-neutral-200 rounded-md">
                    <LogOut className="h-3.5 w-3.5 mr-1.5" /> Sign Out All
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* ───── API Keys ───── */}
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

          {/* ───── Billing ───── */}
          {activeTab === "billing" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-neutral-900 text-white rounded-lg p-5 relative overflow-hidden">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 mb-1">Current Plan</div>
                  <div className="text-[32px] font-semibold tracking-tight mb-0.5">Pro</div>
                  <p className="text-[13px] text-neutral-400 mb-5">$99/month, billed annually</p>
                  <Button className="w-full bg-white text-neutral-900 hover:bg-neutral-100 h-8 text-[13px] font-medium rounded-md">Manage Subscription</Button>
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
                  <button className="text-[12px] font-medium text-neutral-500 hover:text-neutral-700 flex items-center gap-1">
                    View History <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
                {[
                  { label: "Voice Minutes", used: "4,821", total: "10,000", pct: 48, color: "bg-neutral-700" },
                  { label: "Support Tickets", used: "842", total: "2,000", pct: 42, color: "bg-neutral-500" },
                  { label: "Knowledge Base Docs", used: "47", total: "100", pct: 47, color: "bg-neutral-400" },
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

          {/* ───── Integrations ───── */}
          {activeTab === "integrations" && (
            <div className="space-y-5">
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-neutral-100 bg-neutral-50">
                  <h2 className="text-[14px] font-semibold text-neutral-900">CRM Integrations</h2>
                  <p className="text-[12px] text-neutral-400 mt-0.5">Connect Voicera with your existing tools.</p>
                </div>
                {[
                  { name: "HubSpot", desc: "Sync contacts and log support calls to deals automatically.", color: "bg-orange-50 text-orange-500", connected: true },
                  { name: "Salesforce", desc: "Enterprise-grade sync for cases and accounts.", color: "bg-blue-50 text-blue-500", connected: true },
                ].map((item, i) => (
                  <div key={i} className="p-5 border-b border-neutral-50 last:border-0 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-md ${item.color} flex items-center justify-center`}><Zap className="h-4 w-4" /></div>
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
                {[
                  { name: "Zendesk", desc: "Automatically create tickets from support calls.", color: "bg-emerald-50 text-emerald-500", connected: false },
                  { name: "Intercom", desc: "Route live chat conversations to Voicera agents.", color: "bg-blue-50 text-blue-500", connected: false },
                  { name: "Freshdesk", desc: "Sync call transcripts and resolutions.", color: "bg-teal-50 text-teal-500", connected: false },
                ].map((item, i) => (
                  <div key={i} className="p-5 border-b border-neutral-50 last:border-0 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-md ${item.color} flex items-center justify-center`}><Zap className="h-4 w-4" /></div>
                      <div>
                        <div className="text-[13px] font-medium text-neutral-900">{item.name}</div>
                        <div className="text-[12px] text-neutral-500">{item.desc}</div>
                      </div>
                    </div>
                    <Button className="bg-neutral-900 text-white hover:bg-neutral-800 h-8 text-[13px] font-medium rounded-md">Connect</Button>
                  </div>
                ))}
              </div>
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-neutral-100 bg-neutral-50">
                  <h2 className="text-[14px] font-semibold text-neutral-900">Communication</h2>
                </div>
                {[
                  { name: "Slack", desc: "Get call summaries and alerts in Slack channels.", color: "bg-purple-50 text-purple-500", connected: true },
                  { name: "Microsoft Teams", desc: "Receive notifications and escalation alerts.", color: "bg-indigo-50 text-indigo-500", connected: false },
                ].map((item, i) => (
                  <div key={i} className="p-5 border-b border-neutral-50 last:border-0 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-md ${item.color} flex items-center justify-center`}><Zap className="h-4 w-4" /></div>
                      <div>
                        <div className="text-[13px] font-medium text-neutral-900">{item.name}</div>
                        <div className="text-[12px] text-neutral-500">{item.desc}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.connected ? (
                        <>
                          <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Connected</span>
                          <Switch defaultChecked />
                        </>
                      ) : (
                        <Button className="bg-neutral-900 text-white hover:bg-neutral-800 h-8 text-[13px] font-medium rounded-md">Connect</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
