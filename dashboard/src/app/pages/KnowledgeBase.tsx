import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Plus, FileText, Link as LinkIcon, Trash2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Knowledge Base</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage the documents and context your AI uses to answer questions</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold" onClick={() => setActiveTab('add')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Knowledge
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit border border-slate-200">
        <button 
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'documents' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`} 
          onClick={() => setActiveTab('documents')}
        >
          Documents
        </button>
        <button 
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'add' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`} 
          onClick={() => setActiveTab('add')}
        >
          Add Knowledge
        </button>
        <button 
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'gaps' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`} 
          onClick={() => setActiveTab('gaps')}
        >
          Knowledge Gaps
        </button>
        <button 
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'test' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`} 
          onClick={() => setActiveTab('test')}
        >
          Test Search
        </button>
      </div>

      {/* Documents View */}
      {activeTab === 'documents' && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-9 h-9 bg-slate-50 border-transparent focus-visible:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px] h-9 bg-slate-50 border-transparent font-medium">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="docx">Word</SelectItem>
                <SelectItem value="url">URL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-xl bg-white shadow-sm overflow-auto flex-1">
            <Table>
              <TableHeader className="bg-slate-50/50 sticky top-0">
                <TableRow>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-4 px-6">Name</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-4">Status</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-4">Size</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-4">Date Added</TableHead>
                  <TableHead className="w-12 py-4 px-6"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${doc.type === 'url' ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
                          {doc.type === 'url' ? <LinkIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                        </div>
                        <div className="font-semibold text-[13px] text-slate-900">{doc.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      {doc.status === 'synced' && <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md"><CheckCircle2 className="h-3.5 w-3.5" /> Synced</span>}
                      {doc.status === 'syncing' && <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-md"><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Syncing</span>}
                      {doc.status === 'error' && <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-md"><AlertCircle className="h-3.5 w-3.5" /> Failed</span>}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-500 py-4">
                      {doc.size}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-500 py-4">
                      {doc.date}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full">
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
          <Card className="border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group bg-white">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1">Upload Files</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Upload PDF, DOCX, or TXT files. We will automatically extract the text and add it to your agent's brain.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group bg-white">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <LinkIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1">Crawl Website</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Enter a URL and we will scrape all the text from that page to answer customer questions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
