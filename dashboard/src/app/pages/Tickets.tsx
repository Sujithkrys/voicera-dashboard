import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { apiClient } from '../../api/client';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { LayoutList, Kanban, ChevronRight } from 'lucide-react';

const mockTickets = [
  { id: 'TKT-A8F2X', title: 'Login issue after password reset', name: 'Priya Sharma', issue: 'Technical Issue', status: 'open', date: 'Apr 21', duration: '3m 12s call' },
  { id: 'TKT-B3K9P', title: 'Double charge on invoice #4821', name: 'Marco Diaz', issue: 'Billing', status: 'open', date: 'Apr 21', duration: '1m 48s call' },
  { id: 'TKT-G9H7V', title: 'Account suspended without warning', name: 'Nina Okafor', issue: 'Account Access', status: 'open', date: 'Apr 19', duration: '1m 18s call' },
  { id: 'TKT-E2N5T', title: 'API rate limit errors in production', name: 'Laura Chen', issue: 'Technical Issue', status: 'in-progress', date: 'Apr 20', duration: '0m 55s call' },
  { id: 'TKT-D4Q8R', title: 'How to set up webhook integrations', name: 'Ravi Patel', issue: 'Feature Help', status: 'in-progress', date: 'Apr 20', duration: '4m 22s call' },
  { id: 'TKT-C7M1L', title: '2FA not working, locked out', name: 'Sofia Kim', issue: 'Account Access', status: 'resolved', date: 'Apr 21', duration: '2m 05s call' },
  { id: 'TKT-F6W3Z', title: 'Subscription renewal failed', name: 'James Wilson', issue: 'Billing', status: 'resolved', date: 'Apr 20', duration: '2m 41s call' }
];

