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
      case 'Technical Issue': return 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200';
      case 'Billing': return 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200';
      case 'Account Access': return 'bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200';
      case 'Feature Help': return 'bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'open': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'in-progress': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tickets</h1>
          <p className="text-muted-foreground text-sm mt-1">Support tickets generated from voice conversations</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
            onClick={() => setViewMode('list')}
          >
            <LayoutList className="h-4 w-4" />
            List
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'kanban' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
            onClick={() => setViewMode('kanban')}
          >
            <Kanban className="h-4 w-4" />
            Kanban
          </button>
        </div>
      </div>

      {viewMode === 'list' && (
        <>
          <div className="flex gap-2 bg-slate-50 p-1 rounded-xl w-fit border border-slate-200">
            <button className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'all' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`} onClick={() => setActiveTab('all')}>
              All <span className="ml-2 text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-md">{counts.all}</span>
            </button>
            <button className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'open' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`} onClick={() => setActiveTab('open')}>
              Open <span className="ml-2 text-[10px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-md">{counts.open}</span>
            </button>
            <button className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'in-progress' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`} onClick={() => setActiveTab('in-progress')}>
              In Progress <span className="ml-2 text-[10px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-md">{counts['in-progress']}</span>
            </button>
            <button className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'resolved' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`} onClick={() => setActiveTab('resolved')}>
              Resolved <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-md">{counts.resolved}</span>
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto pr-2 pb-10">
            {filteredTickets.map(ticket => (
              <div key={ticket.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
                <div className="font-mono text-[11px] font-bold text-indigo-500 w-24 shrink-0">{ticket.id}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-slate-900 truncate mb-1">
                    <span className="text-slate-500 font-medium">{ticket.name} — </span>
                    {ticket.title}
                  </div>
                  <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
                    <span className="text-slate-600">{ticket.issue}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <Badge variant="outline" className={`font-semibold border ${getStatusBadge(ticket.status)} capitalize text-[10px]`}>
                      {ticket.status.replace('-', ' ')}
                    </Badge>
                    <span className="text-[11px] text-slate-400 font-medium">• {ticket.date} • {ticket.duration}</span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-[11px] font-bold text-white shadow-sm">
                    {ticket.name[0]}
                  </div>
                  <Button variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
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
              <div key={colStatus} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="font-bold text-sm text-slate-900">{title}</h3>
                  <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md">{colTickets.length}</span>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 pb-4">
                  {colTickets.map(ticket => (
                    <div key={ticket.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <div className="font-semibold text-sm text-slate-900 mb-2 leading-tight">{ticket.title}</div>
                      <div className="text-[11px] text-slate-500 font-medium mb-4">{ticket.name} • {ticket.issue}</div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={`font-semibold border text-[9px] px-1.5 py-0 ${getIssueBadge(ticket.issue)}`}>
                          {ticket.issue}
                        </Badge>
                        <span className="text-[11px] text-slate-400 font-medium">{ticket.date}</span>
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
