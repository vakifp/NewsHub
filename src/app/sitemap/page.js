"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import { motion } from "framer-motion";
import { Map, FileText, Folder, Globe } from "lucide-react";

export default function Sitemap() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function load() {
      const pSnap = await getDocs(query(collection(db, "posts"), orderBy("created", "desc")));
      const cSnap = await getDocs(collection(db, "categories"));
      setPosts(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setCategories(cSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="max-w-[1440px] mx-auto px-6 py-24 md:py-32">
        <header className="mb-20 space-y-4">
           <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.3em]">
             <Map size={16} /> Repository Structure
           </div>
           <h1 className="text-5xl md:text-6xl font-black tracking-tighter">Sitemap</h1>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
          {/* CORE PAGES */}
          <section className="space-y-8">
            <h2 className="text-xl font-black flex items-center gap-3 border-b border-border pb-4">
              <Globe size={20} className="text-primary" /> Core Navigation
            </h2>
            <ul className="space-y-4 font-bold text-muted-foreground">
              {["/", "/AllPosts", "/about", "/contact", "/login", "/register"].map(href => (
                <li key={href}>
                   <Link href={href} className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform duration-300">
                     {href === "/" ? "Homepage" : href.substring(1).charAt(0).toUpperCase() + href.substring(2)}
                   </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* CATEGORIES */}
          <section className="space-y-8">
            <h2 className="text-xl font-black flex items-center gap-3 border-b border-border pb-4">
              <Folder size={20} className="text-orange-500" /> Categories
            </h2>
            <ul className="space-y-4 font-bold text-muted-foreground">
              {categories.map(cat => (
                <li key={cat.id}>
                   <Link href={`/category/${cat.slug}`} className="hover:text-primary transition-colors capitalize">
                     {cat.name}
                   </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* ARTICLES (Limited for clean UI) */}
          <section className="space-y-8 md:col-span-2 lg:col-span-1">
            <h2 className="text-xl font-black flex items-center gap-3 border-b border-border pb-4">
              <FileText size={20} className="text-emerald-500" /> Recent Articles
            </h2>
            <ul className="space-y-4 font-bold text-muted-foreground">
              {posts.slice(0, 15).map(post => (
                <li key={post.id}>
                   <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors line-clamp-1">
                     {post.title}
                   </Link>
                </li>
              ))}
              <li className="pt-4">
                <Link href="/AllPosts" className="text-primary text-xs uppercase tracking-widest hover:underline">
                  View full archive +
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
