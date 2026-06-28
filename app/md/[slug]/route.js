import { NextResponse } from "next/server";
import { getArticleMarkdown } from "@/src/components/landing/blog";

export async function GET(request, { params }) {
  const { slug } = await params;
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });

  const markdown = getArticleMarkdown(slug);
  if (!markdown) return NextResponse.json({ error: "not found" }, { status: 404 });

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}
