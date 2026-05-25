import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MidfiV1 } from "@/src/components/landing/MidfiV1";

describe("MidfiV1", () => {
  it("renders the original mid-fi portfolio content inside Next", () => {
    const html = renderToStaticMarkup(<MidfiV1 />);

    expect(html).toContain("hiago");
    expect(html).toContain("hiago.sh");
    expect(html).toContain("n8n-workflows-library");
    expect(html).toContain("field_notes.subscribe()");
    expect(html).toContain("self-hosted ops");
  });
});
