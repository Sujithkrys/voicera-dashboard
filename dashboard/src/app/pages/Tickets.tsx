import React, { useState, useEffect } from "react";
import { apiClient } from "../../api/client";
import { Button } from "../components/ui/button";
import { LayoutList, Kanban, ChevronRight } from "lucide-react";

export default function Tickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [activeTab, setActiveTab] = useState<"all" | "open" | "in-progress" | "resolved">("all");

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await apiClient("/sessions");
        const formattedTickets = (res.sessions || []).map((s: any) => ({
          id: s.ticket_id || `TKT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
          title: s.metadata?.title || s.metadata?.issue_type || "Support Request",
          name: s.customer?.name || "Unknown",
          issue: s.metadata?.issue_type || "Technical Issue",
          status: s.status === "active" ? "in-progress" : (s.status === "resolved" || s.status === "completed" ? "resolved" : "open"),
          date: new Date(s.created_at).toLocaleString("en-US", { month: "short", day: "numeric" }),
          duration: s.metadata?.duration ? `${Math.floor(s.metadata.duration / 60)}m ${s.metadata.duration % 60}s call` : "",
        }));
        setTickets(formattedTickets);
      } catch (err) {
        console.error("Failed to load tickets", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTickets();
  }, []);

  const statusStyle = (status: string) => {
    switch (status) {
      case "resolved": return "bg-emerald-50 text-emerald-700";
      case "open": return "bg-red-50 text-red-600";
      case "in-progress": return "bg-amber-50 text-amber-700";
      default: return "bg-secondary text-muted-foreground";
    }
  };

  const counts = {
    all: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    "in-progress": tickets.filter((t) => t.status === "in-progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  };

  const filteredTickets = activeTab === "all" ? tickets : tickets.filter((t) => t.status === activeTab);

  return (
    <div className="p-6 space-y-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[18px] font-semibold text-foreground">Tickets</h1>
        <div className="flex border border-border rounded-md overflow-hidden">
          <button
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}
            onClick={() => setViewMode("list")}
          >
            <LayoutList className="h-3.5 w-3.5" />
            List
          </button>
          <button
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium transition-colors ${viewMode === "kanban" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}
            onClick={() => setViewMode("kanban")}
          >
            <Kanban className="h-3.5 w-3.5" />
            Board
          </button>
        </div>
      </div>

      {viewMode === "list" && (
        <>
          {/* Tabs */}
          <div className="flex gap-1 border-b border-border">
            {(["all", "open", "in-progress", "resolved"] as const).map((tab) => (
              <button
                key={tab}
                className={`px-3 py-2 text-[13px] font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-neutral-900 text-foreground"
                    : "border-transparent text-muted-foreground hover:text-muted-foreground"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "in-progress" ? "In Progress" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className="ml-1.5 text-[11px] text-muted-foreground">{counts[tab]}</span>
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="border border-border rounded-lg overflow-auto flex-1">
            <table className="w-full">
              <thead className="sticky top-0 bg-background">
                <tr className="border-b border-border">
                  <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider w-24">ID</th>
                  <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                  <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Caller</th>
                  <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-[13px] text-muted-foreground">Loading...</td>
                  </tr>
                ) : filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-[13px] text-muted-foreground">No tickets found.</td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b border-neutral-50 last:border-0 hover:bg-muted transition-colors cursor-pointer">
                      <td className="py-2.5 px-4 font-mono text-[12px] text-muted-foreground">{ticket.id}</td>
                      <td className="py-2.5 px-4 text-[13px] font-medium text-foreground">{ticket.title}</td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-medium text-muted-foreground">{ticket.name && ticket.name.length > 0 ? ticket.name[0] : "?"}</div>
                          <span className="text-[13px] text-muted-foreground">{ticket.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-[13px] text-muted-foreground">{ticket.issue}</td>
                      <td className="py-2.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${statusStyle(ticket.status)}`}>
                          {ticket.status.replace("-", " ").replace(/^\w/, (c: string) => c.toUpperCase())}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-[13px] text-muted-foreground">{ticket.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {viewMode === "kanban" && (
        <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
          {(["open", "in-progress", "resolved"] as const).map((colStatus) => {
            const colTickets = tickets.filter((t) => t.status === colStatus);
            const title = colStatus === "open" ? "Open" : colStatus === "in-progress" ? "In Progress" : "Resolved";
            return (
              <div key={colStatus} className="flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-[13px] font-semibold text-foreground">{title}</h3>
                  <span className="text-[12px] text-muted-foreground">{colTickets.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 bg-muted rounded-lg p-2.5">
                  {isLoading ? (
                    <div className="text-center py-10 text-[13px] text-muted-foreground">Loading...</div>
                  ) : colTickets.length === 0 ? (
                    <div className="text-center py-10 text-[13px] text-muted-foreground">No tickets in this column.</div>
                  ) : (
                    colTickets.map((ticket) => (
                      <div key={ticket.id} className="bg-background rounded-md border border-border p-3 hover:border-border transition-colors cursor-pointer">
                        <div className="text-[13px] font-medium text-foreground mb-1.5">{ticket.title}</div>
                        <div className="text-[12px] text-muted-foreground mb-2.5">{ticket.name} · {ticket.issue}</div>
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${statusStyle(ticket.status)}`}>
                            {ticket.issue}
                          </span>
                          <span className="text-[11px] text-muted-foreground">{ticket.date}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
