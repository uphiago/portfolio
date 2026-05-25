import React from "react";
import { Ico } from "../icons";

export function RepoModal({ openRepo, setOpenRepo }) {
  if (!openRepo) return null;
  return (
    <div className="mfi-modal-bg" onClick={() => setOpenRepo(null)}>
      <div className="mfi-modal repo-modal" onClick={(e) => e.stopPropagation()}>
        <button className="x" onClick={() => setOpenRepo(null)} aria-label="close">×</button>
        <div className="repo-head">
          <div>
            <div className="mono" style={{fontSize: 11, color:"var(--m-ink-soft)", marginBottom: 4}}>$ github repo</div>
            <div className="repo-title">{openRepo.name}</div>
            <p className="body" style={{margin:"0"}}>{openRepo.description}</p>
          </div>
          <div className="repo-mark" aria-hidden="true" />
        </div>

        <div style={{margin:"0 0 14px"}}>
          <div className="row"><span className="k">version</span><span className="v">{openRepo.version}</span></div>
          <div className="row"><span className="k">status</span><span className="v">{openRepo.status}</span></div>
          <div className="row"><span className="k">stats</span><span className="v">{openRepo.stars} stars · {openRepo.growth} · {openRepo.issues}</span></div>
        </div>

        <div className="repo-tags">
          {openRepo.stack.map((tag) => <span key={tag}>{tag}</span>)}
        </div>

        <div className="repo-readme">
          <b>README preview</b>
          {openRepo.readme[0] && <div className="readme-title">{openRepo.readme[0]}</div>}
          {openRepo.readme.slice(1).map((line) => (
            <div className="readme-line" key={line}>{line}</div>
          ))}
        </div>

        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop: 16, gap: 12}}>
          <span className="meta">public repo data from GitHub API</span>
          <a className="btn dark" href={openRepo.url} target="_blank" rel="noreferrer">open github {Ico.arrow}</a>
        </div>
      </div>
    </div>
  );
}
