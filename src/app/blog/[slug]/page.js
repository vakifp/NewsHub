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



  /* ---------------- FETCH SINGLE POST ---------------- */
  useEffect(()=>{
    async function load(){

      const q = query(collection(db,"posts"),where("slug","==",slug));
      const snap = await getDocs(q);

      if(!snap.empty){
        setPost(snap.docs[0].data());
        return;
      }

      const all = await getDocs(collection(db,"posts"));
      const found = all.docs.find(d=>d.id===slug);

      setPost(found ? found.data() : "notfound");
    }

    if(slug) load();

  },[slug]);



  /* ---------------- FETCH ALL POSTS ---------------- */
  useEffect(()=>{
    async function loadPosts(){

      const snap = await getDocs(collection(db,"posts"));

      setPosts(
        snap.docs.map(d=>({
          id:d.id,
          slug:d.data().slug || d.id,
          ...d.data()
        }))
      );
    }

    loadPosts();
  },[]);



  /* ---------------- PAGE TITLE ---------------- */
  useEffect(()=>{
    if(post && post!=="notfound"){
      document.title = post.title + " | News";
    }
  },[post]);



  /* ---------------- DERIVED DATA ---------------- */

  const latestPosts = posts.slice(0,5);

  const popularPosts = [...posts]
    .sort((a,b)=>(b.views||0)-(a.views||0))
    .slice(0,5);

  const sidebarList =
    activeTab==="latest"
      ? latestPosts
      : popularPosts;



  /* labels safe */
  const labels =
    typeof post?.labels==="string"
      ? post.labels.split(",").map(l=>l.trim())
      : Array.isArray(post?.labels)
      ? post.labels
      : [];



  /* reading time */
  const readTime = Math.max(
    1,
    Math.ceil((post?.desc?.split(" ").length || 0)/200)
  );



  /* related posts */
  const related = useMemo(()=>{
    if(!post?.category) return [];

    return posts
      .filter(p =>
        p.category === post.category &&
        p.slug !== post.slug
      )
      .slice(0,3);

  },[posts, post?.category, post?.slug]);



  /* ---------------- LOADING STATES ---------------- */

  if(post===null){
    return (
      <div className="py-40 text-center text-gray-500">
        Loading article...
      </div>
    );
  }

  if(post==="notfound"){
    return (
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


          {/* LEFT ARTICLE */}
          <article className="lg:col-span-2">


            {/* BREADCRUMB */}
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              <Link href="/">Home</Link> ›
              <Link href={`/category/${post.category}`} className="mx-2 capitalize hover:text-red-500">
                {post.category}
              </Link>
              › <span className="text-gray-800 dark:text-white">{post.title}</span>
            </div>



            {/* IMAGE */}
            <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
              <img
                src={post.img||"/placeholder.jpg"}
                className="w-full h-[420px] object-cover"
              />
            </div>



            {/* CATEGORY */}
            <span className="px-3 py-1 text-xs rounded-full bg-red-500 text-white">
              {post.category}
            </span>



            {/* TITLE */}
            <h1 className="text-3xl md:text-5xl font-bold mt-4 mb-6
            text-gray-900 dark:text-white">
              {post.title}
            </h1>



            {/* META */}
            <div className="flex flex-wrap gap-4 text-sm mb-8
            text-gray-500 dark:text-gray-400">
              <span>By {post.author||"Admin"}</span>
              <span>•</span>
              <span>{post.time||"recent"}</span>
              <span>•</span>
              <span>{readTime} min read</span>
            </div>



            {/* LABELS */}
            {labels.length>0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                {labels.map(l=>(
                  <Link
                    key={l}
                    href={`/label/${l}`}
                    className="
                    px-3 py-1 text-xs rounded-full
                    bg-gray-200 text-gray-800
                    dark:bg-gray-700 dark:text-gray-100
                    hover:bg-red-500 hover:text-white transition"
                  >
                    #{l}
                  </Link>
                ))}
              </div>
            )}



            {/* CONTENT */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              {post.desc}
            </div>



            {/* SHARE */}
            <div className="mt-12 border-t pt-6">
              <p className="font-semibold mb-3">Share Article</p>

              <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded">Facebook</button>
                <button className="px-4 py-2 bg-sky-500 text-white rounded">Twitter</button>
                <button className="px-4 py-2 bg-green-500 text-white rounded">WhatsApp</button>
              </div>
            </div>



            {/* RELATED POSTS */}
            {related.length>0 && (
              <div className="mt-16">

                <h3 className="text-xl font-bold mb-6">
                  Related Articles
                </h3>

                <div className="grid md:grid-cols-3 gap-6">

                  {related.map(p=>(
                    <Link
                      key={p.id}
                      href={`/blog/${p.slug}`}
                      className="
                      border rounded-xl p-4
                      hover:shadow-lg transition
                      bg-white dark:bg-[#0b1220]
                      border-gray-200 dark:border-gray-800"
                    >
                      <h4 className="font-semibold">
                        {p.title}
                      </h4>
                    </Link>
                  ))}

                </div>
              </div>
            )}

          </article>



          {/* RIGHT SIDEBAR */}
          <aside>

            <div className="
            rounded-2xl p-6 border sticky top-24
            bg-white border-gray-200
            dark:bg-[#0b1220] dark:border-gray-800
            ">

              {/* TABS */}
              <div className="flex mb-6 bg-gray-100 dark:bg-[#111827] p-1 rounded-full">

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



              {/* LIST */}
              <div className="space-y-5">
                {sidebarList.map((p,i)=>(
                  <Link
                    key={p.id}
                    href={`/blog/${p.slug}`}
                    className="flex gap-4 group"
                  >
                    <span className="text-yellow-400 font-bold">
                      {i+1}
                    </span>

                    <p className="text-sm group-hover:text-blue-500">
                      {p.title}
                    </p>
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