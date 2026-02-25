"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import Topbar from "@/components/Topbar";

export default function Header(){

  const [shadow,setShadow] = useState(false);
  const [dark,setDark] = useState(true);
  const [cats,setCats] = useState([]);
  const [user,setUser] = useState(null);
  const [menu,setMenu] = useState(false); // ⭐ mobile menu state


  /* SCROLL SHADOW */
  useEffect(()=>{
    const handleScroll = ()=>setShadow(window.scrollY>10);
    window.addEventListener("scroll",handleScroll);
    return()=>window.removeEventListener("scroll",handleScroll);
  },[]);


  /* THEME */
  useEffect(()=>{
    document.documentElement.classList.toggle("dark",dark);
  },[dark]);


  /* LOAD CATEGORIES */
  useEffect(()=>{
    async function load(){
      const snap = await getDocs(collection(db,"categories"));
      setCats(
        snap.docs.map(d=>d.data()).filter(c=>c.visible)
      );
    }
    load();
  },[]);


  /* AUTH */
  useEffect(()=>{
    const unsub = onAuthStateChanged(auth,(u)=>setUser(u));
    return ()=>unsub();
  },[]);


  async function logout(){
    await signOut(auth);
  }



  return(
    <header className={`sticky top-0 z-50 transition ${
      dark
      ? "bg-[#020617] text-gray-200 border-gray-800"
      : "bg-white text-gray-700 border-gray-200"
    } border-b ${shadow?"shadow-lg":""}`}>

      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
<Topbar />
        {/* LEFT */}
        <div className="flex items-center gap-6">

          {/* LOGO */}
          <Link href="/">
            <h1 className="font-bold text-xl text-red-500">
              News<span className="text-white dark:text-white">Hub</span>
            </h1>
          </Link>

          {/* DESKTOP CATEGORIES */}
          <div className="hidden lg:flex gap-6 font-medium">
            {cats.map(cat=>(
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="hover:text-red-500 transition capitalize"
              >
                {cat.name}
              </Link>
            ))}
          </div>

        </div>



        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* THEME */}
          <button
            onClick={()=>setDark(!dark)}
            className="text-lg hover:scale-110 transition"
          >
            {dark ? "☀️" : "🌙"}
          </button>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={()=>setMenu(!menu)}
            className="lg:hidden text-2xl"
          >
            ☰
          </button>

          {/* USER */}
          {user ? (
            <div className="hidden lg:flex items-center gap-3">
              <span className="text-sm">{user.email}</span>
              <button
                onClick={logout}
                className="bg-red-500 px-4 py-1.5 rounded-full text-white"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="hidden lg:block">
              <button className="bg-red-500 px-4 py-1.5 rounded-full text-white">
                Login
              </button>
            </Link>
          )}

        </div>
      </nav>



      {/* MOBILE DROPDOWN */}
      {menu && (
        <div className="lg:hidden px-6 pb-4 space-y-3 border-t border-gray-700">

          {cats.map(cat=>(
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="block py-2 border-b border-gray-700 capitalize"
              onClick={()=>setMenu(false)}
            >
              {cat.name}
            </Link>
          ))}

          {/* mobile auth */}
          {user ? (
            <button
              onClick={logout}
              className="w-full bg-red-500 py-2 rounded text-white"
            >
              Logout
            </button>
          ) : (
            <Link href="/login">
              <button className="w-full bg-red-500 py-2 rounded text-white">
                Login
              </button>
            </Link>
          )}

        </div>
      )}

    </header>
  );
}