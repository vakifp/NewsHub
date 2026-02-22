"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from "firebase/firestore";

export default function CategoryManager(){

  const [categories,setCategories] = useState([]);
  const [name,setName] = useState("");
  const [editingId,setEditingId] = useState(null);
  const [loading,setLoading] = useState(false);

  /* ---------- SLUG ---------- */
  function slugify(text){
    return text.toLowerCase().trim().replace(/\s+/g,"-");
  }

  /* ---------- LOAD ---------- */
useEffect(()=>{
  async function load(){
    const snap = await getDocs(collection(db,"posts"));
    setPosts(snap.docs.map(d=>({ id:d.id,...d.data() })));
  }

  load();
},[]);

  /* ---------- SUBMIT ---------- */
  async function submit(e){
    e.preventDefault();
    if(!name.trim()) return;

    setLoading(true);

    const data={
      name:name.trim(),
      slug:slugify(name),
    };

    if(editingId){
      await updateDoc(doc(db,"categories",editingId),data);
      setEditingId(null);
    }else{
      await addDoc(collection(db,"categories"),{
        ...data,
        visible:true
      });
    }

    setName("");
    load();
    setLoading(false);
  }

  /* ---------- EDIT ---------- */
  function edit(cat){
    setName(cat.name);
    setEditingId(cat.id);
    window.scrollTo({top:0,behavior:"smooth"});
  }

  /* ---------- DELETE ---------- */
  async function remove(id){
    if(confirm("Delete category?")){
      await deleteDoc(doc(db,"categories",id));
      load();
    }
  }

  /* ---------- TOGGLE VISIBILITY ---------- */
  async function toggle(cat){
    await updateDoc(doc(db,"categories",cat.id),{
      visible:!cat.visible
    });
    load();
  }

  /* ================= UI ================= */
  return(
    <div className="space-y-8">

      {/* FORM */}
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded-2xl shadow border flex gap-4"
      >

        <input
          value={name}
          onChange={e=>setName(e.target.value)}
          placeholder="Category name"
          className="border p-3 rounded-xl w-full"
        />

        <button
          disabled={loading}
          className="px-6 rounded-xl bg-blue-600 text-white"
        >
          {editingId ? "Update" : "Add"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={()=>{
              setEditingId(null);
              setName("");
            }}
            className="px-6 rounded-xl border"
          >
            Cancel
          </button>
        )}

      </form>



      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow border overflow-hidden">

        <div className="p-5 font-semibold border-b">
          Categories ({categories.length})
        </div>

        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Slug</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map(cat=>(
              <tr key={cat.id} className="border-t">

                <td className="p-4 font-medium">
                  {cat.name}
                </td>

                <td className="p-4 text-gray-500">
                  /{cat.slug}
                </td>

                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    cat.visible
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {cat.visible ? "Visible" : "Hidden"}
                  </span>
                </td>

                <td className="p-4 flex gap-2 justify-center">

                  <button
                    onClick={()=>edit(cat)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
                  >
                    Edit
                  </button>

                  <button
                    onClick={()=>toggle(cat)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded text-xs"
                  >
                    {cat.visible ? "Hide" : "Show"}
                  </button>

                  <button
                    onClick={()=>remove(cat.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-xs"
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}