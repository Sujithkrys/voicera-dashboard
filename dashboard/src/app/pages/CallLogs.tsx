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
      case 'Technical Issue': return 'bg-primary-glow-sm text-primary border-none font-bold uppercase tracking-wider text-[10px] px-3 py-1';
      case 'Billing': return 'bg-amber-bg text-amber border-none font-bold uppercase tracking-wider text-[10px] px-3 py-1';
      case 'Account Access': return 'bg-blue-bg text-blue border-none font-bold uppercase tracking-wider text-[10px] px-3 py-1';
      default: return 'bg-surface-highest text-on-surface-med border-none font-bold uppercase tracking-wider text-[10px] px-3 py-1';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'resolved': return 'bg-tertiary-dim text-tertiary border-none font-bold uppercase tracking-wider text-[10px] px-3 py-1';
      case 'escalated': return 'bg-red-bg text-red border-none font-bold uppercase tracking-wider text-[10px] px-3 py-1';
      case 'active': return 'bg-amber-bg text-amber border-none font-bold uppercase tracking-wider text-[10px] px-3 py-1';
      default: return 'bg-surface-highest text-on-surface-med border-none font-bold uppercase tracking-wider text-[10px] px-3 py-1';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col relative overflow-hidden pb-10">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0 mb-2">
        <div>
          <h1 className="font-manrope text-[24px] font-extrabold tracking-[-0.5px] text-on-surface">Call Logs</h1>
          <p className="font-inter text-[13px] text-on-surface-med mt-1">All customer conversations — click any row to view transcript</p>
        </div>
        <Button variant="outline" size="sm" className="bg-surface-highest text-primary border-ghost hover:bg-surface-bright hover:border-ghost-med hover:text-primary transition-all font-inter font-semibold rounded-xl">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2.5 mb-5 flex-shrink-0">
        <div className="relative flex-1 min-w-[200px] max-w-[280px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-on-surface-low" />
          <Input
            placeholder="Search by name or email..."
            className="pl-[34px] h-[38px] bg-surface-hi border-transparent focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary text-on-surface font-inter text-[13px] rounded-xl placeholder:text-on-surface-low"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {['All Channels', 'All Statuses', 'All Issues'].map((placeholder, idx) => (
          <Select key={idx} defaultValue="all">
            <SelectTrigger className="w-[140px] h-[38px] bg-surface-hi border-transparent text-on-surface-med font-inter text-[12px] rounded-xl focus:ring-0">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-surface-hi border-ghost-med text-on-surface">
              <SelectItem value="all">{placeholder}</SelectItem>
              <SelectItem value="opt1">Option 1</SelectItem>
              <SelectItem value="opt2">Option 2</SelectItem>
            </SelectContent>
          </Select>
        ))}

        <Select defaultValue="7d">
          <SelectTrigger className="w-[140px] h-[38px] bg-surface-hi border-transparent text-on-surface-med font-inter text-[12px] rounded-xl focus:ring-0 ml-auto">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent className="bg-surface-hi border-ghost-med text-on-surface">
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Table */}
      <div className="bg-surface rounded-[1.5rem] shadow-[0_0_40px_rgba(6,14,32,0.5)] overflow-x-auto flex-1 relative border-none">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-ghost-med hover:bg-transparent">
              {['Caller', 'Issue Type', 'Channel', 'Duration', 'Status', 'Ticket', 'Date', ''].map((head, idx) => (
                <TableHead key={idx} className="font-inter text-[10px] font-bold text-on-surface-low uppercase tracking-[0.6px] px-4 py-3 h-auto">
                  {head}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={8} className="text-center py-12 text-on-surface-low font-inter">Loading call logs...</TableCell>
              </TableRow>
            ) : calls.map((call) => (
              <TableRow 
                key={call.id} 
                className="cursor-pointer transition-colors border-none hover:bg-surface-hi group"
                onClick={() => setSelectedCall(call)}
              >
                <TableCell className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] font-manrope font-extrabold text-[14px] text-white bg-gradient-to-br from-primary-dim to-primary">
                      {call.name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-[13px] text-on-surface font-inter">{call.name}</div>
                      <div className="text-[12px] text-on-surface-low font-inter">{call.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3.5">
                  <Badge variant="outline" className={getIssueBadge(call.issue)}>
                    {call.issue}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3.5">
                  <Badge variant="outline" className="bg-surface-highest text-on-surface-med border-none font-bold uppercase tracking-wider text-[10px] px-3 py-1">
                    {call.channel === 'Voice' ? '🎙️ Voice' : '💬 Chat'}
                  </Badge>
                </TableCell>
                <TableCell className="text-[13px] font-inter text-on-surface px-4 py-3.5">
                  {call.duration}
                </TableCell>
                <TableCell className="px-4 py-3.5">
                  <Badge variant="outline" className={getStatusBadge(call.status)}>
                    <div className="w-1 h-1 rounded-full bg-current mr-1.5" />
                    {call.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3.5">
                  <span className="font-mono text-[11px] font-bold text-primary">{call.ticket}</span>
                </TableCell>
                <TableCell className="text-[13px] font-inter text-on-surface-med px-4 py-3.5">
                  {call.date}
                </TableCell>
                <TableCell className="px-4 py-3.5 text-right">
                  <div className="w-7 h-7 rounded-full bg-primary-glow-sm flex items-center justify-center cursor-pointer transition-transform text-primary hover:bg-primary hover:text-white hover:scale-105 ml-auto">
                    <Play className="h-2.5 w-2.5 ml-0.5" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Slide-out Detail Panel */}
      <div className={`absolute top-0 right-0 bottom-0 w-[390px] bg-surface-bright-blur backdrop-blur-[40px] border-l border-ghost shadow-[0_24px_60px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-in-out z-50 flex flex-col ${selectedCall ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedCall && (
          <>
            <div className="p-[20px_24px] border-b border-ghost-med flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] font-manrope font-extrabold text-[15px] text-white bg-gradient-to-br from-primary-dim to-primary">
                  {selectedCall.name[0]?.toUpperCase()}
                </div>
                <div>
                  <h3 className="font-manrope font-extrabold text-[15px] text-on-surface leading-none mb-1">{selectedCall.name}</h3>
                  <p className="font-inter text-[12px] text-on-surface-med">{selectedCall.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="w-[30px] h-[30px] rounded-[9px] bg-surface-highest text-on-surface-med hover:text-on-surface border-none" onClick={() => setSelectedCall(null)}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-[20px_24px] scrollbar-thin scrollbar-thumb-surface-highest scrollbar-track-transparent">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-surface-hi p-3.5 rounded-2xl border border-ghost-med">
                  <div className="font-inter text-[10px] font-bold text-on-surface-low uppercase tracking-[0.6px] mb-1">Issue Type</div>
                  <div className="font-manrope font-bold text-[14px] text-on-surface">{selectedCall.issue}</div>
                </div>
                <div className="bg-surface-hi p-3.5 rounded-2xl border border-ghost-med">
                  <div className="font-inter text-[10px] font-bold text-on-surface-low uppercase tracking-[0.6px] mb-1">Duration</div>
                  <div className="font-manrope font-bold text-[14px] text-on-surface">{selectedCall.duration}</div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-inter text-[11px] font-bold text-on-surface-low uppercase tracking-[0.5px] mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Call Transcript
                </h4>
                
                <div className="space-y-4">
                  {/* Agent Bubble */}
                  <div className="flex gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex-1">
                      <div className="font-inter text-[9px] font-bold text-primary uppercase tracking-[0.5px] mb-1">Agent</div>
                      <div className="bg-primary-glow-sm border border-ghost text-on-surface text-[12px] p-[9px_13px] rounded-2xl rounded-tl-none leading-[1.65]">
                        Hi Priya! Thank you for calling Voicera support. How can I help you today?
                      </div>
                    </div>
                  </div>
                  
                  {/* User Bubble */}
                  <div className="flex gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75">
                    <div className="flex-1">
                      <div className="font-inter text-[9px] font-bold text-on-surface-low uppercase tracking-[0.5px] mb-1 text-right">User</div>
                      <div className="bg-surface-hi border border-ghost-med text-on-surface text-[12px] p-[9px_13px] rounded-2xl rounded-tr-none leading-[1.65] ml-8">
                        Hi, I'm having trouble logging into my dashboard. It keeps saying invalid credentials but I just reset my password.
                      </div>
                    </div>
                  </div>

                  {/* Agent Bubble */}
                  <div className="flex gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-150">
                    <div className="flex-1">
                      <div className="font-inter text-[9px] font-bold text-primary uppercase tracking-[0.5px] mb-1">Agent</div>
                      <div className="bg-primary-glow-sm border border-ghost text-on-surface text-[12px] p-[9px_13px] rounded-2xl rounded-tl-none leading-[1.65]">
                        I can certainly help with that. Let me pull up your account. I see you just changed your password 10 minutes ago. Sometimes it takes a few minutes for the cache to clear. Can you try logging in using an incognito window?
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-[20px_24px] border-t border-ghost-med flex gap-3 mt-auto">
              <Button className="flex-1 bg-gradient-to-r from-primary-dim to-primary hover:-translate-y-[1px] transition-transform text-white font-inter font-bold text-[13px] rounded-xl shadow-[0_4px_18px_var(--color-primary-glow)] border-none">
                View Full Session
              </Button>
            </div>
          </>
        )}
      </div>
      
      {/* Overlay for Detail Panel */}
      {selectedCall && (
        <div 
          className="absolute inset-0 bg-[#060e20]/60 backdrop-blur-[4px] z-40 transition-opacity"
          onClick={() => setSelectedCall(null)}
        />
      )}
    </div>
  );
}
