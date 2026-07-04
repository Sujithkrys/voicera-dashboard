import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Plus, MoreHorizontal, Mail } from "lucide-react";

const mockTeam = [
  { id: "1", name: "Alex Smith", email: "alex@voicera.ai", role: "Admin", status: "active", department: "All", tickets: 12 },
  { id: "2", name: "Priya Sharma", email: "priya@voicera.ai", role: "Specialist", status: "active", department: "Technical", tickets: 42 },
  { id: "3", name: "Marcus Johnson", email: "marcus@voicera.ai", role: "Specialist", status: "offline", department: "Billing", tickets: 28 },
  { id: "4", name: "Elena Rodriguez", email: "elena@voicera.ai", role: "Viewer", status: "invited", department: "Analytics", tickets: 0 },
];

export default function Team() {
  const [members] = useState(mockTeam);

  return (
    <div className="p-6 space-y-5 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-[18px] font-semibold text-foreground">Team</h1>
        <Button className="bg-primary text-primary-foreground hover:bg-primary h-8 text-[13px] font-medium rounded-md">
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Invite Member
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Members table */}
        <div className="col-span-8">
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Member</th>
                  <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Department</th>
                  <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                  <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-b border-neutral-50 last:border-0 hover:bg-muted transition-colors group">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[12px] font-medium text-muted-foreground">
                            {member.name[0]}
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                            member.status === "active" ? "bg-emerald-500" : member.status === "offline" ? "bg-neutral-300" : "bg-amber-400"
                          }`} />
                        </div>
                        <div>
                          <div className="text-[13px] font-medium text-foreground">{member.name}</div>
                          <div className="text-[11px] text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[13px] text-muted-foreground">{member.department}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                        member.role === "Admin" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                        member.status === "active" ? "bg-emerald-50 text-emerald-700" : member.status === "offline" ? "bg-secondary text-muted-foreground" : "bg-amber-50 text-amber-700"
                      }`}>
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="p-1 rounded hover:bg-secondary text-muted-foreground opacity-0 group-hover:opacity-100 transition-all">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="col-span-4 space-y-5">
          {/* Invite */}
          <div className="border border-border rounded-lg p-5">
            <h2 className="text-[14px] font-semibold text-foreground mb-4">Invite New Member</h2>
            <div className="space-y-3">
              <div>
                <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Email</label>
                <Input placeholder="colleague@company.com" className="h-9 text-[13px] border-border rounded-md" />
              </div>
              <div>
                <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Role</label>
                <Select defaultValue="specialist">
                  <SelectTrigger className="h-9 text-[13px] border-border rounded-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-md">
                    <SelectItem value="admin" className="text-[13px]">Admin</SelectItem>
                    <SelectItem value="specialist" className="text-[13px]">Specialist</SelectItem>
                    <SelectItem value="viewer" className="text-[13px]">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary h-9 text-[13px] font-medium rounded-md mt-1">
                Send Invitation
              </Button>
            </div>
          </div>

          {/* Workload */}
          <div className="border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[14px] font-semibold text-foreground">Workload</h2>
              <span className="text-[11px] text-muted-foreground">This week</span>
            </div>
            <div className="space-y-4">
              {members.filter(m => m.tickets > 0).map((agent) => (
                <div key={agent.name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[13px] text-foreground">{agent.name}</span>
                    <span className="text-[12px] text-muted-foreground">{agent.tickets}</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-neutral-400 rounded-full"
                      style={{ width: `${Math.min((agent.tickets / 50) * 100, 100)}%` }}
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
