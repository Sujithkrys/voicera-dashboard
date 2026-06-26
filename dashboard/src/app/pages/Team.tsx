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
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col pb-10">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0 mb-2">
        <div>
          <h1 className="font-manrope text-[24px] font-extrabold tracking-[-0.5px] text-on-surface">Team Management</h1>
          <p className="font-inter text-[13px] text-on-surface-med mt-1">Manage who has access to your Voicera dashboard</p>
        </div>
        <Button className="bg-gradient-to-r from-primary-dim to-primary hover:-translate-y-[1px] transition-transform text-white font-inter font-bold text-[13px] rounded-xl shadow-[0_4px_18px_var(--color-primary-glow)] border-none px-5 py-2.5 h-auto">
          <Plus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-surface-highest scrollbar-track-transparent pr-1">
        {/* Left Column: Team Members */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface rounded-[1.5rem] shadow-[0_0_40px_rgba(6,14,32,0.5)] border-none relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-dim to-primary opacity-0 transition-opacity" />
            <div className="p-[20px_24px] border-b border-ghost-med flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[10px] bg-primary-glow-sm flex items-center justify-center text-primary">
                  <Shield className="h-4 w-4" />
                </div>
                <h2 className="font-manrope font-extrabold text-[16px] text-on-surface">Active Members</h2>
              </div>
              <Badge variant="secondary" className="bg-surface-highest text-on-surface-med font-inter font-bold text-[11px] px-2.5 py-1 hover:bg-surface-highest border-none">
                {members.length} Members
              </Badge>
            </div>
            
            <div className="p-0">
              <div className="divide-y divide-ghost-med">
                {members.map(member => (
                  <div key={member.id} className="p-[18px_24px] flex items-center justify-between hover:bg-surface-hi transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="relative shrink-0">
                        <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[12px] bg-gradient-to-br from-primary-dim to-primary font-manrope text-[15px] font-extrabold text-white shadow-[0_4px_12px_var(--color-primary-glow)]">
                          {member.name[0]}
                        </div>
                        {member.status === 'active' && (
                          <div className="absolute -bottom-[2px] -right-[2px] w-[14px] h-[14px] bg-tertiary border-2 border-surface rounded-full shadow-[0_0_8px_var(--color-tertiary)]" />
                        )}
                        {member.status === 'offline' && (
                          <div className="absolute -bottom-[2px] -right-[2px] w-[14px] h-[14px] bg-on-surface-low border-2 border-surface rounded-full" />
                        )}
                        {member.status === 'invited' && (
                          <div className="absolute -bottom-[2px] -right-[2px] w-[14px] h-[14px] bg-amber border-2 border-surface rounded-full shadow-[0_0_8px_var(--color-amber)]" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-[14px] text-on-surface flex items-center gap-2.5 font-inter mb-0.5">
                          {member.name}
                          {member.role === 'Admin' && <Badge variant="outline" className="text-[9px] h-[18px] px-1.5 bg-primary-glow-sm text-primary border-none font-bold uppercase tracking-[0.5px]">ADMIN</Badge>}
                        </div>
                        <div className="text-[12px] text-on-surface-low font-medium flex items-center gap-2 font-inter">
                          <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> {member.email}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-5">
                      <div className="hidden sm:flex flex-col items-end">
                        <div className="text-[13px] font-semibold text-on-surface font-inter">{member.department}</div>
                        <div className="font-inter text-[9px] text-on-surface-low font-bold uppercase tracking-[0.8px] mt-0.5">Department</div>
                      </div>
                      
                      <Select defaultValue={member.role.toLowerCase()}>
                        <SelectTrigger className="w-[120px] h-[36px] text-[12px] font-bold bg-surface-highest border-transparent text-on-surface focus:ring-0 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-surface-hi border-ghost-med text-on-surface">
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="specialist">Specialist</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button variant="ghost" size="icon" className="h-[34px] w-[34px] rounded-xl text-on-surface-low hover:text-on-surface hover:bg-surface-highest opacity-0 group-hover:opacity-100 transition-all">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Invite & Workload */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface rounded-[1.5rem] shadow-[0_0_40px_rgba(6,14,32,0.5)] border-none relative overflow-hidden">
            <div className="p-[20px_24px] border-b border-ghost-med flex items-center gap-3">
              <div className="w-8 h-8 rounded-[10px] bg-primary-glow-sm flex items-center justify-center text-primary">
                <User className="h-4 w-4" />
              </div>
              <h2 className="font-manrope font-extrabold text-[16px] text-on-surface">Invite New Member</h2>
            </div>
            
            <div className="p-[24px] space-y-5">
              <div>
                <label className="font-inter text-[10px] font-bold text-on-surface-low uppercase tracking-[0.6px] mb-2.5 block">Email Address</label>
                <Input placeholder="colleague@company.com" className="bg-surface-hi border-transparent focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary text-on-surface font-inter text-[13px] rounded-xl h-[42px] px-4 placeholder:text-on-surface-low" />
              </div>
              <div>
                <label className="font-inter text-[10px] font-bold text-on-surface-low uppercase tracking-[0.6px] mb-2.5 block">Role</label>
                <Select defaultValue="specialist">
                  <SelectTrigger className="bg-surface-hi border-transparent text-on-surface font-inter text-[13px] rounded-xl h-[42px] px-4 focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-surface-highest border-ghost-med text-on-surface font-inter text-[13px]">
                    <SelectItem value="admin">Admin (Full Access)</SelectItem>
                    <SelectItem value="specialist">Specialist (Support Only)</SelectItem>
                    <SelectItem value="viewer">Viewer (Read Only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-gradient-to-r from-primary-dim to-primary hover:-translate-y-[1px] transition-transform text-white font-inter font-bold text-[13px] rounded-xl shadow-[0_4px_18px_var(--color-primary-glow)] border-none h-[42px] mt-2">
                Send Invitation
              </Button>
            </div>
          </div>

          <div className="bg-surface-hi rounded-[1.5rem] shadow-[0_0_40px_rgba(6,14,32,0.5)] border border-ghost relative overflow-hidden">
            <div className="p-[20px_24px] border-b border-ghost-med flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[10px] bg-primary-glow-sm flex items-center justify-center text-primary">
                  <Clock className="h-4 w-4" />
                </div>
                <h2 className="font-manrope font-extrabold text-[16px] text-on-surface">Agent Workload</h2>
              </div>
              <Badge variant="outline" className="bg-surface-highest font-inter font-bold text-on-surface-med text-[10px] px-2 py-0.5 border-none">This Week</Badge>
            </div>
            
            <div className="p-[24px] space-y-6">
              {[
                { name: 'Priya Sharma', tickets: 42, capacity: 85, color: 'bg-red shadow-[0_0_12px_var(--color-red)]' },
                { name: 'Marcus Johnson', tickets: 28, capacity: 55, color: 'bg-amber shadow-[0_0_12px_var(--color-amber)]' },
                { name: 'Alex Smith', tickets: 12, capacity: 25, color: 'bg-tertiary shadow-[0_0_12px_var(--color-tertiary)]' },
              ].map(agent => (
                <div key={agent.name} className="space-y-2.5">
                  <div className="flex justify-between items-center font-inter text-[13px] font-semibold text-on-surface">
                    <span>{agent.name}</span>
                    <span className="text-on-surface-med text-[12px]">{agent.tickets} tickets</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-highest rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${agent.color}`} 
                      style={{ width: `${agent.capacity}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
