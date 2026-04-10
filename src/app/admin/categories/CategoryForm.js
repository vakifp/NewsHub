"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from "firebase/firestore";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  GripVertical, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Plus, 
  Check, 
  X,
  Type,
  Hash,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ================= SORTABLE ROW ================= */
function Row({ cat, edit, toggle, remove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: cat.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <tr 
      ref={setNodeRef} 
      style={style} 
      className={`border-b dark:border-gray-800 transition-colors ${isDragging ? "bg-accent/50 shadow-xl" : "hover:bg-accent/30"}`}
    >
      <td className="p-4 w-12">
        <button
          className="p-2 text-muted-foreground hover:text-primary transition-colors cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={18} />
        </button>
      </td>

      <td className="p-4">
        <div className="flex flex-col">
          <span className="font-black text-sm tracking-tight">{cat.name}</span>
          <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1">
            <Hash size={10} /> {cat.slug}
          </span>
        </div>
      </td>

      <td className="p-4">
        <span className={`
          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
          ${cat.visible 
            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" 
            : "bg-gray-500/10 text-gray-500 border border-gray-500/20 opacity-60"}
        `}>
          {cat.visible ? <Eye size={12} /> : <EyeOff size={12} />}
          {cat.visible ? "Visible" : "Hidden"}
        </span>
      </td>

      <td className="p-4 text-right pr-8">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => edit(cat)}
            className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 hover:bg-indigo-100 transition-all"
            title="Edit Category"
          >
            <Edit size={16} />
          </button>
          
          <button
            onClick={() => toggle(cat)}
            className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/10 text-amber-600 hover:bg-amber-100 transition-all"
            title={cat.visible ? "Hide Category" : "Show Category"}
          >
            {cat.visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>

          <button
            onClick={() => remove(cat.id)}
            className="p-2.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all shadow-sm"
            title="Delete Category"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ================= MAIN COMPONENT ================= */
export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => { load(); }, []);

  async function load() {
    const snap = await getDocs(collection(db, "categories"));
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    list.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
    setCategories(list);
  }

  async function submit(e) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    const slug = name.toLowerCase().trim().replace(/\s+/g, "-");
    const data = { name: name.trim(), slug };

    if (editingId) {
      await updateDoc(doc(db, "categories", editingId), data);
      setEditingId(null);
    } else {
      await addDoc(collection(db, "categories"), {
        ...data,
        visible: true,
        order: categories.length
      });
    }

    setName("");
    await load();
    setLoading(false);
  }

  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIdx = categories.findIndex(i => i.id === active.id);
    const newIdx = categories.findIndex(i => i.id === over.id);

    const newItems = arrayMove(categories, oldIdx, newIdx);
    setCategories(newItems);

    await Promise.all(
      newItems.map((cat, idx) => updateDoc(doc(db, "categories", cat.id), { order: idx }))
    );
  }

  function edit(cat) {
    setName(cat.name);
    setEditingId(cat.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function toggle(cat) {
    await updateDoc(doc(db, "categories", cat.id), { visible: !cat.visible });
    load();
  }

  async function remove(id) {
    if (confirm("Permanently delete this category?")) {
      await deleteDoc(doc(db, "categories", id));
      load();
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Activity className="text-primary" /> Taxonomy Management
          </h2>
          <p className="text-muted-foreground font-medium text-sm">Organize and prioritize your editorial categories.</p>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white dark:bg-[#0b1220] p-8 rounded-[2rem] border dark:border-gray-800 shadow-xl relative overflow-hidden">
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-4 relative z-10">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-4 flex items-center text-muted-foreground">
              <Type size={18} />
            </div>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Artificial Intelligence"
              className="w-full bg-accent/20 border-none rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
            />
          </div>

          <div className="flex gap-2">
            <button
              disabled={loading || !name}
              className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              {editingId ? <Check size={18} /> : <Plus size={18} />}
              {editingId ? "Update" : "Add Category"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => { setEditingId(null); setName(""); }}
                className="px-8 py-4 bg-accent/50 text-foreground rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-accent transition-all"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* DRAGGABLE TABLE */}
      <div className="bg-white dark:bg-[#0b1220] rounded-[2rem] border dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b dark:border-gray-800 bg-accent/10 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black tracking-tight">Active Categories</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Drag handle to reorder</p>
          </div>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b dark:border-gray-800 bg-accent/5">
                <th className="p-6 w-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground"></th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Name & Route</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Visibility</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right pr-12">Actions</th>
              </tr>
            </thead>

            <SortableContext items={categories.map(c => c.id)} strategy={verticalListSortingStrategy}>
              <tbody className="divide-y dark:divide-gray-800">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-20 text-center text-muted-foreground font-bold italic">
                      No categories defined yet.
                    </td>
                  </tr>
                ) : (
                  categories.map(cat => (
                    <Row
                      key={cat.id}
                      cat={cat}
                      edit={edit}
                      toggle={toggle}
                      remove={remove}
                    />
                  ))
                )}
              </tbody>
            </SortableContext>
          </table>
        </DndContext>
      </div>
    </div>
  );
}