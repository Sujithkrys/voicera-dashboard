import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import SettingsModal from "../pages/Settings";
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
  Sparkles,
  History,
  Plus,
  PanelLeftClose,
  ChevronDown,
  LogOut,
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
  useSidebar,
} from "../components/ui/sidebar";
import { useChat } from "../context/ChatContext";

const navItem = (isActive: boolean) =>
  `h-8 rounded-md text-[13px] transition-colors ${
    isActive
      ? "bg-neutral-100 text-neutral-900 font-medium"
      : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 font-normal"
  }`;

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const { setActiveThreadId } = useChat();
  const location = useLocation();
  const [isAiChatOpen, setIsAiChatOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const isActive = (path: string) =>
    location.pathname === path ||
    (path === "/" && location.pathname === "/overview");

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("voicera_token");
    localStorage.removeItem("voicera_name");
    localStorage.removeItem("voicera_email");
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-neutral-200 bg-white">
      <SidebarHeader 
        className="px-4 py-4 border-b border-neutral-100 flex-row items-center justify-between group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 cursor-pointer"
        onClick={() => state === "collapsed" && toggleSidebar()}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-neutral-900 text-white shrink-0">
            <Activity className="size-3.5" strokeWidth={2} />
          </div>
          <span className="font-semibold text-[15px] text-neutral-900 group-data-[collapsible=icon]:hidden">
            Voicera
          </span>
          <svg className="ml-1 w-3 h-3 text-neutral-400 group-data-[collapsible=icon]:hidden" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="group-data-[collapsible=icon]:hidden">
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 group-data-[collapsible=icon]:px-0 py-3 gap-5">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/")} className={navItem(isActive("/"))}>
                  <Link to="/">
                    <Home className="size-4" strokeWidth={1.8} />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/call-logs")} className={navItem(isActive("/call-logs"))}>
                  <Link to="/call-logs">
                    <PhoneCall className="size-4" strokeWidth={1.8} />
                    <span>Call Logs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/tickets")} className={navItem(isActive("/tickets"))}>
                  <Link to="/tickets">
                    <Ticket className="size-4" strokeWidth={1.8} />
                    <span>Tickets</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/scheduled-calls")} className={navItem(isActive("/scheduled-calls"))}>
                  <Link to="/scheduled-calls">
                    <Calendar className="size-4" strokeWidth={1.8} />
                    <span>Scheduled Calls</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setIsAiChatOpen(!isAiChatOpen)}
                  className={`cursor-pointer ${navItem(false)} group-data-[collapsible=icon]:!justify-center`}
                >
                  <Sparkles className="size-4" strokeWidth={1.8} />
                  <span className="group-data-[collapsible=icon]:hidden">AI Chat</span>
                  <ChevronDown className={`size-3.5 transition-transform opacity-70 ml-auto group-data-[collapsible=icon]:hidden ${isAiChatOpen ? "rotate-180" : ""}`} />
                </SidebarMenuButton>
              </SidebarMenuItem>
              {isAiChatOpen && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/ai-chat")} className={`${navItem(isActive("/ai-chat"))} pl-8`}>
                      <Link to="/ai-chat" onClick={() => setActiveThreadId(null)}>
                        <Plus className="size-3.5" strokeWidth={1.8} />
                        <span>New Chat</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/ai-chat/history")} className={`${navItem(isActive("/ai-chat/history"))} pl-8`}>
                      <Link to="/ai-chat/history">
                        <History className="size-3.5" strokeWidth={1.8} />
                        <span>History</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-2.5 text-[11px] font-medium uppercase tracking-wider text-neutral-400 mb-1">
            Configuration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/knowledge-base")} className={navItem(isActive("/knowledge-base"))}>
                  <Link to="/knowledge-base">
                    <BookOpen className="size-4" strokeWidth={1.8} />
                    <span>Knowledge Base</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/bot-config")} className={navItem(isActive("/bot-config"))}>
                  <Link to="/bot-config">
                    <Bot className="size-4" strokeWidth={1.8} />
                    <span>Bot Config</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/team")} className={navItem(isActive("/team"))}>
                  <Link to="/team">
                    <Users className="size-4" strokeWidth={1.8} />
                    <span>Team</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/settings/integrations")} className={navItem(isActive("/settings/integrations"))}>
                  <Link to="/settings/integrations">
                    <Sparkles className="size-4" strokeWidth={1.8} />
                    <span>Integrations</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setIsSettingsOpen(true)}
                  className={`cursor-pointer ${navItem(false)} group-data-[collapsible=icon]:!justify-center`}
                >
                  <Settings className="size-4" strokeWidth={1.8} />
                  <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-neutral-100 p-3 group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-2.5 p-2 rounded-md hover:bg-neutral-50 transition-colors group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center">
          <div className="size-7 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center font-medium text-xs shrink-0 cursor-pointer">
            {localStorage.getItem("voicera_name")?.[0]?.toUpperCase() || "U"}
          </div>
          <span className="text-[13px] font-medium text-neutral-700 truncate group-data-[collapsible=icon]:hidden flex-1 cursor-pointer">
            {localStorage.getItem("voicera_name") || "User"}
          </span>
          <button 
            onClick={handleLogout} 
            className="text-neutral-400 hover:text-red-500 transition-colors group-data-[collapsible=icon]:hidden p-1.5 rounded-md hover:bg-red-50 ml-auto" 
            title="Logout"
          >
            <LogOut className="size-4" strokeWidth={1.8} />
          </button>
        </div>
      </SidebarFooter>
      <SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </Sidebar>
  );
}

function SidebarTrigger() {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      onClick={toggleSidebar}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
      title="Close Sidebar"
    >
      <PanelLeftClose className="size-4.5" strokeWidth={1.8} />
    </button>
  );
}

function MainContent() {
  return (
    <main className="flex-1 overflow-auto bg-white relative flex flex-col min-w-0">
      <Outlet />
    </main>
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
    <SidebarProvider style={{ "--sidebar-width": "220px" } as React.CSSProperties}>
      <div className="flex min-h-screen w-full bg-white relative">
        <AppSidebar />
        <MainContent />
      </div>
    </SidebarProvider>
  );
}
