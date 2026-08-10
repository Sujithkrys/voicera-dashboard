import React from "react";
import { Bot, PhoneIncoming, PhoneOutgoing, ExternalLink, Settings2, Sparkles, BookOpen } from "lucide-react";
import { Button } from "../components/ui/button";

export default function BotConfig() {
  const SARVAM_URL = "https://www.sarvam.ai/";

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto h-full">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-[18px] font-semibold text-foreground">Agents</h1>
          <p className="text-[13px] text-muted-foreground mt-1 flex items-center gap-1.5">
            <span className="inline-block px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-semibold uppercase tracking-wider">View Only</span>
            This page is informational. Actual configuration happens in Sarvam's console.
          </p>
        </div>
        <Button 
          variant="outline"
          onClick={() => window.open(SARVAM_URL, '_blank')}
          className="h-9 text-[13px] font-medium border-border text-foreground rounded-md shadow-sm"
        >
          <Settings2 className="mr-1.5 h-4 w-4" />
          Manage in Sarvam AI
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Inbound Agent Card */}
        <div className="border border-border rounded-xl p-6 bg-background shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <PhoneIncoming className="w-24 h-24 text-emerald-500" />
          </div>
          
          <div className="flex items-center gap-3 mb-5 relative z-10">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <PhoneIncoming className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-foreground">Inbound Support Agent "Aanya"</h2>
              <div className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-600 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Active & Routing Calls
              </div>
            </div>
          </div>
          
          <p className="text-[13px] text-muted-foreground mb-6 relative z-10 leading-relaxed">
            Handles incoming customer calls, resolves queries using the Knowledge Base, and escalates complex issues to human agents by creating tickets.
          </p>

          <div className="space-y-3 mb-6 relative z-10">
            <div className="flex items-center gap-2 text-[12px] text-muted-foreground bg-muted/50 p-2 rounded-md">
              <BookOpen className="h-3.5 w-3.5 text-foreground/70" />
              Connected to local Knowledge Base
            </div>
            <div className="flex items-center gap-2 text-[12px] text-muted-foreground bg-muted/50 p-2 rounded-md">
              <Sparkles className="h-3.5 w-3.5 text-foreground/70" />
              Configured with 4 active tools
            </div>
          </div>

          <Button 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-9 text-[13px] font-medium rounded-md shadow-sm relative z-10"
            onClick={() => window.open(SARVAM_URL, '_blank')}
          >
            Configure Inbound Agent <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Outbound Agent Card */}
        <div className="border border-border rounded-xl p-6 bg-background shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <PhoneOutgoing className="w-24 h-24 text-blue-500" />
          </div>
          
          <div className="flex items-center gap-3 mb-5 relative z-10">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
              <PhoneOutgoing className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-foreground">Outbound Recovery Agent</h2>
              <div className="flex items-center gap-1.5 text-[12px] font-medium text-blue-600 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Monitoring Checkouts
              </div>
            </div>
          </div>
          
          <p className="text-[13px] text-muted-foreground mb-6 relative z-10 leading-relaxed">
            Automatically calls customers who abandoned their carts or had failed payments, offering assistance and resolving purchasing friction.
          </p>

          <div className="space-y-3 mb-6 relative z-10">
            <div className="flex items-center gap-2 text-[12px] text-muted-foreground bg-muted/50 p-2 rounded-md">
              <Bot className="h-3.5 w-3.5 text-foreground/70" />
              Connected to Shopify Webhooks
            </div>
            <div className="flex items-center gap-2 text-[12px] text-muted-foreground bg-muted/50 p-2 rounded-md">
              <Sparkles className="h-3.5 w-3.5 text-foreground/70" />
              Dynamic Cart Context enabled
            </div>
          </div>

          <Button 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-9 text-[13px] font-medium rounded-md shadow-sm relative z-10"
            onClick={() => window.open(SARVAM_URL, '_blank')}
          >
            Configure Outbound Agent <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
