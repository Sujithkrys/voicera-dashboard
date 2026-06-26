import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Plus, MoreHorizontal, Mail, Shield, User, Clock, Briefcase } from 'lucide-react';

const mockTeam = [
  { id: '1', name: 'Alex Smith', email: 'alex@voicera.ai', role: 'Admin', status: 'active', department: 'All' },
  { id: '2', name: 'Priya Sharma', email: 'priya@voicera.ai', role: 'Specialist', status: 'active', department: 'Technical' },
  { id: '3', name: 'Marcus Johnson', email: 'marcus@voicera.ai', role: 'Specialist', status: 'offline', department: 'Billing' },
  { id: '4', name: 'Elena Rodriguez', email: 'elena@voicera.ai', role: 'Viewer', status: 'invited', department: 'Analytics' }
];

export default function Team() {
  const [members] = useState(mockTeam);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto h-full flex flex-col bg-[#fafafa]">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-[24px] font-manrope font-extrabold tracking-tight text-slate-900">Team Management</h1>
          <p className="text-slate-500 font-inter text-[13px] mt-1 font-medium">Manage who has access to your Voicera dashboard</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold font-inter h-[42px] px-6 rounded-xl shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:-translate-y-[1px] transition-all">
          <Plus className="mr-2 h-4 w-4" strokeWidth={3} />
          Invite Member
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0 overflow-y-auto pb-10">
        {/* Left Column: Team Members */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border border-slate-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] bg-white rounded-2xl overflow-hidden">
            <CardHeader className="pb-4 border-b border-slate-100 flex flex-row items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-indigo-600" strokeWidth={2.5} />
                </div>
                <CardTitle className="text-[16px] font-manrope font-bold text-slate-900">Active Members</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold border border-slate-200/50">
                {members.length} Members
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100/80">
                {members.map(member => (
                  <div key={member.id} className="p-5 flex items-center justify-between hover:bg-slate-50/80 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200/50 text-[15px] font-bold text-indigo-700 shadow-sm">
                          {member.name[0]}
                        </div>
                        {member.status === 'active' && (
                          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                        )}
                        {member.status === 'offline' && (
                          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-slate-300 border-2 border-white rounded-full shadow-sm" />
                        )}
                        {member.status === 'invited' && (
                          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full shadow-sm" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-[14px] text-slate-900 flex items-center gap-2 font-inter tracking-tight">
                          {member.name}
                          {member.role === 'Admin' && <Badge variant="outline" className="text-[9px] h-[18px] px-1.5 bg-indigo-50 text-indigo-700 border-indigo-200 font-bold tracking-wider">ADMIN</Badge>}
                        </div>
                        <div className="text-[12px] text-slate-500 font-medium flex items-center gap-3 mt-1 font-inter">
                          <span className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-slate-400" /> {member.email}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-5">
                      <div className="hidden sm:flex flex-col items-end mr-2">
                        <div className="text-[13px] font-bold text-slate-700 font-inter">{member.department}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Department</div>
                      </div>
                      
                      <Select defaultValue={member.role.toLowerCase()}>
                        <SelectTrigger className="w-[120px] h-9 text-[13px] font-semibold font-inter bg-white border-slate-200/60 rounded-xl focus:ring-indigo-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200 shadow-lg">
                          <SelectItem value="admin" className="font-inter text-[13px]">Admin</SelectItem>
                          <SelectItem value="specialist" className="font-inter text-[13px]">Specialist</SelectItem>
                          <SelectItem value="viewer" className="font-inter text-[13px]">Viewer</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Invite & Workload */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border border-slate-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] bg-white rounded-2xl">
            <CardHeader className="pb-4 border-b border-slate-100/50 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <User className="h-4 w-4 text-indigo-600" strokeWidth={2.5} />
                </div>
                <CardTitle className="text-[16px] font-manrope font-bold text-slate-900">Invite New Member</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block font-inter">Email Address</label>
                <Input placeholder="colleague@company.com" className="bg-slate-50/80 border-slate-200/60 font-medium font-inter rounded-xl h-10 text-[13px] focus-visible:bg-white" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block font-inter">Role</label>
                <Select defaultValue="specialist">
                  <SelectTrigger className="bg-slate-50/80 border-slate-200/60 font-medium font-inter rounded-xl h-10 text-[13px] focus-visible:bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 shadow-lg">
                    <SelectItem value="admin" className="font-inter text-[13px]">Admin (Full Access)</SelectItem>
                    <SelectItem value="specialist" className="font-inter text-[13px]">Specialist (Support Only)</SelectItem>
                    <SelectItem value="viewer" className="font-inter text-[13px]">Viewer (Read Only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold font-inter h-[42px] rounded-xl shadow-sm transition-colors mt-2">
                Send Invitation
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/60 shadow-sm bg-slate-50/50 rounded-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/60 flex items-center justify-center shadow-sm">
                    <Briefcase className="h-4 w-4 text-slate-600" strokeWidth={2.5} />
                  </div>
                  <CardTitle className="text-[16px] font-manrope font-bold text-slate-900">Agent Workload</CardTitle>
                </div>
                <Badge variant="outline" className="bg-white font-bold text-slate-600 text-[10px] px-2 py-0.5 border-slate-200 shadow-sm">This Week</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {[
                { name: 'Priya Sharma', tickets: 42, capacity: 85, color: 'bg-rose-500' },
                { name: 'Marcus Johnson', tickets: 28, capacity: 55, color: 'bg-amber-500' },
                { name: 'Alex Smith', tickets: 12, capacity: 25, color: 'bg-emerald-500' },
              ].map(agent => (
                <div key={agent.name} className="space-y-2.5">
                  <div className="flex justify-between items-center text-[13px] font-bold text-slate-900 font-inter">
                    <span>{agent.name}</span>
                    <span className="text-slate-500 font-medium">{agent.tickets} tickets</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200/60 rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
                    <div 
                      className={`h-full rounded-full ${agent.color}`} 
                      style={{ width: `${agent.capacity}%` }} 
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
