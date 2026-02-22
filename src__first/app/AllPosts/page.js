"use client";

import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import LatestNews from "@/components/LatestNews";
import PopularNews from "@/components/PopularNews";
import Header from "@/components/Header";

export default function AllPosts(){

  const [posts,setPosts]=useState([]);
  const [activeTab,setActiveTab]=useState("latest");

  /* ---------------- FETCH ---------------- */
  useEffect(()=>{
    async function load(){
      const q=query(collection(db,"posts"),orderBy("created","desc"));
      const snap=await getDocs(q);

      setPosts(
        snap.docs.map(doc=>({
          id:doc.id,
          slug:doc.data().slug || doc.id,
          ...doc.data()
        }))
      );
    }
    load();
  },[]);


  /* ---------------- WORD LIMIT FUNCTION ---------------- */
  function limitWords(text="",count){
    return text.split(" ").slice(0,count).join(" ") +
      (text.split(" ").length > count ? "..." : "");
  }


  /* ---------------- LISTS ---------------- */
  const latestPosts = useMemo(()=>posts.slice(0,5),[posts]);

  const popularPosts = useMemo(()=>(
    [...posts].sort((a,b)=>(b.views||0)-(a.views||0)).slice(0,5)
  ),[posts]);


  return(
    <>
    <Header />
    <section className="
      py-14
      bg-white text-gray-900
      dark:bg-gradient-to-br dark:from-[#0f172a] dark:via-[#111827] dark:to-[#020617]
      dark:text-white
    ">

      <div className="max-w-7xl mx-auto px-4">

        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-10">
          All Articles
        </h1>


        {/* GRID */}
        <div className="grid">

          <div className="lg:col-span-2 grid sm:grid-cols-4 gap-8">

            {posts.map(post=>(
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="
                  group rounded-2xl overflow-hidden border
                  bg-white border-gray-200 shadow-sm
                  dark:bg-[#0b1220] dark:border-gray-800
                  hover:shadow-xl transition
                "
              >

                {/* IMAGE */}
                <div className="overflow-hidden">
                  <img
                    src={post.img}
                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                {/* TEXT */}
                <div className="p-5 space-y-2">

                  {/* TITLE LIMIT 10 WORDS */}
                  <h3 className="font-semibold group-hover:text-blue-400 transition">
                    {limitWords(post.title,2)}
                  </h3>

                  {/* DESC LIMIT 20 WORDS */}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {limitWords(post.desc || post.time || "",10)}
                  </p>

                </div>

              </Link>
            ))}

          </div>

        </div>

      </div>
    </section>
    </>
  );
}