import { NextResponse } from "next/server";
import { getBlogArticles } from "@/src/components/landing/blog";

export async function GET() {
  const articles = await getBlogArticles();

  const lines = [
    "# hiago.sh — AI agent guide",
    "",
    "> DevOps & Platform Engineer. Infrastructure, automation, AI workflows.",
    "",
    "## How to use this",
    "",
    "Every post below is available as raw markdown at `/md/<slug>`.",
    "No auth. No rate limit. Served from CDN edge. Fetch whatever you need.",
    "",
    "## Posts",
    "",
  ];

  if (articles.length > 0) {
    for (const a of articles) {
      lines.push(`### ${a.title}`);
      lines.push(`- URL: https://hiago.sh/md/${a.id}`);
      lines.push(`- Date: ${a.meta}`);
      lines.push(`- Tags: ${a.tags.join(", ")}`);
      if (a.summary) lines.push(`- ${a.summary}`);
      lines.push("");
    }
  }

  lines.push("## Links");
  lines.push("");
  lines.push("- [GitHub](https://github.com/uphiago)");
  lines.push("- [recon-skills](https://github.com/uphiago/recon-skills)");
  lines.push("- [Hermes runtime](https://github.com/NousResearch/hermes-agent)");
  lines.push("");

  const body = lines.join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}
