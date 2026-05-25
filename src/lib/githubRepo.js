const DEFAULT_REPO_URL = "https://github.com/github/spec-kit";

export function getFeaturedRepoUrl() {
  return (
    process.env.FEATURED_REPO_URL ||
    process.env.NEXT_PUBLIC_FEATURED_REPO_URL ||
    DEFAULT_REPO_URL
  );
}

export function getFeaturedRepoNote() {
  return (
    process.env.FEATURED_REPO_NOTE ||
    process.env.NEXT_PUBLIC_FEATURED_REPO_NOTE ||
    "A repo worth studying when the process matters as much as the code."
  );
}

export function parseGitHubRepoUrl(repoUrl) {
  const parsed = new URL(repoUrl);
  const [owner, repo] = parsed.pathname.replace(/^\/|\/$/g, "").split("/");

  if (parsed.hostname !== "github.com" || !owner || !repo) {
    throw new Error("FEATURED_REPO_URL must be a GitHub repository URL");
  }

  return { owner, repo };
}

export function formatCount(value) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

export function formatUpdatedAt(value) {
  return `updated ${new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value))}`;
}

export function normalizeReadme(readmeText) {
  return readmeText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => !line.startsWith("<"))
    .filter((line) => !line.startsWith("[!"))
    .filter((line) => !line.startsWith("<!--"))
    .filter((line) => !/^[-*_]{3,}$/.test(line))
    .map((line) => line.replace(/^#+\s*/, ""))
    .map((line) => line.replace(/^[-*]\s+/, ""))
    .map((line) => line.replace(/\*\*/g, ""))
    .map((line) => line.replace(/`/g, ""))
    .map((line) => line.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"))
    .map((line) => line.replace(/<[^>]+>/g, ""))
    .filter((line) => !/^table of contents$/i.test(line))
    .filter(Boolean)
    .slice(0, 6);
}

export function normalizeGitHubRepo({ repo, readmeText = "", release = null }) {
  const language = repo.language || "";
  const visibility = repo.visibility || "";
  const license = repo.license?.spdx_id || "";
  const branch = repo.default_branch || "";

  return {
    name: repo.full_name,
    version: release?.tag_name || repo.default_branch,
    description: repo.description || "Public GitHub repository.",
    stars: formatCount(repo.stargazers_count || 0),
    forks: formatCount(repo.forks_count || 0),
    growth: `${formatCount(repo.forks_count || 0)} forks`,
    issues: `${formatCount(repo.open_issues_count || 0)} issues`,
    status: formatUpdatedAt(repo.updated_at),
    updated: formatUpdatedAt(repo.updated_at),
    language,
    visibility,
    license,
    branch,
    stack: [language, visibility, license, branch].filter(Boolean),
    url: repo.html_url,
    readme: normalizeReadme(readmeText),
    note: getFeaturedRepoNote(),
  };
}

async function fetchJson(fetchImpl, url, options = {}) {
  const response = await fetchImpl(url, options);
  if (!response.ok) return null;
  return response.json();
}

export async function fetchFeaturedGitHubRepo(fetchImpl = fetch) {
  const { owner, repo } = parseGitHubRepoUrl(getFeaturedRepoUrl());
  const baseUrl = `https://api.github.com/repos/${owner}/${repo}`;
  const requestOptions = {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: { revalidate: 3600 },
  };

  const [repoData, readmeData, releaseData] = await Promise.all([
    fetchJson(fetchImpl, baseUrl, requestOptions),
    fetchJson(fetchImpl, `${baseUrl}/readme`, requestOptions),
    fetchJson(fetchImpl, `${baseUrl}/releases/latest`, requestOptions),
  ]);

  if (!repoData) {
    throw new Error(`GitHub repository not found: ${owner}/${repo}`);
  }

  const readmeText = readmeData?.content
    ? Buffer.from(readmeData.content, "base64").toString("utf8")
    : "";

  return normalizeGitHubRepo({
    repo: repoData,
    readmeText,
    release: releaseData,
  });
}
