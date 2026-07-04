import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, MessageSquare, ArrowRight, MoreHorizontal, Pin, Trash2 } from "lucide-react";
import { useChat } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";

function formatRelativeTime(date: Date) {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = Math.round(diffInMs / 60000);
  const diffInHours = Math.round(diffInMins / 60);
  const diffInDays = Math.round(diffInHours / 24);

  if (diffInMins < 60) {
    return `${diffInMins} minute${diffInMins !== 1 ? 's' : ''} ago`;
  }
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
  
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function AIChatHistory() {
  const { threads, setActiveThreadId, deleteThread, deleteThreads, togglePinThread } = useChat();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredThreads = threads.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedThreads = [...filteredThreads].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const handleOpenThread = (id: string) => {
    if (isSelecting) {
      toggleSelection(id);
      return;
    }
    setActiveThreadId(id);
    navigate("/ai-chat");
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    deleteThreads(Array.from(selectedIds));
    setIsSelecting(false);
    setSelectedIds(new Set());
  };

  return (
    <div className="flex-1 bg-[#fafafa] min-h-full p-8 md:p-12">
      <div className="max-w-[900px] mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[32px] text-foreground font-serif" style={{ fontFamily: 'Georgia, serif' }}>Chats</h1>
          
          <div className="flex items-center gap-3">
            {isSelecting && selectedIds.size > 0 && (
              <button 
                onClick={handleDeleteSelected}
                className="h-9 px-4 flex items-center gap-2 border border-red-200 bg-red-50 text-red-600 rounded-md text-[13px] font-medium hover:bg-red-100 transition-colors"
              >
                <Trash2 className="size-4" />
                Delete ({selectedIds.size})
              </button>
            )}
            
            <button 
              onClick={() => {
                if (isSelecting) {
                  setIsSelecting(false);
                  setSelectedIds(new Set());
                } else {
                  setIsSelecting(true);
                }
              }}
              className="h-9 px-4 border border-border bg-background rounded-md text-[13px] font-medium text-foreground hover:bg-muted transition-colors"
            >
              {isSelecting ? "Cancel selection" : "Select chats"}
            </button>
            
            {!isSelecting && (
              <button 
                onClick={() => {
                  setActiveThreadId(null);
                  navigate("/ai-chat");
                }}
                className="h-9 px-4 bg-black text-primary-foreground text-[13px] font-medium rounded-md hover:bg-primary transition-colors shadow-sm"
              >
                New chat
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-background border border-[#4B96FF] rounded-lg text-[14px] outline-none focus:ring-2 focus:ring-[#4B96FF]/20 transition-all placeholder:text-muted-foreground"
          />
        </div>

        {/* List */}
        <div>
          {filteredThreads.length === 0 ? (
            <div className="text-center py-20 bg-background border border-border rounded-xl">
              <MessageSquare className="size-10 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-[15px] font-medium text-foreground mb-1">No chats found</h3>
              <p className="text-[13px] text-muted-foreground max-w-sm mx-auto mb-6">
                Try searching for something else or start a new conversation.
              </p>
              <button
                onClick={() => {
                  setActiveThreadId(null);
                  navigate("/ai-chat");
                }}
                className="h-9 px-4 bg-black text-primary-foreground text-[13px] font-medium rounded-md hover:bg-primary transition-colors inline-flex items-center gap-2"
              >
                New chat
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col" ref={dropdownRef}>
              {sortedThreads.map((thread) => (
                <div 
                  key={thread.id}
                  onClick={() => handleOpenThread(thread.id)}
                  className="group relative flex items-center justify-between py-4 border-b border-border last:border-0 hover:bg-black/[0.02] cursor-pointer transition-colors px-2 -mx-2 rounded-lg"
                >
                  <div className="flex items-center gap-3 pr-4 truncate">
                    {isSelecting && (
                      <div className="flex items-center justify-center size-5 shrink-0">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(thread.id)}
                          onChange={() => {}} // handled by parent div click
                          className="size-4 rounded border-border text-foreground focus:ring-black cursor-pointer"
                        />
                      </div>
                    )}
                    {thread.isPinned && !isSelecting && <Pin className="size-3.5 text-muted-foreground shrink-0 fill-neutral-400" />}
                    <h3 className="text-[14px] text-foreground font-medium truncate">
                      {thread.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[13px] text-muted-foreground whitespace-nowrap">
                      {formatRelativeTime(thread.createdAt)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(openDropdownId === thread.id ? null : thread.id);
                      }}
                      className="p-1 text-muted-foreground hover:text-foreground hover:bg-neutral-200/50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <MoreHorizontal className="size-4" />
                    </button>
                    
                    {openDropdownId === thread.id && (
                      <div className="absolute right-8 top-10 w-36 bg-background border border-border shadow-lg rounded-lg py-1 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePinThread(thread.id);
                            setOpenDropdownId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-[13px] text-foreground hover:bg-muted flex items-center gap-2"
                        >
                          <Pin className="size-3.5" />
                          {thread.isPinned ? "Unpin" : "Pin"} chat
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteThread(thread.id);
                            setOpenDropdownId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-[13px] text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="size-3.5" />
                          Delete chat
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
