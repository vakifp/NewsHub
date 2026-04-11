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
      <main className="flex-grow pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-[1440px] mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-7xl font-black tracking-tighter transform -rotate-1 origin-left">
                Intelligence <span className="text-primary underline decoration-4">Search</span>
              </h1>
              <p className="text-muted-foreground text-xl font-medium max-w-2xl leading-relaxed">
                Query our neural knowledge network. Access deep-dive technical intelligence and strategic industry trends in real-time.
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-[3rem] blur-2xl opacity-10 group-focus-within:opacity-25 transition-all duration-500" />
            <div className="relative glass-card rounded-[2.5rem] p-6 flex items-center gap-6 border-2 border-primary/10 focus-within:border-primary focus-within:ring-8 focus-within:ring-primary/5 transition-all duration-500 shadow-2xl">
              <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                <Search size={32} strokeWidth={2.5} />
              </div>
              <input 
                type="text" 
                placeholder="Search articles, neural mesh trends, graphene motherboards..." 
                className="w-full bg-transparent border-none outline-none text-2xl md:text-3xl font-black placeholder:text-muted-foreground/30 h-16 tracking-tight"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="pt-8">
             <AllPosts searchQuery={query} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
