"use client";

import Link from "next/link";

export default function Footer(){

  const year = new Date().getFullYear();

  return(
    <footer className="
       border-t
      bg-white text-gray-700 border-gray-200
      dark:bg-[#020617] dark:text-gray-300 dark:border-gray-800
    ">

      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">

        {/* LOGO + DESC */}
        <div>
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            NewsSite
          </h2>

          <p className="text-sm leading-relaxed">
            Latest news, trending stories, sports updates,
            technology insights and more — all in one place.
          </p>
        </div>



        {/* QUICK LINKS */}
        <div>
          <h3 className="font-semibold mb-4 text-lg">
            Quick Links
          </h3>

          <ul className="space-y-2 text-sm">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/all-posts">All News</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>



        {/* CATEGORIES */}
        <div>
          <h3 className="font-semibold mb-4 text-lg">
            Categories
          </h3>

          <ul className="space-y-2 text-sm capitalize">
            <li><Link href="/category/cricket">Cricket</Link></li>
            <li><Link href="/category/football">Football</Link></li>
            <li><Link href="/category/tech">Tech</Link></li>
            <li><Link href="/category/sports">Sports</Link></li>
          </ul>
        </div>



        {/* SOCIAL */}
        <div>
          <h3 className="font-semibold mb-4 text-lg">
            Follow Us
          </h3>

          <div className="flex gap-4 text-xl">

            <a className="hover:text-blue-500 transition">📘</a>
            <a className="hover:text-sky-400 transition">🐦</a>
            <a className="hover:text-pink-500 transition">📸</a>
            <a className="hover:text-red-500 transition">▶</a>

          </div>

          <p className="text-sm mt-5 text-gray-500 dark:text-gray-400">
            Stay connected for daily updates.
          </p>
        </div>

      </div>



      {/* BOTTOM BAR */}
      <div className="
        text-center text-sm py-6 border-t
        border-gray-200 dark:border-gray-800
      ">
        © {year} NewsSite. All rights reserved.
      </div>

    </footer>
  );
}