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
        For projects, consulting, or technical conversations, reach me on LinkedIn or email.
      </p>

      <div style={{margin:"0 0 16px"}}>
        <div className="row"><span className="k">role</span><span className="v">Sr. Systems Specialist &amp; DevOps</span></div>
        <div className="row"><span className="k">based</span><span className="v">São Paulo, Brasil</span></div>
        <div className="row">
          <span className="k">email</span>
          <span className="v">
            <button type="button" className="copy-email" onClick={copyEmail}>
              <span>{email}</span>
              {Ico.copy}
            </button>
            {emailCopied && <span className="copy-status">copied</span>}
          </span>
        </div>
        <div className="row">
          <span className="k">linkedin</span>
          <span className="v">
            <a className="contact-link" href="https://www.linkedin.com/in/uphiago" target="_blank" rel="noopener noreferrer">
              <span>linkedin.com/in/uphiago</span>
              {Ico.external}
            </a>
          </span>
        </div>
        <div className="row"><span className="k">response</span><span className="v">usually within 24h</span></div>
      </div>
    </BaseModal>
  );
}
