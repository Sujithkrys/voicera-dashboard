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
  Search,
  Bell,
  ChevronDown
} from "lucide-react";

export function AppSidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path || (path === '/' && location.pathname === '/overview');

  const navItemsMain = [
    { name: 'Overview', path: '/', icon: Home },
    { name: 'Call Logs', path: '/call-logs', icon: PhoneCall },
    { name: 'Tickets', path: '/tickets', icon: Ticket, badge: '12' },
    { name: 'Scheduled', path: '/scheduled-calls', icon: Calendar },
  ];

  const navItemsConfig = [
    { name: 'Knowledge Base', path: '/knowledge-base', icon: BookOpen },
    { name: 'Bot Config', path: '/bot-config', icon: Bot },
    { name: 'Team', path: '/team', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <nav className="w-[216px] min-w-[216px] h-screen bg-surface-bright-blur backdrop-blur-3xl flex flex-col overflow-y-auto overflow-x-hidden relative z-10 after:content-[''] after:absolute after:right-0 after:top-0 after:bottom-0 after:w-[1px] after:bg-ghost scrollbar-none">
      
      {/* Logo */}
      <div className="flex items-center gap-3 px-[18px] pt-[20px] pb-[12px] mb-0.5">
        <div className="w-8 h-8 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_15px_rgba(189,157,255,0.4)]">
            <rect width="40" height="40" rx="12" fill="url(#paint0_linear)"/>
            <path d="M12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20V28H12V20Z" fill="white"/>
            <circle cx="20" cy="20" r="3" fill="#8a4cfc"/>
            <defs>
              <linearGradient id="paint0_linear" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8a4cfc"/>
                <stop offset="1" stopColor="#bd9dff"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <div className="flex items-center">
            <span className="font-manrope text-base font-extrabold text-on-surface tracking-tight">Voicera</span>
            <span className="font-inter text-[9px] font-semibold bg-primary-glow-sm text-primary px-1.5 py-0.5 rounded-md ml-1">BETA</span>
          </div>
          <div className="text-[10px] text-on-surface-low mt-[1px] font-inter">Admin Dashboard</div>
        </div>
      </div>

      {/* Workspace */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 mx-3 mb-2 bg-surface-highest rounded-xl cursor-pointer hover:bg-surface-bright transition-colors">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
          AC
        </div>
        <div className="text-xs font-semibold flex-1 text-on-surface">Acme Corp</div>
        <ChevronDown className="w-3 h-3 text-on-surface-low" />
      </div>

      {/* Main Nav */}
      <div className="text-[9px] font-bold text-on-surface-low uppercase tracking-[0.9px] px-[18px] pt-3 pb-1.5">Main</div>
      {navItemsMain.map(item => (
        <Link 
          key={item.path}
          to={item.path}
          className={`flex items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium cursor-pointer transition-all relative select-none mx-1.5 rounded-xl ${isActive(item.path) ? 'bg-primary-glow-sm text-primary font-semibold' : 'text-on-surface-med hover:bg-surface-hi hover:text-on-surface'}`}
        >
          {isActive(item.path) && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-primary-dim to-primary rounded-r-[3px] shadow-[0_0_10px_var(--color-primary-glow)]" />
          )}
          <item.icon className={`w-[15px] h-[15px] shrink-0 ${isActive(item.path) ? 'opacity-100' : 'opacity-70'}`} />
          {item.name}
          {item.badge && (
            <span className="ml-auto text-[10px] font-bold bg-red-bg text-red px-1.5 py-0.5 rounded-lg">
              {item.badge}
            </span>
          )}
        </Link>
      ))}

      <div className="h-[1px] bg-ghost-med mx-[18px] my-2.5" />

      {/* Config Nav */}
      <div className="text-[9px] font-bold text-on-surface-low uppercase tracking-[0.9px] px-[18px] pt-3 pb-1.5">Configuration</div>
      {navItemsConfig.map(item => (
        <Link 
          key={item.path}
          to={item.path}
          className={`flex items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium cursor-pointer transition-all relative select-none mx-1.5 rounded-xl ${isActive(item.path) ? 'bg-primary-glow-sm text-primary font-semibold' : 'text-on-surface-med hover:bg-surface-hi hover:text-on-surface'}`}
        >
          {isActive(item.path) && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-primary-dim to-primary rounded-r-[3px] shadow-[0_0_10px_var(--color-primary-glow)]" />
          )}
          <item.icon className={`w-[15px] h-[15px] shrink-0 ${isActive(item.path) ? 'opacity-100' : 'opacity-70'}`} />
          {item.name}
        </Link>
      ))}

      {/* Bottom Profile */}
      <div className="mt-auto p-3.5 pb-4">
        <div className="bg-white/5 border border-ghost-med rounded-xl p-3 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-on-surface-low uppercase tracking-[0.5px]">Credits</span>
            <span className="text-[11px] font-bold text-primary">1,240 / 2,000</span>
          </div>
          <div className="h-1.5 bg-surface-lo rounded-full overflow-hidden relative">
            <div className="h-full bg-gradient-to-r from-primary-dim to-primary rounded-full w-[62%] shadow-[0_0_10px_var(--color-primary-glow)]" />
          </div>
        </div>
        
        <button className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 bg-gradient-to-r from-primary-dim to-primary border-none rounded-xl text-white font-inter text-xs font-bold cursor-pointer transition-all shadow-[0_4px_20px_var(--color-primary-glow)] hover:shadow-[0_6px_28px_var(--color-primary-glow)] hover:-translate-y-[1px] mb-4">
          Upgrade to Pro
        </button>

        <div className="flex items-center gap-2.5 mt-4 p-2.5 rounded-xl bg-white/5 border border-ghost-med cursor-pointer transition-colors hover:bg-white/10">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-dim to-primary rounded-lg flex items-center justify-center font-manrope font-extrabold text-xs text-white">
            {localStorage.getItem('voicera_name')?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 overflow-hidden text-left">
            <div className="text-[13px] font-semibold text-on-surface truncate">{localStorage.getItem('voicera_name') || 'User'}</div>
            <div className="text-[11px] text-on-surface-low truncate">{localStorage.getItem('voicera_email') || 'user@example.com'}</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-on-surface-low" />
        </div>
      </div>
    </nav>
  );
}

