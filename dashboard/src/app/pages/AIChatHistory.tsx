import React, { useState } from "react";
import { Search, ChevronDown, MessageSquare, ArrowRight } from "lucide-react";
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
  const { threads, setActiveThreadId } = useChat();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredThreads = threads.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenThread = (id: string) => {
    setActiveThreadId(id);
    navigate("/ai-chat");
  };

  return (
    <div className="flex-1 bg-[#fafafa] min-h-full p-8 md:p-12">
      <div className="max-w-[900px] mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[32px] text-neutral-900 font-serif" style={{ fontFamily: 'Georgia, serif' }}>Chats</h1>
          
          <div className="flex items-center gap-3">
            <button className="h-9 px-3 flex items-center gap-2 border border-neutral-200 bg-white rounded-md text-[13px] text-neutral-600 hover:bg-neutral-50 transition-colors">
              Filter by <span className="font-medium text-neutral-900">All</span>
              <ChevronDown className="size-3.5 text-neutral-400" />
            </button>
            <button className="h-9 px-4 border border-neutral-200 bg-white rounded-md text-[13px] font-medium text-neutral-800 hover:bg-neutral-50 transition-colors">
              Select chats
            </button>
            <button 
              onClick={() => {
                setActiveThreadId(null);
                navigate("/ai-chat");
              }}
              className="h-9 px-4 bg-black text-white text-[13px] font-medium rounded-md hover:bg-neutral-800 transition-colors shadow-sm"
            >
              New chat
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
          <input 
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-white border border-[#4B96FF] rounded-lg text-[14px] outline-none focus:ring-2 focus:ring-[#4B96FF]/20 transition-all placeholder:text-neutral-400"
          />
        </div>

        {/* List */}
        <div>
          {filteredThreads.length === 0 ? (
            <div className="text-center py-20 bg-white border border-neutral-200 rounded-xl">
              <MessageSquare className="size-10 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-[15px] font-medium text-neutral-900 mb-1">No chats found</h3>
              <p className="text-[13px] text-neutral-500 max-w-sm mx-auto mb-6">
                Try searching for something else or start a new conversation.
              </p>
              <button
                onClick={() => {
                  setActiveThreadId(null);
                  navigate("/ai-chat");
                }}
                className="h-9 px-4 bg-black text-white text-[13px] font-medium rounded-md hover:bg-neutral-800 transition-colors inline-flex items-center gap-2"
              >
                New chat
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              {filteredThreads.map((thread) => (
                <div 
                  key={thread.id}
                  onClick={() => handleOpenThread(thread.id)}
                  className="group flex items-center justify-between py-4 border-b border-neutral-200 last:border-0 hover:bg-black/[0.02] cursor-pointer transition-colors px-2 -mx-2 rounded-lg"
                >
                  <h3 className="text-[14px] text-neutral-800 font-medium truncate pr-4">
                    {thread.title}
                  </h3>
                  <span className="text-[13px] text-neutral-400 whitespace-nowrap">
                    {formatRelativeTime(thread.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
