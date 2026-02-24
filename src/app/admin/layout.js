"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

/* ICONS */
import {
  LayoutDashboard,
  FileText,
  Folder,
  File,
  Users,
  Settings,
  LogOut,
  Menu,
  Search
} from "lucide-react";

export default function AdminLayout({ children }) {
  const path = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState("Admin");

  /* GET USER */
  useEffect(() => {
    const u = localStorage.getItem("name");
    if (u) setUser(u);
  }, []);

  /* LOGOUT */
  async function logout() {
    await signOut(auth);
    router.push("/login");
  }

  /* MENU */
  const menu = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Posts", href: "/admin/posts", icon: FileText },
    { name: "Categories", href: "/admin/categories", icon: Folder },
    { name: "Pages", href: "/admin/pages", icon: File },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings }
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed md:static z-50
        w-64 h-full md:h-auto
        bg-gradient-to-b from-[#111827] to-[#1f2937]
        text-gray-300 p-6 space-y-6
        transition-transform
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>

        <h1 className="text-2xl font-bold text-white">
          NewsAdmin
        </h1>

        <nav className="space-y-2 text-sm">

          {menu.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-2 rounded-lg transition
                  ${path === item.href
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700"}
                `}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}

        </nav>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="w-full mt-6 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
        >
          <LogOut size={18} />
          Logout
        </button>

      </aside>



      {/* RIGHT CONTENT */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="h-16 bg-white flex items-center justify-between px-6 border-b">

          {/* LEFT */}
          <div className="flex items-center gap-4">

            {/* MOBILE BTN */}
            <button
              onClick={() => setOpen(true)}
              className="md:hidden"
            >
              <Menu />
            </button>

            {/* SEARCH */}
            <div className="flex items-center bg-gray-100 px-3 rounded-lg">
              <Search size={16} className="text-gray-500" />
              <input
                placeholder="Search..."
                className="bg-transparent px-2 py-2 text-sm w-40 md:w-72 outline-none"
              />
            </div>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            <span className="text-sm text-gray-600">
              {user}
            </span>

            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />

          </div>

        </header>



        {/* PAGE CONTENT */}
        <main className="p-6 md:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}