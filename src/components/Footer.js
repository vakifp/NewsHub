"use client";

import Link from "next/link";
import { useEffect,useState } from "react";
import { db } from "@/lib/firebase";
import { doc,getDoc } from "firebase/firestore";

import {
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from "lucide-react";

export default function Footer(){

  const year = new Date().getFullYear();

  const [settings,setSettings]=useState(null);

  /* LOAD SETTINGS */
  useEffect(()=>{
    async function load(){
      const snap = await getDoc(doc(db,"settings","main"));
      if(snap.exists()) setSettings(snap.data());
    }
    load();
  },[]);


  /* LOADING SAFE */
  if(!settings){
    return null;
  }


  return(
    <footer className="
      border-t
      bg-white text-gray-700 border-gray-200
      dark:bg-[#020617] dark:text-gray-300 dark:border-gray-800
    ">

      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">

        {/* LOGO + DESC */}
        <div>

          {/* LOGO */}
          {settings.logo ? (
            <img src={settings.logo} className="h-10 mb-4"/>
          ):(
            <h2 className="text-2xl font-bold text-red-500 mb-4">
              {settings.siteName || "NewsSite"}
            </h2>
          )}

          <p className="text-sm leading-relaxed">
            {settings.footerText || "Latest news and updates in one place."}
          </p>

        </div>



        {/* QUICK LINKS */}
        <div>
          <h3 className="font-semibold mb-4 text-lg">
            Quick Links
          </h3>

          <ul className="space-y-2 text-sm">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/all-posts">All News</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>



        {/* CATEGORIES */}
        <div>
          <h3 className="font-semibold mb-4 text-lg">
            Categories
          </h3>

          <ul className="space-y-2 text-sm capitalize">
            <li><Link href="/category/cricket">Cricket</Link></li>
            <li><Link href="/category/football">Football</Link></li>
            <li><Link href="/category/tech">Tech</Link></li>
            <li><Link href="/category/sports">Sports</Link></li>
          </ul>
        </div>



        {/* SOCIAL */}
        <div>
          <h3 className="font-semibold mb-4 text-lg">
            Follow Us
          </h3>

          <div className="flex gap-4">

            {settings.facebook && (
              <a href={settings.facebook} target="_blank"
                className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900">
                <Facebook size={20}/>
              </a>
            )}

            {settings.twitter && (
              <a href={settings.twitter} target="_blank"
                className="p-2 rounded-full hover:bg-sky-100 dark:hover:bg-sky-900">
                <Twitter size={20}/>
              </a>
            )}

            {settings.instagram && (
              <a href={settings.instagram} target="_blank"
                className="p-2 rounded-full hover:bg-pink-100 dark:hover:bg-pink-900">
                <Instagram size={20}/>
              </a>
            )}

            {settings.youtube && (
              <a href={settings.youtube} target="_blank"
                className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900">
                <Youtube size={20}/>
              </a>
            )}

          </div>

          <p className="text-sm mt-5 text-gray-500 dark:text-gray-400">
            Stay connected for daily updates.
          </p>
        </div>

      </div>



      {/* BOTTOM */}
      <div className="text-center text-sm py-6 border-t border-gray-200 dark:border-gray-800">
        © {year} {settings.copyright || settings.siteName || "NewsSite"}
      </div>

    </footer>
  );
}