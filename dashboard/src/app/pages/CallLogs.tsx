import React, { useState, useEffect } from "react";
import { apiClient } from "../../api/client";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Search,
  Download,
  X,
  Phone,
  PhoneOutgoing,
  PhoneIncoming,
  ChevronDown,
  Sparkles,
} from "lucide-react";

export default function CallLogs() {
  const [calls, setCalls] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedCall, setSelectedCall] = useState<any | null>(null);

  useEffect(() => {
    async function fetchCalls() {
      try {
        const res = await apiClient("/sessions");
        const formattedCalls = (res.sessions || []).map((s: any) => ({
          id: s.id,
          name: s.customer?.name || "Unknown",
          email: s.customer?.email || "-",
          issue: s.metadata?.issue_type || "General Inquiry",
          call_type: s.call_type || "inbound",
          call_disposition: s.call_disposition || "resolved",
          converted: !!s.converted,
          duration: s.metadata?.duration != null
            ? `${Math.floor(s.metadata.duration / 60)}m ${s.metadata.duration % 60}s`
            : "—",
          status: s.status || "completed",
          raw_date: s.created_at,
          summary: s.summary || s.metadata?.summary,
          date: new Date(s.created_at).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          }),
          ticket: s.ticket_id || null,
        }));
        setCalls(formattedCalls);
      } catch (err) {
        console.error("Failed to load calls", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCalls();
  }, []);

  const statusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "resolved": 
      case "completed": return "bg-emerald-50 text-emerald-700";
      case "escalated": 
      case "failed": return "bg-red-50 text-red-600";
      case "dropped": return "bg-amber-50 text-amber-700";
      case "active": return "bg-amber-50 text-amber-700";
      default: return "bg-secondary text-muted-foreground";
    }
  };

  const dispositionBadge = (disp: string) => {
    const d = disp?.toLowerCase() || '';
    if (d.includes('resolved') || d.includes('answered')) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (d.includes('escalated')) return "bg-red-50 text-red-700 border-red-200";
    if (d.includes('dropped') || d.includes('voicemail')) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-secondary text-muted-foreground border-border";
  };

  const filteredCalls = calls.filter((call) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const nameMatch = call.name?.toLowerCase().includes(q);
      const emailMatch = call.email?.toLowerCase().includes(q);
      const dispMatch = call.call_disposition?.toLowerCase().includes(q);
      if (!nameMatch && !emailMatch && !dispMatch) return false;
    }
    if (typeFilter !== "all" && call.call_type?.toLowerCase() !== typeFilter) return false;
    if (statusFilter !== "all" && call.status?.toLowerCase() !== statusFilter) return false;
    if (dateFilter === "7days" && call.raw_date) {
      const callDate = new Date(call.raw_date);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      if (callDate < sevenDaysAgo) return false;
    }
    return true;
  });

  return (
    <div className="p-6 space-y-5 h-full flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[18px] font-semibold text-foreground">
          Call Logs
        </h1>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-[13px] font-medium border-border text-muted-foreground rounded-md"
        >
          <Download className="mr-1.5 h-3.5 w-3.5" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-8 h-8 text-[13px] border-border rounded-md bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative">
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="appearance-none h-8 pl-3 pr-8 text-[13px] font-medium text-muted-foreground border border-border rounded-md hover:bg-muted bg-transparent outline-none focus:ring-1 focus:ring-border cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="inbound">Inbound</option>
            <option value="outbound">Outbound</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        </div>
        <div className="relative">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none h-8 pl-3 pr-8 text-[13px] font-medium text-muted-foreground border border-border rounded-md hover:bg-muted bg-transparent outline-none focus:ring-1 focus:ring-border cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="resolved">Resolved</option>
            <option value="dropped">Dropped</option>
            <option value="escalated">Escalated</option>
            <option value="failed">Failed</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        </div>
        <div className="relative ml-auto">
          <select 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="appearance-none h-8 pl-3 pr-8 text-[13px] font-medium text-muted-foreground border border-border rounded-md hover:bg-muted bg-transparent outline-none focus:ring-1 focus:ring-border cursor-pointer"
          >
            <option value="all">All Time</option>
            <option value="7days">Last 7 days</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-auto flex-1">
        <table className="w-full">
          <thead className="sticky top-0 bg-background z-10">
            <tr className="border-b border-border">
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Caller</th>
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Type</th>
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Disposition</th>
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Duration</th>
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-[13px] text-muted-foreground">Loading...</td>
              </tr>
            ) : filteredCalls.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-[13px] text-muted-foreground">No call logs found.</td>
              </tr>
            ) : (
              filteredCalls.map((call) => (
                <tr
                  key={call.id}
                  className="border-b border-neutral-50 last:border-0 hover:bg-muted transition-colors cursor-pointer group"
                  onClick={() => setSelectedCall(call)}
                >
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-[11px] font-medium text-muted-foreground">
                        {call.name && call.name.length > 0 ? call.name[0] : "?"}
                      </div>
                      <div>
                        <div className="text-[13px] font-medium text-foreground">{call.name}</div>
                        <div className="text-[11px] text-muted-foreground">{call.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="text-[13px] text-muted-foreground flex items-center gap-1.5 capitalize">
                      {call.call_type === "outbound" ? (
                        <PhoneOutgoing className="h-3.5 w-3.5 text-blue-500" />
                      ) : (
                        <PhoneIncoming className="h-3.5 w-3.5 text-emerald-500" />
                      )}
                      {call.call_type}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[11px] font-medium capitalize ${dispositionBadge(call.call_disposition)}`}>
                        {call.call_disposition?.replace(/_/g, ' ')}
                      </span>
                      {call.call_type === 'outbound' && call.converted && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                          <Sparkles className="h-2.5 w-2.5" /> Converted
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-[13px] text-muted-foreground">{call.duration}</td>
                  <td className="py-2.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium capitalize ${statusStyle(call.status)}`}>
                      {call.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-[13px] text-muted-foreground">{call.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Slide-out Detail Panel */}
      <div className={`absolute top-0 right-0 bottom-0 w-[420px] bg-background border-l border-border transition-transform duration-200 z-50 flex flex-col ${selectedCall ? "translate-x-0" : "translate-x-full"}`}>
        {selectedCall && (
          <>
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-[13px] font-medium text-foreground">
                  {selectedCall.name[0]}
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-foreground flex items-center gap-2">
                    {selectedCall.name}
                    {selectedCall.call_type === 'outbound' && selectedCall.converted && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                        <Sparkles className="h-2.5 w-2.5" /> Converted
                      </span>
                    )}
                  </h3>
                  <p className="text-[12px] text-muted-foreground">{selectedCall.email}</p>
                </div>
              </div>
              <button className="p-1 rounded hover:bg-secondary text-muted-foreground" onClick={() => setSelectedCall(null)}>
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: "Type", value: selectedCall.call_type },
                  { label: "Disposition", value: selectedCall.call_disposition?.replace(/_/g, ' ') },
                  { label: "Duration", value: selectedCall.duration },
                ].map((item, i) => (
                  <div key={i} className="border border-border rounded-md p-3">
                    <div className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">{item.label}</div>
                    <div className="text-[13px] font-medium text-foreground capitalize">{item.value}</div>
                  </div>
                ))}
                
                {selectedCall.ticket && (
                  <div className="border border-border rounded-md p-3">
                    <div className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Ticket</div>
                    <div className="text-[13px] font-medium text-foreground capitalize">{selectedCall.ticket}</div>
                  </div>
                )}
              </div>

              <h4 className="text-[13px] font-semibold text-foreground mb-3">Call Summary</h4>
              <div className="space-y-3">
                <div className="bg-muted text-[13px] text-foreground p-3 rounded-md leading-relaxed">
                  {selectedCall.summary || "No summary captured for this call."}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border flex gap-2">
              <Button disabled className="flex-1 bg-primary text-primary-foreground hover:bg-primary h-8 text-[13px] font-medium rounded-md opacity-50 cursor-not-allowed">
                View Audio
              </Button>
              <Button disabled variant="outline" className="flex-1 h-8 text-[13px] font-medium border-border text-foreground rounded-md opacity-50 cursor-not-allowed">
                View Ticket
              </Button>
            </div>
          </>
        )}
      </div>

      {selectedCall && (
        <div className="absolute inset-0 bg-black/5 z-40" onClick={() => setSelectedCall(null)} />
      )}
    </div>
  );
}
