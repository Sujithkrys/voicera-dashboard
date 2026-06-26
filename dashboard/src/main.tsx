import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./app/pages/Login";
import DashboardLayout from "./app/layouts/DashboardLayout";
import Overview from "./app/pages/Overview";
import CallLogs from "./app/pages/CallLogs";
import Tickets from "./app/pages/Tickets";
import ScheduledCalls from "./app/pages/ScheduledCalls";
import KnowledgeBase from "./app/pages/KnowledgeBase";
import BotConfig from "./app/pages/BotConfig";
import Team from "./app/pages/Team";
import Settings from "./app/pages/Settings";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Overview />} />
        <Route path="/overview" element={<Navigate to="/" replace />} />
        <Route path="/call-logs" element={<CallLogs />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/scheduled-calls" element={<ScheduledCalls />} />
        <Route path="/knowledge-base" element={<KnowledgeBase />} />
        <Route path="/bot-config" element={<BotConfig />} />
        <Route path="/team" element={<Team />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  </BrowserRouter>
);