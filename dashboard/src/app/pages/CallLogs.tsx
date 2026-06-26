import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { apiClient } from '../../api/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Download, Play, ChevronRight, X, Phone, MessageSquare } from 'lucide-react';
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
      case 'Technical Issue': return 'bg-violet-50 text-violet-700 border-violet-100';
      case 'Billing': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Account Access': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm';
      case 'escalated': return 'bg-rose-50 text-rose-700 border-rose-200 shadow-sm';
      case 'active': return 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm';
      default: return 'bg-slate-50 text-slate-700 border-slate-200 shadow-sm';
    }
  };

  return (
    <div className="p-6 space-y-6 h-full flex flex-col relative overflow-hidden bg-[#fafafa]">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-[24px] font-manrope font-extrabold tracking-tight text-slate-900">Call Logs</h1>
          <p className="text-slate-500 font-inter text-[13px] mt-1 font-medium">All customer conversations — click any row to view transcript</p>
        </div>
        <Button variant="outline" size="sm" className="bg-white border-slate-200 shadow-sm text-slate-700 font-medium font-inter h-9 rounded-xl hover:bg-slate-50">
          <Download className="mr-2 h-4 w-4 text-slate-400" />
          Export CSV
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex-shrink-0">
        <div className="relative flex-1 min-w-[200px] max-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9 h-9 bg-slate-50/80 border-transparent focus-visible:ring-indigo-500 focus-visible:bg-white transition-colors rounded-xl font-inter text-[13px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[140px] h-9 bg-slate-50/80 border-transparent font-medium font-inter text-[13px] rounded-xl text-slate-700">
            <SelectValue placeholder="All Channels" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 shadow-lg font-inter text-[13px]">
            <SelectItem value="all">All Channels</SelectItem>
            <SelectItem value="voice">Voice</SelectItem>
            <SelectItem value="chat">Chat</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[140px] h-9 bg-slate-50/80 border-transparent font-medium font-inter text-[13px] rounded-xl text-slate-700">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 shadow-lg font-inter text-[13px]">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="escalated">Escalated</SelectItem>
            <SelectItem value="active">In Progress</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="7d">
          <SelectTrigger className="w-[140px] h-9 bg-slate-50/80 border-transparent font-medium font-inter text-[13px] rounded-xl text-slate-700 ml-auto">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 shadow-lg font-inter text-[13px]">
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Table */}
      <div className="border border-slate-200/60 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-auto flex-1 relative">
        <Table>
          <TableHeader className="bg-slate-50/80 sticky top-0 z-10 border-b border-slate-100 backdrop-blur-sm">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="text-[11px] font-bold uppercase tracking-widest text-slate-400 py-4 px-6 font-inter">Caller</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-widest text-slate-400 py-4 font-inter">Issue Type</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-widest text-slate-400 py-4 font-inter">Channel</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-widest text-slate-400 py-4 font-inter">Duration</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-widest text-slate-400 py-4 font-inter">Status</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-widest text-slate-400 py-4 font-inter">Ticket</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-widest text-slate-400 py-4 font-inter">Date</TableHead>
              <TableHead className="w-12 py-4 px-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-slate-400 font-inter text-[13px]">Loading call logs...</TableCell>
              </TableRow>
            ) : calls.map((call) => (
              <TableRow 
                key={call.id} 
                className="cursor-pointer hover:bg-slate-50/50 transition-colors border-slate-100 group"
                onClick={() => setSelectedCall(call)}
              >
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200/50 text-[14px] font-bold text-indigo-700 shadow-sm">
                      {call.name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-[14px] text-slate-900 font-inter tracking-tight">{call.name}</div>
                      <div className="text-[12px] text-slate-500 font-medium font-inter mt-0.5">{call.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant="outline" className={`font-semibold font-inter text-[11px] px-2.5 py-0.5 rounded-md ${getIssueBadge(call.issue)}`}>
                    {call.issue}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600 font-inter">
                    {call.channel === 'Voice' ? <Phone className="h-3.5 w-3.5 text-indigo-500" /> : <MessageSquare className="h-3.5 w-3.5 text-indigo-500" />}
                    {call.channel}
                  </div>
                </TableCell>
                <TableCell className="text-[13px] font-medium text-slate-600 py-4 font-inter">
                  {call.duration}
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant="outline" className={`font-semibold font-inter text-[11px] px-2.5 py-0.5 rounded-md ${getStatusBadge(call.status)}`}>
                    <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${call.status === 'resolved' ? 'bg-emerald-500' : call.status === 'escalated' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                    {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <span className="font-mono text-[12px] font-bold text-slate-500 bg-slate-100/50 border border-slate-200/60 px-2 py-1 rounded-md">{call.ticket}</span>
                </TableCell>
                <TableCell className="text-[12px] font-medium text-slate-500 py-4 font-inter">
                  {call.date}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100">
                    <Play className="h-3.5 w-3.5 ml-0.5" fill="currentColor" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Slide-out Detail Panel */}
      <div className={`absolute top-0 right-0 bottom-0 w-[450px] bg-white border-l border-slate-200 shadow-[0_0_40px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-in-out z-50 flex flex-col ${selectedCall ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedCall && (
          <>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-indigo-600" />
              <div className="flex items-center gap-4 mt-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200/50 text-[18px] font-bold text-indigo-700 shadow-sm">
                  {selectedCall.name[0]?.toUpperCase()}
                </div>
                <div>
                  <h3 className="font-manrope font-bold text-[18px] text-slate-900 tracking-tight">{selectedCall.name}</h3>
                  <p className="text-[13px] text-slate-500 font-medium font-inter mt-0.5">{selectedCall.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 h-8 w-8" onClick={() => setSelectedCall(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-inter">Issue Type</div>
                  <div className="font-semibold text-[14px] text-slate-900 font-inter">{selectedCall.issue}</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-inter">Duration</div>
                  <div className="font-semibold text-[14px] text-slate-900 font-inter">{selectedCall.duration}</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-inter">Ticket</div>
                  <div className="font-mono text-[14px] font-bold text-indigo-600">{selectedCall.ticket}</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-inter">Status</div>
                  <div className="font-semibold text-[14px] text-slate-900 font-inter capitalize">{selectedCall.status}</div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-[14px] font-bold text-slate-900 mb-5 flex items-center gap-2 font-inter tracking-tight">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                  Call Transcript
                </h4>
                
                <div className="space-y-5">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1.5 ml-1 font-inter">Agent</div>
                      <div className="bg-indigo-50 text-indigo-900 text-[13px] p-4 rounded-[20px] rounded-tl-sm leading-relaxed font-inter border border-indigo-100 shadow-sm">
                        Hi Priya! Thank you for calling Voicera support. How can I help you today?
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 mr-1 font-inter text-right">User</div>
                      <div className="bg-white border border-slate-200 text-slate-700 text-[13px] p-4 rounded-[20px] rounded-tr-sm leading-relaxed ml-8 font-inter shadow-sm">
                        Hi, I'm having trouble logging into my dashboard. It keeps saying invalid credentials but I just reset my password.
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1.5 ml-1 font-inter">Agent</div>
                      <div className="bg-indigo-50 text-indigo-900 text-[13px] p-4 rounded-[20px] rounded-tl-sm leading-relaxed font-inter border border-indigo-100 shadow-sm">
                        I can certainly help with that. Let me pull up your account. I see you just changed your password 10 minutes ago. Sometimes it takes a few minutes for the cache to clear. Can you try logging in using an incognito window?
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 mr-1 font-inter text-right">User</div>
                      <div className="bg-white border border-slate-200 text-slate-700 text-[13px] p-4 rounded-[20px] rounded-tr-sm leading-relaxed ml-8 font-inter shadow-sm">
                        Oh, you're right. It works perfectly in incognito. Thank you!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-white flex gap-3 relative z-10">
              <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold font-inter rounded-xl h-[42px] shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:-translate-y-[1px] transition-all">
                View Full Session
              </Button>
              <Button variant="outline" className="flex-1 font-bold font-inter rounded-xl h-[42px] border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm">
                View Ticket
              </Button>
            </div>
          </>
        )}
      </div>
      
      {/* Overlay for Detail Panel */}
      {selectedCall && (
        <div 
          className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] z-40 transition-opacity"
          onClick={() => setSelectedCall(null)}
        />
      )}
    </div>
  );
}
