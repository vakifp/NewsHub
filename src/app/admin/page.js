"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

import {
  FileText,
  Users,
  Folder,
  Layers,
  Eye,
  LogOut,
  Newspaper,
  Flame
} from "lucide-react";

export default function AdminDashboard(){

  const router = useRouter();

  const [loading,setLoading] = useState(true);

  const [stats,setStats] = useState({
    posts:0,
    users:0,
    pages:0,
    categories:0,
    views:0
  });

  const [posts,setPosts] = useState([]);
  const [users,setUsers] = useState([]);

  const [page,setPage] = useState(1);
  const perPage = 5;

  /* ================= LOAD DATA ================= */
  useEffect(()=>{
    (async()=>{

      try{
        const [postSnap,userSnap,pageSnap,catSnap] =
          await Promise.all([
            getDocs(collection(db,"posts")),
            getDocs(collection(db,"users")),
            getDocs(collection(db,"pages")),
            getDocs(collection(db,"categories"))
          ]);

        const postList = postSnap.docs.map(d=>({
          id:d.id,
          ...d.data()
        }));

        const userList = userSnap.docs.map(d=>d.data());

        const totalViews = postList.reduce(
          (sum,p)=>sum+(p.views||0),0
        );

        setStats({
          posts:postList.length,
          users:userSnap.size,
          pages:pageSnap.size,
          categories:catSnap.size,
          views:totalViews
        });

        setPosts(postList);
        setUsers(userList.slice(0,5));

      }catch(err){
        console.log(err);
      }

      setLoading(false);

    })();
  },[]);



  /* ================= LOGOUT ================= */
  async function logout(){
    await signOut(auth);
    router.push("/login");
  }



  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(posts.length/perPage);
  const visible = posts.slice((page-1)*perPage,page*perPage);



  /* ================= LOADING ================= */
  if(loading){
    return(
      <div className="p-10 text-center text-gray-400">
        Loading dashboard...
      </div>
    );
  }



  /* ================= UI ================= */
  return(
    <div className="space-y-10">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Admin Dashboard
        </h1>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white shadow hover:scale-105 transition"
        >
          <LogOut size={18}/>
          Logout
        </button>
      </div>



      {/* ================= STATS ================= */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">

        <Card title="Posts" value={stats.posts} icon={<FileText size={22}/>} color="from-blue-500 to-indigo-600"/>
        <Card title="Users" value={stats.users} icon={<Users size={22}/>} color="from-emerald-500 to-teal-600"/>
        <Card title="Pages" value={stats.pages} icon={<Layers size={22}/>} color="from-orange-500 to-amber-600"/>
        <Card title="Categories" value={stats.categories} icon={<Folder size={22}/>} color="from-pink-500 to-rose-600"/>
        <Card title="Views" value={stats.views} icon={<Eye size={22}/>} color="from-purple-500 to-violet-600"/>

      </div>



      {/* ================= GRID ================= */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* POSTS TABLE */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow border overflow-hidden">

          <div className="p-6 border-b flex justify-between">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Newspaper size={18}/>
              Recent Posts
            </h2>

            <span className="text-sm text-gray-500">
              Page {page} of {totalPages||1}
            </span>
          </div>

          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Author</th>
                <th className="p-4 text-left">Views</th>
                <th className="p-4 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {visible.map(post=>(
                <tr key={post.id} className="border-t hover:bg-gray-50">

                  <td className="p-4 font-medium">{post.title}</td>
                  <td className="p-4">{post.author||"Admin"}</td>
                  <td className="p-4">{post.views||0}</td>
                  <td className="p-4 text-gray-500">
                    {post.created
                      ? new Date(post.created).toLocaleDateString()
                      : "-"}
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



        {/* RIGHT SIDEBAR */}
        <div className="space-y-8">

          {/* USERS */}
          <div className="bg-white rounded-2xl shadow border p-6">

            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Users size={18}/>
              Latest Users
            </h3>

            <div className="space-y-3">
              {users.length===0 && (
                <p className="text-gray-400 text-sm">
                  No users yet
                </p>
              )}

              {users.map((u,i)=>(
                <div key={i} className="flex justify-between text-sm">
                  <span>{u.email}</span>
                  <span className="text-gray-400">{u.role||"user"}</span>
                </div>
              ))}
            </div>
          </div>



          {/* TOP POSTS */}
          <div className="bg-white rounded-2xl shadow border p-6">

            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Flame size={18}/>
              Top Posts
            </h3>

            <div className="space-y-3">
              {[...posts]
                .sort((a,b)=>(b.views||0)-(a.views||0))
                .slice(0,5)
                .map(p=>(
                  <div key={p.id} className="text-sm">
                    {p.title}
                    <span className="text-gray-400 ml-2">
                      ({p.views||0})
                    </span>
                  </div>
                ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}



/* ================= CARD ================= */
function Card({title,value,color,icon}){
  return(
    <div className="
      relative flex items-center gap-4
      p-5 rounded-2xl border bg-white
      shadow-sm hover:shadow-xl
      hover:-translate-y-1 transition
      overflow-hidden
    ">

      {/* ICON */}
      <div className={`
        flex items-center justify-center
        w-12 h-12 rounded-xl
        bg-gradient-to-r ${color}
        text-white shadow-md
      `}>
        {icon}
      </div>

      {/* TEXT */}
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">{title}</span>
        <span className="text-2xl font-bold">{value}</span>
      </div>

      {/* RIGHT GLOW */}
      <div className={`
        absolute right-0 top-0 h-full w-1
        bg-gradient-to-b ${color}
      `}/>
    </div>
  );
}