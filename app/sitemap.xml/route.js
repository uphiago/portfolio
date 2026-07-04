import { getBlogArticles } from "@/src/components/landing/blog";

const BASE = "https://hiago.sh";

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function GET() {
  const articles = await getBlogArticles();

  const urls = [
    `  <url><loc>${BASE}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
  ];

  for (const a of articles) {
    urls.push(
      `  <url><loc>${escapeXml(`${BASE}/?post=${a.id}`)}</loc><lastmod>${a.lastmod? a.lastmod.slice(0, 10) : a.date ? a.date.slice(0, 10) : ""}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`
    );
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
