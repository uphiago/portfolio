import React from "react";
import { Ico } from "../icons";
import { BaseModal } from "./BaseModal";

export function ArticleModal({ openArticle, setOpenArticle }) {
  if (!openArticle) return null;
  return (
    <BaseModal onClose={() => setOpenArticle(null)} modalBgClass="mfi-article-bg" modalClass="mfi-article" label={openArticle.title}>
      <div className="ahead">
        <div className="crumb">⌘ write-ups · {openArticle.id}</div>
        <div className="ti">{openArticle.title}</div>
        <div className="meta-row">
          <span>{openArticle.meta}</span>
          {openArticle.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}
        </div>
      </div>
      <div className="abody">
        {openArticle.body.map((block, i) => {
          if (block.t === "h") return <h3 key={i}>{block.v}</h3>;
          if (block.t === "p") return <p key={i}>{block.v}</p>;
          if (block.t === "code") return <pre key={i}>{block.v}</pre>;
          if (block.t === "ul") return <ul key={i}>{block.v.map((li, j) => <li key={j}>{li}</li>)}</ul>;
          return null;
        })}
      </div>
      <div className="afoot">
        <span>esc to close · ↑↓ to scroll</span>
        <span>share · copy link {Ico.arrow}</span>
      </div>
    </BaseModal>
  );
}
