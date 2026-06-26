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
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
            <Activity className="size-4" />
          </div>
          <span className="font-semibold text-base">Voicera</span>
          <span className="ml-2 text-[10px] font-semibold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">BETA</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/')}>
                  <Link to="/">
                    <Home className="size-4" />
                    <span>Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/call-logs')}>
                  <Link to="/call-logs">
                    <PhoneCall className="size-4" />
                    <span>Call Logs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/tickets')}>
                  <Link to="/tickets">
                    <Ticket className="size-4" />
                    <span>Tickets</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/scheduled-calls')}>
                  <Link to="/scheduled-calls">
                    <Calendar className="size-4" />
                    <span>Scheduled Calls</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/knowledge-base')}>
                  <Link to="/knowledge-base">
                    <BookOpen className="size-4" />
                    <span>Knowledge Base</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/bot-config')}>
                  <Link to="/bot-config">
                    <Bot className="size-4" />
                    <span>Bot Config</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/team')}>
                  <Link to="/team">
                    <Users className="size-4" />
                    <span>Team</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/settings')}>
                  <Link to="/settings">
                    <Settings className="size-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
            {localStorage.getItem('voicera_name')?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="font-medium text-sm truncate">{localStorage.getItem('voicera_name') || 'User'}</div>
            <div className="text-xs text-muted-foreground truncate">{localStorage.getItem('voicera_email') || 'user@example.com'}</div>
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
