"use client";

import { Home, Search, Compass, User, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { name: "Home", icon: Home, href: "/" },
  { name: "Discovery", icon: Compass, href: "/AllPosts" },
  { name: "Search", icon: Search, href: "/search" },
  { name: "Profile", icon: User, href: "/admin" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-[100]">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "circOut" }}
        className="glass-card rounded-[2.5rem] p-3 flex items-center justify-between shadow-2xl relative overflow-hidden"
      >
        {/* Animated Background Indicator */}
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className="relative group">
              <div className={`p-4 rounded-full transition-all duration-300 flex flex-col items-center gap-1 ${isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}>
                <item.icon size={22} className={`${isActive ? "animate-pulse" : ""}`} />
                {isActive && (
                   <motion.div 
                     layoutId="mobileNavDot"
                     className="w-1 h-1 rounded-full bg-primary"
                   />
                )}
              </div>
            </Link>
          );
        })}

        {/* Floating Action Hint */}
        <div className="absolute top-0 right-4 -translate-y-1/2">
           <div className="bg-primary text-white p-1.5 rounded-full shadow-lg">
              <Sparkles size={10} className="fill-white" />
           </div>
        </div>
      </motion.div>
    </div>
  );
}
