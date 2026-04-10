"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, LayoutGrid, Settings, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function BottomNav() {
  const pathname = usePathname();

  // Hide BottomNav on Admin pages to maintain clean workspace
  if (pathname?.startsWith("/admin")) return null;

  const NavItem = ({ href, icon: Icon, label }) => {
    const isActive = pathname === href;

    return (
      <Link href={href} className="flex flex-col items-center justify-center flex-1 relative h-16">
        <motion.div
          animate={{
            scale: isActive ? 1.1 : 1,
            y: isActive ? -4 : 0
          }}
          className={`z-10 ${isActive ? "text-primary" : "text-muted-foreground"}`}
        >
          <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
        </motion.div>
        
        <span className={`text-[10px] font-black uppercase tracking-widest mt-1 z-10 ${isActive ? "text-primary" : "text-muted-foreground opacity-60"}`}>
          {label}
        </span>

        {isActive && (
          <motion.div
            layoutId="bottom-nav-active"
            className="absolute top-0 w-12 h-1 bg-primary rounded-full shadow-lg shadow-primary/40"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </Link>
    );
  };

  return (
    <div className="md:hidden fixed bottom-6 left-6 right-6 z-[100]">
      <div className="glass-card rounded-[2rem] border-border/40 shadow-2xl flex items-center justify-around px-4 bg-background/80 backdrop-blur-xl ring-1 ring-white/20">
        <NavItem href="/" icon={Home} label="Home" />
        <NavItem href="/search" icon={Search} label="Search" />
        <NavItem href="/categories" icon={LayoutGrid} label="Explore" />
        <NavItem href="/pages" icon={FileText} label="Pages" />
        <NavItem href="/admin" icon={Settings} label="Admin" />
      </div>
    </div>
  );
}
