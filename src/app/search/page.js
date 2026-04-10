"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, Zap } from "lucide-react";
import AllPosts from "@/components/AllBlog";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight underline transform -rotate-1 decoration-primary">Intelligence Search</h1>
            <p className="text-muted-foreground text-lg font-medium">Deep dive into the Krymoz knowledge network.</p>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative glass-card rounded-[2.5rem] p-4 flex items-center gap-4 border-2 border-primary/20 focus-within:border-primary transition-all">
              <Search className="text-primary ml-4" size={28} />
              <input 
                type="text" 
                placeholder="Search articles, AI trends, tech guides..." 
                className="w-full bg-transparent border-none outline-none text-xl font-bold placeholder:text-muted-foreground/50 h-16"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-10">
            <div className="flex items-center gap-3 mb-10 text-primary font-black uppercase tracking-[0.2em] text-xs">
              <Zap size={16} className="fill-primary" /> Active Search Grid
            </div>
            {/* We reuse the AllPosts component which has the grid logic */}
            <AllPosts />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
