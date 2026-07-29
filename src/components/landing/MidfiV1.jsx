"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Ico } from "./icons";
import { ARTICLES } from "./data";
import { DEFAULT_MUSIC } from "./youtube";

import { TerminalHero, VideoCard, WriteupsCard } from "./cards";
import { ContactModal, ArticleModal } from "./modals";

export function MidfiV1({ articles = ARTICLES, music = DEFAULT_MUSIC }) {
  const [contactOpen, setContactOpen] = React.useState(false);
  const [openArticle, setOpenArticle] = React.useState(null);
  const searchParams = useSearchParams();
  const initialized = React.useRef(false);

  const handleOpenArticle = React.useCallback((article) => {
    setOpenArticle(article);
    window.history.replaceState({}, "", `?post=${article.id}`);
  }, []);

  const handleCloseArticle = React.useCallback(() => {
    setOpenArticle(null);
    window.history.replaceState({}, "", window.location.pathname);
  }, []);

  // Auto-open article from URL on first load
  React.useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const postId = searchParams.get("post");
    if (postId && articles.length > 0) {
      const article = articles.find(a => a.id === postId)
        || articles[/^\d+$/.test(postId) ? Number(postId) - 1 : -1];
      if (article) setOpenArticle(article);
    }
  }, [searchParams, articles]);

  return (
    <section data-screen-label="v1·midfi - Builder-led" className="mfi">
      <div className="mfi-shell">
        {/* BENTO */}
        <main className="mfi-grid">
          <TerminalHero setContactOpen={setContactOpen} />
          <VideoCard />
          <WriteupsCard ARTICLES={articles} setOpenArticle={handleOpenArticle} music={music} />
        </main>

        {/* FOOTER */}
        <footer className="footer">
          <span className="footer-left">
            <span>🇧🇷</span>
            <span className="footer-dot">·</span>
            <span>2026 hiago<span style={{color:"var(--m-ink-soft)"}}>.sh</span></span>
          </span>
          <div className="footer-right">
            <nav className="footer-socials" aria-label="Social links">
              <a className="social" title="github" aria-label="GitHub" href="https://github.com/uphiago/portfolio" target="_blank" rel="noopener noreferrer">{Ico.github}</a>
              <a className="social" title="linkedin" aria-label="LinkedIn" href="https://www.linkedin.com/in/uphiago" target="_blank" rel="noopener noreferrer">{Ico.linkedin}</a>
              <a className="social" title="x" aria-label="X (Twitter)" href="https://x.com/uphiago" target="_blank" rel="noopener noreferrer">{Ico.x}</a>
            </nav>
            <a href="https://cloud.umami.is/share/NatKsfXwWLsGotHM" target="_blank" rel="noreferrer" className="social footer-stats" title="View Analytics">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
            </a>
          </div>
        </footer>
      </div>

      {contactOpen && <ContactModal setContactOpen={setContactOpen} />}
      {openArticle && <ArticleModal openArticle={openArticle} setOpenArticle={handleCloseArticle} />}
    </section>
  );
}
