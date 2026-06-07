import React from "react";
import { MusicPlayer } from "./MusicPlayer";

export function WriteupsCard({ ARTICLES, setOpenArticle, music }) {
  const handleArticleClick = (article) => {
    setOpenArticle(article);
  };

  return (
    <div className="card writing-card" style={{gridColumn:"span 12", gridRow:"span 5"}}>
      <div className="writing-head">
        <div>
          <span className="eyebrow">latest write-ups</span>
          <div className="h-card">Field notes for people running systems.</div>
        </div>
      </div>
      <div className="writing-body">
        <div className="wlist">
          {ARTICLES.map(a => {
            const rowContent = (
              <>
              <span className="idx">{a.id}</span>
              <div>
                <div className="ti">{a.title}</div>
              </div>
              <span className="arr">↗</span>
              </>
            );

            return (
              <div
                className="star-row"
                key={a.id}
                role="button"
                tabIndex={0}
                aria-label={`Open write-up: ${a.title}`}
                onClick={() => handleArticleClick(a)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpenArticle(a);
                  }
                }}
              >
                {rowContent}
              </div>
            );
          })}
        </div>
        <MusicPlayer music={music} />
      </div>
    </div>
  );
}
