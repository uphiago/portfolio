import { NextResponse } from "next/server";
import { getBlogArticles } from "@/src/components/landing/blog";

const BLOG_RAW_ORIGIN = "https://raw.githubusercontent.com/uphiago/dotmindblog/main";

export async function GET(request, { params }) {
  const { slug } = await params;
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });

  const articles = await getBlogArticles();
  const article = articles.find((a) => a.id === slug);
  if (!article) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (!article.sourcePath) return NextResponse.json({ error: "source not available" }, { status: 404 });

  const raw = await fetch(`${BLOG_RAW_ORIGIN}/${article.sourcePath}`, { next: { revalidate: 300 } });
  if (!raw.ok) return NextResponse.json({ error: "fetch failed" }, { status: 502 });

  const markdown = await raw.text();

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
