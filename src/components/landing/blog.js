import { marked } from "marked";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const POSTS_DIR = join(process.cwd(), "content", "posts");
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hiago.sh";

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
  if (Number.isNaN(date.getTime())) return "";
  return `${date.toLocaleString("en-US", { month: "short", timeZone: "UTC" })} ${date.getUTCFullYear()}`;
}

function pathToBlogUrl(sourcePath) {
  const slug = sourcePath
    .replace(/^content\/posts\//, "")
    .replace(/\.md$/, "")
    .replace(/\/index$/, "");
  return `${SITE_URL}/?post=${slug}`;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/&amp;/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s/g, "-")
    .replace(/^-|-$/g, "");
}

function renderMarkdownHtml(markdown) {
  const rendered = marked.parse(markdown.replace(/<!--more-->/g, ""), {
    async: false,
    gfm: true,
    breaks: false,
  });

  return rendered
    .replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"')
    .replace(/<a href="(?!https?:\/\/|#)[^"]*"/g, "<a href=\"#\"")
    .replace(/<h([1-6])>([^<]*)<\/h\1>/g, (_, level, text) => `<h${level} id="${slugify(text)}">${text}</h${level}>`)
    .trim();
}

export function parseBlogMarkdown(sourcePath, markdown) {
  const { frontmatter, body } = parseTomlFrontmatter(markdown);
  const title = frontmatter.title || sourcePath.split("/").pop().replace(/\.md$/, "");
  const summary = frontmatter.description || "";
  const date = frontmatter.date || "";
  const lastmod = frontmatter.lastmod || "";
  const author = frontmatter.author || frontmatter.authors?.[0] || "";

  const slug = frontmatter.slug || sourcePath
    .replace(/^content\/posts\//, "")
    .replace(/\.md$/, "")
    .replace(/\/index$/, "")
    .replace(/\//g, "-");

  const dateStr = formatPostDate(date);
  const lastmodStr = lastmod && lastmod !== date ? ` · updated ${formatPostDate(lastmod)}` : "";

  return {
    id: slug,
    title,
    meta: `${dateStr}${lastmodStr}`,
    url: pathToBlogUrl(sourcePath),
    sourcePath,
    ...(summary ? { summary } : {}),
    ...(date ? { date } : {}),
    ...(lastmod ? { lastmod } : {}),
    ...(author ? { author } : {}),
    tags: frontmatter.tags || [],
    html: renderMarkdownHtml(body),
  };
}

function getMarkdownPostPaths() {
  const paths = [];

  function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name.endsWith(".md") && !entry.name.endsWith(".pt.md")) {
        paths.push(relative(process.cwd(), full));
      }
    }
  }

  walk(POSTS_DIR);
  return paths.sort();
}

export function getBlogArticles() {
  const paths = getMarkdownPostPaths();

  const articles = paths
    .map((path) => parseBlogMarkdown(path, readFileSync(path, "utf-8")))
    .filter((a) => a.title && a.html)
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  return articles;
}

export function getArticleBySlug(slug) {
  const articles = getBlogArticles();
  return articles.find((a) => a.id === slug) || null;
}

export function getArticleMarkdown(slug) {
  const article = getArticleBySlug(slug);
  if (!article) return null;
  return readFileSync(article.sourcePath, "utf-8");
}
