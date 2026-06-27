import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Plus, MoreHorizontal, Download, Archive, Trash2, X, Settings2, ChevronDown } from "lucide-react";
import { Sparkline, MiniBars, DottedTrack, TickBar } from "../components/charts";
import { apiClient } from "../../api/client";

type ChartKind = "sparkline" | "minibars" | "dotted" | "tickbar";

interface Metric {
  label: string;
  value: string;
  change: string;
  trending: boolean;
  chartKind: ChartKind;
  chartData: number[];
  chartPct: number;
}

const defaultMetrics: Metric[] = [
  {
    label: "Total calls",
    value: "4,821",
    change: "+12%",
    trending: true,
    chartKind: "sparkline",
    chartData: [32, 38, 45, 40, 55, 60, 52, 64, 58, 70, 66, 74, 80, 78, 85, 82, 90, 88, 95, 98],
    chartPct: 0,
  },
  {
    label: "Active sessions",
    value: "856",
    change: "94%",
    trending: true,
    chartKind: "sparkline",
    chartData: [40, 42, 48, 44, 50, 55, 53, 56, 58, 60, 57, 62, 65, 63, 68, 70, 72, 74, 78, 82],
    chartPct: 0,
  },
  {
    label: "Escalations",
    value: "80",
    change: "6%",
    trending: false,
    chartKind: "minibars",
    chartData: [12, 18, 8, 15, 10, 22, 14, 9],
    chartPct: 0,
  },
  {
    label: "Resolution rate",
    value: "92%",
    change: "Normal",
    trending: false,
    chartKind: "tickbar",
    chartData: [],
    chartPct: 0.92,
  },
  {
    label: "Avg handle time",
    value: "2:44",
    change: "",
    trending: false,
    chartKind: "dotted",
    chartData: [],
    chartPct: 0.45,
  },
];

const callVolumeData = [
  { name: "Mon", calls: 842 },
  { name: "Tue", calls: 1120 },
  { name: "Wed", calls: 1400 },
  { name: "Thu", calls: 940 },
  { name: "Fri", calls: 1280 },
  { name: "Sat", calls: 1150 },
  { name: "Sun", calls: 900 },
];

const avatarColors = [
  "bg-rose-100 text-rose-600",
  "bg-sky-100 text-sky-600",
  "bg-amber-100 text-amber-600",
  "bg-violet-100 text-violet-600",
  "bg-emerald-100 text-emerald-600",
  "bg-pink-100 text-pink-600",
  "bg-cyan-100 text-cyan-600",
  "bg-lime-100 text-lime-600",
];

function getInitials(name: string) {
  const parts = name.split(" ");
  return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
}

const recentCalls = [
  { name: "Priya Sharma", company: "TechVista", issue: "Technical Issue", duration: "3m 12s", status: "resolved", time: "10:32 AM" },
  { name: "Marco Diaz", company: "Apex Logic", issue: "Billing", duration: "1m 48s", status: "escalated", time: "9:18 AM" },
  { name: "Sofia Kim", company: "Echo Media", issue: "Account Access", duration: "2m 05s", status: "resolved", time: "8:45 AM" },
  { name: "Ravi Patel", company: "TerraPulse", issue: "Feature Help", duration: "4m 22s", status: "resolved", time: "6:14 PM" },
  { name: "Laura Chen", company: "BioRoots", issue: "Technical Issue", duration: "0m 55s", status: "active", time: "3:30 PM" },
  { name: "James Wilson", company: "Capital Wave", issue: "Billing", duration: "2m 41s", status: "resolved", time: "2:15 PM" },
  { name: "Nina Okafor", company: "LeafLink", issue: "Account Access", duration: "1m 18s", status: "escalated", time: "1:50 PM" },
  { name: "Arun Mehta", company: "Solaris Edge", issue: "Technical Issue", duration: "3m 55s", status: "resolved", time: "12:40 PM" },
  { name: "Elena Rodriguez", company: "Vaulted", issue: "Feature Help", duration: "2m 30s", status: "active", time: "11:22 AM" },
  { name: "Oliver Baker", company: "NeuralFlow", issue: "Billing", duration: "1m 12s", status: "resolved", time: "10:05 AM" },
];

const issueBreakdown = [
  { label: "Technical", pct: 72, color: "#8b5cf6" },
  { label: "Billing", pct: 51, color: "#3b82f6" },
  { label: "Access", pct: 38, color: "#22c55e" },
  { label: "Other", pct: 15, color: "#f43f5e" },
];

function MetricChart({ metric }: { metric: Metric }) {
  switch (metric.chartKind) {
    case "sparkline":
      return (
        <div className="w-full">
          <Sparkline data={metric.chartData} width={160} height={24} className="w-full" />
        </div>
      );
    case "minibars":
      return <MiniBars data={metric.chartData} width={60} height={24} />;
    case "dotted":
      return (
        <div className="w-full">
          <DottedTrack value={metric.chartPct} width={160} height={18} className="w-full" />
        </div>
      );
    case "tickbar":
      return (
        <div className="w-full">
          <TickBar value={metric.chartPct} segments={32} width={160} height={18} className="w-full" />
        </div>
      );
    default:
      return null;
  }
}

