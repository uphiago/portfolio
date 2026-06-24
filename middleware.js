import { NextResponse } from "next/server";

export function middleware(request) {
  const post = request.nextUrl.searchParams.get("post");
  if (post && post.endsWith(".md")) {
    const slug = post.replace(/\.md$/, "");
    if (!/^[\w-]+$/.test(slug)) return;
    return NextResponse.rewrite(new URL(`/md/${slug}`, request.url));
  }
}

export const config = {
  matcher: "/",
};
