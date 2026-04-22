"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter((path) => path);

  if (pathname === "/") return null;

  return (
    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
      <Link 
        href="/" 
        className="flex items-center gap-1.5 hover:text-primary transition-colors group"
      >
        <Home size={12} className="group-hover:scale-110 transition-transform" />
        <span>Home</span>
      </Link>

      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`;
        const isLast = index === paths.length - 1;
        const name = path.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

        return (
          <div key={path} className="flex items-center gap-2">
            <ChevronRight size={10} className="text-muted-foreground/30" />
            {isLast ? (
              <span className="text-foreground">{name}</span>
            ) : (
              <Link href={href} className="hover:text-primary transition-colors">
                {name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
