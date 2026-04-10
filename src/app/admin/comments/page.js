"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { 
  MessageSquare, 
  CheckCircle2, 
  Trash2, 
  Clock, 
  User, 
  Mail, 
  Filter, 
  Search,
  ExternalLink,
  ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending"); // pending, approved

  useEffect(() => {
    const q = query(collection(db, "comments"), orderBy("createdAt", "desc"));
    
    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => unsub();
  }, []);

  async function approve(id) {
    await updateDoc(doc(db, "comments", id), { status: "approved" });
  }

  async function remove(id) {
    if (confirm("Delete this comment permanently?")) {
      await deleteDoc(doc(db, "comments", id));
    }
  }

  const filtered = comments.filter(c => c.status === filter);

  if (loading) return <div className="p-20 text-center font-bold animate-pulse">Synchronizing communication channels...</div>;

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight">Comment Moderation</h1>
          <p className="text-muted-foreground font-medium">Protecting your editorial integrity from spam and noise.</p>
        </div>

        <div className="flex bg-white dark:bg-[#0b1220] p-1.5 rounded-2xl border dark:border-gray-800 shadow-sm">
          {["pending", "approved"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === f ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:bg-accent"
              }`}
            >
              {f} ({comments.filter(c => c.status === f).length})
            </button>
          ))}
        </div>
      </header>

      <div className="space-y-6">
        {filtered.length === 0 ? (
          <div className="p-20 text-center bg-white dark:bg-[#0b1220] rounded-[2.5rem] border border-dashed border-border opacity-50">
            <ShieldAlert size={48} className="mx-auto text-primary mb-4" />
            <p className="font-bold text-muted-foreground italic tracking-tight">Everything is clear in the {filter} queue.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            <AnimatePresence>
              {filtered.map((comment) => (
                <motion.div
                  key={comment.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-[#0b1220] p-8 rounded-[2.5rem] border dark:border-gray-800 shadow-sm flex flex-col md:flex-row gap-8 items-start group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl flex-shrink-0">
                    {comment.name[0].toUpperCase()}
                  </div>
                  
                  <div className="flex-1 space-y-4 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-primary" />
                        <span className="font-black text-sm">{comment.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail size={14} />
                        <span className="text-xs font-medium truncate">{comment.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock size={14} />
                        <span className="text-xs font-medium">
                          {comment.createdAt?.toDate().toLocaleString() || "Syncing..."}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm font-medium leading-relaxed bg-accent/30 p-4 rounded-2xl border border-border/50">
                      {comment.content}
                    </p>

                    <p className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2">
                      <ExternalLink size={12} /> Post ID: <span className="text-primary">{comment.postId}</span>
                    </p>
                  </div>

                  <div className="flex md:flex-col gap-2 flex-shrink-0">
                    {filter === "pending" && (
                      <button 
                        onClick={() => approve(comment.id)}
                        className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                        title="Approve Comment"
                      >
                        <CheckCircle2 size={20} />
                      </button>
                    )}
                    <button 
                      onClick={() => remove(comment.id)}
                      className="p-3 rounded-2xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all shadow-sm"
                      title="Delete Comment"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
