import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MidfiV1 } from "@/src/components/landing/MidfiV1";

describe("MidfiV1", () => {
  it("renders the refined portfolio layout inside Next", () => {
    const html = renderToStaticMarkup(<MidfiV1 />);

    expect(html).toContain("hiago");
    expect(html).toContain("wanna talk?");
    expect(html).not.toContain("github · i use this");
    expect(html).not.toContain("repo-card");
    expect(html).toContain("latest write-ups");
    expect(html).toContain("field_notes.subscribe()");
    expect(html).toContain("self-hosted ops");
    expect(html).toContain("systems improved");
    expect(html).toContain("automations shipped");
    expect(html).toContain("platform notes");
    expect(html).toContain("operator-first");
    expect(html).not.toContain("attending");
    expect(html).toContain("reels");
    expect(html).toContain("drag-row");
    expect(html).toContain("drag-tile");
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

  it("renders the complete social icon row in the topbar", () => {
    const html = renderToStaticMarkup(<MidfiV1 />);

    expect(html).toContain('title="github"');
    expect(html).toContain('title="linkedin"');
    expect(html).toContain('title="x"');
    expect(html).toContain('title="youtube"');
    expect(html).toContain('title="tiktok"');
    expect(html).toContain('title="instagram"');
  });
});
