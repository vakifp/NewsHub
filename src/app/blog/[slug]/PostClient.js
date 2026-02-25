"use client";

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

export default function PostClient({ slug }) {

  const [post,setPost] = useState(null);
  const [posts,setPosts] = useState([]);
  const [activeTab,setActiveTab] = useState("latest");



  /* LOAD DATA */
  useEffect(()=>{
    if(!slug) return;

    (async()=>{

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

      /* increment views */
      updateDoc(doc(db,"posts",currentPost.id),{
        views:increment(1)
      });

      /* related */
      const relatedSnap = await getDocs(
        query(collection(db,"posts"),where("category","==",currentPost.category))
      );

      setPosts(
        relatedSnap.docs.map(d=>({
          id:d.id,
          slug:d.data().slug || d.id,
          ...d.data()
        }))
      );

    })();

  },[slug]);



  /* SIDEBAR */
  const latestPosts = useMemo(()=>posts.slice(0,5),[posts]);

  const popularPosts = useMemo(
    ()=>[...posts].sort((a,b)=>(b.views||0)-(a.views||0)).slice(0,5),
    [posts]
  );

  const sidebarList =
    activeTab==="latest"
      ? latestPosts
      : popularPosts;



  /* READ TIME */
  const readTime=Math.max(
    1,
    Math.ceil((post?.desc?.replace(/<[^>]+>/g,"").split(" ").length||0)/200)
  );



  /* LOADER */
  if(post===null){
    return <div className="py-40 text-center">Loading article...</div>;
  }



  if(post==="notfound"){
    return (
      <div className="py-40 text-center">
        Article not found
      </div>
    );
  }



  /* UI */
  return(
    <>
      <Header/>

      <section className="min-h-screen py-14 px-4 bg-white dark:bg-[#020617] dark:text-gray-100">

        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">

          {/* ARTICLE */}
          <article className="lg:col-span-2">

            <img
              src={post.img || "/placeholder.jpg"}
              alt={post.title}
              className="w-full h-[400px] object-cover rounded-2xl mb-8"
            />

            <h1 className="text-4xl font-bold mb-6">{post.title}</h1>

            <div className="text-sm mb-6 text-gray-500 flex gap-4">
              <span>{readTime} min read</span>
              <span>{post.views || 0} views</span>
            </div>

            <div
              className="prose max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.desc)
              }}
            />

          </article>



          {/* SIDEBAR */}
          <aside>
            <div className="rounded-2xl p-6 border sticky top-24">

              <div className="flex mb-6 bg-gray-100 p-1 rounded-full">

                <button
                  onClick={()=>setActiveTab("latest")}
                  className={`flex-1 py-2 rounded-full ${
                    activeTab==="latest"
                      ? "bg-red-500 text-white"
                      : "text-gray-500"
                  }`}
                >
                  Latest
                </button>

                <button
                  onClick={()=>setActiveTab("popular")}
                  className={`flex-1 py-2 rounded-full ${
                    activeTab==="popular"
                      ? "bg-red-500 text-white"
                      : "text-gray-500"
                  }`}
                >
                  Popular
                </button>

              </div>



              <div className="space-y-4">
                {sidebarList.map((p,i)=>(
                  <Link key={p.id} href={`/blog/${p.slug}`} className="flex gap-3">
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