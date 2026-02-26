export default function sitemap() {
  const base = "https://www.krymoz.com";
  const now = new Date().toISOString();

  return [
    {
      url: base,
      lastModified: now
    },
    {
      url: `${base}/blog`,
      lastModified: now
    },
    {
      url: `${base}/all-posts`,
      lastModified: now
    }
  ];
}