import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#fbfaf6",
          color: "#0a0a0a",
          fontFamily: "monospace",
        }}
      >
        <div style={{ fontSize: 48, fontWeight: 500 }}>
          hiago.sh
        </div>
        <div style={{ fontSize: 22, color: "#8c8a86", marginTop: 14 }}>
          Sr. Systems Specialist &amp; DevOps
        </div>
      </div>
    ),
    { ...size },
  );
}
