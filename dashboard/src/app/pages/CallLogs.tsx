import React, { useState, useEffect } from "react";
import { apiClient } from "../../api/client";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Search,
  Download,
  Play,
  X,
  Phone,
  MessageSquare,
  ChevronDown,
} from "lucide-react";

export default function CallLogs() {
  const [calls, setCalls] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCall, setSelectedCall] = useState<any | null>(null);

  useEffect(() => {
    async function fetchCalls() {
      try {
        const res = await apiClient("/sessions");
        const formattedCalls = (res.sessions || []).map((s: any) => ({
          id: s.id,
          name: s.customer?.name || "Unknown",
          email: s.customer?.email || "-",
          issue: s.metadata?.issue_type || "Technical Issue",
          channel: s.metadata?.channel || "Voice",
          duration: s.metadata?.duration
            ? `${Math.floor(s.metadata.duration / 60)}m ${s.metadata.duration % 60}s`
            : "3m 12s",
          status: s.status || "resolved",
          date: new Date(s.created_at).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          }),
          ticket:
            s.ticket_id ||
            `TKT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        }));
        setCalls(
          formattedCalls.length > 0
            ? formattedCalls
            : [
                { id: "1", name: "Priya Sharma", email: "priya@example.com", issue: "Technical Issue", channel: "Voice", duration: "3m 12s", status: "resolved", date: "Apr 21, 10:32 AM", ticket: "TKT-A8F2X" },
                { id: "2", name: "Marco Diaz", email: "marco@example.com", issue: "Billing", channel: "Chat", duration: "1m 48s", status: "escalated", date: "Apr 21, 9:18 AM", ticket: "TKT-B3K9P" },
                { id: "3", name: "Sofia Kim", email: "sofia@example.com", issue: "Account Access", channel: "Voice", duration: "2m 05s", status: "resolved", date: "Apr 21, 8:45 AM", ticket: "TKT-C7M1L" },
                { id: "4", name: "Ravi Patel", email: "ravi@example.com", issue: "Feature Help", channel: "Voice", duration: "4m 22s", status: "resolved", date: "Apr 20, 6:14 PM", ticket: "TKT-D4Q8R" },
                { id: "5", name: "Laura Chen", email: "laura@example.com", issue: "Technical Issue", channel: "Voice", duration: "0m 55s", status: "active", date: "Apr 20, 3:30 PM", ticket: "TKT-E2N5T" },
              ]
        );
      } catch (err) {
        console.error("Failed to load calls", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCalls();
  }, []);

  const statusStyle = (status: string) => {
    switch (status) {
      case "resolved": return "bg-emerald-50 text-emerald-700";
      case "escalated": return "bg-red-50 text-red-600";
      case "active": return "bg-amber-50 text-amber-700";
      default: return "bg-neutral-100 text-neutral-600";
    }
  };

  return (
    <div className="p-6 space-y-5 h-full flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[18px] font-semibold text-neutral-900">
          Call Logs
        </h1>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-[13px] font-medium border-neutral-200 text-neutral-600 rounded-md"
        >
          <Download className="mr-1.5 h-3.5 w-3.5" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
          <Input
            placeholder="Search..."
            className="pl-8 h-8 text-[13px] border-neutral-200 rounded-md bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="h-8 px-3 text-[13px] font-medium text-neutral-600 border border-neutral-200 rounded-md hover:bg-neutral-50 flex items-center gap-1.5">
          Channel <ChevronDown className="h-3 w-3" />
        </button>
        <button className="h-8 px-3 text-[13px] font-medium text-neutral-600 border border-neutral-200 rounded-md hover:bg-neutral-50 flex items-center gap-1.5">
          Status <ChevronDown className="h-3 w-3" />
        </button>
        <button className="h-8 px-3 text-[13px] font-medium text-neutral-600 border border-neutral-200 rounded-md hover:bg-neutral-50 flex items-center gap-1.5 ml-auto">
          Last 7 days <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      {/* Table */}
      <div className="border border-neutral-200 rounded-lg overflow-auto flex-1">
        <table className="w-full">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="border-b border-neutral-100">
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-neutral-400 uppercase tracking-wider">Caller</th>
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-neutral-400 uppercase tracking-wider">Issue</th>
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-neutral-400 uppercase tracking-wider">Channel</th>
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-neutral-400 uppercase tracking-wider">Duration</th>
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-neutral-400 uppercase tracking-wider">Status</th>
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-neutral-400 uppercase tracking-wider">Ticket</th>
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-neutral-400 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-[13px] text-neutral-400">Loading...</td>
              </tr>
            ) : (
              calls.map((call) => (
                <tr
                  key={call.id}
                  className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors cursor-pointer group"
                  onClick={() => setSelectedCall(call)}
                >
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-[11px] font-medium text-neutral-600">
                        {call.name[0]}
                      </div>
                      <div>
                        <div className="text-[13px] font-medium text-neutral-900">{call.name}</div>
                        <div className="text-[11px] text-neutral-400">{call.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-[13px] text-neutral-600">{call.issue}</td>
                  <td className="py-2.5 px-4">
                    <span className="text-[13px] text-neutral-600 flex items-center gap-1">
                      {call.channel === "Voice" ? <Phone className="h-3 w-3 text-neutral-400" /> : <MessageSquare className="h-3 w-3 text-neutral-400" />}
                      {call.channel}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-[13px] text-neutral-600">{call.duration}</td>
                  <td className="py-2.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${statusStyle(call.status)}`}>
                      {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="font-mono text-[12px] text-neutral-500">{call.ticket}</span>
                  </td>
                  <td className="py-2.5 px-4 text-[13px] text-neutral-500">{call.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Slide-out Detail Panel */}
      <div className={`absolute top-0 right-0 bottom-0 w-[420px] bg-white border-l border-neutral-200 transition-transform duration-200 z-50 flex flex-col ${selectedCall ? "translate-x-0" : "translate-x-full"}`}>
        {selectedCall && (
          <>
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-[13px] font-medium text-neutral-700">
                  {selectedCall.name[0]}
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-neutral-900">{selectedCall.name}</h3>
                  <p className="text-[12px] text-neutral-500">{selectedCall.email}</p>
                </div>
              </div>
              <button className="p-1 rounded hover:bg-neutral-100 text-neutral-400" onClick={() => setSelectedCall(null)}>
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: "Issue", value: selectedCall.issue },
                  { label: "Duration", value: selectedCall.duration },
                  { label: "Ticket", value: selectedCall.ticket },
                  { label: "Status", value: selectedCall.status },
                ].map((item, i) => (
                  <div key={i} className="border border-neutral-100 rounded-md p-3">
                    <div className="text-[11px] text-neutral-400 uppercase tracking-wider mb-1">{item.label}</div>
                    <div className="text-[13px] font-medium text-neutral-900 capitalize">{item.value}</div>
                  </div>
                ))}
              </div>

              <h4 className="text-[13px] font-semibold text-neutral-900 mb-3">Transcript</h4>
              <div className="space-y-3">
                <div>
                  <div className="text-[11px] text-neutral-400 mb-1">Agent</div>
                  <div className="bg-neutral-50 text-[13px] text-neutral-700 p-3 rounded-md leading-relaxed">
                    Hi! Thank you for calling Voicera support. How can I help you today?
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-neutral-400 mb-1 text-right">User</div>
                  <div className="bg-neutral-900 text-white text-[13px] p-3 rounded-md leading-relaxed ml-6">
                    Hi, I'm having trouble logging into my dashboard. It keeps saying invalid credentials.
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-neutral-400 mb-1">Agent</div>
                  <div className="bg-neutral-50 text-[13px] text-neutral-700 p-3 rounded-md leading-relaxed">
                    I can certainly help with that. Let me pull up your account. Try logging in using an incognito window.
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-neutral-400 mb-1 text-right">User</div>
                  <div className="bg-neutral-900 text-white text-[13px] p-3 rounded-md leading-relaxed ml-6">
                    That works perfectly. Thank you!
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-neutral-100 flex gap-2">
              <Button className="flex-1 bg-neutral-900 text-white hover:bg-neutral-800 h-8 text-[13px] font-medium rounded-md">
                View Session
              </Button>
              <Button variant="outline" className="flex-1 h-8 text-[13px] font-medium border-neutral-200 text-neutral-700 rounded-md">
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
