import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "hiago.sh — DevOps & Platform Engineer";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "0 80px",
          background: "#fbfaf6",
          color: "#0a0a0a",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            fontSize: 24,
            color: "#8c8a86",
            letterSpacing: "0.04em",
            marginBottom: 12,
          }}
        >
          hiago.sh
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: 16,
            lineHeight: 1.1,
          }}
        >
          hiago felipe
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#5a5854",
            lineHeight: 1.4,
          }}
        >
          DevOps &amp; Platform Engineer
        </div>
        <div
          style={{
            marginTop: 24,
            display: "flex",
            gap: 12,
            fontSize: 18,
            color: "#8c8a86",
          }}
        >
          infrastructure · automation · k8s · terraform · self-hosted
        </div>
      </div>
    ),
    { ...size },
  );
}
