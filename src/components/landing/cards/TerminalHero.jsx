import React from "react";
import { Ico } from "../icons";

export function TerminalHero({ setContactOpen }) {
  return (
    <div style={{gridColumn:"span 7", gridRow:"span 5", display:"flex", flexDirection:"column", gap: 16}}>
      <div className="terminal" style={{flex: 1}}>
        <div className="tbar" style={{marginBottom: 8, justifyContent: "flex-end"}}>
          <span className="tpath"></span>
        </div>
        <div><span className="prompt">$ </span>cat ~/about</div>
        <div style={{height: 18}} />
        <div className="accent">hiago felipe</div>
        <div>platform engineer · são paulo · <span style={{color:"#ffb86c"}}>13y</span></div>
        <div style={{height: 18}} />
        <div>i build infra that doesn't page you at 3am.</div>
        <div>deep in <span style={{color:"#a8e6a3"}}>n8n</span>, <span style={{color:"#a8e6a3"}}>mcp</span>, self-hosting everything.</div>
        <div>gov, esports, fintech — all production.<span className="cursor" /></div>
      </div>
      <div className="card hero-contact-card">
        <div>
          <div className="h-card">Open to interesting problems.</div>
          <div className="meta" style={{marginTop: 6}}>devops · platform engineer · consulting · remote &amp; onsite</div>
        </div>
        <a className="btn dark" onClick={() => setContactOpen(true)} style={{cursor:"pointer"}}>$ contact{" "}{Ico.arrow}</a>
      </div>
    </div>
  );
}
