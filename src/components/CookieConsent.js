"use client";

import { useState, useEffect } from "react";
import { X, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "granted");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 inset-x-6 z-[100] flex justify-center"
        >
          <div className="bg-card/80 backdrop-blur-2xl border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] p-6 md:p-8 rounded-[2.5rem] max-w-2xl w-full flex flex-col md:flex-row items-center gap-8 ring-1 ring-white/5">
            <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ShieldCheck size={32} />
            </div>
            
            <div className="flex-grow space-y-2 text-center md:text-left">
              <h3 className="font-black text-lg tracking-tight">Privacy Excellence</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We use high-fidelity cookies to enhance your editorial journey and analyze site intelligence. 
                Read our <Link href="/cookie-policy" className="text-primary hover:underline font-bold">Cookie Policy</Link> for details.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button 
                onClick={accept}
                className="bg-primary text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Accept All <ArrowRight size={14} />
              </button>
              <button 
                onClick={() => setShow(false)}
                className="bg-accent/50 text-foreground px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-accent transition-all"
              >
                Settings
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
