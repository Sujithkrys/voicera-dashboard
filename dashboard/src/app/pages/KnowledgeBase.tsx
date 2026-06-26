import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search, Plus, FileText, Link as LinkIcon, Trash2, CheckCircle2, AlertCircle, RefreshCw, UploadCloud } from "lucide-react";

const mockDocs = [
  { id: "1", name: "Product_Documentation_v2.pdf", type: "pdf", size: "2.4 MB", status: "synced", date: "Oct 24, 2023" },
  { id: "2", name: "https://acme.com/pricing", type: "url", size: "12 KB", status: "synced", date: "Oct 23, 2023" },
  { id: "3", name: "Q3_Support_Guidelines.docx", type: "docx", size: "845 KB", status: "syncing", date: "Oct 23, 2023" },
  { id: "4", name: "https://acme.com/help/billing", type: "url", size: "18 KB", status: "error", date: "Oct 21, 2023" },
];

export default function KnowledgeBase() {
  const [activeTab, setActiveTab] = useState<"documents" | "add" | "gaps" | "test">("documents");
  const [documents] = useState(mockDocs);
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { key: "documents", label: "Documents" },
    { key: "add", label: "Add Knowledge" },
    { key: "gaps", label: "Knowledge Gaps" },
    { key: "test", label: "Test Search" },
  ] as const;

  return (
    <div className="p-6 space-y-5 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-[18px] font-semibold text-neutral-900">Knowledge Base</h1>
        <Button className="bg-neutral-900 text-white hover:bg-neutral-800 h-8 text-[13px] font-medium rounded-md" onClick={() => setActiveTab("add")}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add Knowledge
        </Button>
      </div>

      <div className="flex gap-1 border-b border-neutral-100">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`px-3 py-2 text-[13px] font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "documents" && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <Input
                placeholder="Search documents..."
                className="pl-8 h-8 text-[13px] border-neutral-200 rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="h-8 px-3 text-[13px] font-medium text-neutral-600 border border-neutral-200 rounded-md hover:bg-neutral-50">
              All Types
            </button>
          </div>

          <div className="border border-neutral-200 rounded-lg overflow-auto flex-1">
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-neutral-100">
                  <th className="text-left py-2.5 px-4 text-[12px] font-medium text-neutral-400 uppercase tracking-wider">Name</th>
                  <th className="text-left py-2.5 px-4 text-[12px] font-medium text-neutral-400 uppercase tracking-wider">Status</th>
                  <th className="text-left py-2.5 px-4 text-[12px] font-medium text-neutral-400 uppercase tracking-wider">Size</th>
                  <th className="text-left py-2.5 px-4 text-[12px] font-medium text-neutral-400 uppercase tracking-wider">Date</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors group">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded flex items-center justify-center ${doc.type === "url" ? "bg-blue-50 text-blue-500" : "bg-neutral-100 text-neutral-500"}`}>
                          {doc.type === "url" ? <LinkIcon className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                        </div>
                        <span className="text-[13px] font-medium text-neutral-900">{doc.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      {doc.status === "synced" && <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600"><CheckCircle2 className="h-3 w-3" /> Synced</span>}
                      {doc.status === "syncing" && <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600"><RefreshCw className="h-3 w-3 animate-spin" /> Syncing</span>}
                      {doc.status === "error" && <span className="inline-flex items-center gap-1 text-[11px] font-medium text-red-500"><AlertCircle className="h-3 w-3" /> Failed</span>}
                    </td>
                    <td className="py-2.5 px-4 text-[13px] text-neutral-500">{doc.size}</td>
                    <td className="py-2.5 px-4 text-[13px] text-neutral-500">{doc.date}</td>
                    <td className="py-2.5 px-4">
                      <button className="p-1 rounded hover:bg-red-50 text-neutral-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "add" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-dashed border-neutral-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-neutral-400 hover:bg-neutral-50 transition-colors cursor-pointer group min-h-[200px]">
            <UploadCloud className="h-8 w-8 text-neutral-300 group-hover:text-neutral-500 mb-3 transition-colors" />
            <h3 className="text-[14px] font-semibold text-neutral-900 mb-1">Upload Files</h3>
            <p className="text-[12px] text-neutral-500 max-w-[240px]">
              Upload PDF, DOCX, or TXT files to add to your agent's knowledge.
            </p>
          </div>
          <div className="border border-neutral-200 rounded-lg p-8 flex flex-col hover:border-neutral-300 transition-colors cursor-pointer group min-h-[200px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-500">
                <LinkIcon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-neutral-900">Crawl Website</h3>
                <p className="text-[12px] text-neutral-500">Scrape text from a URL.</p>
              </div>
            </div>
            <div className="mt-auto flex gap-2">
              <Input placeholder="https://..." className="h-8 text-[13px] border-neutral-200 rounded-md flex-1" />
              <Button className="h-8 bg-neutral-900 text-white text-[13px] font-medium rounded-md px-4">Add</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
