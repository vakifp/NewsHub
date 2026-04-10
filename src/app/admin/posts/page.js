"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import PostForm from "@/components/PostForm";
import PostsTable from "@/components/PostsTable";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Search, Filter } from "lucide-react";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    author: "",
    img: "",
    desc: "",
    category: "",
    tags: [],
    status: "Published",
    views: 0
  });

  useEffect(() => { load() }, []);

  async function load() {
    const q = query(collection(db, "posts"), orderBy("created", "desc"));
    const snap = await getDocs(q);
    setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));

    const catSnap = await getDocs(collection(db, "categories"));
    setCategories(catSnap.docs.map(d => d.data().name));
  }

  function slugify(t) {
    return t.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
  }

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    setLoading(true);

    const data = { ...form, slug: slugify(form.title) };

    if (editingId) {
      await updateDoc(doc(db, "posts", editingId), data);
      setEditingId(null);
    } else {
      await addDoc(collection(db, "posts"), { ...data, created: Date.now() });
    }

    resetForm();
    load();
    setLoading(false);
    setShowForm(false);
  }

  function resetForm() {
    setForm({
      title: "",
      author: "",
      img: "",
      desc: "",
      category: "",
      tags: [],
      status: "Published",
      views: 0
    });
  }

  async function handleDelete(id) {
    if (confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      await deleteDoc(doc(db, "posts", id));
      load();
    }
  }

  function handleEdit(post) {
    const { id, ...rest } = post;
    setForm(rest);
    setEditingId(id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight">Content Management</h1>
          <p className="text-muted-foreground font-medium">Create and refine your editorial high-impact stories.</p>
        </div>
        
        <button
          onClick={() => {
            if (showForm) {
              setEditingId(null);
              resetForm();
            }
            setShowForm(!showForm);
          }}
          className={`
            flex items-center gap-2 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all
            ${showForm 
              ? "bg-destructive text-white shadow-lg shadow-destructive/20" 
              : "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"}
          `}
        >
          {showForm ? <><X size={16} /> Close Editor</> : <><Plus size={16} /> Write New Article</>}
        </button>
      </header>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-12"
          >
            <PostForm
              form={form}
              setForm={setForm}
              editingId={editingId}
              setEditingId={setEditingId}
              categories={categories}
              onSubmit={handleSubmit}
              loading={loading}
              onCancel={() => {
                setShowForm(false);
                setEditingId(null);
                resetForm();
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        <div className="flex items-center gap-4 bg-white dark:bg-[#0b1220] p-2 rounded-2xl border dark:border-gray-800 shadow-sm max-w-md">
          <div className="pl-4"><Search size={18} className="text-muted-foreground" /></div>
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter articles..." 
            className="flex-1 bg-transparent py-2 text-sm outline-none"
          />
          <button className="p-2 rounded-xl hover:bg-accent transition-colors"><Filter size={18} /></button>
        </div>

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
    </div>
  );
}