export default function Overview() {
  const [metrics, setMetrics] = useState<Metric[]>(defaultMetrics);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState("default");

  useEffect(() => {
    async function fetchData() {
      try {
        const sessionsRes = await apiClient("/sessions");
        const sessions = sessionsRes.sessions || [];

        if (sessions.length > 0) {
          const callMinutes =
            sessions.reduce(
              (acc: number, s: any) => acc + (s.metadata?.duration || 0),
              0
            ) / 60;
          const resolved = sessions.filter(
            (s: any) => s.status === "resolved" || s.status === "completed"
          ).length;
          const resRate = Math.round((resolved / sessions.length) * 100);

          setMetrics((prev) => [
            { ...prev[0], value: Math.round(callMinutes).toLocaleString() },
            {
              ...prev[1],
              value: sessions
                .filter((s: any) => s.status === "active")
                .length.toString(),
            },
            {
              ...prev[2],
              value: sessions
                .filter((s: any) => s.status === "escalated")
                .length.toString(),
            },
            { ...prev[3], value: `${resRate}%`, chartPct: resRate / 100 },
            prev[4],
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

  const toggleRow = (idx: number) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedRows.size === recentCalls.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(recentCalls.map((_, i) => i)));
    }
  };

  const statusPill = (status: string) => {
    switch (status) {
      case "resolved": return "bg-emerald-50 text-emerald-700";
      case "escalated": return "bg-red-50 text-red-500";
      case "active": return "bg-amber-50 text-amber-600";
      default: return "bg-neutral-100 text-neutral-500";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* ─── Tab row header ─── */}
      <div className="flex items-center justify-between px-8 border-b border-[#f0f0f0] h-[48px] shrink-0">
        <div className="flex items-center gap-0">
          <button
            onClick={() => setActiveTab("default")}
            className={`relative px-4 h-[48px] text-[13px] font-medium transition-colors ${
              activeTab === "default" ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600"
            }`}
          >
            Default
            {activeTab === "default" && (
              <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-neutral-900 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("important")}
            className={`relative px-4 h-[48px] text-[13px] font-normal transition-colors ${
              activeTab === "important" ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600"
            }`}
          >
            Only important
            {activeTab === "important" && (
              <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-neutral-900 rounded-full" />
            )}
          </button>
          <button className="ml-1 w-7 h-7 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-[#f3f3f3] hover:text-neutral-600 transition-colors">
            <Plus className="size-4" strokeWidth={1.8} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-[32px] px-4 bg-neutral-900 text-white text-[13px] font-medium rounded-lg hover:bg-neutral-800 transition-colors">
            New Session
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-[#f3f3f3] hover:text-neutral-600 transition-colors">
            <MoreHorizontal className="size-4" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* ─── Scrollable content ─── */}
      <div className="flex-1 overflow-auto">
        <div className="px-8 py-7 space-y-7">

          {/* ─── Metrics row ─── */}
          <div className="flex items-start border-b border-[#f0f0f0] pb-7">
            {metrics.map((m, i) => (
              <div key={i} className="flex-1 min-w-0 pr-6 last:pr-0">
                {/* Label */}
                <div className="flex items-center gap-1 mb-1.5">
                  <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 400 }}>
                    {m.label}
                  </span>
                  {m.trending && (
                    <span style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1 }}>↗</span>
                  )}
                </div>
                {/* Big value + sub-badge */}
                <div className="flex items-baseline gap-1.5">
                  <span
                    style={{
                      fontSize: 28,
                      fontWeight: 600,
                      color: "#111827",
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}
                  >
                    {m.value}
                  </span>
                  {m.change && (
                    <span style={{ fontSize: 11, fontWeight: 500, color: "#9ca3af" }}>
                      {m.change}
                    </span>
                  )}
                </div>
                {/* Micro-chart */}
                <div className="mt-3 h-[24px]">
                  <MetricChart metric={m} />
                </div>
              </div>
            ))}
          </div>

          {/* ─── Filter / Search / Customize toolbar ─── */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 h-[34px] px-3.5 text-[13px] font-medium text-neutral-600 border border-[#e8e8e8] rounded-[10px] hover:bg-[#fafafa] transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
                <path d="M1.5 3.5h11M3.5 7h7M5.5 10.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Filters
            </button>
            <div className="flex items-center gap-1.5 h-[34px] px-3.5 text-[13px] text-neutral-400 border border-[#e8e8e8] rounded-[10px] flex-1 max-w-xs cursor-text">
              <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Search
            </div>
            <button className="ml-auto flex items-center gap-1.5 h-[34px] px-3.5 text-[13px] font-medium text-neutral-500 border border-[#e8e8e8] rounded-[10px] hover:bg-[#fafafa] transition-colors">
              <Settings2 className="size-3.5" strokeWidth={1.8} />
              Customize
            </button>
          </div>

          {/* ─── Table ─── */}
          <div className="border border-[#ebebeb] rounded-xl overflow-hidden relative">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#f0f0f0]">
                  <th className="w-[44px] py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === recentCalls.length && recentCalls.length > 0}
                      onChange={toggleAll}
                      className="w-[15px] h-[15px] rounded border-neutral-300 text-neutral-900 cursor-pointer accent-neutral-800"
                    />
                  </th>
                  <th className="text-left py-3 px-3 text-[12px] font-medium text-neutral-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      Name
                      <ChevronDown className="size-3 text-neutral-300" strokeWidth={2} />
                    </span>
                  </th>
                  <th className="text-left py-3 px-3 text-[12px] font-medium text-neutral-400 uppercase tracking-wider">Company</th>
                  <th className="text-left py-3 px-3 text-[12px] font-medium text-neutral-400 uppercase tracking-wider">Issue</th>
                  <th className="text-left py-3 px-3 text-[12px] font-medium text-neutral-400 uppercase tracking-wider">Duration</th>
                  <th className="text-left py-3 px-3 text-[12px] font-medium text-neutral-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentCalls.map((call, i) => {
                  const isSelected = selectedRows.has(i);
                  return (
                    <tr
                      key={i}
                      className={`border-b border-[#f5f5f5] last:border-0 transition-colors cursor-pointer ${
                        isSelected ? "bg-[#f7f7f7]" : "hover:bg-[#fafafa]"
                      }`}
                    >
                      <td className="py-[14px] px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(i)}
                          className="w-[15px] h-[15px] rounded border-neutral-300 text-neutral-900 cursor-pointer accent-neutral-800"
                        />
                      </td>
                      <td className="py-[14px] px-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                            {getInitials(call.name)}
                          </div>
                          <span className="text-[13px] font-medium text-neutral-900">{call.name}</span>
                        </div>
                      </td>
                      <td className="py-[14px] px-3 text-[13px] text-neutral-600">{call.company}</td>
                      <td className="py-[14px] px-3 text-[13px] text-neutral-600">{call.issue}</td>
                      <td className="py-[14px] px-3 text-[13px] text-neutral-600">{call.duration}</td>
                      <td className="py-[14px] px-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${statusPill(call.status)}`}>
                          {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* ─── Floating action bar ─── */}
            {selectedRows.size > 0 && (
              <div className="sticky bottom-4 left-1/2 flex items-center justify-center pointer-events-none">
                <div className="pointer-events-auto flex items-center gap-3 bg-white border border-[#e8e8e8] rounded-full px-4 py-2 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
                  <button onClick={() => setSelectedRows(new Set())} className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors">
                    <X className="size-4" strokeWidth={1.8} />
                  </button>
                  <span className="text-[13px] font-medium text-neutral-700 pl-1 pr-2 border-r border-[#ebebeb]">
                    Selected: {selectedRows.size}
                  </span>
                  <button className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors" title="Export">
                    <Download className="size-4" strokeWidth={1.8} />
                  </button>
                  <button className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors" title="Archive">
                    <Archive className="size-4" strokeWidth={1.8} />
                  </button>
                  <button className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:bg-red-50 hover:text-red-500 transition-colors" title="Delete">
                    <Trash2 className="size-4" strokeWidth={1.8} />
                  </button>
                  <button className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors" title="More">
                    <MoreHorizontal className="size-4" strokeWidth={1.8} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ─── Bottom row: Chart + Issue breakdown ─── */}
          <div className="grid grid-cols-3 gap-7">
            <div className="col-span-2 border border-[#ebebeb] rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[14px] font-semibold text-neutral-900">
                  Call volume
                </h3>
                <span className="text-[12px] text-neutral-400">Last 7 days</span>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={callVolumeData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a3a3a3" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#a3a3a3" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#a3a3a3" }}
                      dy={8}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#a3a3a3" }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "10px",
                        border: "1px solid #ebebeb",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="calls"
                      stroke="#525252"
                      strokeWidth={1.5}
                      fillOpacity={1}
                      fill="url(#colorCalls)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="border border-[#ebebeb] rounded-xl p-6">
              <h3 className="text-[14px] font-semibold text-neutral-900 mb-5">
                Issue breakdown
              </h3>
              <div className="space-y-5">
                {issueBreakdown.map((issue, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[13px] text-neutral-600">
                        {issue.label}
                      </span>
                      <span className="text-[13px] font-medium text-neutral-900">
                        {issue.pct}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${issue.pct}%`,
                          backgroundColor: issue.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
