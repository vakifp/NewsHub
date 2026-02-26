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
import Footer from "@/components/Footer";
import Link from "next/link";
import DOMPurify from "dompurify";

export default function DetailsClient(){

  const { slug } = useParams();

  const [post,setPost] = useState(null);
  const [posts,setPosts] = useState([]);
  const [activeTab,setActiveTab] = useState("latest");



  /* LOAD POST */
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

        updateDoc(doc(db,"posts",currentPost.id),{
          views:increment(1)
        });

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

      }catch{
        setPost("notfound");
      }

    })();

  },[slug]);



  /* SIDEBAR */
  const latestPosts = useMemo(()=>posts.slice(0,5),[posts]);

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



  /* READ TIME */
  const readTime=Math.max(
    1,
    Math.ceil((post?.desc?.replace(/<[^>]+>/g,"").split(" ").length||0)/200)
  );



  /* RELATED */
  const related = useMemo(()=>{
    if(!post?.category) return [];
    return posts.filter(p=>p.slug!==post.slug).slice(0,3);
  },[posts,post]);



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

      <section className="py-14 px-4">

        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">

          {/* ARTICLE */}
          <article className="lg:col-span-2">

            <img
              src={post.img || "/placeholder.jpg"}
              alt={post.title}
              className="rounded-2xl mb-8 w-full h-[400px] object-cover"
            />

            <h1 className="text-4xl font-bold mb-6">{post.title}</h1>

            <div className="text-sm mb-6 text-gray-500 flex gap-4">
              <span>By {post.author||"Admin"}</span>
              <span>{readTime} min read</span>
              <span>{post.views||0} views</span>
            </div>

            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.desc)
              }}
            />



            {/* RELATED */}
            {related.length>0 &&(
              <div className="mt-16">
                <h3 className="text-xl font-bold mb-6">Related Articles</h3>

                <div className="grid md:grid-cols-3 gap-6">
                  {related.map(p=>(
                    <Link
                      key={p.id}
                      href={`/blog/${p.slug}`}
                      className="border rounded-xl p-4 hover:shadow"
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
            <div className="border p-6 rounded-2xl sticky top-24">

              <div className="flex mb-6">
                <button onClick={()=>setActiveTab("latest")}>Latest</button>
                <button onClick={()=>setActiveTab("popular")}>Popular</button>
              </div>

              <div className="space-y-4">
                {sidebarList.map((p,i)=>(
                  <Link key={p.id} href={`/blog/${p.slug}`}>
                    {i+1}. {p.title}
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