"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, ArrowRight, Bookmark, Share2 } from "lucide-react";

export default function BlogCard({ post = {}, loading = false, variant = "grid" }) {
  if (loading) {
    return (
      <div className="flex flex-col h-full rounded-[2rem] border border-border/50 bg-card/50 overflow-hidden relative">
        <div className="h-56 bg-muted relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
        </div>
        <div className="p-8 space-y-4">
          <div className="h-3 bg-muted rounded-full w-1/4 animate-pulse" />
          <div className="h-6 bg-muted rounded-xl w-3/4 animate-pulse" />
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded-full w-full animate-pulse" />
            <div className="h-3 bg-muted rounded-full w-5/6 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const title = post.title || "Untitled Article";
  const desc = post.desc?.replace(/<[^>]+>/g, "") || "";
  const category = post.category || "General";
  const postUrl = `/blog/${post.slug}`;



  /* ================= STYLE 1: MODERN GRID (DEFAULT) ================= */
  if (variant === "grid") {
    return (
      <Link
        href={postUrl}
        className="group flex flex-col h-full bg-card border border-border/50 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-shadow duration-500"
      >
        <div className="relative h-64 overflow-hidden bg-muted">
          <Image 
            src={post.img || "/placeholder.jpg"} 
            alt={title} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700" 
          />
          <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest border border-white/20 z-10 text-emerald-600 dark:text-emerald-400 shadow-sm">
            {category}
          </div>
        </div>
        <div className="p-8 flex flex-col flex-1 gap-4">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <span className="flex items-center gap-1.5"><Clock size={12} className="text-primary" /> {post.time || "Recent"}</span>
            <span className="flex items-center gap-1.5"><Eye size={12} className="text-primary" /> {post.views || 0}</span>
          </div>
          <h3 className="text-xl font-black leading-tight group-hover:text-primary transition-colors line-clamp-2">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{desc}</p>
        </div>
      </Link>
    );
  }

  /* ================= STYLE 2: FULL OVERLAY (GLASS) ================= */
  if (variant === "overlay") {
    return (
      <Link
        href={postUrl}
        className="group relative h-[400px] rounded-[2.5rem] overflow-hidden shadow-xl bg-muted"
      >
        <Image 
          src={post.img || "/placeholder.jpg"} 
          alt={title} 
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-1000 will-change-transform group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 w-full">
          <span className="px-3 py-1 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest mb-4 inline-block">{category}</span>
          <h3 className="text-2xl font-black text-white leading-tight line-clamp-2">{title}</h3>
        </div>
      </Link>
    );
  }

  /* ================= STYLE 3: WIDE (MEDIA LEFT) ================= */
  if (variant === "wide") {
    return (
      <Link
        href={postUrl}
        className="group flex flex-col md:flex-row gap-6 p-4 rounded-[2.5rem] bg-accent/20 border border-transparent hover:border-primary/20 hover:bg-white dark:hover:bg-card transition-colors"
      >
        <div className="md:w-1/3 aspect-video md:aspect-square rounded-[2rem] overflow-hidden shrink-0 relative bg-muted">
          <Image 
            src={post.img || "/placeholder.jpg"} 
            alt={title} 
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700" 
          />
        </div>
        <div className="flex flex-col justify-center gap-3 pr-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">{category}</span>
          <h3 className="text-lg font-black leading-tight group-hover:text-primary transition-colors line-clamp-2">{title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">{desc}</p>
        </div>
      </Link>
    );
  }

  /* ================= STYLE 4: MINIMAL (TEXT ONLY) ================= */
  if (variant === "minimal") {
    return (
      <Link href={postUrl} className="group p-8 rounded-[2.5rem] border border-border/50 bg-card hover:bg-primary/5 transition-all">
        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{category}</span>
          <h3 className="text-2xl font-black leading-[1.1] group-hover:text-primary transition-colors decoration-primary/30 decoration-2 underline-offset-4 group-hover:underline">
            {title}
          </h3>
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
             <span className="text-[10px] font-bold text-muted-foreground uppercase">{post.views || 0} READS</span>
             <ArrowRight size={18} className="text-primary translate-x-1" />
          </div>
        </div>
      </Link>
    );
  }

  /* ================= STYLE 5: COMPACT LIST (APP STYLE) ================= */
  return (
    <Link href={postUrl} className="flex items-center gap-5 group p-2 rounded-3xl hover:bg-primary/5 transition-all outline outline-1 outline-transparent hover:outline-primary/10">
      <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden shrink-0 relative bg-muted shadow-lg shadow-black/5">
        <Image 
          src={post.img || "/placeholder.jpg"} 
          alt={title} 
          fill
          sizes="96px"
          className="object-cover group-hover:scale-110 transition-transform duration-700 will-change-transform" 
        />
      </div>
      <div className="flex flex-col gap-2 flex-grow">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-primary px-2 py-0.5 rounded-full bg-primary/5">
            {category}
          </span>
          <span className="text-[9px] font-bold text-muted-foreground uppercase">{post.time || "Recent"}</span>
        </div>
        <h4 className="font-black text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2 decoration-primary/20 decoration-2 hover:underline">
          {title}
        </h4>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-bold">
          <span className="flex items-center gap-1"><Eye size={12} /> {post.views || 0}</span>
          <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}