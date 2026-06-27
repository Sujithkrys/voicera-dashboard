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
  Bell,
  Inbox,
  BarChart3,
  FileText,
  Search,
  Zap,
} from "lucide-react";
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

const navItemCls = (isActive: boolean) =>
  `h-[34px] rounded-lg text-[13px] transition-colors ${
    isActive
      ? "bg-[#f3f3f3] text-neutral-900 font-medium"
      : "text-neutral-500 hover:text-neutral-800 hover:bg-[#f8f8f8] font-normal"
  }`;

export function AppSidebar() {
  const location = useLocation();
  const isActive = (path: string) =>
    location.pathname === path ||
    (path === "/" && location.pathname === "/overview");

  return (
    <Sidebar className="border-r border-[#f0f0f0] bg-white w-[220px]">
      {/* Logo / Brand */}
      <SidebarHeader className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-neutral-900 text-white">
            <Activity className="size-3.5" strokeWidth={2} />
          </div>
          <span className="font-semibold text-[15px] text-neutral-900">
            Voicera
          </span>
          <svg className="ml-0.5 w-3 h-3 text-neutral-400" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Quick Actions pill */}
        <button className="mt-3 w-full flex items-center gap-2 h-[32px] px-3 border border-[#e8e8e8] rounded-lg bg-white hover:bg-[#fafafa] transition-colors">
          <Search className="size-3.5 text-neutral-400" strokeWidth={1.8} />
          <span className="text-[13px] text-neutral-500 font-normal flex-1 text-left">Quick Actions</span>
          <kbd className="text-[10px] text-neutral-400 bg-[#f3f3f3] px-1.5 py-0.5 rounded font-mono">/</kbd>
        </button>
      </SidebarHeader>

      <SidebarContent className="px-3 py-2 gap-0">
        {/* Main nav group */}
        <SidebarGroup className="mb-1">
          <SidebarGroupContent>
            <SidebarMenu className="gap-[2px]">
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/")} className={navItemCls(isActive("/"))}>
                  <Link to="/" className="flex items-center gap-2.5 px-2.5">
                    <Home className="size-[15px]" strokeWidth={1.8} />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/call-logs")} className={navItemCls(isActive("/call-logs"))}>
                  <Link to="/call-logs" className="flex items-center gap-2.5 px-2.5">
                    <PhoneCall className="size-[15px]" strokeWidth={1.8} />
                    <span>Call Logs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/tickets")} className={navItemCls(isActive("/tickets"))}>
                  <Link to="/tickets" className="flex items-center gap-2.5 px-2.5">
                    <Ticket className="size-[15px]" strokeWidth={1.8} />
                    <span>Tickets</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/scheduled-calls")} className={navItemCls(isActive("/scheduled-calls"))}>
                  <Link to="/scheduled-calls" className="flex items-center gap-2.5 px-2.5">
                    <Calendar className="size-[15px]" strokeWidth={1.8} />
                    <span>Scheduled Calls</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Configuration group */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2.5 text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-400 mb-1 mt-3">
            Configuration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-[2px]">
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/knowledge-base")} className={navItemCls(isActive("/knowledge-base"))}>
                  <Link to="/knowledge-base" className="flex items-center gap-2.5 px-2.5">
                    <BookOpen className="size-[15px]" strokeWidth={1.8} />
                    <span>Knowledge Base</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/bot-config")} className={navItemCls(isActive("/bot-config"))}>
                  <Link to="/bot-config" className="flex items-center gap-2.5 px-2.5">
                    <Bot className="size-[15px]" strokeWidth={1.8} />
                    <span>Bot Config</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/team")} className={navItemCls(isActive("/team"))}>
                  <Link to="/team" className="flex items-center gap-2.5 px-2.5">
                    <Users className="size-[15px]" strokeWidth={1.8} />
                    <span>Team</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/settings")} className={navItemCls(isActive("/settings"))}>
                  <Link to="/settings" className="flex items-center gap-2.5 px-2.5">
                    <Settings className="size-[15px]" strokeWidth={1.8} />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-[#f0f0f0] p-3">
        <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#f8f8f8] cursor-pointer transition-colors">
          <div className="size-7 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center font-medium text-xs">
            {localStorage.getItem("voicera_name")?.[0]?.toUpperCase() || "U"}
          </div>
          <span className="text-[13px] font-normal text-neutral-700 truncate">
            {localStorage.getItem("voicera_name") || "User"}
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function DashboardLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("voicera_token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-white">
        <AppSidebar />
        <main className="flex-1 overflow-auto bg-white">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
