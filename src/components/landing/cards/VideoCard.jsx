import React from "react";
import { motion, useMotionValue, useMotionValueEvent, animate } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaImage } from "../MediaImage";

function InstagramMark({ size = 12 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      shapeRendering="geometricPrecision"
    >
      <rect x="3" y="3" width="18" height="18" rx="5.2" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.25" cy="6.75" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function VideoCard({ VIDEOS, setOpenVideo }) {
  const shorts = VIDEOS.shorts;
  const [dragged, setDragged] = React.useState(false);
  const containerRef = React.useRef(null);
  const rowRef = React.useRef(null);
  const x = useMotionValue(0);
  const [scrollX, setScrollX] = React.useState(0);
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [rowWidth, setRowWidth] = React.useState(0);

  React.useEffect(() => {
    const measure = () => {
      if (containerRef.current && rowRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
        setRowWidth(rowRef.current.scrollWidth);
      }
    };
    const handleResize = () => {
      measure();
      x.set(0);
    };
    measure();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [shorts, x]);

  useMotionValueEvent(x, "change", (latest) => {
    setScrollX(latest);
  });

  const END_GAP = 10;
  const maxDrag = Math.max(0, rowWidth - containerWidth + END_GAP);
  const canScrollLeft = scrollX < -2;
  const canScrollRight = scrollX > -maxDrag + 2;

  React.useEffect(() => {
    const current = x.get();
    const clamped = Math.max(-maxDrag, Math.min(0, current));
    if (current !== clamped) {
      x.set(clamped);
    }
  }, [maxDrag, x]);

  const scroll = (dir) => {
    const step = Math.min(520, Math.max(220, containerWidth * 0.72));
    const target = x.get() - dir * step;
    const clamped = Math.max(-maxDrag, Math.min(0, target));
    animate(x, clamped, { type: "spring", stiffness: 300, damping: 30 });
  };

  const handleClick = (e, v) => {
    if (dragged) {
      e.preventDefault();
      return;
    }
    if (!v.url) {
      e.preventDefault();
      setOpenVideo(v);
    }
  };

  const stageClassName = [
    "shorts-stage",
    canScrollLeft ? "edge-left" : "",
    canScrollRight ? "edge-right" : "",
  ].filter(Boolean).join(" ");

  return (
    <div className="card dark flat video-card reels-card" style={{ gridColumn: "span 7", gridRow: "span 5" }}>
      <div className="video-head">
        <span className="mono reels-title"><InstagramMark size={13} /> reels</span>
      </div>

      <div
        className={stageClassName}
        ref={containerRef}
      >
          {canScrollLeft && (
            <button
              type="button"
              className="video-nav left"
              onClick={() => scroll(-1)}
              aria-label="Previous reels"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
          )}
          {canScrollRight && (
            <button
              type="button"
              className="video-nav right"
              onClick={() => scroll(1)}
              aria-label="Next reels"
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          )}

        <motion.div
          ref={rowRef}
          className="drag-row"
          drag="x"
          dragConstraints={{ left: -maxDrag, right: 0 }}
          dragElastic={0.05}
          dragMomentum
          dragTransition={{ power: 0.22, timeConstant: 240 }}
          style={{ x }}
          onDragStart={() => setDragged(true)}
          onDragEnd={() => {
            const clamped = Math.max(-maxDrag, Math.min(0, x.get()));
            if (clamped !== x.get()) {
              animate(x, clamped, { type: "spring", stiffness: 320, damping: 34 });
            }
            window.setTimeout(() => setDragged(false), 80);
          }}
        >
          {shorts.map((v) => (
            <a
              className="drag-tile"
              key={v.id}
              href={v.url || "#"}
              target={v.url ? "_blank" : undefined}
              rel={v.url ? "noopener noreferrer" : undefined}
              draggable="false"
              aria-label={`Open Instagram reel: ${v.title}`}
              onClick={(e) => handleClick(e, v)}
            >
              <MediaImage src={v.thumb} className="drag-tile-thumb">
                <span className="vts">{v.duration}</span>
              </MediaImage>
              <div className="drag-tile-info">
                <div className="vtitle">{v.title}</div>
                <div className="drag-tile-desc">{v.desc}</div>
                <div className="reel-meta">{v.meta}</div>
                {(v.tags || []).length > 0 && (
                  <div className="short-tags">
                    {v.tags.slice(0, 3).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </a>
          ))}
          <a
            className="reels-more"
            href={VIDEOS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            draggable="false"
            aria-label="Open Instagram profile"
            onClick={(e) => dragged && e.preventDefault()}
          >
              <InstagramMark size={20} />
            <span>more on instagram</span>
          </a>
        </motion.div>
      </div>
    </div>
  );
}
