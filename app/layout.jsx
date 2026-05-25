import "./globals.css";

export const metadata = {
  title: "Hiago | DevOps Engineer",
  description:
    "Portfolio for a DevOps engineer focused on reliable systems, automation, and infrastructure.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
