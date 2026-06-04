import React from "react";

export function WriteupsCard({ ARTICLES, setOpenArticle }) {
  const listRef = React.useRef(null);
  const dragRef = React.useRef({ active: false, captured: false, pointerId: null, startY: 0, startScrollTop: 0 });
  const draggedRef = React.useRef(false);
  const [isDragging, setIsDragging] = React.useState(false);

  const endDrag = (event) => {
    dragRef.current.active = false;
    dragRef.current.captured = false;
    setIsDragging(false);
    if (event?.currentTarget?.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    window.setTimeout(() => {
      draggedRef.current = false;
    }, 80);
  };

  const handlePointerDown = (event) => {
    if (event.button !== 0 || !listRef.current) return;
    dragRef.current = {
      active: true,
      captured: false,
      pointerId: event.pointerId,
      startY: event.clientY,
      startScrollTop: listRef.current.scrollTop,
    };
    draggedRef.current = false;
  };

  const handlePointerMove = (event) => {
    if (!dragRef.current.active || !listRef.current) return;
    const deltaY = event.clientY - dragRef.current.startY;
    if (Math.abs(deltaY) > 3) {
      draggedRef.current = true;
      if (!dragRef.current.captured) {
        dragRef.current.captured = true;
        setIsDragging(true);
        listRef.current.setPointerCapture?.(event.pointerId);
      }
      event.preventDefault();
      listRef.current.scrollTop = dragRef.current.startScrollTop - deltaY;
    }
  };

  const handleArticleClick = (article) => {
    if (draggedRef.current) return;
    setOpenArticle(article);
  };

  const [subscribed, setSubscribed] = React.useState(false);
  const handleSubscribe = (event) => {
    event.preventDefault();
    setSubscribed(true);
  };

  return (
    <div className="card writing-card" style={{gridColumn:"span 12", gridRow:"span 4"}}>
      <div className="writing-head">
        <div>
          <span className="eyebrow">latest write-ups</span>
          <div className="h-card">Field notes for people running systems.</div>
        </div>
      </div>
      <div className="writing-body">
        <div
          ref={listRef}
          className={`wlist${isDragging ? " is-dragging" : ""}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
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
        <div className="subscribe-panel">
          <div className="mono">field_notes.subscribe()</div>
          <div className="meta">{subscribed ? "thanks - you're on the list" : "useful notes, sometimes"}</div>
          <form className="nlinput" onSubmit={handleSubscribe}>
            <label htmlFor="nl-email" className="sr-only">Email address</label>
            <input id="nl-email" type="email" placeholder="your@email.com" required aria-label="Email address" />
            <button type="submit" className="btn dark">go</button>
          </form>
        </div>
      </div>
    </div>
  );
}
