"use client";

import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Link from "next/link";

export default function AllPosts(){

  const [posts,setPosts]=useState([]);
  const [visible,setVisible]=useState(8); // show first 8


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



  /* ---------------- WORD LIMIT ---------------- */
  function limitWords(text="",count){
    const arr=text.split(" ");
    return arr.slice(0,count).join(" ") + (arr.length>count?"...":"");
  }



  /* ---------------- POSTS TO SHOW ---------------- */
  const visiblePosts = useMemo(
    ()=>posts.slice(0,visible),
    [posts,visible]
  );



  /* ---------------- LOAD MORE ---------------- */
  function loadMore(){
    setVisible(v=>v+8);
  }



  return(
    <section className="
      py-14
      bg-white text-gray-900
      dark:bg-linear-to-br dark:from-[#0f172a] dark:via-[#111827] dark:to-[#020617]
      dark:text-white
    ">

      <div className="max-w-7xl mx-auto px-4">

        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-10">
          All Articles
        </h1>



        {/* GRID */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

          {visiblePosts.map(post=>(
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

                {/* TITLE */}
                <h3 className="font-semibold group-hover:text-blue-400 transition">
                  {limitWords(post.title,10)}
                </h3>

                {/* DESC */}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {limitWords(post.desc || "",20)}
                </p>

              </div>

            </Link>
          ))}

        </div>



        {/* LOAD MORE BUTTON */}
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
              Read More
            </button>

          </div>
        )}

      </div>
    </section>
  );
}