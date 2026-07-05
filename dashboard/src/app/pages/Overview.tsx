import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "../components/ui/button";
import { Sparkline, MiniBars, DottedTrack, TickBar } from "../components/charts";
import { apiClient } from "../../api/client";
import { format, subDays, isSameDay } from "date-fns";

type ChartKind = "sparkline" | "minibars" | "dotted" | "tickbar";

interface Metric {
  label: string;
  value: string;
  change: string;
  /** Show a trend arrow (↗) next to the label — only for cumulative metrics */
  trending: boolean;
  chartKind: ChartKind;
  /** Numeric data for sparkline / minibars charts */
  chartData: number[];
  /** 0-1 fraction for dotted track / tick bar charts */
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
    change: "+14%",
    trending: true,
    chartKind: "sparkline",
    chartData: [40, 42, 48, 44, 50, 55, 53, 56, 58, 60, 57, 62, 65, 63, 68, 70, 72, 74, 78, 82],
    chartPct: 0,
  },
  {
    label: "Escalations",
    value: "80",
    change: "-8%",
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



function MetricChart({ metric }: { metric: Metric }) {
  switch (metric.chartKind) {
    case "sparkline":
      return (
        <div className="w-full" style={{ maxWidth: 140 }}>
          <Sparkline data={metric.chartData} width={140} height={24} className="w-full" />
        </div>
      );
    case "minibars":
      return (
        <div className="w-full" style={{ maxWidth: 140 }}>
          <MiniBars data={metric.chartData} width={140} height={24} className="w-full" />
        </div>
      );
    case "dotted":
      return (
        <div className="w-full" style={{ maxWidth: 140 }}>
          <DottedTrack value={metric.chartPct} width={140} height={18} className="w-full" />
        </div>
      );
    case "tickbar":
      return (
        <div className="w-full" style={{ maxWidth: 140 }}>
          <TickBar value={metric.chartPct} segments={32} width={140} height={18} className="w-full" />
        </div>
      );
    default:
      return null;
  }
}

export default function Overview() {
  const [metrics, setMetrics] = useState<Metric[]>(defaultMetrics);
  const [callVolumeData, setCallVolumeData] = useState<{name: string, calls: number}[]>([]);
  const [issueBreakdown, setIssueBreakdown] = useState<{label: string, pct: number, color: string}[]>([]);
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
            { ...prev[3], value: `${resRate}%`, chartPct: resRate / 100 },
            prev[4],
          ]);

          // Compute call volume
          const volumeData = [];
          for (let i = 6; i >= 0; i--) {
            const d = subDays(new Date(), i);
            const count = sessions.filter((s: any) => s.created_at && isSameDay(new Date(s.created_at), d)).length;
            volumeData.push({ name: format(d, "EEE"), calls: count });
          }
          setCallVolumeData(volumeData);

          // Compute issue breakdown
          const issues: Record<string, number> = {};
          let total = 0;
          sessions.forEach((s: any) => {
            const issueType = s.metadata?.issue || "Other";
            issues[issueType] = (issues[issueType] || 0) + 1;
            total++;
          });
          
          if (total > 0) {
            const breakdown = Object.entries(issues).map(([label, count]) => ({
              label: label.length > 15 ? label.substring(0, 15) + '...' : label,
              pct: Math.round((count / total) * 100),
              color: "#4B96FF"
            })).sort((a, b) => b.pct - a.pct).slice(0, 4);
            setIssueBreakdown(breakdown);
          } else {
            setIssueBreakdown([]);
          }
        } else {
          // Empty state for new users
          const emptyVolume = [];
          for (let i = 6; i >= 0; i--) {
            emptyVolume.push({ name: format(subDays(new Date(), i), "EEE"), calls: 0 });
          }
          setCallVolumeData(emptyVolume);
          setIssueBreakdown([]);
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
      <div
        className="border-b border-border pb-6"
        style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0 }}
      >
        {metrics.map((m, i) => (
          <div key={i} className="min-w-0">
            {/* Label + optional trend arrow */}
            <div className="flex items-center gap-1 mb-1">
              <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>
                {m.label}
              </span>
              {m.trending && (
                <span style={{ fontSize: 11, color: "#6b7280", lineHeight: 1 }}>↗</span>
              )}
            </div>
            {/* Big value + neutral sub-badge */}
            <div className="flex items-baseline gap-1.5">
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 600,
                  color: "#111827",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {m.value}
              </span>
              {m.change && (
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#9ca3af",
                  }}
                >
                  {m.change}
                </span>
              )}
            </div>
            {/* Micro-chart */}
            <div className="mt-2.5" style={{ height: 26 }}>
              <MetricChart metric={m} />
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Issue breakdown */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-foreground">
              Call volume
            </h3>
            <span className="text-[12px] text-muted-foreground">Last 7 days</span>
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

        <div className="border border-border rounded-lg p-5">
          <h3 className="text-[14px] font-semibold text-foreground mb-4">
            Issue breakdown
          </h3>
          <div className="space-y-4">
            {issueBreakdown.map((issue, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[13px] text-muted-foreground">
                    {issue.label}
                  </span>
                  <span className="text-[13px] font-medium text-foreground">
                    {issue.pct}%
                  </span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
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
