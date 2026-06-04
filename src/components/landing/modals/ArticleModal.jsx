import React from "react";
import { Ico } from "../icons";
import { BaseModal } from "./BaseModal";

export function ArticleModal({ openArticle, setOpenArticle }) {
  const [copied, setCopied] = React.useState(false);

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

  return (
    <BaseModal onClose={() => setOpenArticle(null)} modalBgClass="mfi-article-bg" modalClass="mfi-article" closeButtonClass="article-close" restoreFocusOnClose={false} label={openArticle.title}>
      <div className="ahead">
        <div className="crumb">write-ups · {openArticle.id}</div>
        <div className="ti">{openArticle.title}</div>
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
