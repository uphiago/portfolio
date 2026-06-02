import React from "react";
import { Ico } from "../icons";

export function TerminalHero({ setContactOpen }) {
  return (
    <div className="terminal hero-terminal" style={{gridColumn:"span 5", gridRow:"span 5"}}>
      <div className="tbar">
        <span className="prompt">$</span>
        <span>cat ~/about</span>
      </div>
      <div className="terminal-copy">
        <div className="accent">hiago felipe</div>
        <div>devops & platform engineer · são paulo · <span style={{color:"#ffb86c"}}>13y in production</span></div>
        <div className="terminal-gap" />
        <div>reliable platforms, automation, and deployment workflows.</div>
        <div>self-hosted ops, ci/cd, n8n, k8s, terraform, ai workflows.</div>
        <div className="terminal-gap" />
        <div>cloud · containers · internal tooling</div>
        <div className="terminal-small-gap" />
        <div>working async or onsite.<span className="cursor" /></div>
      </div>
      <div className="terminal-contact">
        <div>
          <div className="h-card">wanna talk?</div>
          <div className="meta">devops · platform engineer · consulting</div>
        </div>
        <button type="button" className="btn invert" onClick={() => setContactOpen(true)}>contact {Ico.arrow}</button>
      </div>
    </div>
  );
}
