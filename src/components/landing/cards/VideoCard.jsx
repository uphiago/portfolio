import React from "react";

export function VideoCard({ VIDEOS, ytRowRef, shortsRowRef, scrollVideoRow, setOpenVideo }) {
  return (
    <div className="card dark flat video-card" style={{gridColumn:"span 7", gridRow:"span 4", display:"flex", flexDirection:"column"}}>
      <div style={{padding: "14px 18px 10px", display:"flex", justifyContent:"space-between", alignItems:"center", gap: 12, flexWrap:"wrap"}}>
        <div style={{display:"flex", gap: 14, alignItems:"center", whiteSpace:"nowrap"}}>
          <span className="mono" style={{fontSize: 11, color:"#6dd49a", whiteSpace:"nowrap"}}>$ video</span>
          <span className="meta" style={{color:"#909090", whiteSpace:"nowrap"}}>self-hosted ops · n8n · ai workflows</span>
        </div>
      </div>
      <div className="vbody">
        <div className="vsection">
          <div className="vlbl">
            <span>▶ youtube</span>
            <span>
              <span className="count">{VIDEOS.yt.length} of 48</span>
              <button type="button" className="more" onClick={() => scrollVideoRow(ytRowRef)} aria-label="Scroll YouTube videos down">↓</button>
            </span>
          </div>
          <div className="vrow yt" ref={ytRowRef}>
            {VIDEOS.yt.map(v => (
              <div className="vtile yt" key={v.id} onClick={() => setOpenVideo(v)}>
                <div className="vthumb-mini yt">
                  <img src={v.thumb} loading="lazy" alt="" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
                  <div className="vplay" style={{zIndex: 1}}>▶</div>
                  <span className="vts" style={{zIndex: 1}}>{v.duration}</span>
                </div>
                <div className="vinfo">
                  <div className="vtitle">{v.title}</div>
                  <div className="vmeta">{v.meta.split(" · ").slice(0, 2).join(" · ")}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="vsection">
          <div className="vlbl">
            <span>▶ shorts <span style={{color:"#555"}}>· 9:16</span></span>
            <span>
              <span className="count">{VIDEOS.shorts.length} of 28</span>
              <button type="button" className="more" onClick={() => scrollVideoRow(shortsRowRef)} aria-label="Scroll shorts down">↓</button>
            </span>
          </div>
          <div className="vrow short" ref={shortsRowRef}>
            {VIDEOS.shorts.map(v => (
              <div className="vtile short" key={v.id} onClick={() => setOpenVideo(v)}>
                <div className="vthumb-mini short">
                  <img src={v.thumb} loading="lazy" alt="" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
                  <div className="vplay" style={{zIndex: 1}}>▶</div>
                  <span className="vts" style={{zIndex: 1}}>{v.duration}</span>
                </div>
                <div className="vinfo">
                  <div className="vtitle">{v.title}</div>
                  <div className="vmeta">{v.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
