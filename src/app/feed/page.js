import fs from "fs";
import path from "path";
import { parseStringPromise } from "xml2js";

export default async function Page() {
  let posts = [];

  try {
    const filePath = path.join(process.cwd(), "public/feed.atom");

    if (!fs.existsSync(filePath)) {
      throw new Error("feed.atom file not found");
    }

    const xml = fs.readFileSync(filePath, "utf8");

    const result = await parseStringPromise(xml, {
      explicitArray: true,
      tagNameProcessors: [(name) => name.replace(/^.*:/, "")]
    });

    const entries = result?.feed?.entry ?? [];

    posts = entries.map((item) => {
      const linkObj =
        item?.link?.find((l) => l?.$?.rel === "alternate") ||
        item?.link?.[0];

      return {
        title: item?.title?.[0] ?? "Untitled",
        content: item?.content?.[0]?._ ?? "",
        date: item?.published?.[0] ?? "",
        link: linkObj?.$?.href ?? "#",
      };
    });

  } catch (err) {
    console.error("FEED ERROR:", err);
  }

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-bold">Blog Feed</h1>

      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map((post, i) => (
          <div key={i} className="border p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-2">
              <a href={post.link} target="_blank">
                {post.title}
              </a>
            </h2>

            <p className="text-gray-400 text-sm mb-4">
              {post.date}
            </p>

            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        ))
      )}
    </div>
  );
}