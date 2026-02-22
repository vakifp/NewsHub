"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
  query
} from "firebase/firestore";

export default function Dashboard(){

  const [posts,setPosts]=useState([]);
  const [editingId,setEditingId]=useState(null);

  const [form,setForm]=useState({
    title:"",
    desc:"",
    img:"",
    author:"",
    labels:""
  });

  /* ---------- SLUG ---------- */
  function slugify(text){
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g,"")
      .replace(/\s+/g,"-");
  }

  /* ---------- LOAD POSTS ---------- */
  async function loadPosts(){
    const q=query(collection(db,"posts"),orderBy("created","desc"));
    const snap=await getDocs(q);
    setPosts(snap.docs.map(d=>({id:d.id,...d.data()})));
  }

  useEffect(()=>{loadPosts()},[]);

  /* ---------- FORM CHANGE ---------- */
  function handleChange(e){
    setForm({...form,[e.target.name]:e.target.value});
  }

  /* ---------- SUBMIT ---------- */
  async function handleSubmit(e){
    e.preventDefault();

    const data={
      ...form,
      slug: slugify(form.title)
    };

    if(editingId){
      await updateDoc(doc(db,"posts",editingId),data);
      setEditingId(null);
    }else{
      await addDoc(collection(db,"posts"),{
        ...data,
        created: Date.now()
      });
    }

    setForm({
      title:"",
      desc:"",
      img:"",
      author:"",
      labels:""
    });

    loadPosts();
  }

  /* ---------- DELETE ---------- */
  async function handleDelete(id){
    if(confirm("Delete post?")){
      await deleteDoc(doc(db,"posts",id));
      loadPosts();
    }
  }

  /* ---------- EDIT ---------- */
  function handleEdit(post){
    setForm(post);
    setEditingId(post.id);
    window.scrollTo({top:0,behavior:"smooth"});
  }



  return(
    <div className="max-w-6xl mx-auto p-8 space-y-10">

      {/* ================= FORM ================= */}
      <div className="bg-white border rounded-xl shadow p-6">

        <h2 className="text-xl font-bold mb-6">
          {editingId ? "Edit Post" : "Create Post"}
        </h2>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">

          <input name="title" value={form.title} onChange={handleChange}
            placeholder="Title" className="border p-2 rounded"/>

          <input name="author" value={form.author} onChange={handleChange}
            placeholder="Author" className="border p-2 rounded"/>

          <input name="labels" value={form.labels} onChange={handleChange}
            placeholder="Labels (comma separated)"
            className="border p-2 rounded md:col-span-2"/>

          <input name="img" value={form.img} onChange={handleChange}
            placeholder="Image URL"
            className="border p-2 rounded md:col-span-2"/>

          <textarea name="desc" value={form.desc} onChange={handleChange}
            placeholder="Description"
            className="border p-2 rounded md:col-span-2 h-32"/>

          <button className="bg-black text-white py-2 rounded md:col-span-2">
            {editingId ? "Update Post" : "Publish Post"}
          </button>

        </form>
      </div>



      {/* ================= TABLE ================= */}
      <div className="bg-white border rounded-xl shadow overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Author</th>
              <th className="p-3 text-left">Labels</th>
              <th className="p-3 text-left">Slug</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>

            {posts.map(post=>(
              <tr key={post.id} className="border-t">

                <td className="p-3 font-medium">{post.title}</td>
                <td className="p-3">{post.author}</td>
                <td className="p-3">{post.labels}</td>
                <td className="p-3 text-gray-600">{post.slug}</td>

                <td className="p-3 flex gap-2 justify-center">

                  <button
                    onClick={()=>handleEdit(post)}
                    className="px-3 py-1 bg-blue-600 text-white rounded">
                    Edit
                  </button>

                  <button
                    onClick={()=>handleDelete(post.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded">
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