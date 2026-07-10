import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { User, Key, CreditCard, Puzzle, Eye, Copy, CheckCircle2, ChevronRight, Zap, Bell, Shield, Globe, Trash2, LogOut, Mail, Calendar, FileText, Database, BookOpen, Monitor, Moon, Sun, Palette } from "lucide-react";
import { Switch } from "../components/ui/switch";
import { useTheme } from "../context/ThemeContext";

interface SettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function Settings({ open, onOpenChange }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "appearance" | "api" | "billing" | "integrations" | "notifications" | "security" | "usage">("profile");

  const navItem = (tab: string) =>
    `w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
      activeTab === tab
        ? "bg-secondary text-foreground"
        : "text-muted-foreground hover:text-foreground hover:bg-transparent"
    }`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1000px] sm:max-w-[1000px] w-[95vw] h-[85vh] p-0 overflow-hidden flex gap-0 border-none rounded-2xl shadow-2xl bg-background [&>button]:top-4 [&>button]:right-4">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <div className="flex h-full w-full">
          {/* Nav Sidebar */}
          <div className="w-[240px] shrink-0 border-r border-border bg-[#FDFCFB] p-6 space-y-6 flex flex-col">
            <div className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase ml-1">Settings</div>
            <div className="space-y-1 flex-1">
          <button onClick={() => setActiveTab("profile")} className={navItem("profile")}>
            <User className="h-4 w-4" strokeWidth={1.8} /> Profile
          </button>
          <button onClick={() => setActiveTab("appearance")} className={navItem("appearance")}>
            <Palette className="h-4 w-4" strokeWidth={1.8} /> Appearance
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
          <button onClick={() => setActiveTab("usage")} className={navItem("usage")}>
            <Zap className="h-4 w-4" strokeWidth={1.8} /> Usage
          </button>
          <button onClick={() => setActiveTab("integrations")} className={navItem("integrations")}>
            <Puzzle className="h-4 w-4" strokeWidth={1.8} /> Integrations
          </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-10 bg-background">
            <div className="max-w-2xl space-y-8">

          {/* ───── Appearance ───── */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-[15px] font-semibold text-foreground">Appearance</h2>
                <p className="text-[13px] text-muted-foreground mt-1">Customize how Voicera looks on your device.</p>
              </div>
              <AppearancePanel />
            </div>
          )}

          {/* ───── Profile ───── */}
          {activeTab === "profile" && (
            <>
              <div className="border border-border rounded-lg p-6 space-y-6">
                <h2 className="text-[14px] font-semibold text-foreground">Profile Settings</h2>
                <div className="flex items-center gap-5 pb-5 border-b border-border">
                  <div className="h-16 w-16 rounded-full bg-neutral-200 flex items-center justify-center text-[20px] font-semibold text-muted-foreground">AS</div>
                  <div>
                    <Button variant="outline" size="sm" className="h-8 text-[13px] rounded-md border-border mb-1">Change Avatar</Button>
                    <p className="text-[11px] text-muted-foreground">JPG, GIF or PNG. Max 800K</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">First Name</label>
                    <Input defaultValue="Alex" className="h-9 text-[13px] border-border rounded-md" />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Last Name</label>
                    <Input defaultValue="Smith" className="h-9 text-[13px] border-border rounded-md" />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Email</label>
                    <Input defaultValue="alex@acmecorp.com" className="h-9 text-[13px] border-border rounded-md" type="email" />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Phone</label>
                    <Input defaultValue="+1 (555) 012-3456" className="h-9 text-[13px] border-border rounded-md" type="tel" />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Role</label>
                    <Select defaultValue="admin">
                      <SelectTrigger className="h-9 text-[13px] border-border rounded-md"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-md">
                        <SelectItem value="admin" className="text-[13px]">Administrator</SelectItem>
                        <SelectItem value="specialist" className="text-[13px]">Specialist</SelectItem>
                        <SelectItem value="viewer" className="text-[13px]">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Department</label>
                    <Select defaultValue="all">
                      <SelectTrigger className="h-9 text-[13px] border-border rounded-md"><SelectValue /></SelectTrigger>
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
                  <Button className="bg-primary text-primary-foreground hover:bg-primary h-8 text-[13px] font-medium rounded-md px-5">Save Changes</Button>
                </div>
              </div>

              {/* Preferences */}
              <div className="border border-border rounded-lg p-6 space-y-5">
                <h2 className="text-[14px] font-semibold text-foreground">Preferences</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Language</label>
                    <Select defaultValue="en">
                      <SelectTrigger className="h-9 text-[13px] border-border rounded-md"><SelectValue /></SelectTrigger>
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
                    <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Timezone</label>
                    <Select defaultValue="ist">
                      <SelectTrigger className="h-9 text-[13px] border-border rounded-md"><SelectValue /></SelectTrigger>
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
                    <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Date Format</label>
                    <Select defaultValue="dmy">
                      <SelectTrigger className="h-9 text-[13px] border-border rounded-md"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-md">
                        <SelectItem value="dmy" className="text-[13px]">DD/MM/YYYY</SelectItem>
                        <SelectItem value="mdy" className="text-[13px]">MM/DD/YYYY</SelectItem>
                        <SelectItem value="ymd" className="text-[13px]">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Theme</label>
                    <Select defaultValue="light">
                      <SelectTrigger className="h-9 text-[13px] border-border rounded-md"><SelectValue /></SelectTrigger>
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
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="p-5 border-b border-border">
                <h2 className="text-[14px] font-semibold text-foreground">Notification Preferences</h2>
                <p className="text-[12px] text-muted-foreground mt-0.5">Choose how and when you get notified.</p>
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
                <div key={i} className="px-5 py-4 border-b border-neutral-50 last:border-0 flex items-center justify-between hover:bg-muted transition-colors">
                  <div className="flex-1 mr-8">
                    <div className="text-[13px] font-medium text-foreground">{item.label}</div>
                    <div className="text-[12px] text-muted-foreground mt-0.5">{item.desc}</div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="flex flex-col items-center gap-1">
                      {i === 0 && <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Email</span>}
                      <Switch defaultChecked={item.email} />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      {i === 0 && <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Push</span>}
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
              <div className="border border-border rounded-lg p-6 space-y-5">
                <h2 className="text-[14px] font-semibold text-foreground">Change Password</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Current Password</label>
                    <Input type="password" placeholder="••••••••" className="h-9 text-[13px] border-border rounded-md" />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">New Password</label>
                    <Input type="password" placeholder="••••••••" className="h-9 text-[13px] border-border rounded-md" />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Confirm New Password</label>
                    <Input type="password" placeholder="••••••••" className="h-9 text-[13px] border-border rounded-md" />
                  </div>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary h-8 text-[13px] font-medium rounded-md px-5">Update Password</Button>
                </div>
              </div>

              <div className="border border-border rounded-lg p-6 space-y-4">
                <h2 className="text-[14px] font-semibold text-foreground">Two-Factor Authentication</h2>
                <p className="text-[13px] text-muted-foreground">Add an extra layer of security to your account by requiring a verification code on login.</p>
                <div className="flex items-center justify-between bg-muted border border-border rounded-md p-4">
                  <div>
                    <div className="text-[13px] font-medium text-foreground">2FA is currently disabled</div>
                    <div className="text-[12px] text-muted-foreground mt-0.5">Recommended for all admin accounts</div>
                  </div>
                  <Button variant="outline" className="h-8 text-[13px] font-medium border-border rounded-md">Enable 2FA</Button>
                </div>
              </div>

              <div className="border border-border rounded-lg p-6 space-y-4">
                <h2 className="text-[14px] font-semibold text-foreground">Active Sessions</h2>
                {[
                  { device: "Chrome on Windows", location: "Mumbai, India", current: true, time: "Now" },
                  { device: "Safari on iPhone", location: "Mumbai, India", current: false, time: "2 hours ago" },
                  { device: "Firefox on macOS", location: "New York, US", current: false, time: "3 days ago" },
                ].map((session, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b border-neutral-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${session.current ? "bg-emerald-500" : "bg-neutral-300"}`} />
                      <div>
                        <div className="text-[13px] font-medium text-foreground">
                          {session.device}
                          {session.current && <span className="ml-2 text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Current</span>}
                        </div>
                        <div className="text-[12px] text-muted-foreground">{session.location} · {session.time}</div>
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
                    <div className="text-[13px] font-medium text-foreground">Delete Account</div>
                    <div className="text-[12px] text-muted-foreground">Permanently delete your account and all data. This action cannot be undone.</div>
                  </div>
                  <Button variant="outline" className="h-8 text-[13px] font-medium border-red-300 text-red-600 hover:bg-red-50 rounded-md">
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-medium text-foreground">Export Data</div>
                    <div className="text-[12px] text-muted-foreground">Download all your data as a JSON file.</div>
                  </div>
                  <Button variant="outline" className="h-8 text-[13px] font-medium border-border rounded-md">Export</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-medium text-foreground">Sign out everywhere</div>
                    <div className="text-[12px] text-muted-foreground">Log out from all devices and sessions.</div>
                  </div>
                  <Button variant="outline" className="h-8 text-[13px] font-medium border-border rounded-md">
                    <LogOut className="h-3.5 w-3.5 mr-1.5" /> Sign Out All
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* ───── API Keys ───── */}
          {activeTab === "api" && (
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h2 className="text-[14px] font-semibold text-foreground">API Keys</h2>
                <Button className="bg-primary text-primary-foreground hover:bg-primary h-8 text-[13px] font-medium rounded-md">Generate Key</Button>
              </div>
              {[
                { name: "Voicera Widget Key", tag: "Frontend Auth", value: "vwk_live_84kx9f2m4nv93nx1••••••••" },
              ].map((key, i) => (
                <div key={i} className="p-5 border-b border-neutral-50 last:border-0 hover:bg-muted transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[13px] font-medium text-foreground">{key.name}</span>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{key.tag}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="font-mono text-[12px] bg-muted px-3 py-2 rounded-md border border-border flex-1 text-muted-foreground">{key.value}</div>
                    <button className="p-2 rounded-md border border-border hover:bg-muted text-muted-foreground"><Eye className="h-3.5 w-3.5" /></button>
                    <button className="p-2 rounded-md border border-border hover:bg-muted text-muted-foreground"><Copy className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ───── Billing ───── */}
          {activeTab === "billing" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-primary text-primary-foreground rounded-lg p-5 relative overflow-hidden">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-primary-foreground/70 mb-1">Current Plan</div>
                  <div className="text-[32px] font-semibold tracking-tight mb-0.5">Beta Access</div>
                  <p className="text-[13px] text-primary-foreground/80 mb-5">Free during early access period</p>
                  <Button disabled className="w-full bg-background/20 text-primary-foreground h-8 text-[13px] font-medium rounded-md cursor-not-allowed">Active</Button>
                </div>
                <div className="border border-border rounded-lg p-5 flex flex-col">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-3">Payment Method</div>
                  <div className="flex-1 flex items-center justify-center text-center p-4">
                    <div>
                      <p className="text-[13px] font-medium text-foreground">No payment required</p>
                      <p className="text-[12px] text-muted-foreground mt-1">You won't be charged during the beta phase.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border border-border rounded-lg p-5">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-[14px] font-semibold text-foreground">Usage Overview</h2>
                </div>
                <div className="text-[13px] text-muted-foreground bg-muted p-4 rounded-md">
                  <p className="mb-2 text-foreground font-medium">Unmetered Usage</p>
                  <p>Your account currently has unmetered access to core features. Check the <strong>Usage</strong> tab for detailed AI token metrics.</p>
                </div>
              </div>
            </div>
          )}

          {/* ───── Usage ───── */}
          {activeTab === "usage" && (
            <div className="space-y-5">
              <div className="border border-border rounded-lg p-5">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-[14px] font-semibold text-foreground">AI Token Usage</h2>
                </div>
                <UsagePanel />
              </div>
            </div>
          )}

          {/* ───── Integrations ───── */}
          {activeTab === "integrations" && (
            <div className="space-y-5">
              <IntegrationsPanel />
            </div>
          )}

            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function UsagePanel() {
  const [usageStats, setUsageStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    import("../../api/client").then(({ apiClient }) => {
      apiClient("/usage")
        .then(setUsageStats)
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    });
  }, []);

  if (loading) return <div className="text-[13px] text-muted-foreground">Loading usage statistics...</div>;
  if (error) return <div className="text-[13px] text-red-500">Error loading stats: {error}</div>;
  if (!usageStats) return null;

  const pct = Math.min((usageStats.total_tokens / usageStats.monthly_limit) * 100, 100).toFixed(1);

  return (
    <>
      {[
        { label: "Input Tokens (Prompt)", used: usageStats.prompt_tokens.toLocaleString(), total: usageStats.monthly_limit.toLocaleString(), pct: (usageStats.prompt_tokens / usageStats.monthly_limit) * 100, color: "bg-blue-500" },
        { label: "Output Tokens (Completion)", used: usageStats.completion_tokens.toLocaleString(), total: usageStats.monthly_limit.toLocaleString(), pct: (usageStats.completion_tokens / usageStats.monthly_limit) * 100, color: "bg-purple-500" },
        { label: "Total AI Tokens", used: usageStats.total_tokens.toLocaleString(), total: usageStats.monthly_limit.toLocaleString(), pct: (usageStats.total_tokens / usageStats.monthly_limit) * 100, color: "bg-primary" },
      ].map((item, i) => (
        <div key={i} className="mb-5 last:mb-0">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[13px] text-foreground">{item.label}</span>
            <span className="text-[13px] font-medium text-foreground">{item.used} <span className="text-muted-foreground font-normal">/ {item.total}</span></span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${item.color}`} style={{ width: `${Math.max(item.pct, 0.5)}%` }} />
          </div>
        </div>
      ))}
    </>
  );
}

