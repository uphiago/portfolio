import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { generateKeyPairSync } from "node:crypto";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it } from "vitest";

import { MidfiV1 } from "@/src/components/landing/MidfiV1";
import { ContactModal } from "@/src/components/landing/modals/ContactModal";
import { ArticleModal } from "@/src/components/landing/modals/ArticleModal";
import { VideoModal } from "@/src/components/landing/modals/VideoModal";
import { MUSIC_DEFAULT_VOLUME, MUSIC_FADE_MS, MUSIC_FADE_STEPS } from "@/src/components/landing/cards/MusicPlayer";
import { ARTICLES, VIDEOS } from "@/src/components/landing/data";
import { parseBlogMarkdown } from "@/src/components/landing/blog";
import { buildYoutubeEmbedUrl, buildYoutubeThumbnailUrl, parsePlaylistId } from "@/src/components/landing/youtube";
import {
  buildSheetsAppendUrl,
  buildSubscriberRow,
  DEFAULT_NEWSLETTER_SPREADSHEET_ID,
  appendNewsletterSubscriber,
  formatBrazilTimestamp,
  isValidSubscriberEmail,
  normalizeGooglePrivateKey,
  resolveGoogleCredentials,
} from "@/src/lib/newsletterSheet";

describe("MidfiV1", () => {
  it("installs Vercel Analytics in the root layout", () => {
    const layout = readFileSync("app/layout.jsx", "utf8");

    expect(layout).toContain('import { Analytics } from "@vercel/analytics/next"');
    expect(layout).toContain("<Analytics />");
  });

  it("posts field-note subscriptions to the local server route", () => {
    const source = readFileSync("src/components/landing/cards/MusicPlayer.jsx", "utf8");
    const route = readFileSync("app/api/field-notes/subscribe/route.js", "utf8");

    expect(source).toContain('fetch("/api/field-notes/subscribe"');
    expect(source).toContain('name="email"');
    expect(source).toContain('name="website"');
    expect(source).toContain("SUBSCRIBE_COOLDOWN_MS = 3000");
    expect(source).toContain("subscribing");
    expect(source).toContain("subscribeLabel");
    expect(source).not.toContain("try again later</div>");
    expect(route).toContain("SUBSCRIBE_RATE_LIMIT_MS = 3000");
    expect(route).toContain("rate_limited");
    expect(route).toContain("skipped: \"rate_limited\"");
    expect(route).not.toContain("status: 429");
  });

  it("builds newsletter rows for the configured Google Sheet", () => {
    expect(DEFAULT_NEWSLETTER_SPREADSHEET_ID).toBe("1D4Hx5J0eiU9qKkh6GLHc0G3Na5rJtl5tA7t1Za3vQ5w");
    expect(buildSheetsAppendUrl({ spreadsheetId: "sheet123", range: "Subscribers!A:C" })).toBe(
      "https://sheets.googleapis.com/v4/spreadsheets/sheet123/values/Subscribers!A%3AC:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS"
    );
    expect(buildSubscriberRow({
      email: "  HIAGO@example.com ",
      metadata: {
        city: "Rio%20de%20Janeiro",
      },
      now: new Date("2026-06-07T19:30:00.000Z"),
    })).toEqual([
      "07/06/2026 16:30:00",
      "hiago@example.com",
      "Rio de Janeiro",
    ]);
    expect(formatBrazilTimestamp(new Date("2026-06-07T19:30:00.000Z"))).toBe("07/06/2026 16:30:00");
    expect(isValidSubscriberEmail("hiago@example.com")).toBe(true);
    expect(isValidSubscriberEmail("not-an-email")).toBe(false);
  });

  it("normalizes Google private keys pasted into Vercel env vars", () => {
    const pem = "-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----";

    expect(normalizeGooglePrivateKey(`"${pem.replace(/\n/g, "\\n")}"`)).toBe(pem);
    expect(normalizeGooglePrivateKey(Buffer.from(pem).toString("base64"))).toBe(pem);
  });

  it("accepts a full service account JSON env var", () => {
    const credentials = resolveGoogleCredentials({
      serviceAccountJson: JSON.stringify({
        client_email: "sheet-bot@example.iam.gserviceaccount.com",
        private_key: "-----BEGIN PRIVATE KEY-----\\nabc\\n-----END PRIVATE KEY-----\\n",
      }),
    });

    expect(credentials.serviceAccountEmail).toBe("sheet-bot@example.iam.gserviceaccount.com");
    expect(normalizeGooglePrivateKey(credentials.privateKey)).toBe("-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----");
  });

  it("includes Google Sheets response details when append fails", async () => {
    const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
    const testPrivateKey = privateKey.export({ type: "pkcs8", format: "pem" });
    const calls = [];
    const fakeFetch = async (url) => {
      calls.push(String(url));
      if (String(url).includes("oauth2.googleapis.com")) {
        return {
          ok: true,
          json: async () => ({ access_token: "token" }),
        };
      }

      return {
        ok: false,
        status: 403,
        text: async () => "The caller does not have permission",
      };
    };

    await expect(appendNewsletterSubscriber({
      email: "hiago@example.com",
      fetchImpl: fakeFetch,
      serviceAccountEmail: "sheet-bot@example.iam.gserviceaccount.com",
      privateKey: testPrivateKey,
    })).rejects.toThrow("Google Sheets append failed: 403 The caller does not have permission");
    expect(calls.some((url) => url.includes("sheets.googleapis.com"))).toBe(true);
  });

  it("visually separates field note rows with list dividers", () => {
    const css = readFileSync("src/components/landing/styles/cards.css", "utf8");

    expect(css).toContain(".mfi .wlist .star-row");
    expect(css).toContain("border-bottom: 1px solid var(--m-line)");
    expect(css).toContain(".mfi .wlist .star-row:first-child");
  });

  it("does not expose grab cursors or drag-to-scroll interactions", () => {
    const css = readFileSync("src/components/landing/styles/cards.css", "utf8");
    const baseCss = readFileSync("src/components/landing/styles/base.css", "utf8");
    const writeups = readFileSync("src/components/landing/cards/WriteupsCard.jsx", "utf8");

    expect(css).not.toContain("cursor: grab");
    expect(css).not.toContain("cursor: grabbing");
    expect(writeups).not.toContain("setPointerCapture");
    expect(writeups).not.toContain("onPointerDown");
    expect(writeups).not.toContain("is-dragging");
    expect(baseCss).toContain("-webkit-user-drag: none");
  });

  it("ramps the music volume smoothly to 50 percent over 2 seconds", () => {
    expect(MUSIC_DEFAULT_VOLUME).toBe(50);
    expect(MUSIC_FADE_MS).toBe(2000);
    expect(MUSIC_FADE_STEPS).toBeGreaterThanOrEqual(80);
  });

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
    expect(html).toContain("reels-soon");
    expect(html).toContain("work in progress");
    expect(html).toContain("soon");
    expect(html).not.toContain("drag-row");
    expect(html).not.toContain("drag-tile");
    expect(html).not.toContain("Open Instagram reel");
    expect(html).not.toContain("reels-more");
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
      "https://www.youtube.com/embed/abc123?list=PL4NWyqf4Mpp2gOfgZFhOc9W3P--QKoprV&start=93&enablejsapi=1&playsinline=1&controls=0&rel=0&modestbranding=1"
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
          embedUrl: "https://www.youtube.com/embed/abc123?playlist=PL4NWyqf4Mpp2gOfgZFhOc9W3P--QKoprV&start=42&enablejsapi=1&playsinline=1&controls=0&rel=0&modestbranding=1",
        }}
      />
    );

    expect(html).not.toContain("youtube.playlist()");
    expect(html).not.toContain("Lo-fi deploy window");
    expect(html).not.toContain("hiago playlist");
    expect(html).toContain("https://i.ytimg.com/vi/abc123/hqdefault.jpg");
    expect(html).toContain("music-cover");
    expect(html).not.toContain("music-cover is-playing");
    expect(html).toContain("music-center-button");
    expect(html).toContain("aria-label=\"Play music\"");
    expect(html).not.toContain("music-play-button");
    expect(html).not.toContain("music-volume-range");
    expect(html).not.toContain("music-eq");
    expect(html).not.toContain("aria-label=\"Music volume\"");
    expect(html).toContain("<iframe");
    expect(html).toContain("YouTube playlist player");
    expect(html).not.toContain("autoplay=1");
    expect(html).not.toContain("mute=1");
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
      id: "2026-ai-agentic-engineering-guide",
      title: "Skills Stack, MCP, and Project Context",
      meta: "Apr 2026",
      url: "https://dotmindblog.vercel.app/posts/2026/ai/agentic-engineering-guide/",
      summary: "A practical guide to building interoperable agents across any AI runtime.",
      date: "2026-04-02T00:00:00-03:00",
      author: "iceteash",
      tags: ["ai", "agents"],
    });
    expect(article.html).toContain('<h2 id="quick-setup"');
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
  });

  it("renders the selected social icon row in the topbar", () => {
    const html = renderToStaticMarkup(<MidfiV1 />);

    expect(html).toContain('title="github"');
    expect(html).toContain('title="linkedin"');
    expect(html).toContain('title="x"');
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
