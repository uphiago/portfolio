import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const ibm = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hiago.sh";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hiago | Sr. Systems Specialist &amp; DevOps",
    template: "%s | Hiago",
  },
  description:
    "Portfolio of Hiago Felipe — Sr. Systems Specialist & DevOps focused on infrastructure, automation, self-hosted ops, CI/CD, Kubernetes, and platform engineering.",
  applicationName: "hiago.sh",
  authors: [{ name: "Hiago Felipe", url: siteUrl }],
  creator: "Hiago Felipe",
  keywords: [
    "DevOps", "platform engineering", "automation", "Kubernetes",
    "Terraform", "CI/CD", "self-hosted", "n8n", "infrastructure",
  ],
  alternates: { canonical: "/" },
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "hiago.sh",
    title: "Hiago | Sr. Systems Specialist &amp; DevOps",
    description:
      "Reliable platforms, automation, and deployment workflows. Self-hosted ops, CI/CD, Kubernetes, Terraform, AI workflows.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hiago | Sr. Systems Specialist &amp; DevOps",
    description:
      "Reliable platforms, automation, and deployment workflows. Self-hosted ops, CI/CD, Kubernetes, Terraform, AI workflows.",
    creator: "@uphiago",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#fbfaf6",
  colorScheme: "light",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${ibm.variable} ${mono.variable}`}>
      <body>
        {children}
        {process.env.NODE_ENV === "production" && (
          <Script defer src="https://cloud.umami.is/script.js" data-website-id="cdcbf823-222c-42f4-90a0-7d31f2c592eb" strategy="afterInteractive" />
        )}
        <Analytics />
      </body>
    </html>
  );
}
