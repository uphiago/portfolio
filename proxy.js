import { NextResponse } from "next/server";

const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#fbfaf6"/><text x="7" y="22" font-family="monospace" font-size="17" fill="#0a0a0a">h</text></svg>`;

export function proxy(request) {
  const { pathname, searchParams } = request.nextUrl;

  const post = searchParams.get("post");
  if (post && post.endsWith(".md")) {
    const slug = post.replace(/\.md$/, "");
    if (!/^[\w-]+$/.test(slug)) return;
    return NextResponse.rewrite(new URL(`/md/${slug}`, request.url));
  }

  if (pathname === "/favicon.ico") {
    return new NextResponse(FAVICON_SVG, {
      headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=31536000, immutable" },
    });
  }
}

export const config = {
  matcher: ["/", "/favicon.ico"],
};
