// Shared sketchy parts for all wireframe approaches

const Lines = ({ count = 3, dark = false, widths }) => {
  const defaults = ["w90", "w80", "w60", "w70", "w90", "w40"];
  return (
    <div className={"lines" + (dark ? " dark" : "")}>
      {Array.from({ length: count }).map((_, i) => (
        <i key={i} className={(widths && widths[i]) || defaults[i % defaults.length]} />
      ))}
    </div>
  );
};

const Ph = ({ label = "image", dark = false, className = "", style }) => (
  <div className={"ph" + (dark ? " dark" : "") + " " + className} style={style}>
    {"[ " + label + " ]"}
  </div>
);

const Arrow = ({ children }) => (
  <span className="arr">↗</span>
);

const PlayPh = ({ dark = true, label = "video thumbnail", style }) => (
  <div className={"ph " + (dark ? "dark " : "") + "tall"} style={style}>
    <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:8}}>
      <div style={{
        width: 54, height: 54, borderRadius: "50%",
        border: "1.6px solid " + (dark ? "#bbb" : "#1a1a1a"),
        display:"flex", alignItems:"center", justifyContent:"center",
        fontFamily:"JetBrains Mono", fontSize: 18,
      }}>▶</div>
      <div style={{fontFamily:"JetBrains Mono", fontSize: 11, opacity: 0.7}}>{"[ " + label + " ]"}</div>
    </div>
  </div>
);

const AvatarPh = () => <div className="avatar" />;

const SocialIcons = () => (
  <div style={{display:"flex", gap: 10, alignItems:"center"}}>
    {["GH","in","IG","YT"].map(t => (
      <div key={t} style={{
        width: 28, height: 28, borderRadius: "50%",
        border: "1.4px solid #1a1a1a",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontFamily:"JetBrains Mono", fontSize: 10, fontWeight: 700,
      }}>{t}</div>
    ))}
  </div>
);

const Tag = ({ children }) => <span className="pill">{children}</span>;

const Flag = ({ children }) => <span className="flag">{children}</span>;

const Stat = ({ n, l }) => (
  <div className="stat">
    <div className="n">{n}</div>
    <div className="l">{l}</div>
  </div>
);

// Hand-drawn separator
const HandRule = ({ color = "#1a1a1a" }) => (
  <svg height="8" viewBox="0 0 400 8" preserveAspectRatio="none" style={{width:"100%", display:"block"}}>
    <path d="M2 4 Q 60 1 120 5 T 240 3 T 360 5 T 398 4" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
  </svg>
);

// Logo glyph placeholder
const LogoGlyph = () => (
  <div style={{
    width: 38, height: 38, border: "1.6px solid #1a1a1a", borderRadius: 8,
    display:"flex", alignItems:"center", justifyContent:"center",
    fontFamily:"Caveat", fontWeight: 700, fontSize: 22,
  }}>A</div>
);

// Annotation note (orange marker style)
const Note = ({ children, style }) => (
  <div className="note" style={style}>{children}</div>
);

// GitHub-style contribution heatmap
const Heatmap = ({ cols = 26, rows = 7, dark = false }) => {
  // Deterministic pseudo-random levels
  const seed = (i) => {
    const x = Math.sin(i * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  const cells = [];
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const v = seed(c * 7 + r);
      const level = v < 0.45 ? 0 : v < 0.7 ? 1 : v < 0.88 ? 2 : 3;
      cells.push(level);
    }
  }
  const shades = dark
    ? ["#1f1f1f", "#3a3a3a", "#6a6a6a", "#e7e7e7"]
    : ["#ececec", "#cfcfcf", "#8a8a8a", "#1a1a1a"];
  return (
    <svg width="100%" viewBox={`0 0 ${cols * 12} ${rows * 12}`} preserveAspectRatio="none" style={{display:"block"}}>
      {cells.map((lv, idx) => {
        const c = Math.floor(idx / rows), r = idx % rows;
        return <rect key={idx} x={c*12+1} y={r*12+1} width="10" height="10" rx="2" fill={shades[lv]} />;
      })}
    </svg>
  );
};

// Terminal block
const Terminal = ({ lines, prompt = "~/dev", dark = true }) => (
  <div style={{
    background: dark ? "#0e0e0e" : "#fafaf7",
    color: dark ? "#d8d8d8" : "#1a1a1a",
    border: "1.6px solid " + (dark ? "#0e0e0e" : "#1a1a1a"),
    borderRadius: 12,
    fontFamily: "JetBrains Mono",
    fontSize: 12,
    padding: "12px 14px",
    lineHeight: 1.6,
  }}>
    <div style={{display:"flex", gap: 6, marginBottom: 10, opacity: 0.6}}>
      <span style={{width: 8, height: 8, borderRadius:"50%", background:"#ff5b5b", display:"inline-block"}} />
      <span style={{width: 8, height: 8, borderRadius:"50%", background:"#ffbd2e", display:"inline-block"}} />
      <span style={{width: 8, height: 8, borderRadius:"50%", background:"#27c93f", display:"inline-block"}} />
      <span style={{marginLeft:"auto", fontSize: 10, opacity: 0.6}}>{prompt}</span>
    </div>
    {lines.map((l, i) => (
      <div key={i}>
        {l.cmd && <><span style={{color: dark ? "#7ad9a1" : "#1a7a3a"}}>$ </span>{l.cmd}</>}
        {l.out && <span style={{opacity: 0.7}}>{l.out}</span>}
        {l.comment && <span style={{color: dark ? "#888" : "#666"}}>{"# " + l.comment}</span>}
      </div>
    ))}
  </div>
);

// Sparkline (stars over time)
const Sparkline = ({ color = "#1a1a1a", dark = false }) => (
  <svg width="100%" height="36" viewBox="0 0 100 36" preserveAspectRatio="none">
    <polyline
      points="0,30 10,26 20,28 30,22 40,24 50,18 60,15 70,12 80,10 90,6 100,4"
      fill="none" stroke={color} strokeWidth="1.5"
    />
  </svg>
);

// Bookmark / starred item row
const StarRow = ({ title, sub, hand }) => (
  <div style={{display:"flex", gap: 10, alignItems:"flex-start", padding: "8px 0", borderBottom:"1px dashed #d6d4cc"}}>
    <span style={{fontFamily:"JetBrains Mono", color: "var(--ink-faint)", fontSize: 11, marginTop: 3}}>★</span>
    <div style={{flex: 1}}>
      <div className={hand ? "hand" : ""} style={hand ? {fontSize: 18, lineHeight: 1.2} : {fontFamily:"Kalam", fontWeight:700, fontSize: 14}}>{title}</div>
      {sub && <div className="tiny">{sub}</div>}
    </div>
    <span className="tiny">↗</span>
  </div>
);

Object.assign(window, { Lines, Ph, PlayPh, AvatarPh, SocialIcons, Tag, Flag, Stat, HandRule, LogoGlyph, Note, Arrow, Heatmap, Terminal, Sparkline, StarRow });
