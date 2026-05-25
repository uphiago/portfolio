"use client";

import React from "react";
import { Ico } from "./icons";
import { VIDEOS, FEATURED_REPO, mergeFeaturedRepo, ARTICLES } from "./data";

import { TerminalHero } from "./cards/TerminalHero";
import { AudienceCard } from "./cards/AudienceCard";
import { VideoCard } from "./cards/VideoCard";
import { FeaturedRepoCard } from "./cards/FeaturedRepoCard";
import { WriteupsCard } from "./cards/WriteupsCard";
import { NewsletterCard } from "./cards/NewsletterCard";

import { ContactModal } from "./modals/ContactModal";
import { RepoModal } from "./modals/RepoModal";
import { ArticleModal } from "./modals/ArticleModal";
import { VideoModal } from "./modals/VideoModal";

export function MidfiV1({ initialFeaturedRepo = null } = {}) {
  const [contactOpen, setContactOpen] = React.useState(false);
  const [openArticle, setOpenArticle] = React.useState(null);
  const [openVideo, setOpenVideo] = React.useState(null);
  const [openRepo, setOpenRepo] = React.useState(null);
  const [featuredRepo, setFeaturedRepo] = React.useState(() => mergeFeaturedRepo(initialFeaturedRepo || FEATURED_REPO));
  
  const ytRowRef = React.useRef(null);
  const shortsRowRef = React.useRef(null);
  const scrollVideoRow = (rowRef) => {
    const row = rowRef.current;
    if (!row) return;
    const amount = Math.max(120, row.clientHeight * 0.75);
    const max = row.scrollHeight - row.clientHeight;
    row.scrollTop = row.scrollTop >= max ? 0 : Math.min(max, row.scrollTop + amount);
  };

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenArticle(null);
        setContactOpen(false);
        setOpenVideo(null);
        setOpenRepo(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    const controller = new AbortController();

    fetch("/api/github/repo", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("GitHub repo API request failed");
        return response.json();
      })
      .then((repo) => setFeaturedRepo(mergeFeaturedRepo(repo)))
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <section data-screen-label="v1·midfi — Builder-led" className="mfi">
      <div className="mfi-shell">
        {/* TOPBAR */}
        <div className="mfi-topbar">
          <div style={{display:"flex", alignItems:"center", gap: 14}}>
            <div className="glyph">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#0a0a0a" strokeWidth="1.6" strokeLinejoin="round">
                <path d="M3 15 L 9 3 L 15 15 M 5.5 10.5 H 12.5"/>
              </svg>
            </div>
            <span className="brand">
              hiago<span className="dot-d">.sh</span>
            </span>
          </div>
          <div className="mfi-socials">
            <a className="social" title="github" href="#">{Ico.github}</a>
            <a className="social" title="linkedin" href="#">{Ico.linkedin}</a>
            <a className="social" title="x" href="#">{Ico.x}</a>
            <a className="social" title="youtube" href="#">{Ico.youtube}</a>
            <a className="social" title="tiktok" href="#">{Ico.tiktok}</a>
            <a className="social" title="instagram" href="#">{Ico.instagram}</a>
          </div>
        </div>

        {/* BENTO */}
        <div className="mfi-grid">
          <TerminalHero setContactOpen={setContactOpen} />
          <AudienceCard />
          <VideoCard 
            VIDEOS={VIDEOS} 
            ytRowRef={ytRowRef} 
            shortsRowRef={shortsRowRef} 
            scrollVideoRow={scrollVideoRow} 
            setOpenVideo={setOpenVideo} 
          />
          <FeaturedRepoCard featuredRepo={featuredRepo} setOpenRepo={setOpenRepo} />
          <WriteupsCard ARTICLES={ARTICLES} setOpenArticle={setOpenArticle} />
          <NewsletterCard />
        </div>

        {/* FOOTER */}
        <div className="footer">
          <span>
            2026 hiago<span style={{color:"var(--m-ink-soft)"}}>.sh</span> · self-hosted, deployed on a friday
          </span>
          <span style={{display: "flex", alignItems: "center", gap: 10}}>
            🇧🇷 SP · UTC−3 · hey@hiago.sh
            <a href="https://cloud.umami.is/share/NatKsfXwWLsGotHM" target="_blank" rel="noreferrer" className="social" style={{width: 16, height: 16, marginLeft: 2}} title="View Analytics">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
            </a>
          </span>
        </div>
      </div>

      {contactOpen && <ContactModal setContactOpen={setContactOpen} />}
      {openRepo && <RepoModal openRepo={openRepo} setOpenRepo={setOpenRepo} />}
      {openArticle && <ArticleModal openArticle={openArticle} setOpenArticle={setOpenArticle} />}
      {openVideo && <VideoModal openVideo={openVideo} setOpenVideo={setOpenVideo} />}
    </section>
  );
};
