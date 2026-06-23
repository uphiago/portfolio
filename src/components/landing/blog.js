import { marked } from "marked";

const BLOG_ORIGIN = "https://dotmindblog.vercel.app";
const BLOG_REPO_API = "https://api.github.com/repos/uphiago/dotmindblog";
const BLOG_RAW_ORIGIN = "https://raw.githubusercontent.com/uphiago/dotmindblog/main";

export const BLOG_FALLBACK_ARTICLES = [
  {
    id: "01",
    title: "Skills Stack, MCP, and Project Context",
    meta: "Apr 2026 · Dotmind it",
    date: "2026-04-02T00:00:00-03:00",
    tags: ["ai", "agents", "mcp"],
    author: "iceteash",
    url: `${BLOG_ORIGIN}/posts/2026/ai/agentic-engineering-guide/`,
    summary: "A practical guide to building interoperable agents across any AI runtime.",
    html: "<p>A practical guide to building interoperable agents across any AI runtime.</p>",
  },
];

function parseTomlFrontmatter(markdown) {
  const match = markdown.match(/^\+\+\+\n([\s\S]*?)\n\+\+\+\n?/);
  if (!match) return { frontmatter: {}, body: markdown };

  const raw = match[1];
  const frontmatter = {};
  const scalarMatches = raw.matchAll(/^(\w+)\s*=\s*(.+)$/gm);

  for (const item of scalarMatches) {
    const [, key, rawValue] = item;
    const value = rawValue.trim();
    if (value.startsWith("[") || raw.slice(item.index).includes(`${key} = [`)) continue;
    frontmatter[key] = value.replace(/^"|"$/g, "");
  }

  const arrayMatches = raw.matchAll(/^(\w+)\s*=\s*\[([\s\S]*?)\]/gm);
  for (const [, key, rawValue] of arrayMatches) {
    frontmatter[key] = [...rawValue.matchAll(/"([^"]+)"/g)].map((tag) => tag[1]);
  }

  return { frontmatter, body: markdown.slice(match[0].length) };
}

function formatPostDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Dotmind it";
  return `${date.toLocaleString("en-US", { month: "short", timeZone: "UTC" })} ${date.getUTCFullYear()} · Dotmind it`;
}

function pathToBlogUrl(path) {
  const slug = path
    .replace(/^content\//, "")
    .replace(/\.md$/, "")
    .replace(/\/index$/, "");
  return `${BLOG_ORIGIN}/${slug}/`;
}

function renderMarkdownHtml(markdown) {
  const rendered = marked.parse(markdown.replace(/<!--more-->/g, ""), {
    async: false,
    gfm: true,
    breaks: false,
  });

  return rendered
    .replaceAll('href="/', `href="${BLOG_ORIGIN}/`)
    .replaceAll('src="/', `src="${BLOG_ORIGIN}/`)
    .replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"')
    .trim();
}

export function parseBlogMarkdown(path, markdown, index = 0) {
  const { frontmatter, body } = parseTomlFrontmatter(markdown);
  const title = frontmatter.title || path.split("/").pop().replace(/\.md$/, "");
  const summary = frontmatter.description || "";
  const date = frontmatter.date || "";
  const author = frontmatter.author || frontmatter.authors?.[0] || "";

  return {
    id: String(index + 1).padStart(2, "0"),
    title,
    meta: formatPostDate(date),
    url: pathToBlogUrl(path),
    ...(summary ? { summary } : {}),
    ...(date ? { date } : {}),
    ...(author ? { author } : {}),
    tags: frontmatter.tags || [],
    html: renderMarkdownHtml(body),
  };
}

async function getMarkdownPostPaths() {
  const response = await fetch(`${BLOG_REPO_API}/git/trees/main?recursive=1`, { next: { revalidate: 300 } });
  if (!response.ok) return [];

  const payload = await response.json();
  return (payload.tree || [])
    .filter((item) => item.type === "blob")
    .map((item) => item.path)
    .filter((path) => /^content\/posts\/.+\.md$/.test(path))
    .filter((path) => !/\.pt\.md$/.test(path));
}

export async function getBlogArticles() {
  try {
    const paths = await getMarkdownPostPaths();
    if (paths.length === 0) return BLOG_FALLBACK_ARTICLES;

    const articles = await Promise.all(paths.map(async (path, index) => {
      const response = await fetch(`${BLOG_RAW_ORIGIN}/${path}`, { next: { revalidate: 300 } });
      if (!response.ok) return null;
      return parseBlogMarkdown(path, await response.text(), index);
    }));

    const published = articles
      .filter(Boolean)
      .filter((article) => article.title && article.html)
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
      .map((article, index) => ({ ...article, id: String(index + 1).padStart(2, "0") }));

    return published.length > 0 ? published : BLOG_FALLBACK_ARTICLES;
  } catch {
    return BLOG_FALLBACK_ARTICLES;
  }
}
