import React from "react";
import { Ico } from "../icons";
import { MediaImage } from "../MediaImage";
import { BaseModal } from "./BaseModal";

export function VideoModal({ openVideo, setOpenVideo }) {
  if (!openVideo) return null;
  const isShort = openVideo.id.startsWith("s");
  const watchUrl = openVideo.url || null;

  return (
    <BaseModal onClose={() => setOpenVideo(null)} modalBgClass="mfi-video-bg" modalClass="mfi-video" hideCloseButton={true} label={openVideo.title}>
      <div className={"vplayer " + (isShort ? "short" : "yt")}>
        <MediaImage src={openVideo.thumb} className="vplayer-media" />
        <button type="button" className="vclose" style={{zIndex: 1}} onClick={() => setOpenVideo(null)} aria-label="close">×</button>
        <span className="vbadge" style={{zIndex: 1}}>{isShort ? "SHORT · 9:16" : "▶ YOUTUBE"}</span>
        {watchUrl ? (
          <a className="bigplay" href={watchUrl} target="_blank" rel="noopener noreferrer" aria-label={`Play: ${openVideo.title}`}>▶</a>
        ) : (
          <button type="button" className="bigplay" aria-label="play">▶</button>
        )}
        <span className="vdur">{openVideo.duration}</span>
      </div>
      <div className="vinfo-block">
        <div className="vt">{openVideo.title}</div>
        <div className="vm">{openVideo.meta}</div>
        <p className="vdesc">{openVideo.desc}</p>
        <div className="vbtns">
          {watchUrl ? (
            <a className="vbtn primary" href={watchUrl} target="_blank" rel="noopener noreferrer">▶ watch full {Ico.arrow}</a>
          ) : (
            <button type="button" className="vbtn primary">▶ watch full {Ico.arrow}</button>
          )}
          <button type="button" className="vbtn">save</button>
          <button type="button" className="vbtn">share</button>
          <button type="button" className="vbtn">transcript</button>
        </div>
      </div>
    </BaseModal>
  );
}
