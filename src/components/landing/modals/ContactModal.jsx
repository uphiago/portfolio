import React from "react";
import { Ico } from "../icons";
import { BaseModal } from "./BaseModal";

export function ContactModal({ setContactOpen }) {
  const [emailCopied, setEmailCopied] = React.useState(false);
  const email = "hfelipe.sh@gmail.com";

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
      window.setTimeout(() => setEmailCopied(false), 1400);
    } catch {
      setEmailCopied(false);
    }
  };

  return (
    <BaseModal onClose={() => setContactOpen(false)} label="Contact">
      <div className="mono" style={{fontSize: 11, color:"var(--m-ink-soft)", marginBottom: 4}}>$ contact</div>
      <div className="h-card" style={{fontSize: 22, marginBottom: 4}}>wanna talk?</div>
      <p className="body" style={{margin:"0 0 18px"}}>
        Platform work, automation, cloud infrastructure, n8n workflows, self-hosted ops. Or a focused 30-min chat.
      </p>

      <div style={{margin:"0 0 16px"}}>
        <div className="row"><span className="k">role</span><span className="v">DevOps & Platform Engineer</span></div>
        <div className="row"><span className="k">based</span><span className="v">São Paulo, Brazil</span></div>
        <div className="row">
          <span className="k">email</span>
          <span className="v">
            <button type="button" className="copy-email" onClick={copyEmail}>
              {email}
            </button>
            {emailCopied && <span className="copy-status">copied</span>}
          </span>
        </div>
        <div className="row">
          <span className="k">linkedin</span>
          <span className="v"><a href="https://www.linkedin.com/in/uphiago" target="_blank" rel="noopener noreferrer" style={{color:"var(--m-ink)", textDecoration:"underline"}}>linkedin.com/in/uphiago</a></span>
        </div>
        <div className="row"><span className="k">response</span><span className="v">usually within 24h</span></div>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <div style={{marginBottom: 12}}>
          <label htmlFor="mfi-email">email</label>
          <input id="mfi-email" type="email" placeholder="you@company.com" />
        </div>
        <div style={{marginBottom: 14}}>
          <label htmlFor="mfi-msg">what are you building?</label>
          <textarea id="mfi-msg" placeholder="A line or two on the project - stack, scale, timing." />
        </div>
        <div className="contact-actions">
          <button type="submit" className="btn dark">./send {Ico.arrow}</button>
        </div>
      </form>
    </BaseModal>
  );
}
