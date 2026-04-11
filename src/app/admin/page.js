"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
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
  Flame,
  TrendingUp,
  ArrowUpRight,
  Clock,
  ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";


export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    posts: 0,
    users: 0,
    pages: 0,
    categories: 0,
    views: 0
  });

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [postSnap, userSnap, pageSnap, catSnap] = await Promise.all([
          getDocs(collection(db, "posts")),
          getDocs(collection(db, "users")),
          getDocs(collection(db, "pages")),
          getDocs(collection(db, "categories"))
        ]);

        const postList = postSnap.docs.map(d => ({
          id: d.id,
          ...d.data()
        }));

        const totalViews = postList.reduce((sum, p) => sum + (p.views || 0), 0);

        setStats({
          posts: postList.length,
          users: userSnap.size,
          pages: pageSnap.size,
          categories: catSnap.size,
          views: totalViews
        });

        // Sorted posts for the table
        const sortedPosts = [...postList].sort((a,b) => (b.created || 0) - (a.created || 0));
        setPosts(sortedPosts);
        setUsers(userSnap.docs.map(d => d.data()).slice(0, 5));

      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground font-bold text-sm animate-pulse">Synchronizing dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* GREETING */}
      <header className="space-y-1">
        <h1 className="text-4xl font-black tracking-tight">System Overview</h1>
        <p className="text-muted-foreground font-medium">Monitoring your blog performance and content metrics.</p>
      </header>

      {/* STATS GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Posts" value={stats.posts} icon={<FileText size={20} />} trend="+4.5%" />
        <StatCard title="Total Views" value={stats.views} icon={<Eye size={20} />} trend="+12.2%" color="indigo" />
        <StatCard title="Active Users" value={stats.users} icon={<Users size={20} />} trend="+2.1%" color="emerald" />
        <StatCard title="Categories" value={stats.categories} icon={<Folder size={20} />} trend="0%" color="amber" />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* RECENT POSTS TABLE */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0b1220] rounded-[2rem] border dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b dark:border-gray-800 flex justify-between items-center">
            <h2 className="text-xl font-black flex items-center gap-3">
              <Newspaper className="text-primary" /> Recent Articles
            </h2>
            <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b dark:border-gray-800 bg-accent/50">
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Title & Category</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Analytics</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Publication</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-800">
                {posts.slice(0, 5).map((post) => (
                  <tr key={post.id} className="hover:bg-accent/30 transition-colors group">
                    <td className="p-5">
                      <p className="font-bold text-sm group-hover:text-primary transition-colors line-clamp-1">{post.title}</p>
                      <span className="text-[10px] font-black uppercase text-muted-foreground">{post.category}</span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={14} className="text-emerald-500" />
                        <span className="text-sm font-bold">{post.views || 0}</span>
                        <span className="text-[10px] text-muted-foreground">Views</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock size={14} />
                        <span className="text-xs font-medium">
                          {post.created ? new Date(post.created).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TRENDING & QUICK ACTIONS */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-[#0b1220] rounded-[2rem] border dark:border-gray-800 p-8 shadow-sm">

            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
              <Flame className="text-orange-500" /> High Impact
            </h3>
            <div className="space-y-6">
              {[...posts]
                .sort((a,b) => (b.views||0) - (a.views||0))
                .slice(0, 3)
                .map((p, i) => (
                  <div key={p.id} className="flex gap-4">
                    <span className="text-3xl font-black text-muted-foreground/20 italic">{(i + 1).toString().padStart(2, '0')}</span>
                    <div className="space-y-1">
                      <p className="font-bold text-xs leading-snug line-clamp-2">{p.title}</p>
                      <p className="text-[10px] font-black text-primary uppercase">{p.views || 0} Intense Multi-views</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-primary rounded-[2rem] p-8 text-white shadow-xl shadow-primary/30 relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <h3 className="text-xl font-black">Content Studio</h3>
              <p className="text-sm opacity-80 font-medium">Ready to share your next big insight with the Krymoz audience?</p>
              <button 
                onClick={() => router.push('/admin/posts')}
                className="w-full bg-white text-primary py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Create New Post
              </button>
            </div>
            <Newspaper size={120} className="absolute -bottom-8 -right-8 opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color = "primary" }) {
  const colors = {
    primary: "bg-primary text-primary-foreground shadow-primary/30",
    indigo: "bg-indigo-500 text-white shadow-indigo-500/30",
    emerald: "bg-emerald-500 text-white shadow-emerald-500/30",
    amber: "bg-amber-500 text-white shadow-amber-500/30"
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-[#0b1220] p-6 rounded-[2rem] border dark:border-gray-800 shadow-sm flex flex-col gap-4 relative overflow-hidden"
    >
      <div className="flex justify-between items-center relative z-10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${colors[color]}`}>
          {icon}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] items-center gap-1 font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full flex">
            <ArrowUpRight size={12} /> {trend}
          </span>
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{title}</p>
        <p className="text-3xl font-black tracking-tight">{value.toLocaleString()}</p>
      </div>
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 bg-current text-${color}-500`} />
    </motion.div>
  );
}