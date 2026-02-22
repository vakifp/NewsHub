"use client";

import { useEffect,useState } from "react";
import { db } from "@/lib/firebase";
import { collection,getDocs,addDoc,updateDoc,deleteDoc,doc } from "firebase/firestore";

import PostForm from "@/components/PostForm";
import PostsTable from "@/components/PostsTable";

export default function Page(){

  const [posts,setPosts]=useState([]);
  const [categories,setCategories]=useState([]);
  const [editingId,setEditingId]=useState(null);
  const [loading,setLoading]=useState(false);
  const [search,setSearch]=useState("");
  const [page,setPage]=useState(1);

  const [form,setForm]=useState({
    title:"",
    author:"",
    img:"",
    desc:"",
    category:"",
    tags:[],
    status:"Published"
  });

  useEffect(()=>{load()},[]);

  async function load(){
    const snap=await getDocs(collection(db,"posts"));
    setPosts(snap.docs.map(d=>({id:d.id,...d.data()})));

    const cat=await getDocs(collection(db,"categories"));
    setCategories(cat.docs.map(d=>d.data().name));
  }

  function slugify(t){
    return t.toLowerCase().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-");
  }

  async function handleSubmit(e){
    e.preventDefault();
    setLoading(true);

    const data={...form,slug:slugify(form.title)};

    if(editingId){
      await updateDoc(doc(db,"posts",editingId),data);
      setEditingId(null);
    }else{
      await addDoc(collection(db,"posts"),{...data,created:Date.now()});
    }

    setForm({
      title:"",
      author:"",
      img:"",
      desc:"",
      category:"",
      tags:[],
      status:"Published"
    });

    load();
    setLoading(false);
  }

  async function handleDelete(id){
    await deleteDoc(doc(db,"posts",id));
    load();
  }

  function handleEdit(post){
    const {id,...rest}=post;
    setForm(rest);
    setEditingId(id);
  }

  return(
    <div className="space-y-10">

      <PostForm
        form={form}
        setForm={setForm}
        editingId={editingId}
        setEditingId={setEditingId}
        categories={categories}
        onSubmit={handleSubmit}
        loading={loading}
      />

      <PostsTable
        posts={posts}
        search={search}
        setSearch={setSearch}
        page={page}
        setPage={setPage}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

    </div>
  );
}