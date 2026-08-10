import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { User, Key, CreditCard, Puzzle, Eye, Copy, CheckCircle2, ChevronRight, Zap, Bell, Shield, Globe, Trash2, LogOut, Mail, Calendar, FileText, Database, BookOpen, Monitor, Moon, Sun, Palette, Loader2 } from "lucide-react";
import { Switch } from "../components/ui/switch";
import { useTheme } from "../context/ThemeContext";
import { apiClient } from "../../api/client";

interface SettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function Settings({ open, onOpenChange }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "appearance" | "integrations" | "security" | "usage">("profile");

  // Profile State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  
  // Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    if (open) {
      apiClient("/auth/me")
        .then((res: any) => {
          if (res.user) {
            setFullName(res.user.full_name || "");
            setEmail(res.user.email || "");
          }
        })
        .catch(console.error);
    }
  }, [open]);

  const handleProfileSave = async () => {
    try {
      setIsSavingProfile(true);
      await apiClient("/auth/profile", {
        method: "PATCH",
        body: JSON.stringify({ full_name: fullName, email }),
      });
      alert("Profile updated successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSave = async () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    try {
      setIsSavingPassword(true);
      await apiClient("/auth/password", {
        method: "PATCH",
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      alert("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      alert(err.message || "Failed to update password");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleSignOutAll = async () => {
    if (!window.confirm("Are you sure you want to sign out from all devices?")) return;
    try {
      await apiClient("/auth/logout", { method: "POST" });
      localStorage.removeItem("voicera_token");
      window.location.href = "/login";
    } catch (err: any) {
      alert(err.message || "Failed to sign out");
    }
  };

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
          <button onClick={() => setActiveTab("security")} className={navItem("security")}>
            <Shield className="h-4 w-4" strokeWidth={1.8} /> Security
          </button>
          <button onClick={() => setActiveTab("usage")} className={navItem("usage")}>
            <Zap className="h-4 w-4" strokeWidth={1.8} /> Usage
          </button>
          <button onClick={() => setActiveTab("integrations")} className={navItem("integrations")}>
            <Puzzle className="h-4 w-4" strokeWidth={1.8} /> Integrations
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
                  <div className="h-16 w-16 rounded-full bg-neutral-200 flex items-center justify-center text-[20px] font-semibold text-muted-foreground">
                    {fullName.charAt(0) || "U"}
                  </div>
                  <div>
                    <Button variant="outline" size="sm" className="h-8 text-[13px] rounded-md border-border mb-1">Change Avatar</Button>
                    <p className="text-[11px] text-muted-foreground">JPG, GIF or PNG. Max 800K</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Full Name</label>
                    <Input value={fullName} onChange={e => setFullName(e.target.value)} className="h-9 text-[13px] border-border rounded-md" />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Email</label>
                    <Input value={email} onChange={e => setEmail(e.target.value)} className="h-9 text-[13px] border-border rounded-md" type="email" />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button onClick={handleProfileSave} disabled={isSavingProfile} className="bg-primary text-primary-foreground hover:bg-primary h-8 text-[13px] font-medium rounded-md px-5">
                    {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Save Changes"}
                  </Button>
                </div>
              </div>
            </>
          )}



          {/* ───── Security ───── */}
          {activeTab === "security" && (
            <>
              <div className="border border-border rounded-lg p-6 space-y-5">
                <h2 className="text-[14px] font-semibold text-foreground">Change Password</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Current Password</label>
                    <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" className="h-9 text-[13px] border-border rounded-md" />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">New Password</label>
                    <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" className="h-9 text-[13px] border-border rounded-md" />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Confirm New Password</label>
                    <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" className="h-9 text-[13px] border-border rounded-md" />
                  </div>
                  <Button onClick={handlePasswordSave} disabled={isSavingPassword || !currentPassword || !newPassword || !confirmPassword} className="bg-primary text-primary-foreground hover:bg-primary h-8 text-[13px] font-medium rounded-md px-5">
                    {isSavingPassword ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Update Password"}
                  </Button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="border border-red-200 rounded-lg p-6 space-y-4 bg-red-50/30">
                <h2 className="text-[14px] font-semibold text-red-600">Danger Zone</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-medium text-foreground">Sign out everywhere</div>
                    <div className="text-[12px] text-muted-foreground">Log out from all devices and sessions.</div>
                  </div>
                  <Button onClick={handleSignOutAll} variant="outline" className="h-8 text-[13px] font-medium border-border rounded-md">
                    <LogOut className="h-3.5 w-3.5 mr-1.5" /> Sign Out All
                  </Button>
                </div>
              </div>
            </>
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
      const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://voicera-dashboard-production-3c5b.up.railway.app';
      const response = await fetch(`${BACKEND_URL}/api/v1/oauth/status`, {
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
    const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://voicera-dashboard-production-3c5b.up.railway.app';
    window.location.href = `${BACKEND_URL}/api/v1/oauth/google/authorize?token=${token}`;
  };

  const handleConnectNotion = () => {
    const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://voicera-dashboard-production-3c5b.up.railway.app';
    window.location.href = `${BACKEND_URL}/api/v1/oauth/notion/authorize?token=${token}`;
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
