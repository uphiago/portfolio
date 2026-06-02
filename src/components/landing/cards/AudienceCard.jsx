import React from "react";

export function AudienceCard() {
  return (
    <div className="card audience-card" style={{gridColumn:"span 4", gridRow:"span 4"}}>
      <div className="aud-head">
        <span className="eyebrow">presence</span>
        <span className="meta">2026</span>
      </div>
      <div className="aud-top">
        <div className="aud-stat">
          <span className="v">12.4<span className="unit">k</span></span>
          <span className="k">audience</span>
        </div>
        <div className="aud-stat">
          <span className="v">84<span className="unit">k</span></span>
          <span className="k">reach</span>
        </div>
      </div>
      <div className="presence-list">
        <div className="presence-row">
          <span className="label">systems improved</span>
          <span className="value">42</span>
        </div>
        <div className="presence-row">
          <span className="label">automations shipped</span>
          <span className="value">180+</span>
        </div>
        <div className="presence-row">
          <span className="label">platform notes</span>
          <span className="value">weekly</span>
        </div>
      </div>
      <div className="presence-foot">operator-first infra, not vanity metrics</div>
    </div>
  );
}
