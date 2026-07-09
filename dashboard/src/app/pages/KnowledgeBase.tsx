import React, { useState, useRef, useEffect } from "react";
import { apiClient } from "../../api/client";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search, Plus, FileText, Link as LinkIcon, Trash2, CheckCircle2, AlertCircle, RefreshCw, UploadCloud } from "lucide-react";

export default function KnowledgeBase() {
  const [activeTab, setActiveTab] = useState<"documents" | "add" | "gaps" | "test">("documents");
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [crawlUrl, setCrawlUrl] = useState("");
  const [isCrawling, setIsCrawling] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    setIsLoadingDocs(true);
    try {
      const res = await apiClient('/kb/documents');
      const docs = res.documents.map((d: any) => ({
        id: d.id,
        name: d.file_name,
        type: d.file_type,
        url: d.file_url,
        size: `${d.chunk_count} chunks`,
        status: d.status === 'ready' ? 'synced' : (d.status === 'failed' ? 'error' : 'syncing'),
        date: new Date(d.created_at).toLocaleDateString()
      }));
      setDocuments(docs);
    } catch (err: any) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleCrawl = async () => {
    if (!crawlUrl) return;
    try {
      setIsCrawling(true);
      await apiClient('/kb/crawl', {
        method: 'POST',
        body: JSON.stringify({ url: crawlUrl, max_pages: 10 }),
      });
      alert('Website crawled successfully!');
      setCrawlUrl("");
      setActiveTab("documents");
      fetchDocuments();
    } catch (err: any) {
      alert(`Error crawling website: ${err.message}`);
    } finally {
      setIsCrawling(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log("Selected files:", e.target.files);
      // Implementation for file upload goes here
    }
  };

  const tabs = [
    { key: "documents", label: "Documents" },
    { key: "add", label: "Add Knowledge" },
    { key: "gaps", label: "Knowledge Gaps" },
    { key: "test", label: "Test Search" },
  ] as const;

  return (
    <div className="p-6 space-y-5 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-[18px] font-semibold text-foreground">Knowledge Base</h1>
        <Button className="bg-primary text-primary-foreground hover:bg-primary h-8 text-[13px] font-medium rounded-md" onClick={() => setActiveTab("add")}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add Knowledge
        </Button>
      </div>

      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`px-3 py-2 text-[13px] font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-neutral-900 text-foreground"
                : "border-transparent text-muted-foreground hover:text-muted-foreground"
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
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-8 h-8 text-[13px] border-border rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="h-8 px-3 text-[13px] font-medium text-muted-foreground border border-border rounded-md hover:bg-muted">
              All Types
            </button>
          </div>

          <div className="border border-border rounded-lg overflow-auto flex-1">
            <table className="w-full">
              <thead className="sticky top-0 bg-background">
                <tr className="border-b border-border">
                  <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                  <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Size</th>
                  <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-neutral-50 last:border-0 hover:bg-muted transition-colors group">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded flex items-center justify-center ${doc.type === "url" ? "bg-blue-50 text-blue-500" : "bg-secondary text-muted-foreground"}`}>
                          {doc.type === "url" ? <LinkIcon className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                        </div>
                        {doc.url ? (
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-[13px] font-medium text-foreground hover:text-blue-600 hover:underline">
                            {doc.name}
                          </a>
                        ) : (
                          <span className="text-[13px] font-medium text-foreground">{doc.name}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      {doc.status === "synced" && <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600"><CheckCircle2 className="h-3 w-3" /> Synced</span>}
                      {doc.status === "syncing" && <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600"><RefreshCw className="h-3 w-3 animate-spin" /> Syncing</span>}
                      {doc.status === "error" && <span className="inline-flex items-center gap-1 text-[11px] font-medium text-red-500"><AlertCircle className="h-3 w-3" /> Failed</span>}
                    </td>
                    <td className="py-2.5 px-4 text-[13px] text-muted-foreground">{doc.size}</td>
                    <td className="py-2.5 px-4 text-[13px] text-muted-foreground">{doc.date}</td>
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
          <div 
            className="border border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-neutral-400 hover:bg-muted transition-colors cursor-pointer group min-h-[200px]"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf,.docx,.txt"
              multiple
              onChange={handleFileChange}
            />
            <UploadCloud className="h-8 w-8 text-neutral-300 group-hover:text-muted-foreground mb-3 transition-colors" />
            <h3 className="text-[14px] font-semibold text-foreground mb-1">Upload Files</h3>
            <p className="text-[12px] text-muted-foreground max-w-[240px]">
              Upload PDF, DOCX, or TXT files to add to your agent's knowledge.
            </p>
          </div>
          <div className="border border-border rounded-lg p-8 flex flex-col hover:border-border transition-colors cursor-pointer group min-h-[200px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-500">
                <LinkIcon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Crawl Website</h3>
                <p className="text-[12px] text-muted-foreground">Scrape text from a URL.</p>
              </div>
            </div>
            <div className="mt-auto flex gap-2">
              <Input 
                placeholder="https://..." 
                className="h-8 text-[13px] border-border rounded-md flex-1"
                value={crawlUrl}
                onChange={(e) => setCrawlUrl(e.target.value)}
              />
              <Button 
                className="h-8 bg-primary text-primary-foreground text-[13px] font-medium rounded-md px-4"
                onClick={handleCrawl}
                disabled={isCrawling || !crawlUrl}
              >
                {isCrawling ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Add"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
