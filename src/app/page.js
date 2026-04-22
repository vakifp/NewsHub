import Header from "@/components/Header";
import Blog from "@/components/Blog";
import AllBlog from "@/components/AllBlog";
import Footer from "@/components/Footer";
import { Sparkles, ArrowRight, Zap, Target, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Krymoz",
            "url": "https://www.krymoz.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.krymoz.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      
      <Header />
      
      <main className="flex-grow">
        {/* HIGH-FIDELITY HERO SECTION */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          {/* AMBIENT BACKGROUND */}
          <div className="absolute top-0 inset-x-0 h-[800px] bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[120px]" />

          <div className="max-w-[1440px] mx-auto px-6 relative z-10">
            <div className="max-w-4xl space-y-10">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] animate-fade-in">
                <Sparkles size={14} className="fill-primary" /> The Architecture of Intelligence
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black tracking-[calc(-0.06em)] leading-[0.9] text-foreground lowercase">
                Deep-dive <span className="text-primary italic">insights</span> into the <span className="relative">future<span className="absolute bottom-2 left-0 w-full h-2 bg-primary/20 -z-10" /></span> of tech.
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
                Krymoz is a premier digital publication dedicated to high-impact AI research, future-tech strategy, and deep-dive editorial guides.
              </p>

              <div className="flex flex-wrap gap-6 pt-6">
                <Link href="/AllPosts" className="group bg-primary text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-4">
                  Explore Discovery <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center gap-6 px-4">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-accent" />
                    ))}
                  </div>
                  <div className="text-xs font-bold">
                    <p className="text-foreground">Joined by 10k+</p>
                    <p className="text-muted-foreground">Tech innovators</p>
                  </div>
                </div>
              </div>

              {/* TRUST BAR */}
              <div className="pt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                 <div className="flex items-center gap-3"><Zap size={20} /> <span className="font-black uppercase tracking-widest text-[10px]">Real-time Updates</span></div>
                 <div className="flex items-center gap-3"><Target size={20} /> <span className="font-black uppercase tracking-widest text-[10px]">Strategic Analysis</span></div>
                 <div className="flex items-center gap-3"><ShieldCheck size={20} /> <span className="font-black uppercase tracking-widest text-[10px]">Verified Guides</span></div>
                 <div className="flex items-center gap-3"><Sparkles size={20} /> <span className="font-black uppercase tracking-widest text-[10px]">AI Powered</span></div>
              </div>
            </div>
          </div>
        </section>

        <Blog />
        <AllBlog />
      </main>
      
      <Footer />
    </div>
  );
}

