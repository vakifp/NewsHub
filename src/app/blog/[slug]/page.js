"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Header from "@/components/Header";
import Link from "next/link";

export default function Details(){

  const { slug } = useParams();

  const [post,setPost] = useState(null);
  const [posts,setPosts] = useState([]);
  const [activeTab,setActiveTab] = useState("latest");


  /* ---------------- LOAD DATA (OPTIMIZED) ---------------- */
  useEffect(()=>{
    async function load(){

      const singleQuery = getDocs(
        query(collection(db,"posts"),where("slug","==",slug))
      );

      const allQuery = getDocs(collection(db,"posts"));

      const [singleSnap, allSnap] = await Promise.all([
        singleQuery,
        allQuery
      ]);

      /* SINGLE POST */
      if(!singleSnap.empty){
        setPost(singleSnap.docs[0].data());
      } else {
        const found = allSnap.docs.find(d=>d.id===slug);
        setPost(found ? found.data() : "notfound");
      }

      /* ALL POSTS */
      setPosts(
        allSnap.docs.map(d=>({
          id:d.id,
          slug:d.data().slug || d.id,
          ...d.data()
        }))
      );
    }

    if(slug) load();

  },[slug]);



  /* ---------------- PAGE TITLE ---------------- */
  useEffect(()=>{
    if(post && post!=="notfound"){
      document.title = post.title + " | News";
    }
  },[post]);



  /* ---------------- DERIVED ---------------- */

  const latestPosts = posts.slice(0,5);

  const popularPosts = [...posts]
    .sort((a,b)=>(b.views||0)-(a.views||0))
    .slice(0,5);

  const sidebarList =
    activeTab==="latest"
      ? latestPosts
      : popularPosts;



  /* LABELS SAFE */
  const labels =
    typeof post?.labels==="string"
      ? post.labels.split(",").map(l=>l.trim())
      : Array.isArray(post?.labels)
      ? post.labels
      : [];



  /* READ TIME */
  const readTime = Math.max(
    1,
    Math.ceil((post?.desc?.split(" ").length || 0)/200)
  );



  /* RELATED */
  const related = useMemo(()=>{
    if(!post?.category) return [];

    return posts
      .filter(p =>
        p.category === post.category &&
        p.slug !== post.slug
      )
      .slice(0,3);

  },[posts, post?.category, post?.slug]);



  /* ---------------- LOADER ---------------- */

  if(post===null){
    return(
      <section className="py-14 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-10">

          <div className="lg:col-span-2 space-y-6">

            <div className="h-4 w-48 bg-gray-300 dark:bg-gray-700 rounded"/>
            <div className="h-[420px] bg-gray-300 dark:bg-gray-700 rounded-2xl"/>
            <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded"/>
            <div className="h-12 w-full bg-gray-300 dark:bg-gray-700 rounded"/>

            <div className="flex gap-4">
              <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"/>
              <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"/>
              <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"/>
            </div>

            {[1,2,3,4,5].map(i=>(
              <div key={i} className="h-4 bg-gray-300 dark:bg-gray-700 rounded"/>
            ))}
          </div>

          <div className="space-y-4 border p-6 rounded-2xl">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-full"/>
            {[1,2,3,4,5].map(i=>(
              <div key={i} className="h-4 bg-gray-300 dark:bg-gray-700 rounded"/>
            ))}
          </div>

        </div>
      </section>
    );
  }



  /* ---------------- NOT FOUND ---------------- */

  if(post==="notfound"){
    return(
      <div className="py-40 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Article not found
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

          {/* ARTICLE */}
          <article className="lg:col-span-2">

            {/* breadcrumb */}
            <div className="text-sm text-gray-500 mb-6">
              <Link href="/">Home</Link> ›
              <Link href={`/category/${post.category}`} className="mx-2 capitalize">
                {post.category}
              </Link>
              › {post.title}
            </div>


            {/* image */}
            <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
              <img
                src={post.img||"/placeholder.jpg"}
                className="w-full h-[420px] object-cover"
              />
            </div>


            {/* category */}
            <span className="px-3 py-1 text-xs rounded-full bg-red-500 text-white">
              {post.category}
            </span>


            {/* title */}
            <h1 className="text-3xl md:text-5xl font-bold mt-4 mb-6">
              {post.title}
            </h1>


            {/* meta */}
            <div className="flex flex-wrap gap-4 text-sm mb-8 text-gray-500">
              <span>By {post.author||"Admin"}</span>
              <span>•</span>
              <span>{post.time||"recent"}</span>
              <span>•</span>
              <span>{readTime} min read</span>
            </div>


            {/* labels */}
            {labels.length>0 &&(
              <div className="flex flex-wrap gap-2 mb-10">
                {labels.map(l=>(
                  <Link
                    key={l}
                    href={`/label/${l}`}
                    className="px-3 py-1 text-xs rounded-full bg-gray-200 hover:bg-red-500 hover:text-white transition"
                  >
                    #{l}
                  </Link>
                ))}
              </div>
            )}


            {/* content */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              {post.desc}
            </div>


            {/* share */}
            <div className="mt-12 border-t pt-6">
              <p className="font-semibold mb-3">Share Article</p>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded">Facebook</button>
                <button className="px-4 py-2 bg-sky-500 text-white rounded">Twitter</button>
                <button className="px-4 py-2 bg-green-500 text-white rounded">WhatsApp</button>
              </div>
            </div>


            {/* related */}
            {related.length>0 &&(
              <div className="mt-16">
                <h3 className="text-xl font-bold mb-6">Related Articles</h3>

                <div className="grid md:grid-cols-3 gap-6">
                  {related.map(p=>(
                    <Link
                      key={p.id}
                      href={`/blog/${p.slug}`}
                      className="border rounded-xl p-4 hover:shadow-lg transition"
                    >
                      {p.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

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
                  <Link
                    key={p.id}
                    href={`/blog/${p.slug}`}
                    className="flex gap-4"
                  >
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