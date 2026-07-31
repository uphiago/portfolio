import React from "react";
import { DinoGame } from "./DinoGame";

export function VideoCard() {
  return (
    <div className="card dark flat video-card reels-card" style={{ gridColumn: "span 7", gridRow: "span 5" }}>
      <DinoGame />
    </div>
  );
}
