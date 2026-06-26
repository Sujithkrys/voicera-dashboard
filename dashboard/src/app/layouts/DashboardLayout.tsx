import React, { useEffect } from "react";
import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import {
  Home,
  PhoneCall,
  Ticket,
  Calendar,
  BookOpen,
  Bot,
  Users,
  Settings,
  Activity,
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "../components/ui/sidebar";

export function AppSidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path || (path === '/' && location.pathname === '/overview');

  return (
    <Sidebar className="border-r border-slate-200 bg-white shadow-[2px_0_12px_rgba(0,0,0,0.02)]">
      <SidebarHeader className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-[12px] bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/20">
            <Activity className="size-[18px]" strokeWidth={2.5} />
          </div>
          <span className="font-manrope font-bold text-[18px] text-slate-900 tracking-tight">Voicera</span>
          <span className="ml-auto text-[9px] font-bold uppercase tracking-widest bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md border border-indigo-100">BETA</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4 py-4 gap-6">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/')} className={`h-10 rounded-xl transition-all duration-200 ${isActive('/') ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                  <Link to="/" className="flex items-center gap-3 px-3">
                    <Home className="size-[18px]" strokeWidth={isActive('/') ? 2.5 : 2} />
                    <span className="text-[14px]">Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/call-logs')} className={`h-10 rounded-xl transition-all duration-200 ${isActive('/call-logs') ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                  <Link to="/call-logs" className="flex items-center gap-3 px-3">
                    <PhoneCall className="size-[18px]" strokeWidth={isActive('/call-logs') ? 2.5 : 2} />
                    <span className="text-[14px]">Call Logs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/tickets')} className={`h-10 rounded-xl transition-all duration-200 ${isActive('/tickets') ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                  <Link to="/tickets" className="flex items-center gap-3 px-3">
                    <Ticket className="size-[18px]" strokeWidth={isActive('/tickets') ? 2.5 : 2} />
                    <span className="text-[14px]">Tickets</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/scheduled-calls')} className={`h-10 rounded-xl transition-all duration-200 ${isActive('/scheduled-calls') ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                  <Link to="/scheduled-calls" className="flex items-center gap-3 px-3">
                    <Calendar className="size-[18px]" strokeWidth={isActive('/scheduled-calls') ? 2.5 : 2} />
                    <span className="text-[14px]">Scheduled Calls</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/knowledge-base')} className={`h-10 rounded-xl transition-all duration-200 ${isActive('/knowledge-base') ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                  <Link to="/knowledge-base" className="flex items-center gap-3 px-3">
                    <BookOpen className="size-[18px]" strokeWidth={isActive('/knowledge-base') ? 2.5 : 2} />
                    <span className="text-[14px]">Knowledge Base</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/bot-config')} className={`h-10 rounded-xl transition-all duration-200 ${isActive('/bot-config') ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                  <Link to="/bot-config" className="flex items-center gap-3 px-3">
                    <Bot className="size-[18px]" strokeWidth={isActive('/bot-config') ? 2.5 : 2} />
                    <span className="text-[14px]">Bot Config</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/team')} className={`h-10 rounded-xl transition-all duration-200 ${isActive('/team') ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                  <Link to="/team" className="flex items-center gap-3 px-3">
                    <Users className="size-[18px]" strokeWidth={isActive('/team') ? 2.5 : 2} />
                    <span className="text-[14px]">Team</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/settings')} className={`h-10 rounded-xl transition-all duration-200 ${isActive('/settings') ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                  <Link to="/settings" className="flex items-center gap-3 px-3">
                    <Settings className="size-[18px]" strokeWidth={isActive('/settings') ? 2.5 : 2} />
                    <span className="text-[14px]">Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-slate-100 p-4 bg-white/50">
        <div className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-xl cursor-pointer transition-colors">
          <div className="size-9 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100">
            {localStorage.getItem('voicera_name')?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="font-semibold text-[13px] text-slate-900 truncate tracking-tight">{localStorage.getItem('voicera_name') || 'User'}</div>
            <div className="text-[11px] text-slate-500 font-medium truncate">{localStorage.getItem('voicera_email') || 'user@example.com'}</div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function DashboardLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('voicera_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#fafafa]">
        <AppSidebar />
        <main className="flex-1 overflow-auto bg-[#fafafa]">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
