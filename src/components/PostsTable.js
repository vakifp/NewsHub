"use client";
import { useState } from "react";

export default function PostsTable({
  posts,
  search,
  setSearch,
  page,
  setPage,
  handleEdit,
  handleDelete
}){

  const [selected,setSelected] = useState([]);

  const perPage = 6;

  const filtered = posts.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length/perPage);
  const visible = filtered.slice((page-1)*perPage,page*perPage);



  /* SELECT ONE */
  function toggleSelect(id){
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(i=>i!==id)
        : [...prev,id]
    );
  }



  /* SELECT ALL */
  function toggleSelectAll(){
    if(selected.length===visible.length){
      setSelected([]);
    }else{
      setSelected(visible.map(p=>p.id));
    }
  }



  /* DELETE SELECTED */
  async function deleteSelected(){
    if(selected.length===0) return;

    if(!confirm(`Delete ${selected.length} posts?`)) return;

    for(const id of selected){
      await handleDelete(id);
    }

    setSelected([]);
  }



  return(
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

      {/* HEADER */}
      <div className="p-6 flex flex-wrap gap-4 justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100">

        <h2 className="text-lg font-semibold text-gray-700">
          All Posts ({posts.length})
        </h2>

        <div className="flex gap-3">

          <input
            placeholder="Search posts..."
            onChange={e=>setSearch(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />

          {/* DELETE SELECTED */}
          <button
            disabled={selected.length===0}
            onClick={deleteSelected}
            className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm disabled:opacity-40 hover:bg-red-600 transition"
          >
            Delete Selected ({selected.length})
          </button>

        </div>
      </div>



      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          {/* HEAD */}
          <thead className="bg-gray-50 text-gray-600">
            <tr>

              <th className="p-4">
                <input
                  type="checkbox"
                  checked={selected.length===visible.length && visible.length>0}
                  onChange={toggleSelectAll}
                />
              </th>

              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Tags</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>



          {/* BODY */}
          <tbody>
            {visible.length===0 ? (
              <tr>
                <td colSpan="6" className="p-12 text-center text-gray-400">
                  No posts found
                </td>
              </tr>
            ):(
              visible.map(post=>(
                <tr key={post.id} className="border-t hover:bg-gray-50">

                  {/* CHECKBOX */}
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={selected.includes(post.id)}
                      onChange={()=>toggleSelect(post.id)}
                    />
                  </td>

                  {/* TITLE */}
                  <td className="p-4 font-medium text-gray-800">
                    {post.title}
                  </td>

                  {/* CATEGORY */}
                  <td className="p-4 text-gray-600">
                    {post.category || "-"}
                  </td>

                  {/* TAGS */}
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {post.tags?.map(tag=>(
                        <span key={tag}
                          className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      post.status==="Draft"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {post.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4 flex gap-2 justify-center">

                    <button
                      onClick={()=>handleEdit(post)}
                      className="px-3 py-1 text-xs rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                      Edit
                    </button>

                    <button
                      onClick={()=>handleDelete(post.id)}
                      className="px-3 py-1 text-xs rounded-lg bg-red-500 text-white hover:bg-red-600">
                      Delete
                    </button>

                  </td>

                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>



      {/* PAGINATION */}
      {totalPages>1 && (
        <div className="p-6 flex justify-center gap-2 bg-gray-50">

          <button
            disabled={page===1}
            onClick={()=>setPage(p=>p-1)}
            className="px-4 py-1 rounded-lg border disabled:opacity-40"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_,i)=>(
            <button
              key={i}
              onClick={()=>setPage(i+1)}
              className={`px-3 py-1 rounded-lg ${
                page===i+1 ? "bg-blue-600 text-white" : "border"
              }`}
            >
              {i+1}
            </button>
          ))}

          <button
            disabled={page===totalPages}
            onClick={()=>setPage(p=>p+1)}
            className="px-4 py-1 rounded-lg border disabled:opacity-40"
          >
            Next
          </button>

        </div>
      )}

    </div>
  );
}