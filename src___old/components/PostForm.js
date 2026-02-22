"use client";
import { useState } from "react";

export default function PostForm({
  form,
  setForm,
  editingId,
  setEditingId,
  categories,
  onSubmit,
  loading
}){

  const [tagInput,setTagInput] = useState("");

  function slugify(text){
    return text.toLowerCase().trim().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-");
  }

  const slugPreview = slugify(form.title);
  const isInvalid = !form.title || !form.desc || !form.category;

  function handleChange(e){
    setForm({...form,[e.target.name]:e.target.value});
  }

  function addTag(e){
    if(e.key==="Enter" && tagInput.trim()){
      e.preventDefault();
      const clean = tagInput.trim().toLowerCase();

      if(!form.tags.includes(clean)){
        setForm(prev=>({...prev,tags:[...prev.tags,clean]}));
      }
      setTagInput("");
    }
  }

  function removeTag(tag){
    setForm(prev=>({...prev,tags: prev.tags.filter(t=>t!==tag)}));
  }

  function resetForm(){
    setEditingId(null);
    setForm({
      title:"",
      author:"",
      img:"",
      desc:"",
      category:"",
      tags:[],
      status:"Published"
    });
  }

  return(
    <div className="bg-white p-6 rounded-2xl shadow border">

      <h2 className="text-xl font-bold mb-6">
        {editingId ? "Edit Post" : "Create Post"}
      </h2>

      <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">

        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="input"/>
        <input name="author" value={form.author} onChange={handleChange} placeholder="Author" className="input"/>

        {form.title && (
          <p className="text-xs text-gray-500 md:col-span-2">
            Slug: <span className="text-blue-600">/{slugPreview}</span>
          </p>
        )}

        <select name="category" value={form.category} onChange={handleChange} className="input">
          <option value="">Select Category</option>
          {categories.map(c=><option key={c}>{c}</option>)}
        </select>

        <select name="status" value={form.status} onChange={handleChange} className="input">
          <option>Published</option>
          <option>Draft</option>
        </select>

        {/* TAGS */}
        <div className="md:col-span-2">
          <input
            value={tagInput}
            onChange={e=>setTagInput(e.target.value)}
            onKeyDown={addTag}
            placeholder="Press Enter to add tag"
            className="input"
          />

          <div className="flex flex-wrap gap-2 mt-3">
            {form.tags.map(tag=>(
              <span key={tag} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs flex gap-1">
                {tag}
                <button type="button" onClick={()=>removeTag(tag)}>×</button>
              </span>
            ))}
          </div>
        </div>

        <input name="img" value={form.img} onChange={handleChange} placeholder="Image URL" className="input md:col-span-2"/>

        {form.img && <img src={form.img} className="h-40 rounded-lg object-cover border md:col-span-2"/>}

        <textarea name="desc" value={form.desc} onChange={handleChange} placeholder="Description" className="input md:col-span-2 h-32"/>

        <button disabled={loading || isInvalid} className="bg-blue-600 text-white py-3 rounded-xl md:col-span-2">
          {loading ? "Saving..." : editingId ? "Update Post" : "Publish Post"}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm} className="border py-2 rounded-xl md:col-span-2">
            Cancel Editing
          </button>
        )}

      </form>

      <style jsx>{`.input{width:100%;border:1px solid #e5e7eb;padding:12px;border-radius:10px}`}</style>
    </div>
  );
}