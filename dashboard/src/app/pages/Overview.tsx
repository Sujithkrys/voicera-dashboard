import React, { useState, useEffect } from "react";
import { ChevronDown, PieChart } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { StemChart } from "../components/StemChart";
import { apiClient } from "../../api/client";

const defaultMetrics = [
  {
    label: "Call Minutes",
    value: "4,821",
    subtitle: "12% vs last mo",
    chartType: "line" as const,
    chartData: Array.from({ length: 10 }, () => ({ value: Math.floor(Math.random() * 50) + 10 })),
  },
  {
    label: "Resolutions",
    value: "92%",
    subtitle: "4% optimized",
    chartType: "line" as const,
    chartData: Array.from({ length: 10 }, () => ({ value: Math.floor(Math.random() * 30) + 50 })),
  },
  {
    label: "Active Sessions",
    value: "14",
    subtitle: "11 Voice · 3 Chat",
    chartType: "stem" as const,
    chartData: Array.from({ length: 60 }, () => ({ value: Math.floor(Math.random() * 20) + 5 })),
  },
  {
    label: "Escalations",
    value: "2.4%",
    subtitle: "Within threshold",
    chartType: "stem" as const,
    chartData: Array.from({ length: 60 }, () => ({ value: Math.floor(Math.random() * 10) + 2 })),
  }
];

const callVolumeData = [
  { name: 'MON', calls: 842 },
  { name: 'TUE', calls: 1120 },
  { name: 'WED', calls: 1400 },
  { name: 'THU', calls: 940 },
  { name: 'FRI', calls: 1280 },
  { name: 'SAT', calls: 1150 },
  { name: 'SUN', calls: 900 },
];

const pieData = [
  { name: 'Technical', value: 1787, color: '#8b5cf6' },
  { name: 'Billing', value: 372, color: '#60a5fa' },
  { name: 'Access', value: 198, color: '#4ade80' },
  { name: 'Other', value: 125, color: '#f43f5e' },
];

const issueBars = [
  { label: 'Technical', pct: 72, color: 'bg-violet-500', textColor: 'text-violet-500' },
  { label: 'Billing', pct: 51, color: 'bg-blue-400', textColor: 'text-blue-400' },
  { label: 'Access', pct: 38, color: 'bg-green-400', textColor: 'text-green-400' },
  { label: 'Other', pct: 15, color: 'bg-rose-400', textColor: 'text-rose-400' },
];

export default function Overview() {
  const [metrics, setMetrics] = useState(defaultMetrics);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const sessionsRes = await apiClient('/sessions');
        const sessions = sessionsRes.sessions || [];
        
        if (sessions.length > 0) {
          const callMinutes = sessions.reduce((acc: number, s: any) => acc + (s.metadata?.duration || 0), 0) / 60;
          const resolved = sessions.filter((s: any) => s.status === 'resolved' || s.status === 'completed').length;
          const resRate = Math.round((resolved / sessions.length) * 100);

          setMetrics([
            {
              label: "Call Minutes",
              value: Math.round(callMinutes).toLocaleString(),
              subtitle: "12% vs last mo",
              chartType: "line",
              chartData: defaultMetrics[0].chartData,
            },
            {
              label: "Resolutions",
              value: `${resRate}%`,
              subtitle: "4% optimized",
              chartType: "line",
              chartData: defaultMetrics[1].chartData,
            },
            {
              label: "Active Sessions",
              value: sessions.filter((s: any) => s.status === 'active').length.toString(),
              subtitle: "Live right now",
              chartType: "stem",
              chartData: defaultMetrics[2].chartData,
            },
            {
              label: "Escalations",
              value: `${Math.round((sessions.filter((s: any) => s.status === 'escalated').length / sessions.length) * 100)}%`,
              subtitle: "Within threshold",
              chartType: "stem",
              chartData: defaultMetrics[3].chartData,
            }
          ]);
        }
      } catch (err) {
        console.error("Failed to load overview data", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-manrope font-extrabold tracking-tight text-slate-900">Overview</h1>
          <p className="text-slate-500 font-inter text-sm mt-1 font-medium">Welcome back — here's what's happening with Voicera today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Last 7 days
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <Card key={idx} className="bg-white shadow-sm border-0 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="pt-6 pb-4 px-4">
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {metric.label}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <div className={`text-[32px] font-manrope font-extrabold leading-none tracking-tight text-slate-900 ${metric.label === 'Escalations' && metric.value !== '0%' ? 'text-rose-500' : ''}`}>
                    {metric.value}
                  </div>
                  {metric.subtitle && (
                    <div className="text-xs text-muted-foreground font-medium">
                      {metric.subtitle}
                    </div>
                  )}
                </div>
                <div className="h-10 -mx-4 -mb-4 mt-4">
                  {metric.chartType === "line" ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metric.chartData}>
                        <Line type="monotone" dataKey="value" stroke="#818cf8" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <StemChart data={metric.chartData} color="#c7d2fe" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Call Volume Chart */}
        <Card className="lg:col-span-2 border-0 shadow-sm flex flex-col min-h-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-[16px] font-manrope font-bold text-slate-900">Call Volume</CardTitle>
              <p className="text-xs text-slate-500 font-inter font-medium mt-1">Daily call counts over the past 7 days</p>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0 pb-4">
            <div className="flex gap-8 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Avg Handle Time</div>
                <div className="text-lg font-bold text-emerald-500">2m 44s</div>
              </div>
              <div className="w-px bg-slate-200" />
              <div>
                <div className="text-xs text-muted-foreground mb-1">Resolution</div>
                <div className="text-lg font-bold text-blue-500">92%</div>
              </div>
            </div>
            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={callVolumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    labelStyle={{ fontSize: '10px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}
                  />
                  <Area type="monotone" dataKey="calls" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorCalls)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Issues Panel */}
        <Card className="border-0 shadow-sm flex flex-col min-h-0 bg-slate-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-[16px] font-manrope font-bold text-slate-900">Top Issues</CardTitle>
            <p className="text-xs font-inter font-medium text-slate-500 mt-1">This week's breakdown</p>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="flex items-center justify-center gap-6 py-4 border-b border-slate-200 mb-4">
              <div className="relative w-24 h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={45}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-lg font-extrabold tracking-tight">84%</span>
                  <span className="text-[9px] text-muted-foreground uppercase tracking-widest -mt-1">Auto</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {pieData.slice(0,3).map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-medium text-slate-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 flex-1">
              {issueBars.map((issue, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="text-xs font-medium w-16 text-slate-600">{issue.label}</div>
                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full ${issue.color} rounded-full`} style={{ width: `${issue.pct}%` }} />
                  </div>
                  <div className={`text-xs font-bold w-10 text-right ${issue.textColor}`}>{issue.pct}%</div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-4 border-t border-slate-200 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Primary Driver</span>
                <span className="text-xs font-bold text-indigo-600">API Timeout</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Weekly Trend</span>
                <span className="text-xs font-bold text-emerald-600">+12% Resolved</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
