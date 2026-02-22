"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc,collection } from "firebase/firestore";

export default function UserForm({reload}){

  const [form,setForm]=useState({
    name:"",
    email:"",
    role:"Writer"
  });

  async function submit(e){
    e.preventDefault();

    await addDoc(collection(db,"users"),{
      ...form,
      created:Date.now()
    });

    setForm({name:"",email:"",role:"Writer"});
    reload();
  }

  return(
    <form onSubmit={submit} className="bg-white p-6 rounded-2xl shadow border grid md:grid-cols-3 gap-4">

      <input
        value={form.name}
        onChange={e=>setForm({...form,name:e.target.value})}
        placeholder="Name"
        className="input"
      />

      <input
        value={form.email}
        onChange={e=>setForm({...form,email:e.target.value})}
        placeholder="Email"
        className="input"
      />

      <select
        value={form.role}
        onChange={e=>setForm({...form,role:e.target.value})}
        className="input"
      >
        <option>Admin</option>
        <option>Editor</option>
        <option>Writer</option>
      </select>

      <button className="bg-blue-600 text-white py-2 rounded-xl md:col-span-3">
        Create User
      </button>

      <style jsx>{`
        .input{
          border:1px solid #e5e7eb;
          padding:12px;
          border-radius:10px;
          width:100%;
        }
      `}</style>

    </form>
  );
}