"use client";

import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import DOMPurify from "dompurify";

export default function AllPosts(){

  const [posts,setPosts]=useState([]);
  const [visible,setVisible]=useState(8);
  const [loading,setLoading]=useState(true);



  /* ---------------- FETCH POSTS ---------------- */
  useEffect(()=>{
    async function load(){
      try{
        const q=query(collection(db,"posts"),orderBy("created","desc"));
        const snap=await getDocs(q);

        const list = snap.docs.map(doc=>({
          id:doc.id,
          slug:doc.data().slug || doc.id,
          ...doc.data()
        }));

        setPosts(list);

      }catch(err){
        console.error("Fetch error:",err);
      }finally{
        setLoading(false);
      }
    }

    load();
  },[]);



  /* ---------------- HTML EXCERPT ---------------- */
  function excerpt(html="",limit=20){
    const text = html.replace(/<[^>]+>/g,"");
    const words = text.split(" ").filter(Boolean);
    const trimmed = words.slice(0,limit).join(" ");
    return trimmed + (words.length>limit?"...":"");
  }



  /* ---------------- VISIBLE POSTS ---------------- */
  const visiblePosts = useMemo(
    ()=>posts.slice(0,visible),
    [posts,visible]
  );



  /* ---------------- LOAD MORE ---------------- */
  function loadMore(){
    setVisible(v=>v+8);
  }



  /* ================= FACEBOOK STYLE LOADER ================= */
  if(loading){
    return (
      <main className="py-14">
        <div className="max-w-7xl mx-auto px-4">

          <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-10 animate-pulse"/>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

            {[...Array(8)].map((_,i)=>(
              <div
                key={i}
                className="animate-pulse rounded-2xl border bg-white dark:bg-[#0b1220] dark:border-gray-800 overflow-hidden"
              >

                {/* image skeleton */}
                <div className="h-48 bg-gray-300 dark:bg-gray-700"/>

                {/* text skeleton */}
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"/>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"/>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"/>
                </div>

              </div>
            ))}

          </div>

        </div>
      </main>
    );
  }



  /* ================= PAGE ================= */
  return(
    <main>

      <section className="
        py-14
        bg-white text-gray-900
        dark:bg-gradient-to-br dark:from-[#0f172a] dark:via-[#111827] dark:to-[#020617]
        dark:text-gray-100
      ">

        <div className="max-w-7xl mx-auto px-4">

          {/* HEADER */}
          <header>
            <h1 className="text-3xl font-bold mb-10">
              All Articles
            </h1>
          </header>



          {/* GRID */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

            {visiblePosts.map(post=>(
              <article key={post.id}>

                <Link
                  href={`/blog/${post.slug}`}
                  className="
                    group block rounded-2xl overflow-hidden border
                    bg-white border-gray-200 shadow-sm
                    dark:bg-[#0b1220] dark:border-gray-800
                    hover:shadow-xl transition
                  "
                >

                  {/* IMAGE */}
                  <div className="overflow-hidden h-48">
                    <img
                      src={post.img || "/placeholder.jpg"}
                      alt={post.title || "Blog article image"}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>


                  {/* TEXT */}
                  <div className="p-5 space-y-2">

                    <h2 className="font-semibold group-hover:text-blue-400 transition">
                      {excerpt(post.title,10)}
                    </h2>

                    <div
                      className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          excerpt(post.desc,20)
                        )
                      }}
                    />

                  </div>

                </Link>

              </article>
            ))}

          </div>



          {/* LOAD MORE */}
          {visible < posts.length && (
            <div className="mt-12 text-center">

              <button
                onClick={loadMore}
                className="
                  px-10 py-3 rounded-full
                  bg-red-500 text-white
                  hover:bg-red-600 transition
                  shadow-md
                "
              >
                Load More
              </button>

            </div>
          )}

        </div>

      </section>

    </main>
  );
}