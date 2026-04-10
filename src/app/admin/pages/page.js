"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import { 
  FileText, 
  Plus, 
  Search, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Calendar, 
  Globe,
  MoreHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PagesAdmin() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    (async () => {
      const q = query(collection(db, "pages"), orderBy("created", "desc"));
      const snap = await getDocs(q);
      setPages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    })();
  }, []);

  async function remove(id) {
    if (!confirm("Permanently delete this administrative page?")) return;
    setDeleting(id);
    await deleteDoc(doc(db, "pages", id));
    setPages(p => p.filter(x => x.id !== id));
    setDeleting(null);
  }

  const filtered = pages.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-20 text-center animate-pulse">Syncing document architecture...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-20"
    >
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <FileText className="text-primary" /> Page Architecture
          </h1>
          <p className="text-muted-foreground font-medium">Manage your site's static infrastructure and legal pages.</p>
        </div>

        <Link href="/admin/pages/create">
          <button className="px-10 py-4 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3">
            <Plus size={18} /> New Page
          </button>
        </Link>
      </header>

      {/* SEARCH & FILTERS */}
      <div className="relative group max-w-xl">
        <div className="absolute inset-y-0 left-5 flex items-center text-muted-foreground group-focus-within:text-primary transition-colors">
          <Search size={20} />
        </div>
        <input
          placeholder="Search by title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-[#0b1220] border dark:border-gray-800 rounded-[2rem] pl-14 pr-6 py-5 outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold shadow-sm"
        />
      </div>

      {/* TABLE CARD */}
      <div className="bg-white dark:bg-[#0b1220] rounded-[2.5rem] border dark:border-gray-800 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-32 space-y-6">
            <div className="w-20 h-20 bg-accent/50 rounded-3xl flex items-center justify-center mx-auto text-muted-foreground opacity-20">
              <FileText size={40} />
            </div>
            <p className="text-muted-foreground font-bold italic">No document entries found matches your search.</p>
            <Link href="/admin/pages/create">
              <button className="text-primary font-black uppercase text-xs tracking-widest hover:underline">
                Create First Page
              </button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b dark:border-gray-800 bg-accent/5">
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Document Title</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Direct Route</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Status</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right pr-12">Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-800">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-accent/30 transition-all group">
                    <td className="p-8">
                      <div className="flex flex-col">
                        <span className="font-black text-sm tracking-tight">{p.title}</span>
                        <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1.5 mt-1">
                          <Calendar size={10} /> {p.created ? new Date(p.created).toLocaleDateString() : "Historical"}
                        </span>
                      </div>
                    </td>

                    <td className="p-8">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-accent/50 px-3 py-1.5 rounded-full border dark:border-gray-700">
                        /{p.slug}
                      </span>
                    </td>

                    <td className="p-8">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        p.published
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${p.published ? "bg-emerald-500" : "bg-amber-500"}`} />
                        {p.published ? "Live" : "Draft"}
                      </span>
                    </td>

                    <td className="p-8 text-right pr-12">
                      <div className="flex items-center justify-end gap-3 translate-x-2 group-hover:translate-x-0 transition-transform">
                        <Link href={`/page/${p.slug}`} target="_blank">
                          <button className="p-3 rounded-2xl bg-accent/50 text-muted-foreground hover:text-primary transition-all" title="View Source">
                            <ExternalLink size={16} />
                          </button>
                        </Link>
                        <Link href={`/admin/pages/edit/${p.id}`}>
                          <button className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 hover:bg-indigo-100 transition-all" title="Edit Structure">
                            <Edit3 size={16} />
                          </button>
                        </Link>
                        <button
                          onClick={() => remove(p.id)}
                          disabled={deleting === p.id}
                          className="p-3 rounded-2xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all shadow-sm"
                          title="Purge Document"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}