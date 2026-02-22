"use client";
import Link from "next/link";

export default function LatestNews({ posts }) {
  return (
    <div className="space-y-5">
      {posts.length === 0 ? (
        <p className="text-gray-500 text-sm">No posts available</p>
      ) : (
        posts.map((post,i)=>(
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="flex gap-4 group"
          >
            <span className="text-yellow-400 font-bold text-lg w-5">
              {i+1}
            </span>

            <p className="text-sm group-hover:text-blue-400 transition">
              {post.title}
            </p>
          </Link>
        ))
      )}
    </div>
  );
}