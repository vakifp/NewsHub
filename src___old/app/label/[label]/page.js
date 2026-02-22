"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import Header from "@/components/Header";

export default function LabelPage(){

  const { label } = useParams();
  const decoded = decodeURIComponent(label);

  const [posts,setPosts]=useState([]);

  useEffect(()=>{
    async function load(){

      const snap = await getDocs(collection(db,"posts"));

      const filtered = snap.docs
        .map(doc=>({id:doc.id,...doc.data()}))
        .filter(post => {

          if(!post.labels) return false;

          if(Array.isArray(post.labels))
            return post.labels.includes(decoded);

          return post.labels === decoded;
        });

      setPosts(filtered);
    }

    load();
  },[decoded]);


  return(
    <>
      <Header/>

      <section className="min-h-screen py-14 px-4">

        <div className="max-w-6xl mx-auto">

          <h1 className="text-3xl font-bold mb-10 text-center">
            #{decoded}
          </h1>

          {posts.length===0 ? (
            <p className="text-center text-gray-500">
              No posts found for this label
            </p>
          ) : (

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

              {posts.map(post=>(
                <Link
                  key={post.id}
                  href={`/blog/${post.slug || post.id}`}
                  className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
                >

                  <img
                    src={post.img || "/placeholder.jpg"}
                    className="h-52 w-full object-cover"
                  />

                  <div className="p-4">
                    <h3 className="font-semibold">
                      {post.title}
                    </h3>
                  </div>

                </Link>
              ))}

            </div>
          )}

        </div>
      </section>
    </>
  );
}