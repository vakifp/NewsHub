"use client";

import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import BlogCard from "./BlogCard";
import { Clock, Eye, TrendingUp, Zap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import AdSenseUnit from "./AdSenseUnit";

export default function BlogGrid() {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("latest");

  /* ---------------- LOAD POSTS ---------------- */
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
        console.error("Load error:", err);
      }
    }
    load();
  }, []);

  /* ---------------- TEXT CLEAN + LIMIT ---------------- */
  function shortTitle(text = "", words = 12) {
    if (typeof text !== "string") return "";
    const clean = text.replace(/<[^>]+>/g, "");
    const arr = clean.split(" ");
    return arr.length > words ? arr.slice(0, words).join(" ") + "..." : clean;
  }

  /* ---------------- DERIVED ---------------- */
  const featured = posts.length ? posts[0] : null;
  const latestPosts = useMemo(() => posts.slice(0, 5), [posts]);
  const popularPosts = useMemo(() => [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5), [posts]);

  if (posts.length === 0) {
    return (
      <section className="py-20 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse">Designing your feed...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-20 relative overflow-hidden">
      {/* BACKGROUND ACCENT */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] -z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                <Zap size={12} className="fill-primary" /> Editorial Focus
             </div>
             <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Today's Highlights</h2>
          </div>
          <Link href="/AllPosts" className="group flex items-center gap-3 text-sm font-bold text-muted-foreground hover:text-primary transition-all">
             Browse Discovery <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* TRIPLE COLUMN EDITORIAL GRID */}
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* COLUMN 1: THE MAIN FEATURE (5 Units) */}
          <div className="lg:col-span-5">
            {featured && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative h-[500px] md:h-[650px] rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-white/10"
              >
                <Image
                  src={featured.img || "/placeholder.jpg"}
                  alt={featured.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full space-y-6">
                  <span className="px-4 py-1.5 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest">
                    {featured.category || "Editor's Pick"}
                  </span>
                  <Link href={`/blog/${featured.slug}`}>
                    <h3 className="text-3xl md:text-4xl font-black text-white leading-tight hover:text-primary transition-colors cursor-pointer">
                      {featured.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-4 text-white/70 text-[10px] font-black uppercase tracking-widest pt-4 border-t border-white/10">
                    <span className="flex items-center gap-2"><Clock size={14} className="text-primary" /> {featured.time || "5m Read"}</span>
                    <span className="flex items-center gap-2"><Eye size={14} className="text-primary" /> {featured.views || 0}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* COLUMN 2: TRENDING LIST (4 Units) */}
          <div className="lg:col-span-4 space-y-8">
            <h3 className="text-xl font-black tracking-tight border-b border-border pb-4 flex items-center gap-3">
              <TrendingUp size={20} className="text-primary" /> Trending Now
            </h3>
            <div className="space-y-4">
              {posts.slice(1, 4).map((post, i) => (
                <motion.div 
                  key={post.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <BlogCard post={post} variant="compact" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* COLUMN 3: SIDEBAR DISCOVERY (3 Units) */}
          <div className="lg:col-span-3">
             <div className="bg-card/50 backdrop-blur-xl rounded-[2.5rem] border border-border/50 p-6 md:p-8 h-full">
                <div className="flex items-center justify-between mb-8 p-1 bg-accent/50 rounded-2xl">
                   <button 
                     onClick={() => setActiveTab('latest')}
                     className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'latest' ? 'bg-white dark:bg-black shadow-sm text-primary' : 'text-muted-foreground'}`}
                   >
                     Latest
                   </button>
                   <button 
                     onClick={() => setActiveTab('popular')}
                     className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'popular' ? 'bg-white dark:bg-black shadow-sm text-primary' : 'text-muted-foreground'}`}
                   >
                     Popular
                   </button>
                </div>

                <div className="space-y-6">
                   {(activeTab === 'latest' ? latestPosts : popularPosts).map((post, i) => (
                     <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                        <div className="flex gap-4 items-start">
                           <span className="text-2xl font-black text-muted-foreground/20 italic group-hover:text-primary transition-colors mt-0.5">
                              {(i + 1).toString().padStart(2, '0')}
                           </span>
                           <div className="space-y-1">
                              <h4 className="text-[13px] font-black leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                 {post.title}
                              </h4>
                              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                 {post.category}
                              </p>
                           </div>
                        </div>
                     </Link>
                   ))}
                </div>

                <div className="mt-10 pt-8 border-t border-border/50">
                   <div className="bg-primary/10 rounded-2xl p-4 text-center">
                      <p className="text-[10px] font-black text-primary uppercase mb-2">Join the Collective</p>
                      <p className="text-xs font-bold mb-4">Get the latest AI breakthroughs</p>
                      <button className="w-full bg-primary text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all">
                         Stay Updated
                      </button>
                   </div>
                </div>
             </div>
          </div>

        </div>
        
        {/* AD PLACEMENT: HIGH VISIBILITY HORIZONTAL UNIT */}
        <div className="mt-12">
           <AdSenseUnit />
        </div>

      </div>
    </section>
  );
}