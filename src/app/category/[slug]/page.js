"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Header from "@/components/Header";
import Link from "next/link";

export default function CategoryPage() {
  const { slug } = useParams();

  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("latest");

  /* WORD LIMIT */
  function limitWords(text = "", count) {
    const arr = text.split(" ");
    return arr.length > count
      ? arr.slice(0, count).join(" ") + "..."
      : text;
  }

  /* SLUGIFY */
  function slugify(text = "") {
    return text.toLowerCase().trim().replace(/\s+/g, "-");
  }

  /* LOAD POSTS */
  useEffect(() => {
    if (!slug) return;

    (async () => {
      const snap = await getDocs(collection(db, "posts"));

      const all = snap.docs.map(d => ({
        id: d.id,
        slug: d.data().slug || d.id,
        ...d.data()
      }));

      const normalizedSlug = slug.toLowerCase();

      setPosts(
        all.filter(p => slugify(p.category) === normalizedSlug)
      );
    })();
  }, [slug]);

  /* SIDEBAR DATA (MEMOIZED) */
  const latest = useMemo(
    () =>
      [...posts]
        .sort((a, b) => (b.created || 0) - (a.created || 0))
        .slice(0, 5),
    [posts]
  );

  const popular = useMemo(
    () =>
      [...posts]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5),
    [posts]
  );

  const list = activeTab === "latest" ? latest : popular;

  return (
    <>
      <Header />

      <section className="min-h-screen py-12 px-4 bg-white text-gray-900 dark:bg-linear-to-br dark:from-[#0f172a] dark:via-[#111827] dark:to-[#020617] dark:text-white">

        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">

          {/* LEFT POSTS */}
          <div className="lg:col-span-2">

            <h1 className="text-4xl font-bold mb-10 capitalize">
              {slug}
            </h1>

            {posts.length === 0 ? (
              <p className="text-gray-500">No posts found.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">

                {posts.map(p => (
                  <Link key={p.id} href={`/blog/${p.slug}`}>

                    <div className="group border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer bg-white dark:bg-[#0b1220]">

                      {p.img && (
                        <img
                          src={p.img}
                          alt={p.title || "post image"}
                          className="h-48 w-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      )}

                      <div className="p-5">
                        <h2 className="font-bold text-lg group-hover:text-blue-500 transition">
                          {limitWords(p.title, 10)}
                        </h2>

                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          {p.author || "Admin"} • {p.time || "recent"}
                        </p>
                      </div>

                    </div>

                  </Link>
                ))}

              </div>
            )}

          </div>

          {/* SIDEBAR */}
          <aside>

            <div className="rounded-2xl p-6 border sticky top-24 bg-white border-gray-200 dark:bg-[#0b1220] dark:border-gray-800">

              {/* TABS */}
              <div className="flex mb-6 bg-gray-100 dark:bg-[#111827] p-1 rounded-full">

                <button
                  onClick={() => setActiveTab("latest")}
                  className={`flex-1 py-2 rounded-full text-sm font-semibold ${
                    activeTab === "latest"
                      ? "bg-red-500 text-white"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  Latest
                </button>

                <button
                  onClick={() => setActiveTab("popular")}
                  className={`flex-1 py-2 rounded-full text-sm font-semibold ${
                    activeTab === "popular"
                      ? "bg-red-500 text-white"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  Popular
                </button>

              </div>

              {/* LIST */}
              <div className="space-y-5">
                {list.map((p, i) => (
                  <Link key={p.id} href={`/blog/${p.slug}`}>
                    <div className="flex gap-4 cursor-pointer group">

                      <span className="text-yellow-400 font-bold text-lg">
                        {i + 1}
                      </span>

                      <p className="text-sm group-hover:text-blue-500 transition">
                        {limitWords(p.title, 10)}
                      </p>

                    </div>
                  </Link>
                ))}
              </div>

            </div>

          </aside>

        </div>
      </section>
    </>
  );
}