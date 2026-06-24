import { NextResponse } from "next/server";
import { getBlogArticles } from "@/src/components/landing/blog";

export async function GET() {
  const articles = await getBlogArticles();

  const lines = [
    "# hiago.sh",
    "",
    "> DevOps & Platform Engineer · São Paulo",
    "> Infrastructure, automation, AI workflows, and internal platforms.",
    "",
    "Linux, self-hosted ops, CI/CD, K8s, Terraform, n8n.",
    "Cloud · containers · integrations.",
    "",
  ];

  if (articles.length > 0) {
    lines.push("## Write-ups");
    lines.push("");
    for (const a of articles) {
      lines.push(`- [${a.title}](https://hiago.sh/?post=${a.id}.md): ${a.meta}${a.tags.length ? " · " + a.tags.join(", ") : ""}`);
    }
    lines.push("");
  }

  lines.push("## Optional");
  lines.push("");
  lines.push("- [GitHub](https://github.com/uphiago/portfolio)");
  lines.push("- [LinkedIn](https://www.linkedin.com/in/uphiago)");
  lines.push("- [X](https://x.com/uphiago)");
  lines.push("");

  const body = lines.join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
