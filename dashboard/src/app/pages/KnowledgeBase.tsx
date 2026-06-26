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
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col pb-10">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0 mb-2">
        <div>
          <h1 className="font-manrope text-[24px] font-extrabold tracking-[-0.5px] text-on-surface">Knowledge Base</h1>
          <p className="font-inter text-[13px] text-on-surface-med mt-1">Manage the documents and context your AI uses to answer questions</p>
        </div>
        <Button className="bg-gradient-to-r from-primary-dim to-primary hover:-translate-y-[1px] transition-transform text-white font-inter font-bold text-[13px] rounded-xl shadow-[0_4px_18px_var(--color-primary-glow)] border-none px-5 py-2.5 h-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Knowledge
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex bg-surface-hi p-[4px] rounded-[14px] border border-ghost w-fit">
        {[
          { id: 'documents', label: 'Documents' },
          { id: 'add', label: 'Add Knowledge' },
          { id: 'gaps', label: 'Knowledge Gaps' },
          { id: 'test', label: 'Test Search' }
        ].map(tab => (
          <button 
            key={tab.id}
            className={`px-[16px] py-2 text-[13px] font-bold rounded-[10px] transition-all font-inter ${activeTab === tab.id ? 'bg-surface-highest text-on-surface shadow-[0_4px_12px_rgba(0,0,0,0.2)]' : 'text-on-surface-low hover:text-on-surface-med'}`} 
            onClick={() => setActiveTab(tab.id as any)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Documents View */}
      {activeTab === 'documents' && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-2.5 mb-5 bg-surface-hi p-[8px] rounded-2xl border border-ghost shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-on-surface-low" />
              <Input
                placeholder="Search documents..."
                className="pl-[34px] h-[38px] bg-surface border-transparent focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary text-on-surface font-inter text-[13px] rounded-xl placeholder:text-on-surface-low"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px] h-[38px] bg-surface border-transparent text-on-surface-med font-inter text-[12px] rounded-xl focus:ring-0">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-surface-hi border-ghost-med text-on-surface">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="docx">Word</SelectItem>
                <SelectItem value="url">URL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-surface rounded-[1.5rem] shadow-[0_0_40px_rgba(6,14,32,0.5)] overflow-x-auto flex-1 relative border-none">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-ghost-med hover:bg-transparent">
                  {['Name', 'Status', 'Size', 'Date Added', ''].map((head, idx) => (
                    <TableHead key={idx} className="font-inter text-[10px] font-bold text-on-surface-low uppercase tracking-[0.6px] px-6 py-4 h-auto">
                      {head}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id} className="cursor-pointer transition-colors border-none hover:bg-surface-hi group">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-[36px] w-[36px] items-center justify-center rounded-[10px] shadow-sm ${doc.type === 'url' ? 'bg-blue-bg text-blue' : 'bg-primary-glow-sm text-primary'}`}>
                          {doc.type === 'url' ? <LinkIcon className="h-[18px] w-[18px]" /> : <FileText className="h-[18px] w-[18px]" />}
                        </div>
                        <div className="font-semibold text-[13px] text-on-surface font-inter">{doc.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      {doc.status === 'synced' && <span className="inline-flex items-center gap-1.5 font-inter text-[11px] font-bold text-tertiary bg-tertiary-dim px-2.5 py-1 rounded-md uppercase tracking-[0.5px]"><CheckCircle2 className="h-3.5 w-3.5" /> Synced</span>}
                      {doc.status === 'syncing' && <span className="inline-flex items-center gap-1.5 font-inter text-[11px] font-bold text-amber bg-amber-bg px-2.5 py-1 rounded-md uppercase tracking-[0.5px]"><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Syncing</span>}
                      {doc.status === 'error' && <span className="inline-flex items-center gap-1.5 font-inter text-[11px] font-bold text-red bg-red-bg px-2.5 py-1 rounded-md uppercase tracking-[0.5px]"><AlertCircle className="h-3.5 w-3.5" /> Failed</span>}
                    </TableCell>
                    <TableCell className="text-[13px] font-inter text-on-surface-med px-6 py-4">
                      {doc.size}
                    </TableCell>
                    <TableCell className="text-[13px] font-inter text-on-surface-med px-6 py-4">
                      {doc.date}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-[34px] w-[34px] text-on-surface-low hover:text-red hover:bg-red-bg rounded-full transition-colors ml-auto">
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
          <div className="bg-surface border border-ghost shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:border-primary-dim hover:shadow-[0_8px_32px_rgba(138,76,252,0.3)] transition-all cursor-pointer group rounded-[1.5rem] p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-dim to-primary opacity-0 transition-opacity rounded-t-[1.5rem] group-hover:opacity-100" />
            <div className="flex items-start gap-5 mb-4">
              <div className="w-[52px] h-[52px] shrink-0 rounded-2xl bg-surface-hi border border-ghost-med flex items-center justify-center text-primary group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all shadow-sm">
                <FileText className="h-[22px] w-[22px]" />
              </div>
              <div>
                <h3 className="font-manrope font-extrabold text-[18px] text-on-surface mb-1">Upload Files</h3>
                <p className="font-inter text-[13px] text-on-surface-med leading-[1.6]">
                  Upload PDF, DOCX, or TXT files. We will automatically extract the text and add it to your agent's brain.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-surface border border-ghost shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:border-[#7eb8ff] hover:shadow-[0_8px_32px_rgba(126,184,255,0.2)] transition-all cursor-pointer group rounded-[1.5rem] p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7eb8ff] to-[#4b9eff] opacity-0 transition-opacity rounded-t-[1.5rem] group-hover:opacity-100" />
            <div className="flex items-start gap-5 mb-4">
              <div className="w-[52px] h-[52px] shrink-0 rounded-2xl bg-surface-hi border border-ghost-med flex items-center justify-center text-blue group-hover:bg-blue group-hover:border-blue group-hover:text-white transition-all shadow-sm">
                <LinkIcon className="h-[22px] w-[22px]" />
              </div>
              <div>
                <h3 className="font-manrope font-extrabold text-[18px] text-on-surface mb-1">Crawl Website</h3>
                <p className="font-inter text-[13px] text-on-surface-med leading-[1.6]">
                  Enter a URL and we will scrape all the text from that page to answer customer questions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
