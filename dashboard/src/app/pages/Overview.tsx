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
  { name: 'Technical', value: 1787, color: '#8a4cfc' },
  { name: 'Billing', value: 372, color: '#7eb8ff' },
  { name: 'Access', value: 198, color: '#c4ffcd' },
];

const issueBars = [
  { label: 'Technical', pct: 72, color: 'bg-[#8a4cfc]', textColor: 'text-[#bd9dff]' },
  { label: 'Billing', pct: 51, color: 'bg-[#7eb8ff]', textColor: 'text-[#7eb8ff]' },
  { label: 'Access', pct: 38, color: 'bg-[#c4ffcd]', textColor: 'text-[#c4ffcd]' },
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
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-5 flex-shrink-0">
        <div>
          <h1 className="font-manrope text-[24px] font-extrabold tracking-[-0.5px] text-on-surface">Overview</h1>
          <p className="font-inter text-[13px] text-on-surface-med mt-1">Welcome back — here's what's happening with Voicera today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-surface-hi text-on-surface-med border-ghost hover:bg-surface-highest hover:text-on-surface transition-colors font-inter rounded-xl px-4 py-2 h-auto text-[13px] font-semibold shadow-none">
            Last 7 days
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-[18px]">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-surface rounded-[1.25rem] p-[18px_22px] transition-colors relative overflow-hidden group hover:bg-surface-hi shadow-[0_0_40px_rgba(6,14,32,0.5)]">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-dim to-primary opacity-0 transition-opacity rounded-t-[1.25rem] group-hover:opacity-100" />
            <div className="font-inter text-[9px] font-bold text-on-surface-low uppercase tracking-[0.9px] mb-2.5">
              {metric.label}
            </div>
            <div className={`font-manrope text-[32px] font-extrabold tracking-[-1px] leading-none mb-1.5 ${metric.label === 'Escalations' && metric.value !== '0%' ? 'text-red' : 'text-on-surface'}`}>
              {metric.value}
            </div>
            {metric.subtitle && (
              <div className={`font-inter text-[12px] ${metric.label === 'Resolutions' ? 'text-tertiary' : 'text-on-surface-med'}`}>
                {metric.subtitle}
              </div>
            )}
            <div className="h-10 -mx-4 -mb-4 mt-2">
              {metric.chartType === "line" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metric.chartData}>
                    <Line type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <StemChart data={metric.chartData} color="var(--color-primary-dim)" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Active Sessions Banner */}
      <div className="bg-surface-hi rounded-[1.5rem] p-[16px_22px] mb-[22px] flex items-center gap-3.5 shadow-[0_0_40px_rgba(6,14,32,0.5)]">
        <div className="w-2.5 h-2.5 shrink-0 relative">
          <div className="w-2.5 h-2.5 rounded-full bg-tertiary absolute top-0 left-0 shadow-[0_0_8px_var(--color-tertiary)]" />
          <div className="absolute w-2.5 h-2.5 top-0 left-0 rounded-full border border-tertiary animate-[pulse-ring_1.6s_ease-out_infinite]" />
        </div>
        <div className="font-manrope text-[24px] font-extrabold text-tertiary mr-1 drop-shadow-[0_0_12px_rgba(196,255,205,0.4)]">
          14
        </div>
        <div className="text-[13px] text-on-surface-med font-inter">Live customer sessions in progress across all channels right now.</div>
        <Button className="ml-auto bg-surface-highest text-primary border border-ghost-med rounded-xl px-4 py-2 h-auto text-[13px] font-semibold hover:bg-surface-bright hover:border-ghost transition-all shadow-none">
          Monitor Live
        </Button>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[18px]">
        {/* Call Volume Chart */}
        <div className="lg:col-span-2 bg-surface rounded-[1.5rem] p-[22px_24px] shadow-[0_0_40px_rgba(6,14,32,0.5)] flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="font-manrope text-[14px] font-bold text-on-surface">Call Volume</div>
              <div className="text-[12px] text-on-surface-med mt-[2px] font-inter">Daily call counts over the past 7 days</div>
            </div>
          </div>
          
          <div className="flex gap-[30px] mb-6 bg-surface-hi p-[12px_20px] rounded-2xl border border-ghost-med">
            <div>
              <div className="text-xs text-on-surface-low mb-[2px] font-inter">Avg Handle Time</div>
              <div className="font-manrope text-[16px] font-extrabold text-tertiary">2m 44s</div>
            </div>
            <div className="w-[1px] bg-ghost-med h-6 self-center" />
            <div>
              <div className="text-xs text-on-surface-low mb-[2px] font-inter">Resolution</div>
              <div className="font-manrope text-[16px] font-extrabold text-blue">92%</div>
            </div>
          </div>

          <div className="flex-1 min-h-[220px] relative mt-2.5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={callVolumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.15}/>
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-on-surface-low)', fontWeight: 600, fontFamily: 'Inter' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-on-surface-low)', fontFamily: 'Inter' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-ghost-med)', background: 'rgba(10,10,15,0.98)', boxShadow: '0 10px 40px rgba(0,0,0,0.6)', backdropFilter: 'blur(15px)' }}
                  labelStyle={{ fontSize: '10px', color: 'var(--color-on-surface-low)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '0.05em' }}
                  itemStyle={{ fontFamily: 'Manrope', fontSize: '14px', fontWeight: 800, color: 'var(--color-on-surface)' }}
                />
                <Area type="monotone" dataKey="calls" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorCalls)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Issues Panel */}
        <div className="bg-surface rounded-[1.5rem] p-[22px_24px] shadow-[0_0_40px_rgba(6,14,32,0.5)] flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="font-manrope text-[14px] font-bold text-on-surface">Top Issues</div>
              <div className="text-[12px] text-on-surface-med mt-[2px] font-inter">This week's breakdown</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center py-2.5 pb-6 mb-3 border-b border-ghost-med flex-shrink-0">
            <div className="relative w-[110px] h-[110px] cursor-pointer">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={55}
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
                <span className="font-manrope text-[22px] font-extrabold tracking-[-1px] text-on-surface">84%</span>
                <span className="font-inter text-[10px] text-on-surface-low">Automated</span>
              </div>
            </div>
            
            <div className="ml-5 space-y-2">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-[2px]" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-on-surface-med font-inter">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-[14px] flex-1 pb-2.5 overflow-y-auto pr-1">
            {issueBars.map((issue, i) => (
              <div key={i} className="flex items-center gap-3 cursor-pointer group hover:opacity-80 transition-opacity">
                <div className="text-[12px] text-on-surface-med w-[100px] shrink-0 font-inter">{issue.label}</div>
                <div className="flex-1 h-1 bg-surface-highest rounded-full overflow-hidden">
                  <div className={`h-full ${issue.color} rounded-full transition-all duration-700 ease-in-out`} style={{ width: `${issue.pct}%` }} />
                </div>
                <div className={`text-[12px] font-bold w-[34px] text-right shrink-0 font-inter ${issue.textColor}`}>{issue.pct}%</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
