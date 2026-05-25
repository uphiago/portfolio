import React from "react";
import { Ico } from "../icons";

export function FeaturedRepoCard({ featuredRepo, setOpenRepo }) {
  if (!featuredRepo) return null;
  return (
    <div
      className="card repo-card"
      role="button"
      tabIndex={0}
      onClick={() => setOpenRepo(featuredRepo)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpenRepo(featuredRepo);
        }
      }}
      style={{gridColumn:"span 5", gridRow:"span 4", display:"flex", flexDirection:"column"}}
    >
      <div style={{display:"flex", justifyContent:"space-between", marginBottom: 10, alignItems:"center"}}>
        <span className="eyebrow">◇ github · i use this</span>
        <span className="meta">{featuredRepo.version}</span>
      </div>
      <div className="h-mono">{featuredRepo.name}</div>
      <p className="body" style={{margin:"4px 0 6px"}}>{featuredRepo.description}</p>
      <div className="repo-card-body">
        <div>
          <div className="repo-note">{featuredRepo.note}</div>
          <div className="repo-live">
            <div className="repo-live-item">
              <span className="k">stars</span>
              <span className="v">{featuredRepo.stars}</span>
            </div>
            <div className="repo-live-item">
              <span className="k">forks</span>
              <span className="v">{featuredRepo.forks || featuredRepo.growth?.replace(" forks", "")}</span>
            </div>
            <div className="repo-live-item">
              <span className="k">issues</span>
              <span className="v">{featuredRepo.issues?.replace(" issues", "") || "0"}</span>
            </div>
            <div className="repo-live-item">
              <span className="k">updated</span>
              <span className="v">{featuredRepo.updated?.replace(/^updated\s+/, "") || featuredRepo.status?.replace(/^updated\s+/, "")}</span>
            </div>
          </div>
        </div>
        <div className="repo-facts">
          <div className="repo-fact">
            <span className="k">language</span>
            <span className="v">{featuredRepo.language || "—"}</span>
          </div>
          <div className="repo-fact">
            <span className="k">visibility</span>
            <span className="v">{featuredRepo.visibility || "—"}</span>
          </div>
          <div className="repo-fact">
            <span className="k">license</span>
            <span className="v">{featuredRepo.license || "—"}</span>
          </div>
          <div className="repo-fact">
            <span className="k">branch</span>
            <span className="v">{featuredRepo.branch || "—"}</span>
          </div>
        </div>
      </div>
      <div className="meta" style={{marginTop: "auto", display:"flex", justifyContent:"space-between", paddingTop: 4}}>
        <span style={{display:"inline-flex", alignItems:"center", gap: 6}}>{featuredRepo.updated || featuredRepo.status}</span>
        <span style={{display:"inline-flex", alignItems:"center", gap: 6}}>open repo {Ico.arrow}</span>
      </div>
    </div>
  );
}
