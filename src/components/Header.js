"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import Topbar from "./Topbar";

export default function Header(){

  const [shadow,setShadow] = useState(false);
  const [dark,setDark] = useState(true);
  const [cats,setCats] = useState([]);
  const [user,setUser] = useState(null);
  const [menu,setMenu] = useState(false);
  const [settings,setSettings] = useState(null);



  /* ================= LOAD SETTINGS ================= */
  useEffect(()=>{
    async function load(){
      const snap = await getDoc(doc(db,"settings","main"));
      if(snap.exists()){
        setSettings(snap.data());

        /* apply primary color */
        document.documentElement.style.setProperty(
          "--primary",
          snap.data().primaryColor || "#ef4444"
        );
      }
    }
    load();
  },[]);



  /* ================= SCROLL SHADOW ================= */
  useEffect(()=>{
    const handleScroll = ()=>setShadow(window.scrollY>10);
    window.addEventListener("scroll",handleScroll);
    return()=>window.removeEventListener("scroll",handleScroll);
  },[]);



  /* ================= THEME ================= */
  useEffect(()=>{
    document.documentElement.classList.toggle("dark",dark);
  },[dark]);



  /* ================= LOAD CATEGORIES ================= */
  useEffect(()=>{
    async function load(){

      const snap = await getDocs(collection(db,"categories"));

      let list = snap.docs.map(d=>({
        id:d.id,
        ...d.data()
      }));

      list.sort((a,b)=>(a.order ?? 9999)-(b.order ?? 9999));

      setCats(list.filter(c=>c.visible));
    }

    load();
  },[]);



  /* ================= AUTH ================= */
  useEffect(()=>{
    const unsub = onAuthStateChanged(auth,(u)=>setUser(u));
    return ()=>unsub();
  },[]);



  async function logout(){
    await signOut(auth);
  }



  /* ================= UI ================= */
  return(
    <header className={`sticky top-0 z-50 transition ${
      dark
        ? "bg-[#020617] text-gray-200 border-gray-800"
        : "bg-white text-gray-700 border-gray-200"
    } border-b ${shadow?"shadow-lg":""}`}>
{/* <Topbar /> */}
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-6">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">

            {settings?.logo ? (
              <img src={settings.logo} className="h-8"/>
            ):(
              <h1 className="font-bold text-xl text-red-500">
                {settings?.siteName || "NewsHub"}
              </h1>
            )}

          </Link>



          {/* DESKTOP CATEGORIES */}
          <div className="hidden lg:flex gap-6 font-medium">

            {cats.map(cat=>(
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="hover:text-[var(--primary)] transition capitalize"
              >
                {cat.name}
              </Link>
            ))}

          </div>

        </div>



        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* THEME TOGGLE */}
          <button
            onClick={()=>setDark(!dark)}
            className="text-lg hover:scale-110 transition"
          >
            {dark ? "☀️" : "🌙"}
          </button>



          {/* MOBILE MENU */}
          <button
            onClick={()=>setMenu(!menu)}
            className="lg:hidden text-2xl"
          >
            ☰
          </button>



          {/* USER */}
          {user ? (
            <div className="hidden lg:flex items-center gap-3">

              <span className="text-sm">
                {user.email}
              </span>

              <button
                onClick={logout}
                className="px-4 py-1.5 rounded-full text-white"
                style={{background:"var(--primary)"}}
              >
                Logout
              </button>

            </div>
          ) : (
            <Link href="/login" className="hidden lg:block">
              <button
                className="px-4 py-1.5 rounded-full text-white"
                style={{background:"var(--primary)"}}
              >
                Login
              </button>
            </Link>
          )}

        </div>

      </nav>



      {/* ================= MOBILE MENU ================= */}
      {menu && (
        <div className="lg:hidden px-6 pb-4 space-y-3 border-t border-gray-700">

          {cats.map(cat=>(
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="block py-2 border-b border-gray-700 capitalize"
              onClick={()=>setMenu(false)}
            >
              {cat.name}
            </Link>
          ))}


          {/* AUTH */}
          {user ? (
            <button
              onClick={logout}
              className="w-full py-2 rounded text-white"
              style={{background:"var(--primary)"}}
            >
              Logout
            </button>
          ) : (
            <Link href="/login">
              <button
                className="w-full py-2 rounded text-white"
                style={{background:"var(--primary)"}}
              >
                Login
              </button>
            </Link>
          )}

        </div>
      )}

    </header>
  );
}