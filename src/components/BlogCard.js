"use client";

import { useState, useEffect } from "react";

export default function BlogCard({ post = {}, loading = false }) {

  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    setImgLoaded(false);
  }, [post.img]);



  /* ---------------- TEXT HELPERS ---------------- */
  function stripHTML(text = "") {
    return text.replace(/<[^>]+>/g, "");
  }

  function limitWords(text = "", count) {
    const clean = stripHTML(text);
    const words = clean.split(" ").filter(Boolean);
    return words.slice(0, count).join(" ") +
      (words.length > count ? "..." : "");
  }



  /* ================= FACEBOOK STYLE SKELETON ================= */
  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0b1220] shadow-sm">

        {/* Shimmer animation */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/10 animate-[shimmer_1.5s_infinite]" />

        {/* Image skeleton */}
        <div className="h-52 bg-gray-200 dark:bg-gray-700" />

        {/* Text skeleton */}
        <div className="p-5 space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        </div>

        <style jsx>{`
          @keyframes shimmer {
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </div>
    );
  }



  /* ================= NORMAL CARD ================= */

  const title = limitWords(post.title, 10) || "Untitled";
  const desc = limitWords(post.desc, 20) || "No description available";

  return (
    <div className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300 dark:bg-[#0b1220] dark:border-gray-800">

      {/* IMAGE */}
      <div className="relative overflow-hidden">

        {/* Image loader shimmer */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        )}

        <img
          src={post.img || "/placeholder.jpg"}
          alt={post.title || "post image"}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-52 object-cover transition duration-500 group-hover:scale-105 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

      </div>



      {/* CONTENT */}
      <div className="flex flex-col gap-3 p-5 flex-1">

        <h3 className="font-semibold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-blue-600 transition">
          {title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
          {desc}
        </p>

        <div className="flex items-center justify-between pt-2">

          <span className="text-xs text-gray-400">
            {post.time || "Recently"}
          </span>

          <span className="text-sm font-medium text-blue-600 group-hover:underline">
            Read More →
          </span>

        </div>

      </div>
    </div>
  );
}