export function Topbar() {
  const location = useLocation();
  const getPageTitle = () => {
    switch(location.pathname) {
      case '/': return 'Overview';
      case '/overview': return 'Overview';
      case '/call-logs': return 'Call Logs';
      case '/tickets': return 'Tickets';
      case '/scheduled-calls': return 'Scheduled Calls';
      case '/knowledge-base': return 'Knowledge Base';
      case '/bot-config': return 'Bot Config';
      case '/team': return 'Team';
      case '/settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="h-[58px] min-h-[58px] flex items-center gap-3.5 px-7 bg-surface-bright-blur backdrop-blur-3xl relative z-[9] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-ghost">
      <div className="font-manrope text-lg font-extrabold tracking-tight shrink-0 text-on-surface">
        {getPageTitle()}
      </div>

      <div className="flex items-center gap-2 bg-surface-hi rounded-xl px-3.5 h-9 w-[270px] ml-auto cursor-pointer outline outline-1 outline-ghost-med transition-colors hover:outline-ghost">
        <Search className="w-3.5 h-3.5 text-on-surface-low" />
        <span className="text-[13px] text-on-surface-low flex-1">Search anything...</span>
        <kbd className="text-[10px] text-on-surface-low bg-surface-highest px-1.5 py-0.5 rounded font-inter">⌘K</kbd>
      </div>

      <div className="flex items-center gap-0.5">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-med cursor-pointer transition-colors relative hover:bg-surface-hi hover:text-on-surface">
          <Bell className="w-4 h-4" />
          <div className="absolute top-[7px] right-[7px] w-1.5 h-1.5 bg-red rounded-full shadow-[0_0_6px_var(--color-red)]" />
        </div>
      </div>
    </div>
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
    <div className="flex h-screen w-full bg-bg text-on-surface font-inter overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />
        <main className="flex-1 flex flex-col overflow-y-auto px-7 py-6 bg-bg scrollbar-thin scrollbar-thumb-surface-highest scrollbar-track-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
