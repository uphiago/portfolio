import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const ibm = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata = {
  title: "Hiago | DevOps Engineer",
  description:
    "Portfolio for a DevOps engineer focused on reliable systems, automation, and infrastructure.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${ibm.variable} ${mono.variable}`}>
      <body>
        {children}
        {process.env.NODE_ENV === "production" && (
          <Script defer src="https://cloud.umami.is/script.js" data-website-id="cdcbf823-222c-42f4-90a0-7d31f2c592eb" strategy="afterInteractive" />
        )}
      </body>
    </html>
  );
}
