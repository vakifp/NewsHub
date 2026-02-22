"use client";

import { useEffect,useState } from "react";
import { db } from "@/lib/firebase";
import { doc,setDoc,getDoc } from "firebase/firestore";

export default function SettingsForm(){

  const [form,setForm]=useState({
    siteName:"",
    logo:"",
    primaryColor:"#2563eb",
    metaDesc:"",
    facebook:"",
    twitter:"",
    instagram:""
  });

  const [loading,setLoading]=useState(false);
  const [saved,setSaved]=useState(false);

  /* LOAD SETTINGS */
  useEffect(()=>{
    load();
  },[]);

  async function load(){
    const snap=await getDoc(doc(db,"settings","main"));
    if(snap.exists()) setForm(snap.data());
  }

  function change(e){
    setForm({...form,[e.target.name]:e.target.value});
  }

  /* SAVE SETTINGS */
  async function save(e){
    e.preventDefault();
    setLoading(true);

    await setDoc(doc(db,"settings","main"),form);

    setSaved(true);
    setLoading(false);

    setTimeout(()=>setSaved(false),2000);
  }

  return(
    <form onSubmit={save} className="bg-white p-8 rounded-2xl shadow border space-y-6">

      <h2 className="text-xl font-bold">Site Settings</h2>

      {/* SITE NAME */}
      <input name="siteName" value={form.siteName} onChange={change}
        placeholder="Site Name"
        className="input"/>

      {/* LOGO */}
      <input name="logo" value={form.logo} onChange={change}
        placeholder="Logo URL"
        className="input"/>

      {/* COLOR */}
      <div>
        <label className="text-sm font-medium">Primary Color</label>
        <input type="color" name="primaryColor" value={form.primaryColor} onChange={change}/>
      </div>

      {/* META */}
      <textarea name="metaDesc" value={form.metaDesc} onChange={change}
        placeholder="Default Meta Description"
        className="input h-24"/>

      {/* SOCIAL LINKS */}
      <div className="grid md:grid-cols-3 gap-4">
        <input name="facebook" value={form.facebook} onChange={change} placeholder="Facebook" className="input"/>
        <input name="twitter" value={form.twitter} onChange={change} placeholder="Twitter" className="input"/>
        <input name="instagram" value={form.instagram} onChange={change} placeholder="Instagram" className="input"/>
      </div>

      {/* BUTTON */}
      <button className="bg-blue-600 text-white px-6 py-2 rounded-xl">
        {loading ? "Saving..." : "Save Settings"}
      </button>

      {saved && <p className="text-green-600 text-sm">Settings saved ✓</p>}

      <style jsx>{`
        .input{
          width:100%;
          border:1px solid #e5e7eb;
          padding:12px;
          border-radius:10px;
        }
      `}</style>

    </form>
  );
}