"use client";

import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import LatestNews from "./LatestNews";

export default function BlogGrid(){

  const [posts,setPosts] = useState([]);
  const [activeTab,setActiveTab] = useState("latest");


  /* LOAD POSTS */
  useEffect(()=>{
    async function load(){

      const q=query(
        collection(db,"posts"),
        orderBy("created","desc")
      );

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



  /* TITLE LIMIT */
  function shortTitle(text, words=10){
    if(!text) return "";
    const arr=text.split(" ");
    return arr.length>words
      ? arr.slice(0,words).join(" ")+"..."
      : text;
  }



  /* DERIVED DATA */
  const featured = posts[0];
  const side = posts.slice(1,5);

  const latestPosts = useMemo(
    ()=>posts.slice(0,5),
    [posts]
  );

  const popularPosts = useMemo(
    ()=>[...posts]
      .sort((a,b)=>(b.views||0)-(a.views||0))
      .slice(0,5),
    [posts]
  );

  const sidebarList =
    activeTab==="latest"
      ? latestPosts
      : popularPosts;



  /* SKELETON LOADER */
  if(posts.length===0){
    return(
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 animate-pulse">

          {/* header */}
          <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-10"/>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* featured */}
            <div className="h-96 rounded-2xl bg-gray-300 dark:bg-gray-700"/>

            {/* side posts */}
            <div className="space-y-5">
              {[1,2,3,4].map(i=>(
                <div key={i} className="flex gap-4">
                  <div className="w-32 h-20 bg-gray-300 dark:bg-gray-700 rounded"/>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"/>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-20"/>
                  </div>
                </div>
              ))}
            </div>

            {/* sidebar */}
            <div className="p-6 rounded-2xl border space-y-4">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-full"/>
              {[1,2,3,4,5].map(i=>(
                <div key={i} className="h-4 bg-gray-300 dark:bg-gray-700 rounded"/>
              ))}
            </div>

          </div>
        </div>
      </section>
    );
  }



  return(
    <section className="
      py-14
      bg-white text-gray-900
      dark:bg-gradient-to-br dark:from-[#0f172a] dark:via-[#111827] dark:to-[#020617]
      dark:text-white
    ">

      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <h2 className="text-2xl font-bold mb-8">
          Latest News
        </h2>



        {/* GRID */}
        <div className="grid lg:grid-cols-3 gap-8">


          {/* FEATURED */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group relative rounded-2xl overflow-hidden"
            >
              <img
                src={featured.img}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"/>

              <div className="absolute bottom-0 p-6">
                <h3 className="font-bold text-xl group-hover:text-blue-400">
                  {shortTitle(featured.title)}
                </h3>

                <p className="text-sm mt-2 text-gray-300">
                  {featured.time || "recent"}
                </p>
              </div>
            </Link>
          )}



          {/* SIDE POSTS */}
          <div className="space-y-5">
            {side.map(post=>(
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="flex gap-4 group"
              >
                <img
                  src={post.img}
                  className="w-32 h-20 rounded-lg object-cover"
                />

                <div>
                  <h4 className="font-semibold text-sm group-hover:text-blue-400">
                    {shortTitle(post.title)}
                  </h4>

                  <p className="text-xs text-gray-500 mt-1">
                    {post.time || "recent"}
                  </p>
                </div>
              </Link>
            ))}
          </div>



          {/* SIDEBAR */}
          <div className="rounded-2xl p-6 border bg-white dark:bg-[#0b1220]">

            {/* TABS */}
            <div className="flex mb-6 bg-gray-100 dark:bg-[#111827] p-1 rounded-full">

              <button
                onClick={()=>setActiveTab("latest")}
                className={`flex-1 py-2 rounded-full text-sm font-semibold ${
                  activeTab==="latest"
                    ? "bg-red-500 text-white"
                    : "text-gray-500"
                }`}
              >
                Latest
              </button>

              <button
                onClick={()=>setActiveTab("popular")}
                className={`flex-1 py-2 rounded-full text-sm font-semibold ${
                  activeTab==="popular"
                    ? "bg-red-500 text-white"
                    : "text-gray-500"
                }`}
              >
                Popular
              </button>

            </div>



            {/* LIST */}
            <div className="space-y-5">
              <LatestNews
                posts={sidebarList.map(p=>({
                  ...p,
                  title: shortTitle(p.title)
                }))}
              />
            </div>

          </div>

        </div>



        {/* VIEW ALL */}
        <div className="mt-10 text-center">
          <Link href="/AllPosts">
            <button className="
              px-10 py-3 rounded-full border
              hover:bg-gray-100 dark:hover:bg-gray-800
            ">
              View All News
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}