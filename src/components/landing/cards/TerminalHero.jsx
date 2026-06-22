import React from "react";
import { Ico } from "../icons";

export function TerminalHero({ setContactOpen }) {
  return (
    <div className="terminal hero-terminal" style={{gridColumn:"span 12", gridRow:"span 5"}}>
      <div className="tbar">
        <span className="prompt">$</span>
        <span>cat ~/about</span>
      </div>
      <div className="terminal-copy">
        <div className="accent">hiago felipe</div>
        <div>devops & platform engineer · são paulo</div>
        <div className="terminal-gap" />
        <div>infrastructure, automation, ai workflows, and internal platforms.</div>
        <div>linux, self-hosted ops, ci/cd, k8s, terraform, n8n.</div>
        <div className="terminal-gap" />
        <div>cloud · containers · integrations<span className="cursor" /></div>
      </div>
      <div className="terminal-contact">
        <div>
          <div className="h-card">wanna talk?</div>
        </div>
        <button type="button" className="btn invert" onClick={() => setContactOpen(true)}>contact {Ico.arrow}</button>
      </div>
    </div>
  );
}
