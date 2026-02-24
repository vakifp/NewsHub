"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Link from "next/link";

export default function PagesAdmin(){

  const [pages,setPages] = useState([]);
  const [loading,setLoading] = useState(true);
  const [search,setSearch] = useState("");
  const [deleting,setDeleting] = useState(null);

  /* LOAD */
  useEffect(()=>{
    (async()=>{
      const snap = await getDocs(collection(db,"pages"));
      setPages(snap.docs.map(d=>({id:d.id,...d.data()})));
      setLoading(false);
    })();
  },[]);


  /* DELETE */
  async function remove(id){
    if(!confirm("Delete this page?")) return;

    setDeleting(id);
    await deleteDoc(doc(db,"pages",id));
    setPages(p=>p.filter(x=>x.id!==id));
    setDeleting(null);
  }


  /* FILTER */
  const filtered = pages.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );


  return(
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pages Manager</h1>

        <Link href="/admin/pages/create">
          <button className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow hover:scale-105 transition">
            + Create Page
          </button>
        </Link>
      </div>


      {/* SEARCH */}
      <input
        placeholder="Search pages..."
        value={search}
        onChange={e=>setSearch(e.target.value)}
        className="w-full border rounded-xl px-4 py-2"
      />


      {/* TABLE CARD */}
      <div className="bg-white/80 backdrop-blur shadow-xl border overflow-hidden">

        {/* LOADING */}
        {loading && (
          <div className="p-10 space-y-3 animate-pulse">
            {[1,2,3,4].map(i=>(
              <div key={i} className="h-12 bg-gray-200 rounded"/>
            ))}
          </div>
        )}


        {/* EMPTY */}
        {!loading && filtered.length===0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">No pages found</p>

            <Link href="/admin/pages/create">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg">
                Create First Page
              </button>
            </Link>
          </div>
        )}


        {/* TABLE */}
        {!loading && filtered.length>0 && (
          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Slug</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>

              {filtered.map(p=>(
                <tr key={p.id} className="border-t hover:bg-gray-50 transition">

                  <td className="p-4 font-medium">
                    {p.title}
                  </td>

                  <td className="p-4 text-gray-500">
                    /{p.slug}
                  </td>

                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      p.published
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </td>

                  <td className="p-4 text-gray-500">
                    {p.created
                      ? new Date(p.created).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="p-4 text-right space-x-4">

                    <Link
                      href={`/page/${p.slug}`}
                      className="text-gray-600 hover:text-black"
                    >
                      View
                    </Link>

                    <Link
                      href={`/admin/pages/edit/${p.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={()=>remove(p.id)}
                      disabled={deleting===p.id}
                      className="text-red-600 hover:underline"
                    >
                      {deleting===p.id ? "Deleting..." : "Delete"}
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>
          </table>
        )}

      </div>

    </div>
  );
}