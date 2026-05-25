import React from "react";

export function WriteupsCard({ ARTICLES, setOpenArticle }) {
  return (
    <div className="card" style={{gridColumn:"span 7", gridRow:"span 4", display:"flex", flexDirection:"column"}}>
      <div style={{display:"flex", justifyContent:"space-between", marginBottom: 12, alignItems:"center", flexShrink: 0}}>
        <span className="eyebrow">⌘ latest write-ups</span>
        <span className="meta" style={{display:"inline-flex", alignItems:"center", gap: 6}}>
          {ARTICLES.length} articles
        </span>
      </div>
      <div className="wlist" style={{flex: 1, overflow: "hidden", paddingRight: 4}}>
        {ARTICLES.map(a => (
          <div className="star-row" key={a.id} onClick={() => setOpenArticle(a)}>
            <span className="idx">{a.id}</span>
            <div>
              <div className="ti">{a.title}</div>
              <div className="sub">{a.meta}</div>
            </div>
            <span className="arr">↗</span>
          </div>
        ))}
      </div>
    </div>
  );
}
