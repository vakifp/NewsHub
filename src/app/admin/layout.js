"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

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
  ChevronDown
} from "lucide-react";

export default function AdminLayout({ children }) {

  const path = usePathname();
  const router = useRouter();

  const [open,setOpen] = useState(false);
  const [user,setUser] = useState("Admin");
  const [profileOpen,setProfileOpen] = useState(false);

  /* USER LOAD */
  useEffect(()=>{
    const u = localStorage.getItem("name");
    if(u) setUser(u);
  },[]);

  /* LOGOUT */
  async function logout(){
    await signOut(auth);
    router.push("/login");
  }

  /* MENU */
  const menu = [
    { name:"Dashboard", href:"/admin", icon:LayoutDashboard },
    { name:"Posts", href:"/admin/posts", icon:FileText },
    { name:"Categories", href:"/admin/categories", icon:Folder },
    { name:"Pages", href:"/admin/pages", icon:File },
    { name:"Users", href:"/admin/users", icon:Users },
    { name:"Settings", href:"/admin/settings", icon:Settings }
  ];

  /* ACTIVE CHECK */
  function isActive(href){
    return path === href || path.startsWith(href + "/");
  }

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-[#020617]">

      {/* OVERLAY */}
      {open && (
        <div
          onClick={()=>setOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed md:static z-50
        w-64 h-full md:h-auto
        bg-gradient-to-b from-[#0f172a] to-[#020617]
        text-gray-300 p-6 space-y-6
        transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>

        {/* LOGO */}
        <h1 className="text-2xl font-bold text-white tracking-wide">
          NewsAdmin
        </h1>

        {/* MENU */}
        <nav className="space-y-2 text-sm">

          {menu.map(item=>{
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={()=>setOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-2 rounded-lg transition
                  ${active
                    ? "bg-blue-600 text-white shadow"
                    : "hover:bg-white/10"}
                `}
              >
                <Icon className="w-5 h-5"/>
                {item.name}
              </Link>
            );
          })}

        </nav>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="
            w-full mt-8 flex items-center justify-center gap-2 py-2
            rounded-lg bg-red-500 text-white
            hover:bg-red-600 transition shadow
          "
        >
          <LogOut size={18}/>
          Logout
        </button>

      </aside>



      {/* RIGHT CONTENT */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="
          h-16 px-6 border-b flex items-center justify-between
          bg-white/70 backdrop-blur
          dark:bg-[#020617]/80 dark:border-gray-800
        ">

          {/* LEFT */}
          <div className="flex items-center gap-4">

            <button
              onClick={()=>setOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded"
            >
              <Menu/>
            </button>

            {/* SEARCH */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-3 rounded-lg">

              <Search size={16} className="text-gray-400"/>

              <input
                placeholder="Search..."
                className="
                  bg-transparent px-2 py-2 text-sm
                  w-40 md:w-72 outline-none
                "
              />

            </div>

          </div>



          {/* RIGHT PROFILE */}
          <div className="relative">

            <button
              onClick={()=>setProfileOpen(!profileOpen)}
              className="
                flex items-center gap-3
                hover:bg-gray-100 dark:hover:bg-gray-800
                px-3 py-2 rounded-lg transition
              "
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500"/>
              <span className="text-sm hidden md:block">{user}</span>
              <ChevronDown size={16}/>
            </button>


            {/* DROPDOWN */}
            {profileOpen && (
              <div className="
                absolute right-0 mt-2 w-44
                bg-white dark:bg-gray-900
                border dark:border-gray-800
                rounded-xl shadow-lg overflow-hidden
              ">

                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Logout
                </button>

              </div>
            )}

          </div>

        </header>



        {/* CONTENT */}
        <main className="p-6 md:p-8 flex-1">
          {children}
        </main>

      </div>

    </div>
  );
}