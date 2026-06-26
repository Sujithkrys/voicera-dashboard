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
      case 'Technical Issue': return 'bg-violet-50 text-violet-700 border-violet-100';
      case 'Billing': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Account Access': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Feature Help': return 'bg-slate-50 text-slate-700 border-slate-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm';
      case 'open': return 'bg-rose-50 text-rose-700 border-rose-200 shadow-sm';
      case 'in-progress': return 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm';
      default: return 'bg-slate-50 text-slate-700 border-slate-200 shadow-sm';
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto h-full flex flex-col bg-[#fafafa]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-manrope font-extrabold tracking-tight text-slate-900">Tickets</h1>
          <p className="text-slate-500 font-inter text-[13px] mt-1 font-medium">Support tickets generated from voice conversations</p>
        </div>
        
        <div className="flex bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <button 
            className={`flex items-center gap-2 px-4 py-2 text-[13px] font-semibold font-inter rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-700 border border-slate-200/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
            onClick={() => setViewMode('list')}
          >
            <LayoutList className="h-4 w-4" />
            List
          </button>
          <button 
            className={`flex items-center gap-2 px-4 py-2 text-[13px] font-semibold font-inter rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-white shadow-sm text-indigo-700 border border-slate-200/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
            onClick={() => setViewMode('kanban')}
          >
            <Kanban className="h-4 w-4" />
            Kanban
          </button>
        </div>
      </div>

      {viewMode === 'list' && (
        <>
          <div className="flex gap-2 bg-slate-100/80 p-1.5 rounded-[14px] w-fit border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <button className={`px-4 py-2 rounded-xl text-[13px] font-semibold font-inter transition-all ${activeTab === 'all' ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`} onClick={() => setActiveTab('all')}>
              All <span className="ml-2 text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/50 font-bold">{counts.all}</span>
            </button>
            <button className={`px-4 py-2 rounded-xl text-[13px] font-semibold font-inter transition-all ${activeTab === 'open' ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`} onClick={() => setActiveTab('open')}>
              Open <span className="ml-2 text-[11px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-md border border-rose-100 font-bold">{counts.open}</span>
            </button>
            <button className={`px-4 py-2 rounded-xl text-[13px] font-semibold font-inter transition-all ${activeTab === 'in-progress' ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`} onClick={() => setActiveTab('in-progress')}>
              In Progress <span className="ml-2 text-[11px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md border border-amber-100 font-bold">{counts['in-progress']}</span>
            </button>
            <button className={`px-4 py-2 rounded-xl text-[13px] font-semibold font-inter transition-all ${activeTab === 'resolved' ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`} onClick={() => setActiveTab('resolved')}>
              Resolved <span className="ml-2 text-[11px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md border border-emerald-100 font-bold">{counts.resolved}</span>
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto pr-2 pb-10">
            {filteredTickets.map(ticket => (
              <div key={ticket.id} className="bg-white border border-slate-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] rounded-2xl p-5 flex items-center gap-5 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
                <div className="font-mono text-[12px] font-bold text-slate-500 bg-slate-50 border border-slate-200/50 px-2.5 py-1.5 rounded-lg shrink-0 group-hover:text-indigo-600 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors">
                  {ticket.id}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[14px] font-inter tracking-tight text-slate-900 truncate mb-1">
                    {ticket.title}
                  </div>
                  <div className="text-[12px] text-slate-500 font-medium font-inter flex items-center gap-2">
                    <span className="font-semibold text-slate-700">{ticket.name}</span>
                    <span className="text-slate-300">•</span>
                    <span>{ticket.issue}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <Badge variant="outline" className={`font-semibold border ${getStatusBadge(ticket.status)} capitalize text-[10px] px-2 py-0.5 rounded-md`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${ticket.status === 'resolved' ? 'bg-emerald-500' : ticket.status === 'open' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                      {ticket.status.replace('-', ' ')}
                    </Badge>
                    <span className="text-[11px] text-slate-400 font-medium font-inter">{ticket.date} • {ticket.duration}</span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200/50 text-[14px] font-bold text-indigo-700 shadow-sm">
                    {ticket.name[0]}
                  </div>
                  <Button variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600 hover:text-white hover:bg-indigo-600 font-bold font-inter rounded-xl shadow-sm border border-transparent hover:border-indigo-700">
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
              <div key={colStatus} className="bg-slate-100/50 rounded-[24px] p-5 border border-slate-200/60 flex flex-col h-full shadow-[inset_0_2px_10px_rgba(0,0,0,0.01)]">
                <div className="flex items-center justify-between mb-5 px-1">
                  <h3 className="font-manrope font-bold text-[16px] text-slate-900">{title}</h3>
                  <span className="text-[11px] font-bold bg-white text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">{colTickets.length}</span>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-4 pb-4 scrollbar-hide">
                  {colTickets.map(ticket => (
                    <div key={ticket.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group">
                      <div className="flex justify-between items-start mb-3">
                        <div className="font-bold text-[14px] font-inter text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{ticket.title}</div>
                        <div className="font-mono text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{ticket.id.split('-')[1]}</div>
                      </div>
                      <div className="text-[12px] text-slate-500 font-medium font-inter mb-5 flex items-center gap-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-50 text-[9px] font-bold text-indigo-700">
                          {ticket.name[0]}
                        </div>
                        {ticket.name}
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={`font-semibold font-inter border text-[10px] px-2 py-0.5 rounded-md ${getIssueBadge(ticket.issue)}`}>
                          {ticket.issue}
                        </Badge>
                        <span className="text-[11px] text-slate-400 font-medium font-inter">{ticket.date}</span>
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