export default function Tickets() {
  const [tickets, setTickets] = useState(mockTickets);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'in-progress' | 'resolved'>('all');

  const getIssueBadge = (issue: string) => {
    switch(issue) {
      case 'Technical Issue': return 'bg-primary-glow-sm text-primary border-none';
      case 'Billing': return 'bg-amber-bg text-amber border-none';
      case 'Account Access': return 'bg-blue-bg text-blue border-none';
      case 'Feature Help': return 'bg-surface-highest text-on-surface-med border-none';
      default: return 'bg-surface-highest text-on-surface-med border-none';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'resolved': return 'bg-tertiary-dim text-tertiary border-none';
      case 'open': return 'bg-red-bg text-red border-none';
      case 'in-progress': return 'bg-amber-bg text-amber border-none';
      default: return 'bg-surface-highest text-on-surface-med border-none';
    }
  };

  const counts = {
    all: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    'in-progress': tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length
  };

  const filteredTickets = activeTab === 'all' ? tickets : tickets.filter(t => t.status === activeTab);

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="font-manrope text-[24px] font-extrabold tracking-[-0.5px] text-on-surface">Tickets</h1>
          <p className="font-inter text-[13px] text-on-surface-med mt-1">Support tickets generated from voice conversations</p>
        </div>
        
        <div className="flex bg-surface-hi p-[4px] rounded-[14px] border border-ghost">
          <button 
            className={`flex items-center gap-2 px-[14px] py-2 text-[13px] font-bold rounded-[10px] transition-all font-inter ${viewMode === 'list' ? 'bg-surface-highest text-on-surface shadow-[0_4px_12px_rgba(0,0,0,0.2)]' : 'text-on-surface-low hover:text-on-surface-med'}`}
            onClick={() => setViewMode('list')}
          >
            <LayoutList className="h-4 w-4" />
            List
          </button>
          <button 
            className={`flex items-center gap-2 px-[14px] py-2 text-[13px] font-bold rounded-[10px] transition-all font-inter ${viewMode === 'kanban' ? 'bg-surface-highest text-on-surface shadow-[0_4px_12px_rgba(0,0,0,0.2)]' : 'text-on-surface-low hover:text-on-surface-med'}`}
            onClick={() => setViewMode('kanban')}
          >
            <Kanban className="h-4 w-4" />
            Kanban
          </button>
        </div>
      </div>

      {viewMode === 'list' && (
        <>
          <div className="flex gap-2 bg-surface-hi p-[6px] rounded-2xl w-fit border border-ghost">
            <button className={`px-[18px] py-2.5 rounded-xl text-[13px] font-bold transition-all font-inter flex items-center ${activeTab === 'all' ? 'bg-surface-highest text-on-surface shadow-[0_4px_12px_rgba(0,0,0,0.2)]' : 'text-on-surface-med hover:text-on-surface'}`} onClick={() => setActiveTab('all')}>
              All <span className="ml-2 text-[10px] bg-ghost text-on-surface-med px-1.5 py-[2px] rounded-md">{counts.all}</span>
            </button>
            <button className={`px-[18px] py-2.5 rounded-xl text-[13px] font-bold transition-all font-inter flex items-center ${activeTab === 'open' ? 'bg-surface-highest text-on-surface shadow-[0_4px_12px_rgba(0,0,0,0.2)]' : 'text-on-surface-med hover:text-on-surface'}`} onClick={() => setActiveTab('open')}>
              Open <span className="ml-2 text-[10px] bg-red-bg text-red px-1.5 py-[2px] rounded-md">{counts.open}</span>
            </button>
            <button className={`px-[18px] py-2.5 rounded-xl text-[13px] font-bold transition-all font-inter flex items-center ${activeTab === 'in-progress' ? 'bg-surface-highest text-on-surface shadow-[0_4px_12px_rgba(0,0,0,0.2)]' : 'text-on-surface-med hover:text-on-surface'}`} onClick={() => setActiveTab('in-progress')}>
              In Progress <span className="ml-2 text-[10px] bg-amber-bg text-amber px-1.5 py-[2px] rounded-md">{counts['in-progress']}</span>
            </button>
            <button className={`px-[18px] py-2.5 rounded-xl text-[13px] font-bold transition-all font-inter flex items-center ${activeTab === 'resolved' ? 'bg-surface-highest text-on-surface shadow-[0_4px_12px_rgba(0,0,0,0.2)]' : 'text-on-surface-med hover:text-on-surface'}`} onClick={() => setActiveTab('resolved')}>
              Resolved <span className="ml-2 text-[10px] bg-tertiary-dim text-tertiary px-1.5 py-[2px] rounded-md">{counts.resolved}</span>
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto pr-2 pb-10 scrollbar-thin scrollbar-thumb-surface-highest scrollbar-track-transparent">
            {filteredTickets.map(ticket => (
              <div key={ticket.id} className="bg-surface border border-ghost rounded-2xl p-[18px_24px] flex items-center gap-[24px] hover:border-ghost-med hover:bg-surface-hi transition-all cursor-pointer group shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                <div className="font-mono text-[13px] font-bold text-primary w-[100px] shrink-0 tracking-wide">{ticket.id}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[15px] text-on-surface truncate mb-1 font-inter">
                    <span className="text-on-surface-med font-medium mr-2">{ticket.name} — </span>
                    {ticket.title}
                  </div>
                  <div className="text-[12px] text-on-surface-low font-medium flex items-center gap-2 font-inter mb-3">
                    {ticket.issue}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={`font-bold border uppercase tracking-[0.6px] text-[10px] px-3 py-1 ${getStatusBadge(ticket.status)}`}>
                      {ticket.status.replace('-', ' ')}
                    </Badge>
                    <span className="text-[11px] text-on-surface-low font-medium font-inter">• {ticket.date} • {ticket.duration}</span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-[24px]">
                  <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-gradient-to-br from-primary-dim to-primary text-[15px] font-extrabold font-manrope text-white shadow-sm">
                    {ticket.name[0]}
                  </div>
                  <Button variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-white hover:bg-primary rounded-xl font-inter font-bold">
                    View <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-0">
          {['open', 'in-progress', 'resolved'].map((colStatus) => {
            const colTickets = tickets.filter(t => t.status === colStatus);
            const title = colStatus === 'open' ? 'Open' : colStatus === 'in-progress' ? 'In Progress' : 'Resolved';
            
            return (
              <div key={colStatus} className="bg-surface-hi rounded-[24px] p-5 border border-ghost flex flex-col h-full shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
                <div className="flex items-center justify-between mb-5 px-2">
                  <h3 className="font-manrope font-extrabold text-[15px] text-on-surface tracking-wide">{title}</h3>
                  <span className="text-[11px] font-bold bg-ghost text-on-surface-med px-2.5 py-1 rounded-lg">{colTickets.length}</span>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-4 pb-4 px-1 scrollbar-thin scrollbar-thumb-surface-highest scrollbar-track-transparent">
                  {colTickets.map(ticket => (
                    <div key={ticket.id} className="bg-surface rounded-2xl p-[18px] border border-ghost shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:border-ghost-med hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all cursor-pointer group">
                      <div className="font-inter font-semibold text-[14px] text-on-surface mb-2 leading-[1.4] group-hover:text-primary transition-colors">{ticket.title}</div>
                      <div className="text-[12px] text-on-surface-med font-medium mb-4 font-inter">{ticket.name} • {ticket.issue}</div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={`font-bold uppercase tracking-[0.5px] border text-[9px] px-2 py-1 ${getIssueBadge(ticket.issue)}`}>
                          {ticket.issue}
                        </Badge>
                        <span className="text-[11px] text-on-surface-low font-medium font-inter">{ticket.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
