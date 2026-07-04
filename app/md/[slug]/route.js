import { NextResponse } from "next/server";
import { getArticleMarkdown } from "@/src/components/landing/blog";

export async function GET(request, { params }) {
  const { slug } = await params;
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });

  const cleanSlug = slug.replace(/\.md$/, "");
  const markdown = getArticleMarkdown(cleanSlug);
  if (!markdown) return NextResponse.json({ error: "not found" }, { status: 404 });

  const accept = request.headers.get("accept") || "";
  const wantsHtml = accept.includes("text/html");

  if (!wantsHtml) {
    return new NextResponse(markdown, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
      },
    });
  }

  const title = markdown.match(/^#\s*(.+)$/m)?.[1] || cleanSlug;
  const escaped = markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — hiago.sh</title>
<style>
  body {
    font-family: monospace;
    background: #fbfaf6;
    color: #0a0a0a;
    line-height: 1.6;
    padding: 20px 24px 60px;
    max-width: 720px;
    margin: 0 auto;
  }
  a { color: #0a0a0a; }
  .back {
    display: inline-block;
    margin-bottom: 24px;
    font-size: 13px;
    color: #8c8a86;
    text-decoration: none;
  }
  .back:hover { color: #0a0a0a; }
  pre {
    background: #f0efe8;
    padding: 12px;
    overflow-x: auto;
    font-size: 13px;
  }
  code { font-size: 13px; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #ddd; padding: 6px 10px; text-align: left; }
  img { max-width: 100%; }
</style>
</head>
<body>
<a href="/?post=${cleanSlug}" class="back">← back to hiago.sh</a>
<pre style="background:none;padding:0;font-family:monospace;white-space:pre-wrap;word-wrap:break-word;font-size:14px;line-height:1.6;">${escaped}</pre>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}
