"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import {
  LayoutDashboard,
  FileText,
  Folder,
  File,
  Users,
  Settings,
  LogOut,
  Menu,
  Search,
  ChevronDown,
  Bell,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

export default function AdminLayout({ children }) {
  const path = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  /* AUTH CHECK */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
      } else {
        router.push("/login");
      }
    });
    return () => unsub();
  }, [router]);

  /* LOGOUT */
  async function logout() {
    await signOut(auth);
    router.push("/login");
  }

  const menu = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Posts", href: "/admin/posts", icon: FileText },
    { name: "Categories", href: "/admin/categories", icon: Folder },
    { name: "Pages", href: "/admin/pages", icon: File },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings }
  ];

  function isActive(href) {
    return path === href || path.startsWith(href + "/");
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] flex">
      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-72 bg-white dark:bg-[#0b1220] border-r dark:border-gray-800
        transition-all duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="h-full flex flex-col p-6">
          {/* LOGO */}
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <ExternalLink className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tight text-foreground">
              News<span className="text-primary">Admin</span>
            </span>
          </div>

          {/* NAVIGATION */}
          <div className="flex-1 space-y-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-4">Management</span>
              <nav className="mt-4 space-y-1">
                {menu.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`
                        flex items-center justify-between px-4 py-3 rounded-xl transition-all group
                        ${active 
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 font-bold" 
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <ChevronRight size={14} className={`transition-transform ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* BOTTOM PROFILE */}
          <div className="pt-6 border-t dark:border-gray-800">
            <div className="bg-accent/50 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-indigo-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{user?.email?.split("@")[0] || "Admin"}</p>
                <p className="text-[10px] text-muted-foreground font-medium truncate">{user?.email}</p>
              </div>
              <button onClick={logout} className="text-muted-foreground hover:text-destructive transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP HEADER */}
        <header className="h-20 bg-white/80 dark:bg-[#0b1220]/80 backdrop-blur-md border-b dark:border-gray-800 px-6 md:px-10 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen(true)}
              className="md:hidden p-2.5 rounded-xl hover:bg-accent transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center bg-accent/50 border border-transparent focus-within:border-primary focus-within:bg-background px-4 rounded-xl transition-all">
              <Search size={18} className="text-muted-foreground" />
              <input
                placeholder="Search resources..."
                className="bg-transparent px-3 py-2.5 text-sm outline-none w-64 lg:w-96"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2.5 rounded-xl hover:bg-accent transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-white dark:ring-[#0b1220]" />
            </button>

            <ThemeToggle />
            
            <Link href="/" target="_blank" className="hidden sm:flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors border px-4 py-2 rounded-xl">
              Visit Site <ExternalLink size={14} />
            </Link>

            <div className="h-8 w-px bg-border mx-2" />

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-accent transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
                  {user?.email?.[0]?.toUpperCase() || "A"}
                </div>
                <ChevronDown size={14} className="text-muted-foreground mr-1" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-56 bg-white dark:bg-[#0b1220] border dark:border-gray-800 rounded-2xl shadow-xl p-2 z-50"
                  >
                    <div className="p-3 border-b dark:border-gray-800 mb-2">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Signed in as</p>
                      <p className="text-sm font-bold truncate">{user?.email}</p>
                    </div>
                    <button onClick={logout} className="w-full text-left px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/10 rounded-xl transition-all flex items-center gap-2">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-6 md:p-10 lg:p-12 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}