function IntegrationsPanel() {
  const token = localStorage.getItem("voicera_token");
  const [status, setStatus] = React.useState<Record<string, boolean>>({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch("https://voicera-dashboard-production.up.railway.app/api/v1/oauth/status", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (e) {
      console.error("Failed to fetch integration status", e);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGoogle = () => {
    window.location.href = `https://voicera-dashboard-production.up.railway.app/api/v1/oauth/google/authorize?token=${token}`;
  };

  const handleConnectNotion = () => {
    window.location.href = `https://voicera-dashboard-production.up.railway.app/api/v1/oauth/notion/authorize?token=${token}`;
  };

  const googleConnected = status["gmail"] || status["google-calendar"] || status["google-drive"] || status["google-docs"];
  const notionConnected = status["notion"];

  return (
    <>
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border bg-muted flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-semibold text-foreground">Google Workspace</h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">Connect once to enable Mail, Calendar, Drive, and Docs.</p>
          </div>
          {googleConnected ? (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-[12px] font-medium border border-green-100">
              <CheckCircle2 className="w-3.5 h-3.5" /> Connected
            </div>
          ) : (
            <Button onClick={handleConnectGoogle} className="bg-blue-600 hover:bg-blue-700 text-primary-foreground h-8 text-[13px] font-medium rounded-md">
              Connect Google
            </Button>
          )}
        </div>
        <div className="divide-y divide-neutral-100">
          <IntegrationItem icon={<Mail className="w-4 h-4 text-red-500" />} title="Gmail" description="Allow AI to read and send emails on your behalf." active={!!status["gmail"]} />
          <IntegrationItem icon={<Calendar className="w-4 h-4 text-teal-500" />} title="Google Calendar" description="Manage your schedule and automate event creation." active={!!status["google-calendar"]} />
          <IntegrationItem icon={<Database className="w-4 h-4 text-blue-500" />} title="Google Drive" description="Search and summarize files in your drive." active={!!status["google-drive"]} />
          <IntegrationItem icon={<FileText className="w-4 h-4 text-blue-600" />} title="Google Docs" description="Generate and edit documents automatically." active={!!status["google-docs"]} />
        </div>
      </div>

      <div className="border border-border rounded-lg overflow-hidden mt-5">
        <div className="p-4 border-b border-border bg-muted flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-semibold text-foreground">Notion</h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">Connect to your workspace to sync databases and pages.</p>
          </div>
          {notionConnected ? (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-[12px] font-medium border border-green-100">
              <CheckCircle2 className="w-3.5 h-3.5" /> Connected
            </div>
          ) : (
            <Button onClick={handleConnectNotion} className="bg-primary hover:bg-primary text-primary-foreground h-8 text-[13px] font-medium rounded-md">
              Connect Notion
            </Button>
          )}
        </div>
        <div className="divide-y divide-neutral-100">
          <IntegrationItem icon={<BookOpen className="w-4 h-4 text-foreground" />} title="Notion Workspace" description="Allow AI to update your daily analysis logs and read notes." active={!!status["notion"]} />
        </div>
      </div>
    </>
  );
}

function IntegrationItem({ icon, title, description, active }: { icon: React.ReactNode, title: string, description: string, active: boolean }) {
  return (
    <div className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="text-[13px] font-medium text-foreground">{title}</h3>
          <p className="text-[12px] text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex items-center">
        {active ? (
          <span className="text-[12px] font-medium text-green-600 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
          </span>
        ) : (
          <span className="text-[12px] font-medium text-muted-foreground">Inactive</span>
        )}
      </div>
    </div>
  );
}

function AppearancePanel() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setTheme("light")}
          className={`relative flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
            theme === "light"
              ? "border-neutral-900 bg-muted dark:border-white dark:bg-primary"
              : "border-border hover:border-border hover:bg-muted dark:border-neutral-700 dark:hover:border-neutral-600 dark:hover:bg-primary"
          }`}
        >
          <div className="h-8 w-8 rounded-full bg-background border shadow-sm flex items-center justify-center mb-4">
            <Sun className="h-4 w-4 text-foreground" />
          </div>
          <span className="font-semibold text-[14px] text-foreground dark:text-primary-foreground">Light</span>
          <span className="text-[12px] text-muted-foreground dark:text-muted-foreground mt-1">Light theme for daytime.</span>
          {theme === "light" && (
            <div className="absolute top-4 right-4 text-foreground dark:text-primary-foreground">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          )}
        </button>

        <button
          onClick={() => setTheme("dark")}
          className={`relative flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
            theme === "dark"
              ? "border-neutral-900 bg-muted dark:border-white dark:bg-primary"
              : "border-border hover:border-border hover:bg-muted dark:border-neutral-700 dark:hover:border-neutral-600 dark:hover:bg-primary"
          }`}
        >
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mb-4">
            <Moon className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-[14px] text-foreground dark:text-primary-foreground">Dark</span>
          <span className="text-[12px] text-muted-foreground dark:text-muted-foreground mt-1">Dark theme for night.</span>
          {theme === "dark" && (
            <div className="absolute top-4 right-4 text-foreground dark:text-primary-foreground">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          )}
        </button>

        <button
          onClick={() => setTheme("system")}
          className={`relative flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
            theme === "system"
              ? "border-neutral-900 bg-muted dark:border-white dark:bg-primary"
              : "border-border hover:border-border hover:bg-muted dark:border-neutral-700 dark:hover:border-neutral-600 dark:hover:bg-primary"
          }`}
        >
          <div className="h-8 w-8 rounded-full bg-secondary dark:bg-primary border flex items-center justify-center mb-4">
            <Monitor className="h-4 w-4 text-foreground dark:text-neutral-300" />
          </div>
          <span className="font-semibold text-[14px] text-foreground dark:text-primary-foreground">System</span>
          <span className="text-[12px] text-muted-foreground dark:text-muted-foreground mt-1">Matches your device.</span>
          {theme === "system" && (
            <div className="absolute top-4 right-4 text-foreground dark:text-primary-foreground">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
