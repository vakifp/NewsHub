"use client";

import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import DOMPurify from "dompurify";
import BlogCard from "./BlogCard";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Grid, List, Sparkles } from "lucide-react";

export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [visible, setVisible] = useState(8);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH POSTS ---------------- */
  useEffect(() => {
    async function load() {
      try {
        const q = query(collection(db, "posts"), orderBy("created", "desc"));
        const snap = await getDocs(q);
        const list = snap.docs.map(doc => ({
          id: doc.id,
          slug: doc.data().slug || doc.id,
          ...doc.data()
        }));
        setPosts(list);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /* ---------------- VISIBLE POSTS ---------------- */
  const visiblePosts = useMemo(() => posts.slice(0, visible), [posts, visible]);

  /* ---------------- LOAD MORE ---------------- */
  function loadMore() {
    setVisible(v => v + 8);
  }

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em]">
              <Sparkles size={14} className="fill-primary" /> Discovery
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Browse All Articles</h2>
            <p className="text-muted-foreground max-w-xl text-lg font-medium leading-relaxed">
              Explore our complete collection of technical guides, news updates, and expert troubleshooting tips.
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-2xl border border-border/50">
             <button className="p-2.5 rounded-xl bg-background text-primary shadow-sm border border-border">
                <Grid size={18} />
             </button>
             <button className="p-2.5 rounded-xl text-muted-foreground hover:bg-background transition-all">
                <List size={18} />
             </button>
          </div>
        </div>

        {/* FEED GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <BlogCard key={i} loading={true} />
              ))
            ) : (
              visiblePosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <BlogCard post={post} variant="grid" />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* EMPTY STATE */}
        {!loading && posts.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <Zap size={48} className="mx-auto text-muted-foreground/30" />
            <p className="text-xl font-bold text-muted-foreground">No articles found in this archive.</p>
          </div>
        )}

        {/* LOAD MORE ACTION */}
        {visible < posts.length && (
          <div className="mt-20 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadMore}
              className="px-12 py-4 rounded-full bg-primary text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-4 mx-auto"
            >
              Load More Stories
              <div className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white animate-bounce" />
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
}