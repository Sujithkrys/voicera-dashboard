import React from "react";
import { Handle, Position } from "@xyflow/react";
import { MessageSquare, Settings2, Cpu, FileOutput, Mail, Table, FileText, Calendar, BookOpen } from "lucide-react";

const NodeWrapper = ({ children, title, icon: Icon, color }: any) => (
  <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden w-[260px] font-sans">
    <div className={`px-4 py-3 flex items-center gap-2 border-b border-neutral-100 ${color}`}>
      <Icon className="w-4 h-4 text-neutral-700" />
      <span className="text-[13px] font-semibold text-neutral-900">{title}</span>
    </div>
    <div className="p-4 flex flex-col gap-3">
      {children}
    </div>
  </div>
);

export const ChatInputNode = ({ data }: any) => {
  return (
    <>
      <NodeWrapper title="Chat Input" icon={MessageSquare} color="bg-blue-50">
        <div className="text-[11px] text-neutral-500">Receives user messages from the chat widget.</div>
      </NodeWrapper>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500 border-2 border-white" />
    </>
  );
};

export const PromptNode = ({ data }: any) => {
  return (
    <>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-purple-500 border-2 border-white" />
      <NodeWrapper title="Prompt Template" icon={Settings2} color="bg-purple-50">
        <textarea 
          className="w-full text-[12px] p-2 border border-neutral-200 rounded-md min-h-[80px] resize-none focus:outline-none focus:ring-1 focus:ring-purple-500"
          defaultValue={data.template || "You are a helpful assistant.\nUser: {question}"}
          onChange={(e) => data.onChange && data.onChange(e.target.value)}
        />
      </NodeWrapper>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-purple-500 border-2 border-white" />
    </>
  );
};

export const LLMNode = ({ data }: any) => {
  return (
    <>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-green-500 border-2 border-white" />
      <NodeWrapper title="Groq LLM" icon={Cpu} color="bg-green-50">
        <div>
          <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">Model Name</label>
          <select className="w-full text-[12px] p-1.5 border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500">
            <option>llama-3.1-8b-instant</option>
            <option>llama3-70b-8192</option>
            <option>mixtral-8x7b-32768</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">Groq API Key</label>
          <input type="password" placeholder="gsk_..." className="w-full text-[12px] p-1.5 border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500" />
        </div>
      </NodeWrapper>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-green-500 border-2 border-white" />
    </>
  );
};

export const ChatOutputNode = ({ data }: any) => {
  return (
    <>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-orange-500 border-2 border-white" />
      <NodeWrapper title="Chat Output" icon={FileOutput} color="bg-orange-50">
        <div className="text-[11px] text-neutral-500">Sends the AI response back to the widget.</div>
      </NodeWrapper>
    </>
  );
};

export const GmailNode = ({ data }: any) => {
  return (
    <>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-red-500 border-2 border-white" />
      <NodeWrapper title="Gmail" icon={Mail} color="bg-red-50">
        <div className="text-[11px] text-neutral-500">Send or read emails from Gmail.</div>
      </NodeWrapper>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-red-500 border-2 border-white" />
    </>
  );
};

export const GoogleSheetsNode = ({ data }: any) => {
  return (
    <>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-emerald-500 border-2 border-white" />
      <NodeWrapper title="Google Sheets" icon={Table} color="bg-emerald-50">
        <div className="text-[11px] text-neutral-500">Read or append rows to Sheets.</div>
      </NodeWrapper>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-emerald-500 border-2 border-white" />
    </>
  );
};

export const GoogleDocsNode = ({ data }: any) => {
  return (
    <>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500 border-2 border-white" />
      <NodeWrapper title="Google Docs" icon={FileText} color="bg-blue-50">
        <div className="text-[11px] text-neutral-500">Generate or read documents.</div>
      </NodeWrapper>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500 border-2 border-white" />
    </>
  );
};

export const GoogleCalendarNode = ({ data }: any) => {
  return (
    <>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-teal-500 border-2 border-white" />
      <NodeWrapper title="Google Calendar" icon={Calendar} color="bg-teal-50">
        <div className="text-[11px] text-neutral-500">Schedule or list events.</div>
      </NodeWrapper>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-teal-500 border-2 border-white" />
    </>
  );
};

export const NotionNode = ({ data }: any) => {
  return (
    <>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-neutral-800 border-2 border-white" />
      <NodeWrapper title="Notion" icon={BookOpen} color="bg-neutral-100">
        <div className="text-[11px] text-neutral-500">Update databases and pages.</div>
      </NodeWrapper>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-neutral-800 border-2 border-white" />
    </>
  );
};

export const nodeTypes = {
  chatInput: ChatInputNode,
  prompt: PromptNode,
  llm: LLMNode,
  chatOutput: ChatOutputNode,
  gmail: GmailNode,
  googleSheets: GoogleSheetsNode,
  googleDocs: GoogleDocsNode,
  googleCalendar: GoogleCalendarNode,
  notion: NotionNode,
};
