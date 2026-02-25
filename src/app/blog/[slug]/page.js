"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  increment
} from "firebase/firestore";
import Header from "@/components/Header";
import Link from "next/link";
import Footer from "@/components/Footer";
import DOMPurify from "dompurify";

export default function Details(){

  const { slug } = useParams();

  const [post,setPost] = useState(null);
  const [posts,setPosts] = useState([]);
  const [activeTab,setActiveTab] = useState("latest");



  /* ================= LOAD DATA ================= */
  useEffect(()=>{
    if(!slug) return;

    (async()=>{

      try{

        const snap = await getDocs(
          query(collection(db,"posts"),where("slug","==",slug))
        );

        if(snap.empty){
          setPost("notfound");
          return;
        }

        const currentPost={
          id:snap.docs[0].id,
          ...snap.docs[0].data()
        };

        setPost(currentPost);

        /* increment views (non blocking) */
        updateDoc(doc(db,"posts",currentPost.id),{
          views:increment(1)
        });

        /* related posts */
        const relatedSnap = await getDocs(
          query(
            collection(db,"posts"),
            where("category","==",currentPost.category)
          )
        );

        setPosts(
          relatedSnap.docs.map(d=>({
            id:d.id,
            slug:d.data().slug || d.id,
            ...d.data()
          }))
        );

      }catch(err){
        console.error(err);
        setPost("notfound");
      }

    })();

  },[slug]);



  /* ================= SIDEBAR LIST ================= */

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



  /* ================= READ TIME ================= */

  const readTime=Math.max(
    1,
    Math.ceil((post?.desc?.replace(/<[^>]+>/g,"").split(" ").length||0)/200)
  );



  /* ================= RELATED ================= */

  const related = useMemo(()=>{
    if(!post?.category) return [];
    return posts
      .filter(p=>p.slug!==post.slug)
      .slice(0,3);
  },[posts,post]);



  /* ================= LOADER ================= */

  if(post===null){
    return(
      <section className="py-14 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-10">

          {/* article skeleton */}
          <div className="lg:col-span-2 space-y-6">

            <div className="h-[400px] bg-gray-300 dark:bg-gray-700 rounded-2xl"/>

            <div className="h-10 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"/>

            <div className="flex gap-4">
              <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"/>
              <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"/>
              <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded"/>
            </div>

            <div className="space-y-3">
              {[1,2,3,4,5].map(i=>(
                <div key={i} className="h-4 bg-gray-300 dark:bg-gray-700 rounded"/>
              ))}
            </div>

          </div>

          {/* sidebar skeleton */}
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



  /* ================= NOT FOUND ================= */

  if(post==="notfound"){
    return(
      <div className="py-40 text-center">
        <h2 className="text-2xl font-bold mb-4">Article not found</h2>
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

      <section className="min-h-screen py-14 px-4 bg-white text-gray-900 dark:bg-[#020617] dark:text-gray-100">

        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">

          {/* ARTICLE */}
          <article className="lg:col-span-2">

            {/* IMAGE */}
            <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
              <img
                src={post.img || "/placeholder.jpg"}
                alt={post.title}
                className="w-full h-[400px] object-cover"
              />
            </div>

            {/* TITLE */}
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              {post.title}
            </h1>

            {/* META */}
            <div className="text-sm mb-6 text-gray-500 flex gap-4 flex-wrap">
              <span>By {post.author || "Admin"}</span>
              <span>{readTime} min read</span>
              <span>{post.views || 0} views</span>
            </div>

            {/* CONTENT SAFE HTML */}
            <div
              className="prose prose-lg max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.desc)
              }}
            />



            {/* RELATED */}
            {related.length>0 && (
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

              {/* tabs */}
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



              {/* list */}
              <div className="space-y-5">
                {sidebarList.map((p,i)=>(
                  <Link key={p.id} href={`/blog/${p.slug}`} className="flex gap-4">
                    <span className="text-yellow-500 font-bold">{i+1}</span>
                    <p className="text-sm">{p.title}</p>
                  </Link>
                ))}
              </div>

            </div>
          </aside>

        </div>

      </section>

      <Footer/>
    </>
  );
}