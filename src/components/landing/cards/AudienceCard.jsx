import React from "react";

export function AudienceCard() {
  return (
    <div className="card" style={{gridColumn:"span 5", gridRow:"span 5", display:"flex", flexDirection:"column"}}>
      <div className="aud-head">
        <span className="eyebrow">◇ presence · 2026</span>
        <span className="meta">may 2026</span>
      </div>
      <div className="aud-top">
        <div className="aud-stat">
          <span className="v">12.4<span className="unit">k</span></span>
          <span className="k">audience · 6 nets</span>
          <span className="d">↑ +312 · 30d</span>
        </div>
        <div className="aud-stat">
          <span className="v">84<span className="unit">k</span></span>
          <span className="k">reach · 30d</span>
          <span className="d">↑ +28% mom</span>
        </div>
      </div>
      <div className="aud-sep">attending · next 3</div>
      <div className="ev-list">
        <div className="ev-row">
          <span className="date">12 nov</span>
          <span className="name">Web Summit Lisbon</span>
          <span className="ev-arr">↗</span>
        </div>
        <div className="ev-row">
          <span className="date">28 nov</span>
          <span className="name">Blockchain Rio</span>
          <span className="ev-arr">↗</span>
        </div>
        <div className="ev-row">
          <span className="date">05 dec</span>
          <span className="name">Tokenation SP</span>
          <span className="ev-arr">↗</span>
        </div>
      </div>
      <div className="aud-foot">
        <span>say hi at any of these</span>
        <span></span>
      </div>
    </div>
  );
}
