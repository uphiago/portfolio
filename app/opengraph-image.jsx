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
          alignItems: "center",
          justifyContent: "center",
          background: "#fbfaf6",
          color: "#0a0a0a",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            fontSize: 380,
            fontWeight: 600,
            letterSpacing: "-0.08em",
          }}
        >
          h
        </div>
      </div>
    ),
    { ...size },
  );
}
