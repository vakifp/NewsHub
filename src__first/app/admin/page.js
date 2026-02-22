"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AdminDashboard(){

  const router = useRouter();

  const [stats,setStats] = useState({
    posts:0,
    users:0,
    views:0
  });

  const [posts,setPosts] = useState([]);

  /* pagination */
  const [page,setPage] = useState(1);
  const perPage = 5;

  /* LOAD DATA */
  useEffect(()=>{
    async function load(){
      const postSnap = await getDocs(collection(db,"posts"));
      const userSnap = await getDocs(collection(db,"users"));

      const list = postSnap.docs.map(d=>({id:d.id,...d.data()}));

      setStats({
        posts: list.length,
        users: userSnap.size,
        views: Math.floor(Math.random()*5000)+1000
      });

      setPosts(list);
    }
    load();
  },[]);

  /* logout */
  async function logout(){
    await signOut(auth);
    router.push("/login");
  }

  /* pagination logic */
  const totalPages = Math.ceil(posts.length/perPage);
  const visible = posts.slice((page-1)*perPage,page*perPage);

  return(
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        <button
          onClick={logout}
          className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white shadow hover:scale-105 transition"
        >
          Logout
        </button>
      </div>



      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6">

        <Card title="Total Posts" value={stats.posts} color="from-blue-500 to-indigo-600"/>
        <Card title="Users" value={stats.users} color="from-emerald-500 to-teal-600"/>
        <Card title="Views" value={stats.views} color="from-purple-500 to-pink-600"/>

      </div>



      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow border overflow-hidden">

        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="font-semibold text-lg">Recent Posts</h2>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages || 1}
          </span>
        </div>

        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Author</th>
              <th className="p-4 text-left">Date</th>
            </tr>
          </thead>

          <tbody>

            {visible.map(post=>(
              <tr key={post.id} className="border-t hover:bg-gray-50 transition">

                <td className="p-4 font-medium">
                  {post.title}
                </td>

                <td className="p-4">
                  {post.author || "Admin"}
                </td>

                <td className="p-4 text-gray-500">
                  {new Date(post.created).toLocaleDateString()}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

        {/* PAGINATION */}
        <div className="p-5 flex justify-center gap-2">

          <button
            disabled={page===1}
            onClick={()=>setPage(p=>p-1)}
            className="px-4 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_,i)=>(
            <button
              key={i}
              onClick={()=>setPage(i+1)}
              className={`px-3 py-1 rounded ${
                page===i+1
                ? "bg-blue-600 text-white"
                : "border"
              }`}
            >
              {i+1}
            </button>
          ))}

          <button
            disabled={page===totalPages}
            onClick={()=>setPage(p=>p+1)}
            className="px-4 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>

        </div>

      </div>

    </div>
  );
}



/* CARD */
function Card({title,value,color}){
  return(
    <div className="relative p-6 rounded-2xl shadow border bg-white overflow-hidden group hover:-translate-y-1 transition">

      {/* gradient icon */}
      <div className={`absolute right-4 top-4 w-12 h-12 rounded-xl bg-gradient-to-r ${color} opacity-20 group-hover:scale-110 transition`} />

      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-3xl font-bold mt-1">{value}</h3>

      {/* bottom accent */}
      <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${color}`}/>
    </div>
  );
}