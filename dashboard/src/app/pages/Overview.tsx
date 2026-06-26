import React, { useState, useEffect } from "react";
import { ChevronDown, Search, Filter, ChevronRight, Activity, Users } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { StemChart } from "../components/StemChart";
import { apiClient } from "../../api/client";

// Mock metrics (used as fallback or for visual structure before API loads)
const defaultMetrics = [
  {
    label: "Call Minutes",
    value: "0",
    subtitle: "0% vs last mo",
    chartType: "line" as const,
    chartData: Array.from({ length: 10 }, () => ({ value: 0 })),
  },
  {
    label: "Resolutions",
    value: "0%",
    subtitle: "0% optimized",
    chartType: "line" as const,
    chartData: Array.from({ length: 10 }, () => ({ value: 0 })),
  },
  {
    label: "Active Sessions",
    value: "0",
    subtitle: "0 Voice · 0 Chat",
    chartType: "stem" as const,
    chartData: Array.from({ length: 60 }, () => ({ value: 0 })),
  },
  {
    label: "Escalations",
    value: "0%",
    subtitle: "Within threshold",
    chartType: "stem" as const,
    chartData: Array.from({ length: 60 }, () => ({ value: 0 })),
  }
];

export default function Overview() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentCalls, setRecentCalls] = useState<any[]>([]);
  const [metrics, setMetrics] = useState(defaultMetrics);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch sessions (calls)
        const sessionsRes = await apiClient('/sessions');
        // We'll format the first 5 sessions for the recent calls table
        const sessions = sessionsRes.sessions || [];
        
        const formattedCalls = sessions.slice(0, 5).map((s: any) => ({
          id: s.id,
          name: s.customer?.name || "Unknown",
          email: s.customer?.email || "-",
          issue: s.metadata?.issue_type || "General Inquiry",
          channel: s.metadata?.channel || "Voice",
          duration: s.metadata?.duration ? `${Math.floor(s.metadata.duration / 60)}m ${s.metadata.duration % 60}s` : "Unknown",
          status: s.status || "completed",
          date: new Date(s.created_at).toLocaleString(),
          ticket: s.ticket_id || "-"
        }));
        setRecentCalls(formattedCalls);

        // Calculate simple metrics from the data
        const callMinutes = sessions.reduce((acc: number, s: any) => acc + (s.metadata?.duration || 0), 0) / 60;
        const resolved = sessions.filter((s: any) => s.status === 'resolved' || s.status === 'completed').length;
        const resRate = sessions.length > 0 ? Math.round((resolved / sessions.length) * 100) : 0;

        setMetrics([
          {
            label: "Call Minutes",
            value: Math.round(callMinutes).toLocaleString(),
            subtitle: "12% vs last mo",
            chartType: "line",
            chartData: Array.from({ length: 10 }, () => ({ value: Math.floor(Math.random() * 50) + 10 })),
          },
          {
            label: "Resolutions",
            value: `${resRate}%`,
            subtitle: "4% optimized",
            chartType: "line",
            chartData: Array.from({ length: 10 }, () => ({ value: Math.floor(Math.random() * 30) + 50 })),
          },
          {
            label: "Active Sessions",
            value: sessions.filter((s: any) => s.status === 'active').length.toString(),
            subtitle: "Live right now",
            chartType: "stem",
            chartData: Array.from({ length: 60 }, () => ({ value: Math.floor(Math.random() * 20) + 5 })),
          },
          {
            label: "Escalations",
            value: sessions.length > 0 ? `${Math.round((sessions.filter((s: any) => s.status === 'escalated').length / sessions.length) * 100)}%` : "0%",
            subtitle: "Within threshold",
            chartType: "stem",
            chartData: Array.from({ length: 60 }, () => ({ value: Math.floor(Math.random() * 10) + 2 })),
          }
        ]);
      } catch (err) {
        console.error("Failed to load overview data", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedRows((prev) =>
      prev.length === recentCalls.length ? [] : recentCalls.map((c) => c.id)
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">Welcome back — here's what's happening with Voicera today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Last 7 days
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <Card key={idx} className="bg-white shadow-sm border-0">
            <CardContent className="pt-6 pb-4 px-4">
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  <p className="text-xs text-[#6b7280] font-normal">
                    {metric.label}
                  </p>
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-[28px] font-semibold leading-none">
                    {metric.value}
                  </div>
                  {metric.subtitle && (
                    <div className="text-xs text-[#9ca3af] font-normal">
                      {metric.subtitle}
                    </div>
                  )}
                </div>
                <div className="h-12 -mx-4 -mb-4 mt-3">
                  {metric.chartType === "line" ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metric.chartData}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#818cf8"
                          strokeWidth={2}
                          dot={false}
                        />
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

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 mt-8">
        <h2 className="text-lg font-semibold mr-auto">Recent Calls</h2>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search calls..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="size-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedRows.length === recentCalls.length && recentCalls.length > 0}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider">Caller</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider">Issue</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider">Channel</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider">Duration</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider">Date</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Loading recent calls...
                </TableCell>
              </TableRow>
            ) : recentCalls.length === 0 ? (
               <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No recent calls found.
                </TableCell>
              </TableRow>
            ) : recentCalls.map((call) => (
              <TableRow key={call.id} className="cursor-pointer hover:bg-slate-50">
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(call.id)}
                    onCheckedChange={() => toggleRow(call.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
                      {call.name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{call.name}</div>
                      <div className="text-xs text-muted-foreground">{call.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-slate-50 font-normal">
                    {call.issue}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {call.channel}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {call.duration}
                </TableCell>
                <TableCell>
                  <Badge variant={call.status === 'resolved' || call.status === 'completed' ? 'default' : call.status === 'escalated' ? 'destructive' : 'secondary'} 
                         className={(call.status === 'resolved' || call.status === 'completed') ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
                    {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {call.date}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700">
                    <ChevronRight className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
