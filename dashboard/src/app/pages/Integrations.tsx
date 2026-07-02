import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Mail, Calendar, FileText, Database, BookOpen, ExternalLink, CheckCircle2 } from "lucide-react";
export default function Integrations() {
  const token = localStorage.getItem("voicera_token");
  const [status, setStatus] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Integrations</h1>
        <p className="text-neutral-500 mt-1">Connect your favorite tools to enable advanced AI automation.</p>
      </div>

      {/* Google Workspace */}
      <section className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Google Workspace</h2>
            <p className="text-sm text-neutral-500">Connect once to enable Mail, Calendar, Drive, and Docs.</p>
          </div>
          {googleConnected ? (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-sm font-medium border border-green-100">
              <CheckCircle2 className="w-4 h-4" /> Connected
            </div>
          ) : (
            <Button onClick={handleConnectGoogle} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
              Connect Google
            </Button>
          )}
        </div>
        <div className="divide-y divide-neutral-100">
          <IntegrationItem icon={<Mail className="w-5 h-5 text-red-500" />} title="Gmail" description="Allow AI to read and send emails on your behalf." active={!!status["gmail"]} />
          <IntegrationItem icon={<Calendar className="w-5 h-5 text-teal-500" />} title="Google Calendar" description="Manage your schedule and automate event creation." active={!!status["google-calendar"]} />
          <IntegrationItem icon={<Database className="w-5 h-5 text-blue-500" />} title="Google Drive" description="Search and summarize files in your drive." active={!!status["google-drive"]} />
          <IntegrationItem icon={<FileText className="w-5 h-5 text-blue-600" />} title="Google Docs" description="Generate and edit documents automatically." active={!!status["google-docs"]} />
        </div>
      </section>

      {/* Notion */}
      <section className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Notion</h2>
            <p className="text-sm text-neutral-500">Connect to your workspace to sync databases and pages.</p>
          </div>
          {notionConnected ? (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-sm font-medium border border-green-100">
              <CheckCircle2 className="w-4 h-4" /> Connected
            </div>
          ) : (
            <Button onClick={handleConnectNotion} className="bg-neutral-900 hover:bg-neutral-800 text-white shadow-sm">
              Connect Notion
            </Button>
          )}
        </div>
        <div className="divide-y divide-neutral-100">
          <IntegrationItem icon={<BookOpen className="w-5 h-5 text-neutral-800" />} title="Notion Workspace" description="Allow AI to update your daily analysis logs and read notes." active={!!status["notion"]} />
        </div>
      </section>
    </div>
  );
}

function IntegrationItem({ icon, title, description, active }: { icon: React.ReactNode, title: string, description: string, active: boolean }) {
  return (
    <div className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium text-neutral-900">{title}</h3>
          <p className="text-xs text-neutral-500">{description}</p>
        </div>
      </div>
      <div className="flex items-center">
        {active ? (
          <span className="text-xs font-medium text-green-600 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
          </span>
        ) : (
          <span className="text-xs font-medium text-neutral-400">Inactive</span>
        )}
      </div>
    </div>
  );
}
