"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Register(){

  const router = useRouter();

  const [form,setForm] = useState({
    name:"",
    email:"",
    password:""
  });

  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);

  function handleChange(e){
    setForm({...form,[e.target.name]:e.target.value});
  }

  async function handleSubmit(e){
    e.preventDefault();
    setError("");
    setLoading(true);

    if(!form.name || !form.email || !form.password){
      setError("All fields required");
      setLoading(false);
      return;
    }

    try{
      // 1️⃣ create auth user
      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      // 2️⃣ store user data in firestore
      await setDoc(doc(db,"users",userCred.user.uid),{
        name: form.name,
        email: form.email,
        role: "admin",
        created: Date.now()
      });

      alert("Account created!");
      router.push("/login");

    }catch(err){
      setError(err.message);
    }

    setLoading(false);
  }

  return(
    <div className="center">
      <form onSubmit={handleSubmit} className="card">

        <h2>Create Account</h2>

        {error && <p className="err">{error}</p>}

        <input name="name" placeholder="Name" onChange={handleChange}/>
        <input name="email" placeholder="Email" onChange={handleChange}/>
        <input name="password" type="password" placeholder="Password" onChange={handleChange}/>

        <button disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>

      </form>

      <style jsx>{`
        .center{display:flex;align-items:center;justify-content:center;height:100vh;background:#f6f8fb}
        .card{background:white;padding:40px;border-radius:18px;width:340px;box-shadow:0 10px 25px rgba(0,0,0,.08)}
        input{width:100%;padding:12px;margin-top:12px;border:1px solid #e5e7eb;border-radius:10px}
        button{width:100%;margin-top:20px;padding:12px;background:#2563eb;color:white;border-radius:10px;font-weight:600}
        .err{color:red;font-size:14px}
      `}</style>
    </div>
  );
}