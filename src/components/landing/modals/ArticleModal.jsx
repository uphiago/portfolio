import React from "react";
import { Ico } from "../icons";
import { BaseModal } from "./BaseModal";

export function ArticleModal({ openArticle, setOpenArticle }) {
  const [copied, setCopied] = React.useState(false);
  const [copiedMd, setCopiedMd] = React.useState(false);

  if (!openArticle) return null;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(openArticle.url || window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  const copyMarkdown = async () => {
    try {
      if (openArticle.html) {
        const div = document.createElement("div");
        div.innerHTML = openArticle.html;
        const text = div.textContent || div.innerText || "";
        await navigator.clipboard.writeText(text);
      } else {
        const text = (openArticle.body || []).map(b => {
          if (b.t === "h") return `### ${b.v}`;
          if (b.t === "p") return b.v;
          if (b.t === "code") return b.v;
          if (b.t === "ul") return b.v.map(li => `- ${li}`).join("\n");
          return "";
        }).join("\n\n");
        await navigator.clipboard.writeText(text);
      }
      setCopiedMd(true);
      window.setTimeout(() => setCopiedMd(false), 1400);
    } catch {
      setCopiedMd(false);
    }
  };

  return (
    <BaseModal onClose={() => setOpenArticle(null)} modalBgClass="mfi-article-bg" modalClass="mfi-article" closeButtonClass="article-close" restoreFocusOnClose={false} label={openArticle.title}>
      <div className="ahead">
        <div className="crumb">write-ups · {openArticle.id}</div>
        <div className="ti">
          {openArticle.title}
          <button className="copy-title-btn" onClick={copyMarkdown} title="Copy article text" aria-label="Copy article text">
            {copiedMd ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            )}
          </button>
        </div>
        <div className="meta-row">
          <span>{openArticle.meta}</span>
          {openArticle.author && <span>@{openArticle.author}</span>}
          {(openArticle.tags || []).map(tag => <span className="tag" key={tag}>{tag}</span>)}
        </div>
      </div>
      <div className="abody">
        {openArticle.html ? (
          <div className="markdown-body" dangerouslySetInnerHTML={{ __html: openArticle.html }} />
        ) : (
          (openArticle.body || []).map((block, i) => {
            if (block.t === "h") return <h3 key={i}>{block.v}</h3>;
            if (block.t === "p") return <p key={i}>{block.v}</p>;
            if (block.t === "code") return <pre key={i}>{block.v}</pre>;
            if (block.t === "ul") return <ul key={i}>{block.v.map((li, j) => <li key={j}>{li}</li>)}</ul>;
            return null;
          })
        )}
      </div>
      <div className="afoot">
        <span>esc to close</span>
        <span className="article-actions">
          <button type="button" onClick={copyLink}>{copied ? "copied" : "copy link"}</button>
          {openArticle.url && (
            <a href={openArticle.url} target="_blank" rel="noopener noreferrer">original {Ico.arrow}</a>
          )}
        </span>
      </div>
    </BaseModal>
  );
}
