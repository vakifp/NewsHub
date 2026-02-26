import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export const dynamic = "force-dynamic";

export default async function sitemap() {

  const base = "https://krymoz.com";

  /* POSTS */
  const postSnap = await getDocs(collection(db,"posts"));

  const posts = postSnap.docs.map(doc => ({
    url: `${base}/blog/${doc.data().slug || doc.id}`,
    lastModified: new Date(doc.data().created || Date.now()),
  }));


  /* CATEGORIES */
  const catSnap = await getDocs(collection(db,"categories"));

  const categories = catSnap.docs
    .map(d=>d.data())
    .filter(c=>c.visible)
    .map(cat => ({
      url: `${base}/category/${cat.slug}`,
      lastModified: new Date(),
    }));


  /* STATIC */
  const staticPages = [
    { url: base, lastModified: new Date() },
    { url: `${base}/all-posts`, lastModified: new Date() },
  ];

  return [
    ...staticPages,
    ...posts,
    ...categories
  ];
}