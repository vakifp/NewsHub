"use client";
import { useState } from "react";
import { seedDatabase } from "@/lib/content_seed";
import { RefreshCw, CheckCircle, AlertCircle, Zap } from "lucide-react";

export default function SeedButton() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, loading, success, error

  const handleSeed = async () => {
    if (!confirm("CRITICAL: This will PURGE all existing short-form content and replace it with 10+ High-Value Editorial Articles (1500+ words). Proceed?")) return;
    
    setLoading(true);
    setStatus("loading");
    
    try {
      const success = await seedDatabase();
      if (success) {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 5000);
        window.location.reload(); // Reload to see new data
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border-2 border-primary/20 rounded-[2.5rem] p-8 space-y-6 shadow-xl shadow-primary/5 relative overflow-hidden group">
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Zap size={20} className="fill-primary" />
          </div>
          <h3 className="text-xl font-black tracking-tight">AdSense Content Recovery</h3>
        </div>
        
        <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6">
          Resolves "Low Value Content" by purging thin posts and seeding <span className="text-foreground font-bold italic">10 Professional Editorial Articles</span> (1500–2000 words each) with optimized SEO and AI-generated insight.
        </p>

        <button
          onClick={handleSeed}
          disabled={loading}
          className={`
            w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all
            ${status === "idle" ? "bg-primary text-white hover:scale-[1.02] shadow-lg shadow-primary/20" : ""}
            ${status === "loading" ? "bg-muted text-muted-foreground cursor-not-allowed" : ""}
            ${status === "success" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : ""}
            ${status === "error" ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : ""}
          `}
        >
          {status === "idle" && (
            <>
              <RefreshCw size={18} /> Fix Low Value Content
            </>
          )}
          {status === "loading" && (
            <>
              <RefreshCw size={18} className="animate-spin" /> Seeding High-Value Matrix...
            </>
          )}
          {status === "success" && (
            <>
              <CheckCircle size={18} /> Content Synchronized
            </>
          )}
          {status === "error" && (
            <>
              <AlertCircle size={18} /> Seeding Failed
            </>
          )}
        </button>
      </div>

      {/* Decorative background element */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
    </div>
  );
}
