import { NextResponse } from "next/server";
import { getArticleMarkdown, getBlogArticles } from "@/src/components/landing/blog";

export function generateStaticParams() {
  const articles = getBlogArticles();
  return articles.map((a) => ({ slug: a.id }));
}

export async function GET(request, { params }) {
  const { slug } = await params;
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });

  const cleanSlug = slug.replace(/\.md$/, "");
  const markdown = getArticleMarkdown(cleanSlug);
  if (!markdown) return NextResponse.json({ error: "not found" }, { status: 404 });

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}
