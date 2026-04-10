"use client";
import { useState } from "react";
import RichEditor from "@/app/admin/RichEditor";
import { X, Tag, ImageIcon, User, Type, Grid, ClipboardList, Send } from "lucide-react";

export default function PostForm({
  form,
  setForm,
  editingId,
  setEditingId,
  categories,
  onSubmit,
  loading,
  onCancel
}) {
  const [tagInput, setTagInput] = useState("");

  const isInvalid = !form.title || !form.desc || !form.category;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function addTag(e) {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const clean = tagInput.trim().toLowerCase();
      if (!form.tags.includes(clean)) {
        setForm(prev => ({ ...prev, tags: [...prev.tags, clean] }));
      }
      setTagInput("");
    }
  }

  function removeTag(tag) {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  }

  return (
    <div className="bg-white dark:bg-[#0b1220] p-8 md:p-10 rounded-[2.5rem] shadow-2xl border dark:border-gray-800 relative">
      <div className="mb-10 space-y-2">
        <h2 className="text-2xl font-black tracking-tight">
          {editingId ? "Refine Article" : "Compose New Highlight"}
        </h2>
        <p className="text-muted-foreground text-sm font-medium">Capture your insights with our professional editorial toolkit.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* TITLE */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Type size={14} className="text-primary" /> Article Title
            </label>
            <input 
              name="title" 
              value={form.title} 
              onChange={handleChange} 
              placeholder="e.g. The Future of Generative AI" 
              className="admin-input" 
            />
          </div>

          {/* AUTHOR */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <User size={14} className="text-primary" /> Author Identity
            </label>
            <input 
              name="author" 
              value={form.author} 
              onChange={handleChange} 
              placeholder="e.g. John Doe / Editor" 
              className="admin-input" 
            />
          </div>

          {/* CATEGORY */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Grid size={14} className="text-primary" /> Editorial Category
            </label>
            <select name="category" value={form.category} onChange={handleChange} className="admin-input appearance-none">
              <option value="">Select Category</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* STATUS */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <ClipboardList size={14} className="text-primary" /> Visibility Status
            </label>
            <select name="status" value={form.status} onChange={handleChange} className="admin-input appearance-none">
              <option value="Published">Published (Live)</option>
              <option value="Draft">Draft (Private)</option>
            </select>
          </div>
        </div>

        {/* IMAGE */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <ImageIcon size={14} className="text-primary" /> Featured Visual URL
          </label>
          <input 
            name="img" 
            value={form.img} 
            onChange={handleChange} 
            placeholder="https://images.unsplash.com/..." 
            className="admin-input" 
          />
          {form.img && (
            <div className="mt-4 rounded-3xl overflow-hidden border-4 border-accent shadow-inner">
              <img src={form.img} className="h-48 w-full object-cover" />
            </div>
          )}
        </div>

        {/* TAGS */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Tag size={14} className="text-primary" /> Semantic Tags
          </label>
          <div className="bg-accent/30 p-4 rounded-2xl border border-dashed border-border/50">
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder="Type tag and press Enter..."
              className="bg-transparent text-sm outline-none w-full"
            />
            <div className="flex flex-wrap gap-2 mt-4">
              {form.tags.map(tag => (
                <span key={tag} className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-primary/20">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive transition-colors"><X size={14} /></button>
                </span>
              ))}
              {form.tags.length === 0 && <span className="text-[10px] text-muted-foreground font-medium italic">No tags added yet...</span>}
            </div>
          </div>
        </div>

        {/* CONTENT EDITOR */}
        <div className="space-y-4 pt-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Send size={14} className="text-primary" /> Article Narrative
          </label>
          <RichEditor 
            value={form.desc} 
            onChange={(html) => setForm({ ...form, desc: html })} 
          />
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col md:flex-row gap-4 pt-10">
          <button 
            type="submit"
            disabled={loading || isInvalid} 
            className="flex-1 admin-button-primary disabled:opacity-50 disabled:grayscale"
          >
            {loading ? "Processing..." : editingId ? "Update Insights" : "Broadcast Insight"}
          </button>
          
          <button 
            type="button" 
            onClick={onCancel} 
            className="admin-button-secondary"
          >
            Discard Changes
          </button>
        </div>
      </form>
    </div>
  );
}