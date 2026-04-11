"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [shadow, setShadow] = useState(false);
  const [cats, setCats] = useState([]);
  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => setMounted(true), []);

  /* ================= LOAD SETTINGS ================= */
  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, "settings", "main"));
      if (snap.exists()) {
        setSettings(snap.data());
        if (snap.data().primaryColor) {
          document.documentElement.style.setProperty("--primary", snap.data().primaryColor);
        }
      }
    }
    load();
  }, []);

  /* ================= SCROLL SHADOW ================= */
  useEffect(() => {
    const handleScroll = () => setShadow(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, "categories"));
      let list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
      setCats(list.filter(c => c.visible));
    }
    load();
  }, []);

  /* ================= AUTH ================= */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return () => unsub();
  }, []);

  const logout = async () => await signOut(auth);

  if (!mounted) return null;

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${shadow ? "glass" : "bg-background"}`}>
      <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between relative">
        {/* LEFT: LOGO + DESKTOP MENU */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 group relative">
            <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-2xl bg-primary/10 transition-transform group-hover:scale-105">
              <img 
                src="/logo.png" 
                alt="Krymoz Logo" 
                className="w-full h-full object-cover"
                width={48}
                height={48}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground bg-[length:200%_auto] animate-gradient-slow group-hover:tracking-normal transition-all">
                Krymoz
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 -mt-1 scale-90 origin-left">
                Intelligence
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex gap-8 font-medium">
            {cats.map(cat => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="text-muted-foreground hover:text-primary transition-colors capitalize text-sm tracking-wide"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT: THEME + AUTH + MOBILE MENU */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* THEME TOGGLE */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-accent ring-offset-background transition-all focus:ring-2 focus:ring-primary"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-700" />}
          </button>

          {/* USER ACTIONS (DESKTOP) */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4 bg-accent/50 px-4 py-1.5 rounded-full border">
                <span className="text-xs font-semibold max-w-[120px] truncate">{user.email}</span>
                <button
                  onClick={logout}
                  className="text-destructive hover:text-destructive/80 transition-colors"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
              >
                Login
              </Link>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setMenu(!menu)}
            className="lg:hidden p-2 text-foreground"
            aria-label="Toggle Menu"
          >
            {menu ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 w-full bg-background border-b shadow-2xl p-6 z-40"
          >
            <div className="flex flex-col gap-5">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Categories</span>
              {cats.map(cat => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="text-lg font-semibold hover:text-primary transition-colors capitalize py-1 border-l-2 border-transparent hover:border-primary pl-4"
                  onClick={() => setMenu(false)}
                >
                  {cat.name}
                </Link>
              ))}

              <hr className="my-2 border-muted" />

              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <User size={18} />
                    <span>{user.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMenu(false);
                    }}
                    className="w-full bg-destructive text-destructive-foreground py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setMenu(false)}>
                  <button className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/20">
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}