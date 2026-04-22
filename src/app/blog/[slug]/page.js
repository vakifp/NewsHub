"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  increment
} from "firebase/firestore";
import Header from "@/components/Header";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import DOMPurify from "dompurify";
import { Clock, Eye, Share2, Bookmark, ChevronLeft, Calendar, User, MessageSquare, TrendingUp } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import CommentSection from "@/components/CommentSection";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function Details() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("latest");

  const { scrollYProgress } = useScroll();
  const scrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "posts"), where("slug", "==", slug))
        );
        if (snap.empty) {
          setPost("notfound");
          return;
        }
        const currentPost = {
          id: snap.docs[0].id,
          ...snap.docs[0].data()
        };
        setPost(currentPost);

        /* increment views */
        updateDoc(doc(db, "posts", currentPost.id), {
          views: increment(1)
        });

        /* related posts by same category */
        const relatedSnap = await getDocs(
          query(collection(db, "posts"), where("category", "==", currentPost.category))
        );
        setPosts(
          relatedSnap.docs.map(d => ({
            id: d.id,
            slug: d.data().slug || d.id,
            ...d.data()
          }))
        );
      } catch (err) {
        console.error(err);
        setPost("notfound");
      }
    })();
  }, [slug]);

  /* ================= SIDEBAR & READ TIME ================= */
  const sidebarList = useMemo(() => {
    const list = activeTab === "latest" 
      ? posts.slice(0, 5) 
      : [...posts].sort((a,b)=>(b.views||0)-(a.views||0)).slice(0, 5);
    return list;
  }, [posts, activeTab]);

  const readTime = Math.max(
    1,
    Math.ceil((post?.desc?.replace(/<[^>]+>/g, "").split(" ").length || 0) / 200)
  );

  const related = useMemo(() => {
    if (!post?.category) return [];
    return posts.filter(p => p.id !== post.id).slice(0, 3);
  }, [posts, post]);

  /* ================= LOADER SKELETON ================= */
  if (post === null) {
    return (
      <div className="bg-background min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-20 animate-pulse">
          <div className="h-4 w-24 bg-muted rounded-full mb-8" />
          <div className="h-12 bg-muted rounded-xl w-3/4 mb-6" />
          <div className="flex gap-4 mb-12">
            <div className="h-4 w-32 bg-muted rounded-full" />
            <div className="h-4 w-32 bg-muted rounded-full" />
          </div>
          <div className="h-[450px] bg-muted rounded-[2.5rem] mb-12" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-4 bg-muted rounded w-full" />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (post === "notfound") {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-4xl font-black mb-4">404: Article Vanished</h2>
          <p className="text-muted-foreground mb-8">The story you're looking for has been moved or deleted.</p>
          <Link href="/" className="px-8 py-3 bg-primary text-white rounded-full font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105">
            Back to Homepage
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen overflow-x-hidden">
      <Header />
      
      {/* SCHEMA.ORG JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": post.title,
            "image": [post.img || "https://www.krymoz.com/placeholder.jpg"],
            "datePublished": new Date(post.created || Date.now()).toISOString(),
            "dateModified": new Date(post.created || Date.now()).toISOString(),
            "author": [{
                "@type": "Person",
                "name": post.author || "Krymoz Editorial Team",
                "url": "https://www.krymoz.com/about"
              }]
          })
        }}
      />
      
      {/* PROGRESS BAR */}
      <motion.div 
        className="fixed top-0 left-0 h-1.5 bg-primary z-[70] origin-left"
        style={{ scaleX: scrollProgress }}
      />

      <article className="relative">
        <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        
        {/* HERO SECTION */}
        <div className="max-w-5xl mx-auto px-6 pt-10 md:pt-24 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="flex items-center gap-3">
              <Link href={`/category/${post.category}`} className="px-5 py-2 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20">
                {post.category || "Insight"}
              </Link>
              <div className="w-1.5 h-1.5 rounded-full bg-border" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{post.time || "Editorial"}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] max-w-5xl balance whitespace-pre-line group">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 group-hover:from-primary group-hover:to-primary/70 transition-all duration-1000">
                {post.title}
              </span>
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-8 text-xs text-muted-foreground font-black uppercase tracking-widest pt-4">
              <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-full border border-border/50">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white font-bold text-[10px]">
                  {post.author ? post.author[0] : "K"}
                </div>
                <span className="text-foreground">{post.author || "Krymoz Editorial"}</span>
              </div>
              <span className="flex items-center gap-2"><Clock size={16} className="text-primary" /> {readTime} min deep dive</span>
              <span className="flex items-center gap-2"><Eye size={16} className="text-primary" /> {post.views || 0} reads</span>
            </div>
          </motion.div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
          
          <main className="flex flex-col gap-16">
            
            {/* BREADCRUMBS */}
            <div className="flex justify-center -mt-10 mb-6">
              <Breadcrumbs />
            </div>

            {/* FLOATING ACTION BAR: Fixed on Desktop */}
            <div className="hidden xl:block fixed left-[calc(50%-550px)] top-1/2 -translate-y-1/2 z-40">
              <div className="flex flex-col gap-6 items-center bg-card/40 backdrop-blur-xl p-5 rounded-full border border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
                <button 
                  onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title)}%20${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="p-3.5 rounded-full hover:bg-emerald-500 hover:text-white transition-all hover:scale-110 active:scale-90"
                  title="Share on WhatsApp"
                >
                  <MessageSquare size={22} className="fill-emerald-500/20" />
                </button>
                <div className="w-8 h-px bg-border/50" />
                <button 
                  onClick={() => window.open(`http://twitter.com/share?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="p-3.5 rounded-full hover:bg-sky-500 hover:text-white transition-all hover:scale-110 active:scale-90"
                  title="Share on X"
                >
                  <Share2 size={22} className="fill-sky-500/20" />
                </button>
                <div className="w-8 h-px bg-border/50" />
                <button className="p-3.5 rounded-full hover:bg-primary hover:text-white transition-all hover:scale-110 active:scale-90">
                  <Bookmark size={22} />
                </button>
              </div>
            </div>

            {/* FEATURED IMAGE WITH CAPTION */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="rounded-[4rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] ring-1 ring-white/10 aspect-[16/9] bg-muted relative group">
                <Image
                  src={post.img || "/placeholder.jpg"}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-[2s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Visualizing: {post.title} • Generated by Krymoz Vision AI
              </p>
            </motion.div>

            {/* BODY TEXT: HIGH DENSITY EDITORIAL */}
            <div className="flex flex-col items-center">
              <div
                className="prose prose-lg md:prose-2xl dark:prose-invert prose-slate 
                max-w-3xl w-full text-left font-medium leading-relaxed
                prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-foreground
                prose-p:text-muted-foreground prose-p:leading-[1.8]
                prose-strong:text-foreground prose-strong:font-black
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-[2.5rem] prose-img:shadow-2xl
                selection:bg-primary/30"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(post.desc)
                }}
              />
            </div>

            {/* RELATED SECTION AT BOTTOM */}
            {related.length > 0 && (
              <div className="mt-20 py-20 border-t border-border">
                <div className="flex items-center justify-between mb-12">
                  <h3 className="text-3xl font-black tracking-tight flex items-center gap-3">
                    <TrendingUp size={32} className="text-primary" /> Recommendation Engine
                  </h3>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  {related.map(p => (
                    <Link
                      key={p.id}
                      href={`/blog/${p.slug}`}
                      className="group flex flex-col gap-4 p-6 rounded-[2.5rem] bg-accent/30 border border-transparent hover:border-primary/20 hover:bg-white dark:hover:bg-card transition-all duration-500 shadow-sm"
                    >
                      <div className="aspect-video rounded-[1.5rem] overflow-hidden relative">
                        <Image src={p.img} alt={p.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <h4 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {p.title}
                      </h4>
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground pt-2">
                        <span>{p.time || "Recent Insights"}</span>
                        <ChevronLeft size={16} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* TRENDING SECTION (FORMER SIDEBAR) */}
            <div className="mt-10 p-10 bg-primary/5 rounded-[3rem] border border-primary/10">
              <h4 className="font-black text-xs uppercase tracking-[0.2em] text-primary mb-10 text-center">Trending Across the Network</h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sidebarList.map((p, i) => (
                  <Link key={p.id} href={`/blog/${p.slug}`} className="flex gap-6 group items-start">
                    <span className="text-4xl font-black text-primary/10 group-hover:text-primary/40 transition-colors">
                      {(i + 1).toString().padStart(2, '0')}
                    </span>
                    <div className="space-y-2">
                      <p className="font-bold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {p.title}
                      </p>
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">{p.category}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* COMMENT SECTION */}
            <CommentSection postId={post.id} />
          </main>
        </div>
      </article>

      <Footer />
    </div>
  );
}