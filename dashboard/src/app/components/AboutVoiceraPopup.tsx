import { useState } from "react";
import { Info, X, Check, Clock } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const WORKING_ITEMS = [
  "Google Sign-In authentication",
  "Inbound calls, try it: +91 8071581996",
  "Voice agent built with Sarvam AI",
  "Connected to a demo Shopify store for cart recovery",
  "Live dashboard showing real call and recovery data",
  "AI Chat assistant that can answer questions about your data",
];

const BUILDING_ITEMS = ["Outbound recovery calls", "Multi-user team accounts"];

export function AboutVoiceraPopup() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium shadow-md transition-transform hover:scale-105 active:scale-95"
        style={{ background: "#0c2d6b", color: "#e6f1fb" }}
      >
        <Info size={16} />
        About Voicera
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.3, bounce: 0.2 }}
              className="relative w-full max-w-[420px] max-h-[90vh] overflow-auto rounded-2xl bg-card border border-border p-6 shadow-xl"
            >
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute top-4 right-4 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2.5 mb-4">
                <img src="/logo.png" alt="Voicera Logo" className="h-8 w-8 object-contain" />
                <span
                  className="text-[1.35rem] font-semibold text-foreground tracking-tight"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Voicera
                </span>
              </div>

              <p className="text-sm text-foreground/80 mb-2 leading-relaxed">
                Voicera is an AI voice platform that answers customer calls and
                recovers abandoned carts automatically, built for e-commerce
                teams.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                This is an early build. Here's exactly what's real right now.
              </p>

              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                What's working
              </p>
              <ul className="flex flex-col gap-2.5 mb-6">
                {WORKING_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                    <Check size={16} className="shrink-0 mt-[2px] text-green-500" />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>

              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Still building
              </p>
              <ul className="flex flex-col gap-2.5">
                {BUILDING_ITEMS.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <Clock size={16} className="shrink-0 mt-[2px] opacity-70" />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
