import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { apiClient } from '../../api/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Download, Play, ChevronRight, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

export default function CallLogs() {
  const [calls, setCalls] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCall, setSelectedCall] = useState<any | null>(null);

  useEffect(() => {
    async function fetchCalls() {
      try {
        const res = await apiClient('/sessions');
        const formattedCalls = (res.sessions || []).map((s: any) => ({
          id: s.id,
          name: s.customer?.name || "Unknown",
          email: s.customer?.email || "-",
          issue: s.metadata?.issue_type || "Technical Issue",
          channel: s.metadata?.channel || "Voice",
          duration: s.metadata?.duration ? `${Math.floor(s.metadata.duration / 60)}m ${s.metadata.duration % 60}s` : "3m 12s",
          status: s.status || "resolved",
          date: new Date(s.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }),
          ticket: s.ticket_id || `TKT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
        }));
        setCalls(formattedCalls.length > 0 ? formattedCalls : [
          { id: '1', name: 'Priya Sharma', email: 'priya@example.com', issue: 'Technical Issue', channel: 'Voice', duration: '3m 12s', status: 'resolved', date: 'Apr 21, 10:32 AM', ticket: 'TKT-A8F2X' },
          { id: '2', name: 'Marco Diaz', email: 'marco@example.com', issue: 'Billing', channel: 'Chat', duration: '1m 48s', status: 'escalated', date: 'Apr 21, 9:18 AM', ticket: 'TKT-B3K9P' },
          { id: '3', name: 'Sofia Kim', email: 'sofia@example.com', issue: 'Account Access', channel: 'Voice', duration: '2m 05s', status: 'resolved', date: 'Apr 21, 8:45 AM', ticket: 'TKT-C7M1L' },
          { id: '4', name: 'Ravi Patel', email: 'ravi@example.com', issue: 'Feature Help', channel: 'Voice', duration: '4m 22s', status: 'resolved', date: 'Apr 20, 6:14 PM', ticket: 'TKT-D4Q8R' },
          { id: '5', name: 'Laura Chen', email: 'laura@example.com', issue: 'Technical Issue', channel: 'Voice', duration: '0m 55s', status: 'active', date: 'Apr 20, 3:30 PM', ticket: 'TKT-E2N5T' },
        ]);
      } catch (err) {
        console.error("Failed to load calls", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCalls();
  }, []);

  const getIssueBadge = (issue: string) => {
    switch(issue) {
      case 'Technical Issue': return 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200';
      case 'Billing': return 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200';
      case 'Account Access': return 'bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'resolved': return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200';
      case 'escalated': return 'bg-rose-100 text-rose-700 hover:bg-rose-100 border-rose-200';
      case 'active': return 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="p-6 space-y-6 h-full flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Call Logs</h1>
          <p className="text-muted-foreground text-sm mt-1">All customer conversations — click any row to view transcript</p>
        </div>
        <Button variant="outline" size="sm" className="bg-white">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex-shrink-0">
        <div className="relative flex-1 min-w-[200px] max-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9 h-9 bg-slate-50 border-transparent focus-visible:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[140px] h-9 bg-slate-50 border-transparent font-medium">
            <SelectValue placeholder="All Channels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Channels</SelectItem>
            <SelectItem value="voice">Voice</SelectItem>
            <SelectItem value="chat">Chat</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[140px] h-9 bg-slate-50 border-transparent font-medium">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="escalated">Escalated</SelectItem>
            <SelectItem value="active">In Progress</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[140px] h-9 bg-slate-50 border-transparent font-medium">
            <SelectValue placeholder="All Issues" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Issues</SelectItem>
            <SelectItem value="billing">Billing</SelectItem>
            <SelectItem value="tech">Technical Issue</SelectItem>
            <SelectItem value="access">Account Access</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="7d">
          <SelectTrigger className="w-[140px] h-9 bg-slate-50 border-transparent font-medium ml-auto">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Table */}
      <div className="border rounded-xl bg-white shadow-sm overflow-auto flex-1 relative">
        <Table>
          <TableHeader className="bg-slate-50/50 sticky top-0 z-10">
            <TableRow>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-4 px-6">Caller</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-4">Issue Type</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-4">Channel</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-4">Duration</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-4">Status</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-4">Ticket</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-4">Date</TableHead>
              <TableHead className="w-12 py-4 px-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">Loading call logs...</TableCell>
              </TableRow>
            ) : calls.map((call) => (
              <TableRow 
                key={call.id} 
                className="cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setSelectedCall(call)}
              >
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-sm">
                      {call.name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-[13px] text-slate-900">{call.name}</div>
                      <div className="text-xs text-slate-500 font-medium">{call.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant="outline" className={`font-semibold border ${getIssueBadge(call.issue)}`}>
                    {call.issue}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant="outline" className="font-semibold bg-indigo-50 text-indigo-700 border-indigo-200">
                    {call.channel === 'Voice' ? '🎙️ Voice' : '💬 Chat'}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm font-medium text-slate-600 py-4">
                  {call.duration}
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant="outline" className={`font-semibold border ${getStatusBadge(call.status)}`}>
                    <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${call.status === 'resolved' ? 'bg-emerald-500' : call.status === 'escalated' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                    {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <span className="font-mono text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{call.ticket}</span>
                </TableCell>
                <TableCell className="text-xs font-medium text-slate-500 py-4">
                  {call.date}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                    <Play className="h-3.5 w-3.5 ml-0.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Slide-out Detail Panel */}
      <div className={`absolute top-0 right-0 bottom-0 w-[450px] bg-white border-l border-slate-200 shadow-2xl transition-transform duration-300 ease-in-out z-50 flex flex-col ${selectedCall ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedCall && (
          <>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-bold text-white shadow-md">
                  {selectedCall.name[0]?.toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{selectedCall.name}</h3>
                  <p className="text-sm text-slate-500 font-medium">{selectedCall.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200" onClick={() => setSelectedCall(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Issue Type</div>
                  <div className="font-semibold text-sm text-slate-700">{selectedCall.issue}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Duration</div>
                  <div className="font-semibold text-sm text-slate-700">{selectedCall.duration}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ticket</div>
                  <div className="font-mono text-sm font-bold text-indigo-600">{selectedCall.ticket}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</div>
                  <div className="font-semibold text-sm text-slate-700 capitalize">{selectedCall.status}</div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  Call Transcript
                </h4>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">Agent</div>
                      <div className="bg-indigo-50 text-indigo-900 text-sm p-3 rounded-2xl rounded-tl-none leading-relaxed">
                        Hi Priya! Thank you for calling Voicera support. How can I help you today?
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 text-right">User</div>
                      <div className="bg-slate-100 text-slate-700 text-sm p-3 rounded-2xl rounded-tr-none leading-relaxed ml-8">
                        Hi, I'm having trouble logging into my dashboard. It keeps saying invalid credentials but I just reset my password.
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">Agent</div>
                      <div className="bg-indigo-50 text-indigo-900 text-sm p-3 rounded-2xl rounded-tl-none leading-relaxed">
                        I can certainly help with that. Let me pull up your account. I see you just changed your password 10 minutes ago. Sometimes it takes a few minutes for the cache to clear. Can you try logging in using an incognito window?
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 text-right">User</div>
                      <div className="bg-slate-100 text-slate-700 text-sm p-3 rounded-2xl rounded-tr-none leading-relaxed ml-8">
                        Oh, you're right. It works perfectly in incognito. Thank you!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-white flex gap-3">
              <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                View Full Session
              </Button>
              <Button variant="outline" className="flex-1">
                View Ticket
              </Button>
            </div>
          </>
        )}
      </div>
      
      {/* Overlay for Detail Panel */}
      {selectedCall && (
        <div 
          className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setSelectedCall(null)}
        />
      )}
    </div>
  );
}
