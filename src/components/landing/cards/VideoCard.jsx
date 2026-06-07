import React from "react";
import { Wrench } from "lucide-react";

function InstagramMark({ size = 12 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      shapeRendering="geometricPrecision"
    >
      <rect x="3" y="3" width="18" height="18" rx="5.2" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.25" cy="6.75" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function VideoCard() {
  return (
    <div className="card dark flat video-card reels-card" style={{ gridColumn: "span 7", gridRow: "span 5" }}>
      <div className="video-head">
        <span className="mono reels-title"><InstagramMark size={13} /> reels</span>
      </div>

      <div className="reels-soon">
        <div className="reels-soon-mark" aria-hidden="true">
          <Wrench size={18} strokeWidth={1.7} />
        </div>
        <div className="reels-soon-copy">
          <div className="reels-soon-title">soon</div>
          <div className="reels-soon-meta">work in progress</div>
        </div>
      </div>
    </div>
  );
}
