import { describe, expect, it } from "vitest";

import { getFeaturedRepoNote, parseGitHubRepoUrl, normalizeGitHubRepo } from "@/src/lib/githubRepo";

describe("github repo helpers", () => {
  it("parses a public GitHub repository URL", () => {
    expect(parseGitHubRepoUrl("https://github.com/github/spec-kit")).toEqual({
      owner: "github",
      repo: "spec-kit",
    });
  });

  it("reads the featured repo note from env when provided", () => {
    const previous = process.env.FEATURED_REPO_NOTE;
    process.env.FEATURED_REPO_NOTE = "A short note about the repo.";

    expect(getFeaturedRepoNote()).toBe("A short note about the repo.");

    if (previous === undefined) {
      delete process.env.FEATURED_REPO_NOTE;
    } else {
      process.env.FEATURED_REPO_NOTE = previous;
    }
  });

  it("normalizes GitHub API data for the featured repo UI", () => {
    const repo = normalizeGitHubRepo({
      repo: {
        full_name: "github/spec-kit",
        html_url: "https://github.com/github/spec-kit",
        description: "Toolkit to help you get started with Spec-Driven Development",
        stargazers_count: 23456,
        forks_count: 1200,
        open_issues_count: 321,
        language: "Python",
        visibility: "public",
        default_branch: "main",
        updated_at: "2026-05-24T12:00:00Z",
        license: { spdx_id: "MIT" },
      },
      release: { tag_name: "v0.0.42" },
      readmeText: "# Spec Kit\nShip specs before code.\nUse with agents.",
    });

    expect(repo).toMatchObject({
      name: "github/spec-kit",
      version: "v0.0.42",
      description: "Toolkit to help you get started with Spec-Driven Development",
      stars: "23.5k",
      forks: "1.2k",
      growth: "1.2k forks",
      issues: "321 issues",
      status: "updated May 24, 2026",
      updated: "updated May 24, 2026",
      language: "Python",
      visibility: "public",
      license: "MIT",
      branch: "main",
      stack: ["Python", "public", "MIT", "main"],
      url: "https://github.com/github/spec-kit",
      readme: ["Spec Kit", "Ship specs before code.", "Use with agents."],
    });
  });

  it("strips HTML and markdown decoration from README preview lines", () => {
    const repo = normalizeGitHubRepo({
      repo: {
        full_name: "github/spec-kit",
        html_url: "https://github.com/github/spec-kit",
        description: "Spec kit",
        stargazers_count: 1,
        forks_count: 2,
        open_issues_count: 3,
        language: "Python",
        visibility: "public",
        default_branch: "main",
        updated_at: "2026-05-24T12:00:00Z",
        license: null,
      },
      readmeText: [
        "---",
        '<div align="center">',
        '<img src="./media/logo_large.webp" alt="Spec Kit Logo"/>',
        "Table of Contents",
        "# 🌱 Spec Kit",
        "### **Build high-quality software faster.**",
        "- [Install](https://example.com)",
        "`specify init`",
      ].join("\n"),
    });

    expect(repo.readme).toEqual([
      "🌱 Spec Kit",
      "Build high-quality software faster.",
      "Install",
      "specify init",
    ]);
  });

  it("includes the featured repo note from env in the normalized repo data", () => {
    const previous = process.env.FEATURED_REPO_NOTE;
    process.env.FEATURED_REPO_NOTE = "A short note about the repo.";

    const repo = normalizeGitHubRepo({
      repo: {
        full_name: "github/spec-kit",
        html_url: "https://github.com/github/spec-kit",
        description: "Spec kit",
        stargazers_count: 1,
        forks_count: 2,
        open_issues_count: 3,
        language: "Python",
        visibility: "public",
        default_branch: "main",
        updated_at: "2026-05-24T12:00:00Z",
        license: null,
      },
    });

    expect(repo.note).toBe("A short note about the repo.");

    if (previous === undefined) {
      delete process.env.FEATURED_REPO_NOTE;
    } else {
      process.env.FEATURED_REPO_NOTE = previous;
    }
  });
});
