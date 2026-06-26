const CSP = [
  "default-src 'self'",
  "script-src 'self' https://www.youtube.com https://vercel.live https://cloud.umami.is https://static.cloudflareinsights.com 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "frame-src 'self' https://www.youtube.com",
  "img-src 'self' https://*.ytimg.com https://i.ytimg.com https://vercel.live data: blob:",
  "connect-src 'self' https://api.github.com https://raw.githubusercontent.com https://sheets.googleapis.com https://oauth2.googleapis.com https://cloud.umami.is https://gateway.umami.is https://vercel.live",
  "font-src 'self' data:",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  devIndicators: false,
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
