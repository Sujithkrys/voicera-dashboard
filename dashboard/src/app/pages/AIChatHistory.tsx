import React from "react";
import { MessageSquare, Trash2, ArrowRight } from "lucide-react";
import { useChat } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";

export default function AIChatHistory() {
  const { threads, setActiveThreadId, deleteThread } = useChat();
  const navigate = useNavigate();

  const handleOpenThread = (id: string) => {
    setActiveThreadId(id);
    navigate("/ai-chat");
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteThread(id);
  };

  return (
    <div className="flex-1 bg-[#fafafa] min-h-full p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Chat History</h1>
            <p className="text-[14px] text-neutral-500">View and manage your past AI conversations.</p>
          </div>
          <button
            onClick={() => {
              setActiveThreadId(null);
              navigate("/ai-chat");
            }}
            className="h-9 px-4 bg-neutral-900 text-white text-[13px] font-medium rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Start New Chat
          </button>
        </div>

        {threads.length === 0 ? (
          <div className="text-center py-20 bg-white border border-neutral-200 rounded-2xl">
            <MessageSquare className="size-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-[16px] font-medium text-neutral-900 mb-2">No conversations yet</h3>
            <p className="text-[14px] text-neutral-500 max-w-sm mx-auto mb-6">
              You haven't started any chats with Voicera AI. Start a new conversation to get insights on your calls.
            </p>
            <button
              onClick={() => {
                setActiveThreadId(null);
                navigate("/ai-chat");
              }}
              className="h-9 px-4 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-medium rounded-lg hover:bg-neutral-50 transition-colors inline-flex items-center gap-2"
            >
              Start New Chat
              <ArrowRight className="size-4" />
            </button>
          </div>
        ) : (
          <div className="grid gap-3">
            {threads.map((thread) => (
              <div
                key={thread.id}
                onClick={() => handleOpenThread(thread.id)}
                className="group flex items-center justify-between bg-white border border-neutral-200 p-4 rounded-xl hover:border-neutral-300 hover:shadow-sm cursor-pointer transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center shrink-0">
                    <MessageSquare className="size-5 text-neutral-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[14px] font-medium text-neutral-900 truncate mb-0.5">
                      {thread.title}
                    </h3>
                    <p className="text-[12px] text-neutral-500">
                      {thread.messages.length} message{thread.messages.length !== 1 ? "s" : ""} •{" "}
                      {thread.createdAt.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleDelete(e, thread.id)}
                    className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete chat"
                  >
                    <Trash2 className="size-4" />
                  </button>
                  <div className="w-8 h-8 flex items-center justify-center text-neutral-400">
                    <ArrowRight className="size-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
