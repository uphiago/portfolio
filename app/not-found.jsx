import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      fontFamily: "var(--font-ibm)",
      color: "var(--m-ink-soft)",
      background: "var(--m-paper)",
      gap: 12,
    }}>
      <div style={{ fontSize: 48, fontFamily: "var(--font-mono)", color: "var(--m-ink)" }}>
        404
      </div>
      <div>not found</div>
      <Link href="/" style={{
        color: "var(--m-ink)",
        textDecoration: "underline",
        fontSize: 14,
      }}>
        go home
      </Link>
    </div>
  );
}
