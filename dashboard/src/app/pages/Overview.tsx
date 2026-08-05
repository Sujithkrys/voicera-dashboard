import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Tooltip,
} from "recharts";
import { apiClient } from "../../api/client";
import { format, subDays, isSameDay } from "date-fns";

function StatCard({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <Card className="bg-muted/40 border-0">
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground mb-1.5">{label}</p>
        <p className="text-2xl font-medium flex items-center">
          {value}
          {delta && <span className="text-sm font-normal text-muted-foreground ml-2">{delta}</span>}
        </p>
      </CardContent>
    </Card>
  );
}

const ISSUE_COLORS: Record<string, string> = {
  "Order status": "#2a78d6",
  "Stock query": "#eb6834",
  "Return policy": "#1baf7a",
  "Voicemail": "#eda100",
  "Dropped off": "#e87ba4",
  "Escalated": "#008300",
  "Out of scope": "#4a3aa7"
};

const DEFAULT_COLORS = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#4a3aa7"];

export default function Overview() {
  const [isLoading, setIsLoading] = useState(true);

  const [callVolumeData, setCallVolumeData] = useState<any[]>([]);
  const [issueBreakdownData, setIssueBreakdownData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalCalls: "0",
    resolutionRate: "0%",
    escalations: "0",
    avgHandleTime: "0:00"
  });

  const [connectionHealth, setConnectionHealth] = useState<any>(null);
  const [recoveryStats, setRecoveryStats] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [sessionsRes, healthRes, recoveryRes] = await Promise.allSettled([
          apiClient("/sessions"),
          apiClient("/samvaad/connection-health"),
          apiClient("/recovery/stats")
        ]);

        // Handle Connection Health
        if (healthRes.status === "fulfilled") {
          setConnectionHealth(healthRes.value);
        }

        // Handle Recovery Stats
        if (recoveryRes.status === "fulfilled") {
          setRecoveryStats(recoveryRes.value);
        }

        // Handle Sessions
        if (sessionsRes.status === "fulfilled") {
          const sessions = sessionsRes.value.sessions || [];
          
          // 1. StatRow logic (7 days)
          const sevenDaysAgo = subDays(new Date(), 7);
          const recentSessions = sessions.filter((s: any) => 
            s.created_at && new Date(s.created_at) >= sevenDaysAgo
          );

          const totalCalls = recentSessions.length;
          
          const inboundSessions = recentSessions.filter((s: any) => s.call_type !== "outbound");
          const resolvedInbound = inboundSessions.filter((s: any) => 
            s.call_disposition?.toLowerCase().includes("resolved") || s.status === "resolved" || s.status === "completed"
          );
          
          const resolutionRate = inboundSessions.length > 0 
            ? Math.round((resolvedInbound.length / inboundSessions.length) * 100)
            : 0;
            
          const escalations = recentSessions.filter((s: any) => 
            s.call_disposition?.toLowerCase().includes("escalated") || s.status === "escalated"
          ).length;

          let totalDuration = 0;
          let durationCount = 0;
          recentSessions.forEach((s: any) => {
            if (s.metadata?.duration) {
              totalDuration += s.metadata.duration;
              durationCount++;
            }
          });
          const avgSeconds = durationCount > 0 ? Math.round(totalDuration / durationCount) : 0;
          const avgHandleTime = `${Math.floor(avgSeconds / 60)}:${(avgSeconds % 60).toString().padStart(2, '0')}`;

          setStats({
            totalCalls: totalCalls.toString(),
            resolutionRate: `${resolutionRate}%`,
            escalations: escalations.toString(),
            avgHandleTime
          });

          // 2. Call Volume Chart logic (last 7 days)
          const volumeData = [];
          for (let i = 6; i >= 0; i--) {
            const d = subDays(new Date(), i);
            const daySessions = sessions.filter((s: any) => s.created_at && isSameDay(new Date(s.created_at), d));
            const inbound = daySessions.filter((s: any) => s.call_type !== "outbound").length;
            const outbound = daySessions.filter((s: any) => s.call_type === "outbound").length;
            
            volumeData.push({
              day: format(d, "EEE"),
              inbound,
              outbound
            });
          }
          setCallVolumeData(volumeData);

          // 3. Issue Breakdown Chart logic (inbound, 7 days)
          const issues: Record<string, number> = {};
          inboundSessions.forEach((s: any) => {
            let disp = s.call_disposition || "Other";
            disp = disp.replace(/_/g, " ");
            disp = disp.charAt(0).toUpperCase() + disp.slice(1);
            issues[disp] = (issues[disp] || 0) + 1;
          });

          const breakdown = Object.entries(issues)
            .map(([name, value], i) => ({
              name,
              value,
              color: ISSUE_COLORS[name] || DEFAULT_COLORS[i % DEFAULT_COLORS.length]
            }))
            .sort((a, b) => b.value - a.value);
            
          setIssueBreakdownData(breakdown);
        }

      } catch (err) {
        console.error("Failed to load overview data", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const renderConnectionHealth = () => {
    if (isLoading) return <div className="text-sm text-muted-foreground">Loading...</div>;
    
    const tokenStatus = connectionHealth?.shopify_token_status || "expired";
    const badgeVariant = tokenStatus === "valid" ? "active" : tokenStatus === "expiring_soon" ? "secondary" : "destructive";
    
    let lastWebhookText = "Never";
    if (connectionHealth?.shopify_webhook_last_received_at) {
      const date = new Date(connectionHealth.shopify_webhook_last_received_at);
      const diffMins = Math.round((new Date().getTime() - date.getTime()) / 60000);
      if (diffMins < 60) {
        lastWebhookText = `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
      } else {
        const diffHours = Math.round(diffMins / 60);
        if (diffHours < 24) lastWebhookText = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        else {
          const diffDays = Math.round(diffHours / 24);
          lastWebhookText = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        }
      }
    }

    return (
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Shopify token</span>
          <Badge variant={badgeVariant as any} className="capitalize">
            {tokenStatus.replace("_", " ")}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Last webhook</span>
          <span className="text-sm">{lastWebhookText}</span>
        </div>
      </div>
    );
  };

  const renderRecoverySnapshot = () => {
    if (isLoading) return <div className="text-sm text-muted-foreground">Loading...</div>;
    
    const triggered = recoveryStats?.total_triggered || 0;
    const converted = recoveryStats?.converted_count || 0;
    const rate = recoveryStats?.conversion_rate ? Math.round(recoveryStats.conversion_rate) : 0;

    return (
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Calls triggered</span>
          <span className="text-sm font-medium">{triggered}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Converted</span>
          <span className="text-sm font-medium">{converted} ({rate}%)</span>
        </div>
        <a href="/recovery-stats" className="text-xs text-primary block pt-1 hover:underline">
          View recovery stats
        </a>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total calls, 7 days" value={stats.totalCalls} />
        <StatCard label="Support resolution rate" value={stats.resolutionRate} />
        <StatCard label="Escalations" value={stats.escalations} />
        <StatCard label="Avg handle time" value={stats.avgHandleTime} />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Call volume, last 7 days</CardTitle>
          <div className="flex gap-4 text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "#2a78d6" }} />
              Inbound support
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "#eb6834" }} />
              Outbound recovery
            </span>
          </div>
        </CardHeader>
        <CardContent className="h-[160px]">
          {isLoading ? (
             <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={callVolumeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="inbound" stackId="a" fill="#2a78d6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="outbound" stackId="a" fill="#eb6834" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Issue breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
               <div className="h-[140px] w-full flex items-center justify-center text-sm text-muted-foreground">Loading...</div>
            ) : issueBreakdownData.length === 0 ? (
               <div className="h-[140px] w-full flex items-center justify-center text-sm text-muted-foreground">No data for the last 7 days.</div>
            ) : (
              <>
                <div className="h-[140px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={issueBreakdownData} dataKey="value" innerRadius={55} outerRadius={80}>
                        {issueBreakdownData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-2 mt-3 text-xs text-muted-foreground">
                  {issueBreakdownData.map((entry) => (
                    <span key={entry.name} className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-sm" style={{ background: entry.color }} />
                      {entry.name} {entry.value}
                    </span>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Store connection</CardTitle>
            </CardHeader>
            <CardContent>
              {renderConnectionHealth()}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Recovery snapshot</CardTitle>
            </CardHeader>
            <CardContent>
              {renderRecoverySnapshot()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
