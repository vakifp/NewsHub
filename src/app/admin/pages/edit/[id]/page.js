"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditPage(){

  const { id } = useParams();
  const router = useRouter();

  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);

  const [form,setForm]=useState({
    title:"",
    slug:"",
    content:"",
    seoTitle:"",
    seoDesc:"",
    published:true
  });

  /* LOAD PAGE */
  useEffect(()=>{
    if(!id) return;

    (async()=>{
      const ref = doc(db,"pages",id);
      const snap = await getDoc(ref);

      if(snap.exists()){
        setForm(snap.data());
      } else {
        alert("Page not found");
        router.push("/admin/pages");
      }

      setLoading(false);
    })();

  },[id]);


  /* INPUT CHANGE */
  function handle(e){
    const {name,value,type,checked}=e.target;

    setForm(prev=>({
      ...prev,
      [name]: type==="checkbox" ? checked : value
    }));
  }


  /* SAVE */
  async function save(e){
    e.preventDefault();

    setSaving(true);

    await updateDoc(doc(db,"pages",id),{
      ...form,
      updated:Date.now()
    });

    router.push("/admin/pages");
  }



  /* LOADING UI */
  if(loading){
    return(
      <div className="p-20 text-center text-gray-500">
        Loading page...
      </div>
    );
  }



  /* UI */
  return(
    <div className="max-w-3xl mx-auto py-12 px-6">

      <h1 className="text-3xl font-bold mb-10">
        Edit Page
      </h1>

      <form onSubmit={save} className="space-y-6">

        {/* TITLE */}
        <input
          name="title"
          value={form.title}
          onChange={handle}
          placeholder="Title"
          className="border p-3 rounded w-full"
        />


        {/* SLUG */}
        <input
          name="slug"
          value={form.slug}
          onChange={handle}
          placeholder="Slug"
          className="border p-3 rounded w-full"
        />


        {/* CONTENT */}
        <textarea
          name="content"
          value={form.content}
          onChange={handle}
          placeholder="Content"
          className="border p-3 rounded w-full h-52"
        />


        {/* SEO TITLE */}
        <input
          name="seoTitle"
          value={form.seoTitle || ""}
          onChange={handle}
          placeholder="SEO Title"
          className="border p-3 rounded w-full"
        />


        {/* SEO DESC */}
        <textarea
          name="seoDesc"
          value={form.seoDesc || ""}
          onChange={handle}
          placeholder="SEO Description"
          className="border p-3 rounded w-full h-28"
        />


        {/* PUBLISH */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="published"
            checked={form.published}
            onChange={handle}
          />
          Published
        </label>


        {/* BUTTON */}
        <button
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg w-full hover:bg-blue-700 transition"
        >
          {saving ? "Updating..." : "Update Page"}
        </button>

      </form>

    </div>
  );
}