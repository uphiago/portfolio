import { NextResponse } from "next/server";

const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#fbfaf6"/><text x="7" y="22" font-family="monospace" font-size="17" fill="#0a0a0a">h</text></svg>`;

const CSP = [
  "default-src 'self'",
  "script-src 'self' https://www.youtube.com https://vercel.live https://cloud.umami.is 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "frame-src 'self' https://www.youtube.com",
  "img-src 'self' https://*.ytimg.com https://i.ytimg.com https://vercel.live data: blob:",
  "connect-src 'self' https://api.github.com https://raw.githubusercontent.com https://sheets.googleapis.com https://oauth2.googleapis.com https://cloud.umami.is https://vercel.live",
  "font-src 'self' data:",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;

  // Serve markdown for ?post=slug.md
  const post = searchParams.get("post");
  if (post && post.endsWith(".md")) {
    const slug = post.replace(/\.md$/, "");
    if (!/^[\w-]+$/.test(slug)) return;
    return NextResponse.rewrite(new URL(`/md/${slug}`, request.url));
  }

  // Serve favicon SVG inline
  if (pathname === "/favicon.ico") {
    return new NextResponse(FAVICON_SVG, {
      headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=31536000, immutable" },
    });
  }

  // Apply security headers to all responses
  const response = NextResponse.next();
  SECURITY_HEADERS.forEach((h) => response.headers.set(h.key, h.value));
  return response;
}

export const config = {
  matcher: ["/", "/favicon.ico"],
};
