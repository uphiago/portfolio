import React from "react";
import { Ico } from "../icons";

export function VideoModal({ openVideo, setOpenVideo }) {
  if (!openVideo) return null;
  return (
    <div className="mfi-video-bg" onClick={() => setOpenVideo(null)}>
      <div className="mfi-video" onClick={(e) => e.stopPropagation()}>
        <div className={"vplayer " + (openVideo.id.startsWith("s") ? "short" : "yt")}>
          <img src={openVideo.thumb} loading="lazy" alt="" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0}} />
          <button className="vclose" style={{zIndex: 1}} onClick={() => setOpenVideo(null)} aria-label="close">×</button>
          <span className="vbadge" style={{zIndex: 1}}>{openVideo.id.startsWith("s") ? "SHORT · 9:16" : "▶ YOUTUBE"}</span>
          <button className="bigplay" aria-label="play">▶</button>
          <span className="vdur">{openVideo.duration}</span>
        </div>
        <div className="vinfo-block">
          <div className="vt">{openVideo.title}</div>
          <div className="vm">{openVideo.meta}</div>
          <p className="vdesc">{openVideo.desc}</p>
          <div className="vbtns">
            <a className="vbtn primary">▶ watch full {Ico.arrow}</a>
            <a className="vbtn">save</a>
            <a className="vbtn">share</a>
            <a className="vbtn">transcript</a>
          </div>
        </div>
      </div>
    </div>
  );
}
