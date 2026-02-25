"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Topbar(){

  const [settings,setSettings] = useState(null);

  /* LOAD SETTINGS */
  useEffect(()=>{
    async function load(){
      try{
        const snap = await getDoc(doc(db,"settings","main"));
        if(snap.exists()) setSettings(snap.data());
      }catch(err){
        console.error("Topbar settings error:",err);
      }
    }
    load();
  },[]);


  return(
    <div className="bg-gray-900 text-gray-300 text-sm">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex items-center justify-between py-3">

          {/* LEFT MENU */}
          <ul className="flex flex-wrap gap-4">

            <li>
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>
            </li>

            <li>
              <Link href="/about" className="hover:text-white transition">
                About
              </Link>
            </li>

            <li>
              <Link href="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </li>

            <li>
              <Link href="/privacy-policy" className="hover:text-white transition">
                Privacy Policy
              </Link>
            </li>

            <li>
              <Link href="/terms" className="hover:text-white transition">
                Terms
              </Link>
            </li>

          </ul>



          {/* RIGHT SOCIAL */}
          <div className="flex items-center gap-3">

            {settings?.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-800 hover:bg-blue-600 transition"
              >
                <Facebook size={16}/>
              </a>
            )}

            {settings?.twitter && (
              <a
                href={settings.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-800 hover:bg-sky-500 transition"
              >
                <Twitter size={16}/>
              </a>
            )}

            {settings?.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-800 hover:bg-pink-500 transition"
              >
                <Instagram size={16}/>
              </a>
            )}

            {settings?.youtube && (
              <a
                href={settings.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-800 hover:bg-red-600 transition"
              >
                <Youtube size={16}/>
              </a>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}