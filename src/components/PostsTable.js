"use client";

import { 
  Edit, 
  Trash2, 
  Eye, 
  MoreVertical, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileEdit
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PostsTable({
  posts,
  search,
  setSearch,
  page,
  setPage,
  handleEdit,
  handleDelete
}) {
  const [dropdownId, setDropdownId] = useState(null);
  const perPage = 10;
  
  const filtered = posts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const visible = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="bg-white dark:bg-[#0b1220] rounded-[2.5rem] border dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
      <div className="p-8 border-b dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-accent/20">
        <div>
          <h2 className="text-xl font-black tracking-tight">Catalog Repository</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Total Articles: {filtered.length}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="p-2.5 rounded-xl border dark:border-gray-800 hover:bg-accent disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-bold w-20 text-center">
            {page} / {totalPages || 1}
          </span>
          <button 
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(p => p + 1)}
            className="p-2.5 rounded-xl border dark:border-gray-800 hover:bg-accent disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b dark:border-gray-800 bg-accent/10">
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Article & Metadata</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reach</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Status</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right px-10">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-800">
            {visible.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-20 text-center text-muted-foreground font-bold italic">
                  No articles found matching your criteria.
                </td>
              </tr>
            ) : (
              visible.map((post) => (
                <tr key={post.id} className="hover:bg-accent/30 transition-all group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      {post.img && (
                        <div className="w-12 h-12 rounded-xl overflow-hidden border dark:border-gray-800 flex-shrink-0">
                          <img src={post.img} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="space-y-1 min-w-0">
                        <p className="font-bold text-sm tracking-tight truncate max-w-xs group-hover:text-primary transition-colors">{post.title}</p>
                        <div className="flex items-center gap-3 text-[10px] font-medium text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock size={12} /> {post.created ? new Date(post.created).toLocaleDateString() : 'N/A'}</span>
                          <span className="text-secondary">•</span>
                          <span className="truncate">By {post.author || "Admin"}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="px-3 py-1.5 rounded-full bg-accent text-[10px] font-black uppercase tracking-widest border dark:border-gray-700">
                      {post.category}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-emerald-500" />
                      <span className="text-sm font-bold">{post.views || 0}</span>
                      <span className="text-[10px] text-muted-foreground font-medium">Views</span>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <span className={`
                      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                      ${post.status === "Published" 
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" 
                        : "bg-amber-500/10 text-amber-600 border border-amber-500/20"}
                    `}>
                      {post.status === "Published" ? <CheckCircle2 size={12} /> : <FileEdit size={12} />}
                      {post.status}
                    </span>
                  </td>
                  <td className="p-6 text-right px-10">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(post)}
                        className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 hover:bg-indigo-100 transition-all"
                        title="Edit Article"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="p-2.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all shadow-sm"
                        title="Delete Article"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-8 border-t dark:border-gray-800 bg-accent/10 flex justify-between items-center text-sm font-medium text-muted-foreground">
        <p>Showing {visible.length} of {filtered.length} entries</p>
        <div className="flex gap-1">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                page === i + 1 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "hover:bg-accent"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}