import React from "react";
import { Ico } from "../icons";

export function ContactModal({ setContactOpen }) {
  return (
    <div className="mfi-modal-bg" onClick={() => setContactOpen(false)}>
      <div className="mfi-modal" onClick={(e) => e.stopPropagation()}>
        <button className="x" onClick={() => setContactOpen(false)} aria-label="close">×</button>
        <div className="mono" style={{fontSize: 11, color:"var(--m-ink-soft)", marginBottom: 4}}>$ contact</div>
        <div className="h-card" style={{fontSize: 22, marginBottom: 4}}>Let’s talk.</div>
        <p className="body" style={{margin:"0 0 18px"}}>
          Platform engineering, n8n automation, AI workflows, self-hosted ops, multi-cloud - or a 30-min chat.
        </p>

        <div style={{margin:"0 0 16px"}}>
          <div className="row"><span className="k">role</span><span className="v">DevOps · Platform Engineer · Consultant</span></div>
          <div className="row"><span className="k">based</span><span className="v">São Paulo, Brazil</span></div>
          <div className="row"><span className="k">timezone</span><span className="v">Brasília · UTC−3</span></div>
          <div className="row"><span className="k">response</span><span className="v">usually within 24h</span></div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setContactOpen(false); }}>
          <div style={{marginBottom: 12}}>
            <label htmlFor="mfi-email">email</label>
            <input id="mfi-email" type="email" placeholder="you@company.com" required />
          </div>
          <div style={{marginBottom: 14}}>
            <label htmlFor="mfi-msg">what are you building?</label>
            <textarea id="mfi-msg" placeholder="A line or two on the project — stack, scale, timing." />
          </div>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <span className="meta">or email <span style={{color:"var(--m-ink)"}}>hey@hiago.sh</span></span>
            <button type="submit" className="btn dark">./send {Ico.arrow}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
