"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import UserForm from "./UserForm";
import UserTable from "./UserTable";
import { Users, ShieldCheck, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    const q = query(collection(db, "users"), orderBy("created", "desc"));
    const snap = await getDocs(q);
    setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  }

  if (loading) return <div className="p-20 text-center animate-pulse">Synchronizing access protocols...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-20"
    >
      <header className="space-y-1">
        <h1 className="text-4xl font-black tracking-tight">Access Management</h1>
        <p className="text-muted-foreground font-medium">Coordinate your team and maintain secure editorial standards.</p>
      </header>

      <div className="grid lg:grid-cols-4 gap-6">
        <StatCard title="Total Staff" value={users.length} icon={<Users size={20} />} color="primary" />
        <StatCard title="Admins" value={users.filter(u => u.role === "Admin").length} icon={<ShieldCheck size={20} />} color="indigo" />
        <StatCard title="Active Systems" value="Operational" icon={<Activity size={20} />} color="emerald" sub="All Clear" />
      </div>

      <UserForm reload={load} />

      <UserTable users={users} reload={load} />
    </motion.div>
  );
}

function StatCard({ title, value, icon, color = "primary", sub }) {
  const colors = {
    primary: "bg-primary text-primary-foreground shadow-primary/30",
    indigo: "bg-indigo-500 text-white shadow-indigo-500/30",
    emerald: "bg-emerald-500 text-white shadow-emerald-500/30",
    amber: "bg-amber-500 text-white shadow-amber-500/30"
  };

  return (
    <div className="bg-white dark:bg-[#0b1220] p-6 rounded-[2rem] border dark:border-gray-800 shadow-sm flex items-center gap-6">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{title}</p>
        <p className="text-2xl font-black tracking-tight">{value}</p>
        {sub && <p className="text-[10px] font-bold text-emerald-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}