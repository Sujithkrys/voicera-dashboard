import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Plus, MoreHorizontal, Mail, Shield, User, Clock } from 'lucide-react';

const mockTeam = [
  { id: '1', name: 'Alex Smith', email: 'alex@voicera.ai', role: 'Admin', status: 'active', department: 'All' },
  { id: '2', name: 'Priya Sharma', email: 'priya@voicera.ai', role: 'Specialist', status: 'active', department: 'Technical' },
  { id: '3', name: 'Marcus Johnson', email: 'marcus@voicera.ai', role: 'Specialist', status: 'offline', department: 'Billing' },
  { id: '4', name: 'Elena Rodriguez', email: 'elena@voicera.ai', role: 'Viewer', status: 'invited', department: 'Analytics' }
];

export default function Team() {
  const [members] = useState(mockTeam);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage who has access to your Voicera dashboard</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
          <Plus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0 overflow-y-auto pb-10">
        {/* Left Column: Team Members */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-500" />
                <CardTitle className="text-lg">Active Members</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold">
                {members.length} Members
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {members.map(member => (
                  <div key={member.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-sm">
                          {member.name[0]}
                        </div>
                        {member.status === 'active' && (
                          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                        )}
                        {member.status === 'offline' && (
                          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-slate-300 border-2 border-white rounded-full" />
                        )}
                        {member.status === 'invited' && (
                          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                          {member.name}
                          {member.role === 'Admin' && <Badge variant="outline" className="text-[9px] h-4 px-1.5 bg-indigo-50 text-indigo-700 border-indigo-200">ADMIN</Badge>}
                        </div>
                        <div className="text-xs text-slate-500 font-medium flex items-center gap-3 mt-0.5">
                          <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {member.email}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:flex flex-col items-end mr-4">
                        <div className="text-xs font-semibold text-slate-700">{member.department}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Department</div>
                      </div>
                      
                      <Select defaultValue={member.role.toLowerCase()}>
                        <SelectTrigger className="w-[110px] h-8 text-xs font-semibold bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="specialist">Specialist</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity">
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
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-500" />
                <CardTitle className="text-lg">Invite New Member</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Email Address</label>
                <Input placeholder="colleague@company.com" className="bg-slate-50 font-medium" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Role</label>
                <Select defaultValue="specialist">
                  <SelectTrigger className="bg-slate-50 font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin (Full Access)</SelectItem>
                    <SelectItem value="specialist">Specialist (Support Only)</SelectItem>
                    <SelectItem value="viewer">Viewer (Read Only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                Send Invitation
              </Button>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm bg-slate-50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-indigo-500" />
                  <CardTitle className="text-lg">Agent Workload</CardTitle>
                </div>
                <Badge variant="outline" className="bg-white font-bold text-slate-600">This Week</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Priya Sharma', tickets: 42, capacity: 85, color: 'bg-rose-500' },
                { name: 'Marcus Johnson', tickets: 28, capacity: 55, color: 'bg-amber-500' },
                { name: 'Alex Smith', tickets: 12, capacity: 25, color: 'bg-emerald-500' },
              ].map(agent => (
                <div key={agent.name} className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-semibold text-slate-900">
                    <span>{agent.name}</span>
                    <span className="text-slate-500">{agent.tickets} tickets</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
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
