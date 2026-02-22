"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Login(){

  const router = useRouter();

  const [form,setForm] = useState({
    email:"",
    password:""
  });

  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");

  function handleChange(e){
    setForm({...form,[e.target.name]:e.target.value});
  }

  async function handleSubmit(e){
    e.preventDefault();
    setError("");

    if(!form.email || !form.password){
      return setError("Enter email and password");
    }

    try{
      setLoading(true);

      /* 🔐 Firebase Login */
      const userCred = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      /* 👤 Get user data from Firestore */
      const docRef = doc(db,"users",userCred.user.uid);
      const snap = await getDoc(docRef);

      if(!snap.exists()){
        throw new Error("User data not found");
      }

      const userData = snap.data();

      /* Save session */
      localStorage.setItem("admin","true");
      localStorage.setItem("role",userData.role);

      router.push("/admin");

    }catch(err){
      setError("Invalid email or password");
    }

    setLoading(false);
  }

  return(
    <div className="min-h-screen flex items-center justify-center bg-[#f6f8fb]">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          Admin Login
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="input"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="input mt-4"
        />

        <button
          disabled={loading}
          className="btn mt-6 w-full"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center mt-6 text-gray-500">
          Don't have account?
          <a href="/register" className="text-blue-600 ml-1">Create</a>
        </p>

      </form>

      <style jsx>{`
        .input{
          width:100%;
          border:1px solid #e5e7eb;
          padding:12px;
          border-radius:10px;
        }
        .btn{
          background:#2563eb;
          color:white;
          padding:12px;
          border-radius:10px;
          font-weight:600;
        }
        .btn:disabled{
          opacity:.6;
        }
      `}</style>

    </div>
  );
}