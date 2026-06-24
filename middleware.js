import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;

  // Serve markdown for ?post=slug.md
  const post = searchParams.get("post");
  if (post && post.endsWith(".md")) {
    const slug = post.replace(/\.md$/, "");
    if (!/^[\w-]+$/.test(slug)) return;
    return NextResponse.rewrite(new URL(`/md/${slug}`, request.url));
  }

  // Rewrite favicon.ico to the SVG icon
  if (pathname === "/favicon.ico") {
    return NextResponse.rewrite(new URL("/icon.svg", request.url));
  }
}

export const config = {
  matcher: ["/", "/favicon.ico"],
};
