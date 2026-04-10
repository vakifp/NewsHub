"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function CategoryPage() {
  const { slug } = useParams();
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("latest");

  /* SLUGIFY HELPER */
  function slugify(text = "") {
    return text.toLowerCase().trim().replace(/\s+/g, "-");
  }

  /* LOAD POSTS */
  useEffect(() => {
    if (!slug) return;
    (async () => {
      const q = query(collection(db, "posts"), orderBy("created", "desc"));
      const snap = await getDocs(q);
      const all = snap.docs.map(d => ({
        id: d.id,
        slug: d.data().slug || d.id,
        ...d.data()
      }));
      const normalizedSlug = slug.toLowerCase();
      setPosts(all.filter(p => slugify(p.category) === normalizedSlug));
    })();
  }, [slug]);

  /* SIDEBAR DATA */
  const popular = useMemo(() => [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5), [posts]);
  const list = activeTab === "latest" ? posts.slice(0, 5) : popular;

  return (
    <div className="bg-background min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* LEFT: POSTS FEED */}
          <div className="lg:col-span-8">
            <header className="mb-12 space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em]">
                <Sparkles size={14} className="fill-primary" /> Curated Archive
              </div>
              <h1 className="text-4xl md:text-6xl font-black capitalize tracking-tight">
                {slug.replace(/-/g, " ")}
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl font-medium leading-relaxed">
                Deep dive into our expert selection of articles and insights categorized under {slug.replace(/-/g, " ")}.
              </p>
            </header>

            {posts.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-border rounded-[2.5rem]">
                <p className="text-muted-foreground font-bold italic">No articles yet in this category.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {posts.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <BlogCard post={p} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: SIDEBAR */}
          <aside className="lg:col-span-4">
            <div className="sticky top-32 glass-card rounded-[2.5rem] p-8 border border-border/50">
              <h4 className="font-black text-xs uppercase tracking-[0.2em] text-primary mb-6 flex items-center gap-2">
                <TrendingUp size={16} /> Trends in {slug}
              </h4>
              
              <div className="flex gap-4 mb-8 bg-muted/50 p-1 rounded-full">
                {["latest", "popular"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === tab ? "bg-primary text-white shadow-lg" : "text-muted-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                {list.map((p, i) => (
                  <Link key={p.id} href={`/blog/${p.slug}`} className="flex gap-4 group">
                    <span className="text-xl font-black text-primary/10 group-hover:text-primary/30 transition-colors pt-1">
                      {(i + 1).toString().padStart(2, '0')}
                    </span>
                    <div className="space-y-1">
                      <p className="font-bold text-xs leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {p.title}
                      </p>
                      <span className="text-[10px] font-medium text-muted-foreground uppercase">{p.category}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </main>

      <Footer />
    </div>
  );
}