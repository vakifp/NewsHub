"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { UserPlus, User, Mail, Shield, Plus, ChevronDown } from "lucide-react";

export default function UserForm({ reload }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Writer"
  });
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!form.name || !form.email) return;

    setLoading(true);
    await addDoc(collection(db, "users"), {
      ...form,
      created: Date.now()
    });

    setForm({ name: "", email: "", role: "Writer" });
    reload();
    setLoading(false);
  }

  return (
    <div className="bg-white dark:bg-[#0b1220] p-8 rounded-[2rem] border dark:border-gray-800 shadow-xl relative overflow-hidden">
      <div className="mb-8 space-y-1 relative z-10">
        <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
          <UserPlus size={20} className="text-primary" /> Onboard Operative
        </h3>
        <p className="text-muted-foreground text-xs font-medium">Grant secure access to your editorial staff.</p>
      </div>

      <form onSubmit={submit} className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 relative z-10">
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center text-muted-foreground">
            <User size={16} />
          </div>
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Identity Name"
            className="w-full bg-accent/20 border-none rounded-xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center text-muted-foreground">
            <Mail size={16} />
          </div>
          <input
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="Security Email"
            className="w-full bg-accent/20 border-none rounded-xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center text-muted-foreground">
            <Shield size={16} />
          </div>
          <select
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
            className="w-full bg-accent/20 border-none rounded-xl pl-12 pr-10 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm appearance-none cursor-pointer"
          >
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="Writer">Writer</option>
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center text-muted-foreground pointer-events-none">
            <ChevronDown size={14} />
          </div>
        </div>

        <button 
          disabled={loading}
          className="bg-primary text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {loading ? "Registering..." : <><Plus size={18} /> Provision Access</>}
        </button>
      </form>
      
      <UserPlus size={120} className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none rotate-12" />
    </div>
  );
}