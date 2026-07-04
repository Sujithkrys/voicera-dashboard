import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  PhoneCall,
  Ticket,
  Calendar,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  Settings,
  MoreHorizontal,
  Activity,
  BookOpen,
  Bot,
  Users,
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, ResponsiveContainer } from "recharts";

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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from "./components/ui/sidebar";
import { Card, CardContent, CardHeader } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { Checkbox } from "./components/ui/checkbox";
import { Badge } from "./components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./components/ui/pagination";
import { StemChart } from "./components/StemChart";

// Mock data
const recentCalls = [
  {
    id: "1",
    name: "Priya Sharma",
    email: "priya@example.com",
    issue: "Technical Issue",
    channel: "Voice",
    duration: "3m 12s",
    status: "resolved",
    date: "Apr 21, 10:32 AM",
    ticket: "TKT-A8F2X"
  },
  {
    id: "2",
    name: "Marco Diaz",
    email: "marco.d@startup.io",
    issue: "Billing",
    channel: "Chat",
    duration: "1m 48s",
    status: "escalated",
    date: "Apr 21, 10:15 AM",
    ticket: "TKT-B912Q"
  },
  {
    id: "3",
    name: "Sarah Jenkins",
    email: "s.jenkins@corp.net",
    issue: "Account Access",
    channel: "Voice",
    duration: "4m 05s",
    status: "resolved",
    date: "Apr 21, 09:42 AM",
    ticket: "TKT-C732M"
  },
  {
    id: "4",
    name: "David Chen",
    email: "dchen@techco.com",
    issue: "Feature Help",
    channel: "Chat",
    duration: "2m 15s",
    status: "in-progress",
    date: "Apr 21, 09:15 AM",
    ticket: "TKT-D452P"
  },
  {
    id: "5",
    name: "Emma Watson",
    email: "emma@design.co",
    issue: "Technical Issue",
    channel: "Voice",
    duration: "5m 22s",
    status: "resolved",
    date: "Apr 21, 08:30 AM",
    ticket: "TKT-E112S"
  }
];

const metrics = [
  {
    label: "Call Minutes",
    value: "4,821",
    subtitle: "12% vs last mo",
    chartType: "line" as const,
    chartData: [
      { value: 20 },
      { value: 35 },
      { value: 30 },
      { value: 45 },
      { value: 40 },
      { value: 55 },
      { value: 50 },
      { value: 60 },
      { value: 58 },
      { value: 70 },
    ],
  },
  {
    label: "Resolutions",
    value: "92%",
    subtitle: "4% optimized",
    chartType: "line" as const,
    chartData: [
      { value: 20 },
      { value: 32 },
      { value: 28 },
      { value: 42 },
      { value: 38 },
      { value: 50 },
      { value: 48 },
      { value: 58 },
      { value: 55 },
      { value: 65 },
    ],
  },
  {
    label: "Active Sessions",
    value: "14",
    subtitle: "11 Voice · 3 Chat",
    chartType: "stem" as const,
    chartData: Array.from({ length: 60 }, () => ({
      value: Math.floor(Math.random() * 40) + 20
    })),
  },
  {
    label: "Escalations",
    value: "2.4%",
    subtitle: "Within threshold",
    chartType: "stem" as const,
    chartData: Array.from({ length: 60 }, () => ({
      value: Math.floor(Math.random() * 15) + 5
    })),
  }
];

function AppSidebar() {
  const [contactsOpen, setContactsOpen] = useState(true);
  const [teamOpen, setTeamOpen] = useState(false);

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-primary-foreground shadow-lg shadow-indigo-500/20">
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
                <SidebarMenuButton isActive className="w-full">
                  <Home className="size-4" />
                  <span>Overview</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full">
                  <PhoneCall className="size-4" />
                  <span>Call Logs</span>
                  <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700 hover:bg-green-100 border-0 h-5 px-1.5 text-[10px]">24</Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full">
                  <Ticket className="size-4" />
                  <span>Tickets</span>
                  <Badge variant="secondary" className="ml-auto bg-red-100 text-red-700 hover:bg-red-100 border-0 h-5 px-1.5 text-[10px]">7</Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full">
                  <Calendar className="size-4" />
                  <span>Scheduled Calls</span>
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
                <SidebarMenuButton className="w-full">
                  <BookOpen className="size-4" />
                  <span>Knowledge Base</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full">
                  <Bot className="size-4" />
                  <span>Bot Config</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full">
                  <Users className="size-4" />
                  <span>Team</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full">
                  <Settings className="size-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-indigo-600 text-primary-foreground flex items-center justify-center font-bold text-xs">
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

export default function App() {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('voicera_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedRows((prev) =>
      prev.length === recentCalls.length ? [] : recentCalls.map((c) => c.id)
    );
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#fafafa]">
        <AppSidebar />
        <main className="flex-1 overflow-auto bg-[#fafafa]">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
                <p className="text-muted-foreground text-sm mt-1">Welcome back — here's what's happening with Voicera today.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Last 7 days
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {metrics.map((metric, idx) => (
                <Card key={idx} className="bg-background shadow-sm border-0">
                  <CardContent className="pt-6 pb-4 px-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-1">
                        <p className="text-xs text-[#6b7280] font-normal">
                          {metric.label}
                        </p>
                        <svg className="w-3 h-3 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <div className="text-[28px] font-semibold leading-none">
                          {metric.value}
                        </div>
                        {metric.subtitle && (
                          <div className="text-xs text-[#9ca3af] font-normal">
                            {metric.subtitle}
                          </div>
                        )}
                      </div>
                      <div className="h-12 -mx-4 -mb-4 mt-3">
                        {metric.chartType === "line" ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={metric.chartData}>
                              <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#9ca3af"
                                strokeWidth={1}
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        ) : (
                          <StemChart data={metric.chartData} color="#d1d5db" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-4 mt-8">
              <h2 className="text-lg font-semibold mr-auto">Recent Calls</h2>
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search calls..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="size-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Table */}
            <div className="border rounded-lg bg-background shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedRows.length === recentCalls.length}
                        onCheckedChange={toggleAll}
                      />
                    </TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wider">Caller</TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wider">Issue</TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wider">Channel</TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wider">Duration</TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wider">Status</TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wider">Date</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCalls.map((call) => (
                    <TableRow key={call.id} className="cursor-pointer hover:bg-muted">
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.includes(call.id)}
                          onCheckedChange={() => toggleRow(call.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
                            {call.name[0]}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{call.name}</div>
                            <div className="text-xs text-muted-foreground">{call.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-muted font-normal">
                          {call.issue}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {call.channel}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {call.duration}
                      </TableCell>
                      <TableCell>
                        <Badge variant={call.status === 'resolved' ? 'default' : call.status === 'escalated' ? 'destructive' : 'secondary'} 
                               className={call.status === 'resolved' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
                          {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {call.date}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700">
                          <ChevronRight className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing 5 recent calls
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}