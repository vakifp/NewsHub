"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function CreatePage(){

  const router = useRouter();

  const [form,setForm] = useState({
    title:"",
    slug:"",
    content:"",
    seoTitle:"",
    seoDesc:"",
    published:true
  });

  const [loading,setLoading] = useState(false);
  const [msg,setMsg] = useState("");



  /* ---------- SLUG ---------- */
  function slugify(text){
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g,"")
      .replace(/\s+/g,"-");
  }



  /* ---------- INPUT ---------- */
  function handle(e){
    const {name,value,type,checked} = e.target;

    setForm(prev=>({
      ...prev,
      [name]: type==="checkbox" ? checked : value,
      ...(name==="title" && !prev.slug
        ? {slug:slugify(value)}
        : {})
    }));
  }



  /* ---------- SUBMIT ---------- */
  async function submit(e){
    e.preventDefault();

    if(!form.title || !form.slug){
      return setMsg("Title and slug required");
    }

    try{
      setLoading(true);

      await addDoc(collection(db,"pages"),{
        ...form,
        created:Date.now()
      });

      setMsg("Page created successfully ✅");

      setTimeout(()=>{
        router.push("/admin/pages");
      },800);

    }catch(err){
      setMsg("Error creating page ❌");
    }finally{
      setLoading(false);
    }
  }



  return(
    <div className="min-h-screen  py-12 px-6">

      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold">
            Create Page
          </h1>
          <p className="text-gray-500 mt-2">
            Create static pages like About, Contact, Privacy Policy.
          </p>
        </div>



        {/* CARD */}
        <form
          onSubmit={submit}
          className="bg-white rounded-2xl shadow border p-8 space-y-8"
        >

          {/* ---------- BASIC ---------- */}
          <div className="space-y-6">

            <h2 className="font-semibold text-lg border-b pb-2">
              Page Details
            </h2>

            {/* TITLE */}
            <div>
              <label className="text-sm font-medium">
                Page Title
              </label>

              <input
                name="title"
                onChange={handle}
                placeholder="Enter page title"
                className="mt-1 border p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>



            {/* SLUG */}
            <div>
              <label className="text-sm font-medium">
                URL Slug
              </label>

              <input
                name="slug"
                value={form.slug}
                onChange={handle}
                placeholder="page-url-slug"
                className="mt-1 border p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>



            {/* CONTENT */}
            <div>
              <label className="text-sm font-medium">
                Page Content
              </label>

              <textarea
                name="content"
                onChange={handle}
                placeholder="Write page content..."
                className="mt-1 border p-3 rounded-xl w-full h-52 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

          </div>



          {/* ---------- SEO ---------- */}
          <div className="space-y-6">

            <h2 className="font-semibold text-lg border-b pb-2">
              SEO Settings
            </h2>

            {/* SEO TITLE */}
            <div>
              <label className="text-sm font-medium">
                SEO Title
              </label>

              <input
                name="seoTitle"
                onChange={handle}
                placeholder="SEO optimized title"
                className="mt-1 border p-3 rounded-xl w-full focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>



            {/* SEO DESC */}
            <div>
              <label className="text-sm font-medium">
                SEO Description
              </label>

              <textarea
                name="seoDesc"
                onChange={handle}
                placeholder="SEO description"
                className="mt-1 border p-3 rounded-xl w-full h-24 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

          </div>



          {/* ---------- STATUS ---------- */}
          <div className="flex items-center justify-between border-t pt-6">

            <label className="flex items-center gap-3 cursor-pointer">

              <input
                type="checkbox"
                name="published"
                checked={form.published}
                onChange={handle}
                className="w-5 h-5"
              />

              <span className="text-sm font-medium">
                Publish immediately
              </span>

            </label>


            <span className={`text-xs px-3 py-1 rounded-full ${
              form.published
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}>
              {form.published ? "Published" : "Draft"}
            </span>

          </div>



          {/* ---------- SUBMIT ---------- */}
          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow"
          >
            {loading ? "Saving..." : "Save Page"}
          </button>



          {/* MESSAGE */}
          {msg && (
            <p className="text-center text-sm text-gray-500">
              {msg}
            </p>
          )}

        </form>
      </div>
    </div>
  );
}