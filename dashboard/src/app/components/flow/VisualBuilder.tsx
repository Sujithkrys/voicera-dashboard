import React, { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeTypes } from "./CustomNodes";
import { Button } from "../ui/button";
import { X, Play } from "lucide-react";

const initialNodes = [
  { id: "1", type: "chatInput", position: { x: 50, y: 150 }, data: {} },
  { id: "2", type: "prompt", position: { x: 400, y: 150 }, data: {} },
  { id: "3", type: "llm", position: { x: 750, y: 150 }, data: {} },
  { id: "4", type: "chatOutput", position: { x: 1100, y: 150 }, data: {} },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 } },
  { id: "e2-3", source: "2", target: "3", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 2 } },
  { id: "e3-4", source: "3", target: "4", animated: true, style: { stroke: "#10b981", strokeWidth: 2 } },
];

export default function VisualBuilder({ onClose }: { onClose: () => void }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true, style: { strokeWidth: 2, stroke: "#64748b" } }, eds)),
    [setEdges]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-50 w-[95vw] h-[95vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-neutral-200 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="h-14 bg-white border-b border-neutral-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-[15px] font-semibold text-neutral-900">Visual Bot Builder</h2>
            <div className="h-4 w-[1px] bg-neutral-200"></div>
            <span className="text-[12px] text-neutral-500 font-medium">Drag nodes to build your flow</span>
          </div>
          <div className="flex items-center gap-3">
            <Button className="h-8 bg-neutral-900 text-white text-[12px] font-medium hover:bg-neutral-800 rounded-md">
              <Play className="w-3.5 h-3.5 mr-1.5" />
              Live Preview
            </Button>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative flex">
          
          {/* Sidebar */}
          <div className="w-64 bg-white border-r border-neutral-200 p-4 flex flex-col gap-6 overflow-y-auto z-10 shadow-sm">
            <div>
              <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-3">Inputs</h3>
              <div className="p-3 border border-neutral-200 rounded-lg cursor-grab hover:border-blue-500 hover:shadow-sm transition-all bg-blue-50/50 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-[12px] font-medium text-neutral-700">Chat Input</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-3">Logic</h3>
              <div className="p-3 border border-neutral-200 rounded-lg cursor-grab hover:border-purple-500 hover:shadow-sm transition-all bg-purple-50/50 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="text-[12px] font-medium text-neutral-700">Prompt Template</span>
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-3">Models</h3>
              <div className="p-3 border border-neutral-200 rounded-lg cursor-grab hover:border-green-500 hover:shadow-sm transition-all bg-green-50/50 flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-[12px] font-medium text-neutral-700">Groq LLM</span>
              </div>
              <div className="p-3 border border-neutral-200 rounded-lg cursor-grab hover:border-emerald-500 hover:shadow-sm transition-all bg-emerald-50/50 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-[12px] font-medium text-neutral-700">OpenAI</span>
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-3">Outputs</h3>
              <div className="p-3 border border-neutral-200 rounded-lg cursor-grab hover:border-orange-500 hover:shadow-sm transition-all bg-orange-50/50 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-[12px] font-medium text-neutral-700">Chat Output</span>
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-3">Integrations</h3>
              <div className="p-3 border border-neutral-200 rounded-lg cursor-grab hover:border-red-500 hover:shadow-sm transition-all bg-red-50/50 flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-[12px] font-medium text-neutral-700">Gmail</span>
              </div>
              <div className="p-3 border border-neutral-200 rounded-lg cursor-grab hover:border-emerald-500 hover:shadow-sm transition-all bg-emerald-50/50 flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-[12px] font-medium text-neutral-700">Google Sheets</span>
              </div>
              <div className="p-3 border border-neutral-200 rounded-lg cursor-grab hover:border-blue-500 hover:shadow-sm transition-all bg-blue-50/50 flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-[12px] font-medium text-neutral-700">Google Docs</span>
              </div>
              <div className="p-3 border border-neutral-200 rounded-lg cursor-grab hover:border-teal-500 hover:shadow-sm transition-all bg-teal-50/50 flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                <span className="text-[12px] font-medium text-neutral-700">Google Calendar</span>
              </div>
              <div className="p-3 border border-neutral-200 rounded-lg cursor-grab hover:border-neutral-800 hover:shadow-sm transition-all bg-neutral-100/50 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neutral-800"></div>
                <span className="text-[12px] font-medium text-neutral-700">Notion</span>
              </div>
            </div>
          </div>

          {/* React Flow Canvas */}
          <div className="flex-1 h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              className="bg-neutral-50"
              proOptions={{ hideAttribution: true }}
            >
              <Background gap={16} size={1} color="#e5e5e5" />
              <Controls className="bg-white border-neutral-200 shadow-sm" />
              <MiniMap 
                nodeStrokeColor={(n) => {
                  if (n.type === 'chatInput') return '#3b82f6';
                  if (n.type === 'prompt') return '#a855f7';
                  if (n.type === 'llm') return '#22c55e';
                  if (n.type === 'chatOutput') return '#f97316';
                  if (n.type === 'gmail') return '#ef4444';
                  if (n.type === 'googleSheets') return '#10b981';
                  if (n.type === 'googleDocs') return '#3b82f6';
                  if (n.type === 'googleCalendar') return '#14b8a6';
                  if (n.type === 'notion') return '#262626';
                  return '#eee';
                }}
                nodeColor={(n) => {
                  if (n.type === 'chatInput') return '#eff6ff';
                  if (n.type === 'prompt') return '#faf5ff';
                  if (n.type === 'llm') return '#f0fdf4';
                  if (n.type === 'chatOutput') return '#fff7ed';
                  if (n.type === 'gmail') return '#fef2f2';
                  if (n.type === 'googleSheets') return '#ecfdf5';
                  if (n.type === 'googleDocs') return '#eff6ff';
                  if (n.type === 'googleCalendar') return '#f0fdfa';
                  if (n.type === 'notion') return '#f5f5f5';
                  return '#fff';
                }}
                className="border-neutral-200 shadow-sm rounded-lg"
              />
            </ReactFlow>
          </div>
          
        </div>
      </div>
    </div>
  );
}
