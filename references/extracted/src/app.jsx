// App shell — default: refined v1 Builder-led

const { useState, useEffect } = React;

const DEFAULTS = /*EDITMODE-BEGIN*/{
  "view": "midfi",
  "showGrid": false,
  "showNotes": false
}/*EDITMODE-END*/;

const VIEWS = [
  ["midfi", "v1 · mid-fi ★"],
  ["refined", "v1 · refined"],
  ["all-mix", "All 4 Mix"],
  ["v1", "v1 · Builder"],
  ["v2", "v2 · Broadcaster"],
  ["v3", "v3 · Writer"],
  ["v4", "v4 · Symmetric"],
  ["earlier", "Earlier A1–A4"],
  ["originals", "Originals B, C"],
];

const App = () => {
  const [t, setTweak] = useTweaks(DEFAULTS);
  const view = t.view;

  // Hide project topbar when viewing the polished midfi landing (single-page no-scroll)
  useEffect(() => {
    const topbar = document.querySelector(".topbar");
    if (topbar) topbar.style.display = (view === "midfi") ? "none" : "";
  }, [view]);

  useEffect(() => {
    const host = document.getElementById("nav-switcher");
    if (!host) return;
    if (!host._root) host._root = ReactDOM.createRoot(host);
    host._root.render(
      <div className="switcher">
        {VIEWS.map(([k, l]) => (
          <button
            key={k}
            className={view === k ? "active" : ""}
            onClick={() => setTweak("view", k)}
          >{l}</button>
        ))}
      </div>
    );
  }, [view]);

  const opts = { showGrid: t.showGrid, showNotes: t.showNotes };
  const showAllMix = view === "all-mix";

  return (
    <div className="frame" style={t.view === "midfi" ? {padding:"16px 24px"} : null}>
      {view === "midfi" && <div><MidfiV1 /></div>}
      {view === "refined" && <div style={{marginBottom: 24}}><RefinedV1 /></div>}

      {(showAllMix || view === "v1") && <div style={{marginBottom: 56}}><A5v1 {...opts} /></div>}
      {(showAllMix || view === "v2") && <div style={{marginBottom: 56}}><A5v2 {...opts} /></div>}
      {(showAllMix || view === "v3") && <div style={{marginBottom: 56}}><A5v3 {...opts} /></div>}
      {(showAllMix || view === "v4") && <div style={{marginBottom: 24}}><A5v4 {...opts} /></div>}

      {view === "earlier" && (
        <>
          <div style={{marginBottom: 56}}><A1 {...opts} /></div>
          <div style={{marginBottom: 56}}><A2 {...opts} /></div>
          <div style={{marginBottom: 56}}><A3 {...opts} /></div>
          <div style={{marginBottom: 24}}><A4 {...opts} /></div>
        </>
      )}

      {view === "originals" && (
        <>
          <div style={{marginBottom: 56}}><ApproachA density="comfortable" {...opts} /></div>
          <div style={{marginBottom: 56}}><ApproachB density="comfortable" {...opts} /></div>
          <div style={{marginBottom: 24}}><ApproachC density="comfortable" {...opts} /></div>
        </>
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection label="View">
          <TweakSelect
            label="Show"
            value={t.view}
            onChange={(v) => setTweak("view", v)}
            options={VIEWS.map(([value, label]) => ({ value, label }))}
          />
        </TweakSection>
        <TweakSection label="Sketchy mode">
          <TweakToggle
            label="Show grid"
            value={t.showGrid}
            onChange={(v) => setTweak("showGrid", v)}
          />
          <TweakToggle
            label="Annotations"
            value={t.showNotes}
            onChange={(v) => setTweak("showNotes", v)}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
