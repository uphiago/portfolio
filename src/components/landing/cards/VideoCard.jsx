import React from "react";
import { Wrench } from "lucide-react";

export function VideoCard() {
  return (
    <div className="card dark flat video-card reels-card" style={{ gridColumn: "span 7", gridRow: "span 5" }}>
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
