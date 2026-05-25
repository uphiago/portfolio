import React from "react";

export function NewsletterCard() {
  return (
    <div className="card dark newsletter-card" style={{gridColumn:"span 5", gridRow:"span 4", display:"flex", flexDirection:"column", justifyContent:"center", gap: 12}}>
      <div className="mono" style={{fontSize: 11, color:"#6dd49a"}}>$ subscribe --monthly</div>
      <div className="h-mono" style={{color:"#f1efe8", fontSize: 18}}>field_notes.subscribe()</div>
      <div className="nlinput" style={{marginTop: 4}}>
        <input type="email" placeholder="your@email.com" defaultValue="" />
        <button className="btn invert" style={{fontSize: 11, padding:"7px 14px"}}>./go</button>
      </div>
      <div className="meta" style={{color:"#777", marginTop: 2}}>3,200 readers · no spam, just notes</div>
    </div>
  );
}
