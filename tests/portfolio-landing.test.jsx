import { renderToStaticMarkup } from "react-dom/server";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it } from "vitest";

import { MidfiV1 } from "@/src/components/landing/MidfiV1";
import { ContactModal } from "@/src/components/landing/modals/ContactModal";
import { ArticleModal } from "@/src/components/landing/modals/ArticleModal";
import { VideoModal } from "@/src/components/landing/modals/VideoModal";
import { ARTICLES, VIDEOS } from "@/src/components/landing/data";
import { parseBlogMarkdown } from "@/src/components/landing/blog";
import { buildYoutubeEmbedUrl, buildYoutubeThumbnailUrl, parsePlaylistId } from "@/src/components/landing/youtube";

describe("MidfiV1", () => {
  it("renders the refined portfolio layout inside Next", () => {
    const html = renderToStaticMarkup(<MidfiV1 />);

    expect(html).toContain("hiago");
    expect(html).toContain("devops &amp; platform engineer · são paulo");
    expect(html).toContain("infrastructure, automation, ai workflows, and internal platforms.");
    expect(html).toContain("linux, self-hosted ops, ci/cd, k8s, terraform, n8n.");
    expect(html).toContain("cloud · containers · integrations");
    expect(html).not.toContain("13y in production");
    expect(html).not.toContain("working async or onsite");
    expect(html).toContain("wanna talk?");
    expect(html).not.toContain("github · i use this");
    expect(html).not.toContain("repo-card");
    expect(html).toContain("latest write-ups");
    expect(html).toContain('class="card writing-card" style="grid-column:span 12;grid-row:span 5"');
    expect(html).toContain("field_notes.subscribe()");
    expect(html).not.toContain("youtube.playlist()");
    expect(html).toContain("self-hosted ops");
    expect(html).not.toContain("presence");
    expect(html).not.toContain("systems improved");
    expect(html).not.toContain("automations shipped");
    expect(html).not.toContain("platform notes");
    expect(html).not.toContain("operator-first");
    expect(html).not.toContain("attending");
    expect(html).toContain("reels");
    expect(html).toContain("drag-row");
    expect(html).toContain("drag-tile");
    expect(html).toContain("media-shell is-loading drag-tile-thumb");
    expect(html).toContain("drag-tile-desc");
    expect(html).toContain("reel-meta");
    expect(html).toContain("reels-more");
    expect(html).toContain("Open Instagram reel");
    expect(html).toContain("short-tags");
    expect(html).not.toContain("hfelipe.sh@gmail.com");
    expect(html).not.toContain("self-hosted, deployed on a friday");
    expect(html).not.toContain("UTC−3");
    expect(html).not.toContain("6 articles");
    expect(html).not.toContain("reel-badge");
    expect(html).not.toContain("vplay");
    expect(html).not.toContain("youtube-cta");
  });

  it("renders synced blog posts as local field-note rows", () => {
    const html = renderToStaticMarkup(
      <MidfiV1 articles={[{
        id: "01",
        title: "Skills Stack, MCP, and Project Context",
        meta: "Apr 2026 · Dotmind it",
        url: "https://dotmindblog.vercel.app/posts/2026/ai/agentic-engineering-guide/",
        html: "<p>A practical guide.</p>",
      }]} />
    );

    expect(html).toContain("Skills Stack, MCP, and Project Context");
    expect(html).not.toContain("Apr 2026 · Dotmind it");
    expect(html).not.toContain('href="https://dotmindblog.vercel.app/posts/2026/ai/agentic-engineering-guide/"');
    expect(html).not.toContain('rel="noopener noreferrer">Skills Stack');
  });

  it("parses the configured YouTube playlist URL and start offset", () => {
    const playlistUrl = "https://youtube.com/playlist?list=PL4NWyqf4Mpp2gOfgZFhOc9W3P--QKoprV&si=pINjpqGtEc8RVy9S";

    expect(parsePlaylistId(playlistUrl)).toBe("PL4NWyqf4Mpp2gOfgZFhOc9W3P--QKoprV");
    expect(buildYoutubeThumbnailUrl("abc123")).toBe("https://i.ytimg.com/vi/abc123/hqdefault.jpg");
    expect(buildYoutubeEmbedUrl({ playlistId: "PL4NWyqf4Mpp2gOfgZFhOc9W3P--QKoprV", videoId: "abc123", startSeconds: 93 })).toBe(
      "https://www.youtube-nocookie.com/embed/abc123?list=PL4NWyqf4Mpp2gOfgZFhOc9W3P--QKoprV&start=93&enablejsapi=1&playsinline=1&controls=0&rel=0&modestbranding=1"
    );
    expect(buildYoutubeEmbedUrl({ playlistId: "PL4NWyqf4Mpp2gOfgZFhOc9W3P--QKoprV", startSeconds: 93, autoplay: true, muted: true })).toBe(
      "https://www.youtube.com/embed/videoseries?list=PL4NWyqf4Mpp2gOfgZFhOc9W3P--QKoprV&start=93&autoplay=1&mute=1&enablejsapi=1&playsinline=1&controls=0&rel=0&modestbranding=1"
    );
  });

  it("renders the compact YouTube playlist player inside field notes", () => {
    const html = renderToStaticMarkup(
      <MidfiV1
        music={{
          playlistId: "PL4NWyqf4Mpp2gOfgZFhOc9W3P--QKoprV",
          startSeconds: 42,
          title: "Lo-fi deploy window",
          channelTitle: "hiago playlist",
          thumbnailUrl: "https://i.ytimg.com/vi/abc123/hqdefault.jpg",
          embedUrl: "https://www.youtube-nocookie.com/embed/abc123?playlist=PL4NWyqf4Mpp2gOfgZFhOc9W3P--QKoprV&start=42&enablejsapi=1&playsinline=1&controls=0&rel=0&modestbranding=1",
        }}
      />
    );

    expect(html).not.toContain("youtube.playlist()");
    expect(html).not.toContain("Lo-fi deploy window");
    expect(html).not.toContain("hiago playlist");
    expect(html).toContain("https://i.ytimg.com/vi/abc123/hqdefault.jpg");
    expect(html).toContain("music-eq");
    expect(html).toContain("<iframe");
    expect(html).toContain("YouTube playlist player");
    expect(html).toContain("your@email.com");
    expect(html).toContain("field_notes.subscribe()");
  });

  it("parses Dotmind markdown into complete modal blocks", () => {
    const article = parseBlogMarkdown("content/posts/2026/ai/agentic-engineering-guide.md", `+++
title = "Skills Stack, MCP, and Project Context"
date = 2026-04-02T00:00:00-03:00
description = "A practical guide to building interoperable agents across any AI runtime."
author = "iceteash"
tags = ["ai", "agents"]
+++

<!--more-->

## Quick Setup

Want to get started right now?

| Platform | How to Configure |
| :--- | :--- |
| Codex | Keep skills in \`skills/\`. |

- narrow tools
- verified actions

\`\`\`bash
npx skills add repo
\`\`\`
`);

    expect(article).toMatchObject({
      id: "01",
      title: "Skills Stack, MCP, and Project Context",
      meta: "Apr 2026 · Dotmind it",
      url: "https://dotmindblog.vercel.app/posts/2026/ai/agentic-engineering-guide/",
      summary: "A practical guide to building interoperable agents across any AI runtime.",
      date: "2026-04-02T00:00:00-03:00",
      author: "iceteash",
      tags: ["ai", "agents"],
    });
    expect(article.html).toContain("<h2>Quick Setup</h2>");
    expect(article.html).toContain("<table>");
    expect(article.html).toContain("<td");
    expect(article.html).toContain("Keep skills in <code>skills/</code>.");
    expect(article.html).toContain("<ul>");
    expect(article.html).toContain('<code class="language-bash">npx skills add repo');
  });

  it("renders synced markdown HTML inside the local field-note modal", () => {
    const html = renderToStaticMarkup(
      <ArticleModal
        openArticle={{
          id: "01",
          title: "Markdown Post",
          meta: "Apr 2026 · Dotmind it",
          author: "iceteash",
          url: "https://dotmindblog.vercel.app/posts/2026/ai/agentic-engineering-guide/",
          html: '<h2>Quick Setup</h2><p>Text</p><img src="https://dotmindblog.vercel.app/images/diagram.png" alt="Diagram"><pre><code>echo ok</code></pre>',
        }}
        setOpenArticle={() => {}}
      />
    );

    expect(html).toContain('<div class="markdown-body">');
    expect(html).toContain("write-ups · 01");
    expect(html).not.toContain("⌘ write-ups");
    expect(html).toContain('<img src="https://dotmindblog.vercel.app/images/diagram.png" alt="Diagram">');
    expect(html).toContain("<pre><code>echo ok</code></pre>");
    expect(html).toContain("@iceteash");
    expect(html).toContain("copy link");
    expect(html).toContain("original");
  });

  it("renders the selected social icon row in the topbar", () => {
    const html = renderToStaticMarkup(<MidfiV1 />);

    expect(html).toContain('title="github"');
    expect(html).toContain('title="linkedin"');
    expect(html).toContain('title="x"');
    expect(html).toContain('title="instagram"');
    expect(html).not.toContain('title="youtube"');
    expect(html).not.toContain('title="tiktok"');
  });

  it("does not focus the contact close button when the modal opens", async () => {
    const rootElement = document.createElement("div");
    document.body.appendChild(rootElement);
    const root = createRoot(rootElement);

    await act(async () => {
      root.render(<ContactModal setContactOpen={() => {}} />);
    });

    expect(document.activeElement).not.toBe(
      rootElement.querySelector('button[aria-label="close"]')
    );

    await act(async () => {
      root.unmount();
    });
    document.body.removeChild(rootElement);
  });

  it("renders contact as direct copy and external-link actions without a form", () => {
    const html = renderToStaticMarkup(<ContactModal setContactOpen={() => {}} />);

    expect(html).toContain("hfelipe.sh@gmail.com");
    expect(html).toContain("For projects, consulting, or technical conversations, reach me on LinkedIn or email.");
    expect(html).not.toContain("Need help turning messy infra");
    expect(html).toContain("São Paulo, Brasil");
    expect(html).not.toContain("Brazil");
    expect(html).toContain("copy-email");
    expect(html).toContain("contact-link");
    expect(html).toContain("linkedin.com/in/uphiago");
    expect(html).not.toContain("mfi-email");
    expect(html).not.toContain("what are you building?");
    expect(html).not.toContain("./send");
  });

  it("renders field note modal with a compact article close button and no initial close focus", async () => {
    const rootElement = document.createElement("div");
    document.body.appendChild(rootElement);
    const root = createRoot(rootElement);

    await act(async () => {
      root.render(<ArticleModal openArticle={ARTICLES[0]} setOpenArticle={() => {}} />);
    });

    const closeButton = rootElement.querySelector('button[aria-label="close"]');

    expect(closeButton.className).toContain("article-close");
    expect(document.activeElement).not.toBe(closeButton);

    await act(async () => {
      root.unmount();
    });
    document.body.removeChild(rootElement);
  });

  it("does not restore focus to the selected field note after article modal closes", async () => {
    const previouslyFocused = document.createElement("button");
    document.body.appendChild(previouslyFocused);
    previouslyFocused.focus();

    const rootElement = document.createElement("div");
    document.body.appendChild(rootElement);
    const root = createRoot(rootElement);

    await act(async () => {
      root.render(<ArticleModal openArticle={ARTICLES[0]} setOpenArticle={() => {}} />);
    });

    await act(async () => {
      root.unmount();
    });

    expect(document.activeElement).not.toBe(previouslyFocused);

    document.body.removeChild(rootElement);
    document.body.removeChild(previouslyFocused);
  });

  it("renders video media with skeleton shells before thumbnails load", () => {
    const html = renderToStaticMarkup(
      <VideoModal openVideo={VIDEOS.shorts[0]} setOpenVideo={() => {}} />
    );

    expect(html).toContain("media-shell is-loading vplayer-media");
    expect(html).toContain("aria-busy=\"true\"");
  });
});
