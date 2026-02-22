export default function BlogCard({ post }) {

  const shortTitle =
    post.title?.split(" ").slice(0, 10).join(" ") || "Untitled";

  const shortDesc =
    post.desc?.split(" ").slice(0, 20).join(" ") ||
    "No description available";

  return (
    <div className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300">

      {/* IMAGE */}
      <div className="overflow-hidden">
        <img
          src={post.img}
          alt={post.title}
          className="w-full h-52 object-cover group-hover:scale-105 transition duration-500"
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-3 p-5 flex-1">

        {/* TITLE */}
        <h3 className="font-semibold text-gray-900 leading-snug group-hover:text-blue-600 transition">
          {shortTitle}
          {post.title?.split(" ").length > 50 && "..."}
        </h3>

        {/* DESCRIPTION */}
        <p className="text-gray-600 text-sm leading-relaxed">
          {shortDesc}
          {post.desc?.split(" ").length > 20 && "..."}
        </p>

        {/* FOOTER */}
        <div className="flex items-center justify-between pt-2">

          <span className="text-xs text-gray-400">
            {post.time || "5 min ago"}
          </span>

          <span className="text-sm font-medium text-blue-600 group-hover:underline">
            Read More →
          </span>

        </div>
      </div>
    </div>
  );
}