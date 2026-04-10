"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { MessageSquare, Send, User, Clock, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!postId) return;

    const q = query(
      collection(db, "comments"),
      where("postId", "==", postId),
      where("status", "==", "approved")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      setComments(list);
    });

    return () => unsub();
  }, [postId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.content) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "comments"), {
        postId,
        name: form.name,
        email: form.email,
        content: form.content,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setForm({ name: "", email: "", content: "" });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <div className="mt-16 pt-16 border-t border-border">
      <div className="flex items-center gap-3 mb-10">
        <MessageSquare size={28} className="text-primary" />
        <h3 className="text-3xl font-black tracking-tight">Community Discussion</h3>
        <span className="bg-accent px-3 py-1 rounded-full text-xs font-bold text-muted-foreground ml-2">
          {comments.length}
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        
        {/* FORM */}
        <div className="space-y-6">
          <div className="bg-accent/30 p-8 rounded-[2rem] border border-border/50">
            <h4 className="font-bold mb-6 flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary" /> Share Your Perspective
            </h4>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  placeholder="Full Name"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
                <input
                  type="email"
                  placeholder="Email (Private)"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <textarea
                placeholder="What are your thoughts on this article?"
                rows={4}
                value={form.content}
                onChange={e => setForm({...form, content: e.target.value})}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
              />
              
              <button
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden"
              >
                {loading ? "Transmitting..." : "Post Comment"}
              </button>
            </form>

            <AnimatePresence>
              {submitted && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 text-xs font-bold text-emerald-500 text-center"
                >
                  Comment submitted for moderation. Thank you!
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <p className="text-[10px] text-muted-foreground px-4 italic">
            * All comments are moderated before publication to ensure high-quality discussion.
          </p>
        </div>

        {/* LIST */}
        <div className="space-y-6">
          {comments.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-[2rem] opacity-50">
              <p className="font-bold text-muted-foreground italic">Be the first to start the conversation.</p>
            </div>
          ) : (
            comments.map((comment, i) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-[2rem] bg-white dark:bg-card border border-border/40 shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {comment.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-sm">{comment.name}</p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <Clock size={12} />
                        <span>{comment.createdAt?.toDate().toLocaleDateString() || "Recently"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground font-medium whitespace-pre-wrap">
                  {comment.content}
                </p>
              </motion.div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
