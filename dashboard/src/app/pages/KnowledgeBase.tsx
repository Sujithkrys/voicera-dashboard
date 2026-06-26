import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Plus, FileText, Link as LinkIcon, Trash2, CheckCircle2, AlertCircle, RefreshCw, UploadCloud } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

const mockDocs = [
  { id: '1', name: 'Product_Documentation_v2.pdf', type: 'pdf', size: '2.4 MB', status: 'synced', date: 'Oct 24, 2023' },
  { id: '2', name: 'https://acme.com/pricing', type: 'url', size: '12 KB', status: 'synced', date: 'Oct 23, 2023' },
  { id: '3', name: 'Q3_Support_Guidelines.docx', type: 'docx', size: '845 KB', status: 'syncing', date: 'Oct 23, 2023' },
  { id: '4', name: 'https://acme.com/help/billing', type: 'url', size: '18 KB', status: 'error', date: 'Oct 21, 2023' }
];

export default function KnowledgeBase() {
  const [activeTab, setActiveTab] = useState<'documents' | 'add' | 'gaps' | 'test'>('documents');
  const [documents, setDocuments] = useState(mockDocs);
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto h-full flex flex-col bg-[#fafafa]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-manrope font-extrabold tracking-tight text-slate-900">Knowledge Base</h1>
          <p className="text-slate-500 font-inter text-[13px] mt-1 font-medium">Manage the documents and context your AI uses to answer questions</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold font-inter h-[42px] px-6 rounded-xl shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:-translate-y-[1px] transition-all">
          <Plus className="mr-2 h-4 w-4" strokeWidth={3} />
          Add Knowledge
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-100/80 p-1.5 rounded-[14px] w-fit border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <button 
          className={`px-5 py-2.5 rounded-xl text-[13px] font-semibold font-inter transition-all ${activeTab === 'documents' ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`} 
          onClick={() => setActiveTab('documents')}
        >
          Documents
        </button>
        <button 
          className={`px-5 py-2.5 rounded-xl text-[13px] font-semibold font-inter transition-all ${activeTab === 'add' ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`} 
          onClick={() => setActiveTab('add')}
        >
          Add Knowledge
        </button>
        <button 
          className={`px-5 py-2.5 rounded-xl text-[13px] font-semibold font-inter transition-all ${activeTab === 'gaps' ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`} 
          onClick={() => setActiveTab('gaps')}
        >
          Knowledge Gaps
        </button>
        <button 
          className={`px-5 py-2.5 rounded-xl text-[13px] font-semibold font-inter transition-all ${activeTab === 'test' ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`} 
          onClick={() => setActiveTab('test')}
        >
          Test Search
        </button>
      </div>

      {/* Documents View */}
      {activeTab === 'documents' && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] mb-5">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search documents..."
                className="pl-9 h-9 bg-slate-50/80 border-transparent focus-visible:ring-indigo-500 focus-visible:bg-white rounded-xl font-inter text-[13px] transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px] h-9 bg-slate-50/80 border-transparent font-medium font-inter text-[13px] rounded-xl text-slate-700">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-lg font-inter text-[13px]">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="docx">Word</SelectItem>
                <SelectItem value="url">URL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border border-slate-200/60 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-auto flex-1">
            <Table>
              <TableHeader className="bg-slate-50/80 sticky top-0 border-b border-slate-100 backdrop-blur-sm">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="text-[11px] font-bold uppercase tracking-widest text-slate-400 py-4 px-6 font-inter">Name</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-widest text-slate-400 py-4 font-inter">Status</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-widest text-slate-400 py-4 font-inter">Size</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-widest text-slate-400 py-4 font-inter">Date Added</TableHead>
                  <TableHead className="w-12 py-4 px-6"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-slate-50/50 transition-colors border-slate-100 group">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-[12px] shadow-sm border ${doc.type === 'url' ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200/50 text-blue-600' : 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200/50 text-indigo-600'}`}>
                          {doc.type === 'url' ? <LinkIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                        </div>
                        <div className="font-bold text-[14px] text-slate-900 font-inter tracking-tight group-hover:text-indigo-600 transition-colors">{doc.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      {doc.status === 'synced' && <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/50 px-2.5 py-1 rounded-md font-inter uppercase tracking-wide"><CheckCircle2 className="h-3.5 w-3.5" /> Synced</span>}
                      {doc.status === 'syncing' && <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200/50 px-2.5 py-1 rounded-md font-inter uppercase tracking-wide"><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Syncing</span>}
                      {doc.status === 'error' && <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200/50 px-2.5 py-1 rounded-md font-inter uppercase tracking-wide"><AlertCircle className="h-3.5 w-3.5" /> Failed</span>}
                    </TableCell>
                    <TableCell className="text-[13px] font-medium text-slate-500 py-4 font-inter">
                      {doc.size}
                    </TableCell>
                    <TableCell className="text-[13px] font-medium text-slate-500 py-4 font-inter">
                      {doc.date}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Add Knowledge View */}
      {activeTab === 'add' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-[1.5px] border-dashed border-slate-200 hover:border-indigo-400 shadow-sm hover:shadow-md transition-all cursor-pointer group bg-white rounded-[24px]">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center min-h-[280px]">
              <div className="w-16 h-16 rounded-[18px] bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors mb-6 shadow-sm border border-slate-100 group-hover:border-indigo-100">
                <UploadCloud className="h-8 w-8" />
              </div>
              <h3 className="font-manrope font-bold text-[18px] text-slate-900 mb-2">Upload Files</h3>
              <p className="text-[13px] text-slate-500 font-medium font-inter leading-relaxed max-w-[280px]">
                Upload PDF, DOCX, or TXT files. We will automatically extract the text and add it to your agent's brain.
              </p>
              <div className="mt-6 text-[12px] font-bold text-indigo-600 font-inter opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                Browse Files <ChevronRight className="h-3 w-3" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-[1.5px] border-slate-200 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer group bg-white rounded-[24px]">
            <CardContent className="p-8 flex flex-col min-h-[280px]">
              <div className="w-16 h-16 rounded-[18px] bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors mb-6 shadow-sm border border-slate-100 group-hover:border-blue-100">
                <LinkIcon className="h-8 w-8" />
              </div>
              <h3 className="font-manrope font-bold text-[18px] text-slate-900 mb-2">Crawl Website</h3>
              <p className="text-[13px] text-slate-500 font-medium font-inter leading-relaxed max-w-[280px]">
                Enter a URL and we will scrape all the text from that page to answer customer questions.
              </p>
              <div className="mt-auto w-full flex items-center gap-2">
                <Input placeholder="https://..." className="flex-1 h-[42px] bg-slate-50 border-slate-200 rounded-xl font-inter text-[13px]" />
                <Button className="h-[42px] rounded-xl bg-slate-900 text-white font-bold font-inter px-5 shadow-sm group-hover:bg-blue-600 transition-colors">Add</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
