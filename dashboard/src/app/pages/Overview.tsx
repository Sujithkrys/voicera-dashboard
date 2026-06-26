import React, { useState, useEffect } from "react";
import { ChevronDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";
import { Button } from "../components/ui/button";
import { StemChart } from "../components/StemChart";
import { apiClient } from "../../api/client";

const defaultMetrics = [
  {
    label: "Total calls",
    value: "4,821",
    change: "+12%",
    up: true,
    chartData: Array.from({ length: 20 }, (_, i) => ({
      value: Math.floor(Math.random() * 30) + 30 + i * 2,
    })),
  },
  {
    label: "Active sessions",
    value: "856",
    change: "+14%",
    up: true,
    chartData: Array.from({ length: 20 }, (_, i) => ({
      value: Math.floor(Math.random() * 20) + 40 + i,
    })),
  },
  {
    label: "Escalations",
    value: "80",
    change: "-8%",
    up: false,
    chartData: Array.from({ length: 20 }, (_, i) => ({
      value: Math.floor(Math.random() * 15) + 10,
    })),
  },
  {
    label: "Resolution rate",
    value: "92%",
    change: "Normal",
    up: true,
    chartData: [],
  },
  {
    label: "Avg handle time",
    value: "2:44",
    change: "",
    up: true,
    chartData: [],
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

const recentCalls = [
  { name: "Priya Sharma", issue: "Technical Issue", duration: "3m 12s", status: "resolved", time: "10:32 AM" },
  { name: "Marco Diaz", issue: "Billing", duration: "1m 48s", status: "escalated", time: "9:18 AM" },
  { name: "Sofia Kim", issue: "Account Access", duration: "2m 05s", status: "resolved", time: "8:45 AM" },
  { name: "Ravi Patel", issue: "Feature Help", duration: "4m 22s", status: "resolved", time: "6:14 PM" },
  { name: "Laura Chen", issue: "Technical Issue", duration: "0m 55s", status: "active", time: "3:30 PM" },
];

const issueBreakdown = [
  { label: "Technical", pct: 72, color: "#8b5cf6" },
  { label: "Billing", pct: 51, color: "#3b82f6" },
  { label: "Access", pct: 38, color: "#22c55e" },
  { label: "Other", pct: 15, color: "#f43f5e" },
];

export default function Overview() {
  const [metrics, setMetrics] = useState(defaultMetrics);
  const [isLoading, setIsLoading] = useState(true);

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
            { ...prev[3], value: `${resRate}%` },
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

  return (
    <div className="p-6 space-y-6">
      {/* Metrics row */}
      <div className="flex items-end gap-8 border-b border-neutral-100 pb-6">
        {metrics.map((m, i) => (
          <div key={i} className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[12px] text-neutral-500 font-medium">
                {m.label}
              </span>
              {m.chartData.length > 0 && (
                <svg className="w-3 h-3 text-neutral-400" viewBox="0 0 12 12" fill="none">
                  <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-semibold text-neutral-900 tracking-tight leading-none">
                {m.value}
              </span>
              {m.change && (
                <span
                  className={`text-[12px] font-medium ${
                    m.change.startsWith("+")
                      ? "text-emerald-600"
                      : m.change.startsWith("-")
                      ? "text-emerald-600"
                      : "text-neutral-400"
                  }`}
                >
                  {m.change}
                </span>
              )}
            </div>
            {m.chartData.length > 0 && (
              <div className="h-8 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={m.chartData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#a3a3a3"
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Filter and Search bar */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-neutral-600 border border-neutral-200 rounded-md hover:bg-neutral-50 transition-colors">
          <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
            <path d="M1.5 3.5h11M3.5 7h7M5.5 10.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          Filters
        </button>
        <div className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] text-neutral-400 border border-neutral-200 rounded-md flex-1 max-w-xs">
          <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          Search
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-[13px] text-neutral-500">
          <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
            <path d="M2 4h10M2 7h10M2 10h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          Customize
        </div>
      </div>

      {/* Recent calls table */}
      <div className="border border-neutral-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-neutral-400 uppercase tracking-wider">
                Caller
              </th>
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-neutral-400 uppercase tracking-wider">
                Issue
              </th>
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-neutral-400 uppercase tracking-wider">
                Duration
              </th>
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-neutral-400 uppercase tracking-wider">
                Time
              </th>
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-neutral-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {recentCalls.map((call, i) => (
              <tr
                key={i}
                className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-[11px] font-medium text-neutral-600">
                      {call.name[0]}
                    </div>
                    <span className="text-[13px] font-medium text-neutral-900">
                      {call.name}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-4 text-[13px] text-neutral-600">
                  {call.issue}
                </td>
                <td className="py-2.5 px-4 text-[13px] text-neutral-600">
                  {call.duration}
                </td>
                <td className="py-2.5 px-4 text-[13px] text-neutral-500">
                  {call.time}
                </td>
                <td className="py-2.5 px-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                      call.status === "resolved"
                        ? "bg-emerald-50 text-emerald-700"
                        : call.status === "escalated"
                        ? "bg-red-50 text-red-600"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom row: Chart + Issue breakdown */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 border border-neutral-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
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
                    borderRadius: "6px",
                    border: "1px solid #e5e5e5",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
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

        <div className="border border-neutral-200 rounded-lg p-5">
          <h3 className="text-[14px] font-semibold text-neutral-900 mb-4">
            Issue breakdown
          </h3>
          <div className="space-y-4">
            {issueBreakdown.map((issue, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1.5">
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
  );
}
