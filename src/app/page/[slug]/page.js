"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Header from "@/components/Header";
import Link from "next/link";

export default function PageDetails(){

  const { slug } = useParams();

  const [page,setPage]=useState(null);
  const [posts,setPosts]=useState([]);
  const [activeTab,setActiveTab]=useState("latest");


  /* ---------------- LOAD PAGE ---------------- */
  useEffect(()=>{
    if(!slug) return;

    (async()=>{

      const snap = await getDocs(
        query(collection(db,"pages"),where("slug","==",slug))
      );

      if(snap.empty){
        setPage("notfound");
        return;
      }

      setPage({
        id:snap.docs[0].id,
        ...snap.docs[0].data()
      });


      /* sidebar posts */
      const postsSnap = await getDocs(collection(db,"posts"));

      setPosts(
        postsSnap.docs.map(d=>({
          id:d.id,
          slug:d.data().slug||d.id,
          ...d.data()
        }))
      );

    })();

  },[slug]);


  /* ---------------- SIDEBAR ---------------- */

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



  /* ---------------- LOADER ---------------- */

  if(page===null){
    return(
      <section className="py-14 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-10">

          <div className="lg:col-span-2 space-y-6">
            <div className="h-105 bg-gray-300 rounded-2xl"/>
            <div className="h-10 bg-gray-300 rounded"/>
            <div className="h-4 bg-gray-300 rounded"/>
            <div className="h-4 bg-gray-300 rounded"/>
          </div>

          <div className="space-y-4 border p-6 rounded-2xl">
            {[1,2,3,4,5].map(i=>(
              <div key={i} className="h-4 bg-gray-300 rounded"/>
            ))}
          </div>

        </div>
      </section>
    );
  }



  /* ---------------- NOT FOUND ---------------- */

  if(page==="notfound"){
    return(
      <div className="py-40 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Page not found
        </h2>

        <Link href="/" className="text-blue-600 underline">
          Go Home
        </Link>
      </div>
    );
  }



  /* ================= UI ================= */

  return(
    <>
      <Header/>

      <section className="
        min-h-screen py-14 px-4
        bg-white text-gray-900
        dark:bg-[#020617] dark:text-gray-100
      ">

        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">

          {/* MAIN CONTENT */}
          <article className="lg:col-span-2">

            {/* breadcrumb */}
            <div className="text-sm text-gray-500 mb-6">
              <Link href="/">Home</Link> ›
              <span className="mx-2 capitalize">Page</span> ›
              {page.title}
            </div>


            {/* title */}
            <h1 className="text-3xl md:text-5xl font-bold mb-10">
              {page.title}
            </h1>


            {/* content */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              {page.content}
            </div>



            {/* share */}
            <div className="mt-12 border-t pt-6">
              <p className="font-semibold mb-3">Share Page</p>

              <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded">Facebook</button>
                <button className="px-4 py-2 bg-sky-500 text-white rounded">Twitter</button>
                <button className="px-4 py-2 bg-green-500 text-white rounded">WhatsApp</button>
              </div>
            </div>

          </article>



          {/* SIDEBAR */}
          <aside>

            <div className="rounded-2xl p-6 border sticky top-24">

              <div className="flex mb-6 bg-gray-100 p-1 rounded-full">

                <button
                  onClick={()=>setActiveTab("latest")}
                  className={`flex-1 py-2 rounded-full text-sm ${
                    activeTab==="latest"
                      ? "bg-red-500 text-white"
                      : "text-gray-500"
                  }`}
                >
                  Latest
                </button>

                <button
                  onClick={()=>setActiveTab("popular")}
                  className={`flex-1 py-2 rounded-full text-sm ${
                    activeTab==="popular"
                      ? "bg-red-500 text-white"
                      : "text-gray-500"
                  }`}
                >
                  Popular
                </button>

              </div>


              <div className="space-y-5">
                {sidebarList.map((p,i)=>(
                  <Link key={p.id} href={`/blog/${p.slug}`} className="flex gap-4">
                    <span className="text-yellow-400 font-bold">
                      {i+1}
                    </span>

                    <p className="text-sm">{p.title}</p>
                  </Link>
                ))}
              </div>

            </div>

          </aside>

        </div>
      </section>
    </>
  );
}