import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function sitemap() {
  const baseUrl = "https://www.krymoz.com";

  // Static routes
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms-of-service",
    "/disclosure",
    "/cookie-policy",
    "/AllPosts"
  ];

  const sitemapEntries = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1 : 0.8,
  }));

  try {
    // Dynamic blog routes
    const postsSnap = await getDocs(collection(db, "posts"));
    const blogRoutes = postsSnap.docs.map((doc) => ({
      url: `${baseUrl}/blog/${doc.data().slug || doc.id}`,
      lastModified: new Date(doc.data().created || Date.now()),
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    return [...sitemapEntries, ...blogRoutes];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return sitemapEntries;
  }
}