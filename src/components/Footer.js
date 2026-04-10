"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, "settings", "main"));
      if (snap.exists()) setSettings(snap.data());
    }
    load();
  }, []);

  if (!settings) return null;

  return (
    <footer className="bg-background border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* BRAND & DESC */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              {settings.logo ? (
                <img src={settings.logo} className="h-10" alt="Logo" />
              ) : (
                <span className="font-extrabold text-2xl tracking-tighter text-primary">
                  {settings.siteName || "Krymoz"}
                </span>
              )}
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {settings.footerText || "Your go-to source for the latest news, Windows tips, and troubleshooting guides. We simplify tech for you."}
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: settings.facebook, color: "hover:text-blue-500" },
                { icon: Twitter, href: settings.twitter, color: "hover:text-sky-400" },
                { icon: Instagram, href: settings.instagram, color: "hover:text-pink-500" },
                { icon: Youtube, href: settings.youtube, color: "hover:text-red-500" },
              ].map((social, i) => social.href && (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-xl bg-accent/50 transition-all ${social.color} hover:scale-110 active:scale-95`}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="font-bold text-base mb-6 uppercase tracking-widest text-foreground/70">Navigation</h3>
            <ul className="space-y-4">
              {[
                { name: "Home", href: "/" },
                { name: "All Articles", href: "/AllPosts" },
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
                { name: "Privacy Policy", href: "/privacy-policy" },
                { name: "Disclosure", href: "/disclosure" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center group">
                    <span>{link.name}</span>
                    <ArrowUpRight size={14} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CATEGORIES */}
          <div>
            <h3 className="font-bold text-base mb-6 uppercase tracking-widest text-foreground/70">Trending Topics</h3>
            <ul className="space-y-4">
              {[
                { name: "Windows Guides", href: "/category/windows" },
                { name: "Tech News", href: "/category/tech" },
                { name: "Error Fixes", href: "/category/fixes" },
                { name: "How To", href: "/category/how-to" },
                { name: "Lifestyle", href: "/category/lifestyle" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center group">
                    <span>{link.name}</span>
                    <ArrowUpRight size={14} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT INFO / NEWSLETTER */}
          <div className="space-y-6">
            <h3 className="font-bold text-base mb-6 uppercase tracking-widest text-foreground/70">Newsletter</h3>
            <p className="text-muted-foreground text-sm">Subscribe to get the latest tech fixes directly in your inbox.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-accent/50 border border-border px-4 py-2.5 rounded-xl text-sm w-full focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
              <button className="bg-primary text-primary-foreground p-3 rounded-xl hover:opacity-90 transition-all">
                <Mail size={18} />
              </button>
            </div>
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin size={16} className="text-primary" />
                <span>Global Digital Platform</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail size={16} className="text-primary" />
                <span>support@krymoz.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/60 font-medium">
          <p>© {year} {settings.copyright || settings.siteName || "Krymoz"}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms-of-service" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/" className="hover:text-foreground transition-colors">Cookie Policy</Link>
            <Link href="/" className="hover:text-foreground transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}