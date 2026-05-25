// Refined v1 — Builder-led
// JetBrains Mono + IBM Plex Sans · strict B&W · subtle red only on LIVE
// Hover lift on cards · ® branded handle · light first

const REFINED_CSS = `
  .rv1 {
    --r-ink: #0d0d0d;
    --r-ink-2: #2a2a2a;
    --r-ink-soft: #555;
    --r-ink-faint: #8a8a8a;
    --r-paper: #fafaf7;
    --r-paper-2: #f1efe9;
    --r-line: #e5e3dc;
    --r-rule: #0d0d0d;
    --r-live: #ec3a2d;
    font-family: "IBM Plex Sans", system-ui, sans-serif;
    color: var(--r-ink);
    -webkit-font-smoothing: antialiased;
  }
  .rv1 .mono { font-family: "JetBrains Mono", monospace; }
  .rv1 .card {
    background: var(--r-paper);
    border: 1px solid var(--r-rule);
    border-radius: 10px;
    padding: 22px;
    transition: transform .18s ease, box-shadow .18s ease;
    position: relative;
  }
  .rv1 .card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 0 -2px var(--r-rule);
  }
  .rv1 .card.dark {
    background: #0d0d0d;
    color: #f1efe9;
    border-color: #0d0d0d;
  }
  .rv1 .card.dark:hover {
    box-shadow: 0 8px 0 -2px #0d0d0d, 0 8px 0 -1px #f1efe9 inset;
  }
  .rv1 .card.flat { padding: 0; overflow: hidden; }

  .rv1 .eyebrow {
    font-family: "JetBrains Mono", monospace;
    font-size: 11px;
    letter-spacing: 0.04em;
    color: var(--r-ink-soft);
    text-transform: lowercase;
  }
  .rv1 .h-hero {
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 600;
    font-size: 44px;
    line-height: 1.05;
    letter-spacing: -0.02em;
    margin: 0;
  }
  .rv1 .h-card {
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 600;
    font-size: 20px;
    line-height: 1.2;
    letter-spacing: -0.01em;
    margin: 0;
  }
  .rv1 .h-mono {
    font-family: "JetBrains Mono", monospace;
    font-weight: 500;
    font-size: 17px;
    letter-spacing: -0.01em;
    margin: 0;
  }
  .rv1 .body {
    font-family: "IBM Plex Sans", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: var(--r-ink-soft);
  }
  .rv1 .meta {
    font-family: "JetBrains Mono", monospace;
    font-size: 11px;
    color: var(--r-ink-faint);
  }

  .rv1 .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 9px 16px;
    border: 1px solid var(--r-rule);
    border-radius: 999px;
    background: var(--r-paper);
    color: var(--r-ink);
    font-family: "JetBrains Mono", monospace;
    font-size: 12px;
    font-weight: 500;
    text-decoration: none;
    transition: background .15s ease, color .15s ease;
    cursor: pointer;
  }
  .rv1 .btn:hover { background: var(--r-ink); color: var(--r-paper); }
  .rv1 .btn.dark { background: var(--r-ink); color: var(--r-paper); }
  .rv1 .btn.dark:hover { background: var(--r-paper); color: var(--r-ink); }
  .rv1 .btn.ghost-on-dark { background: transparent; color: #f1efe9; border-color: #555; }
  .rv1 .btn.ghost-on-dark:hover { background: #f1efe9; color: #0d0d0d; }

  .rv1 .pill {
    display: inline-flex; align-items: center;
    padding: 3px 9px;
    border: 1px solid var(--r-rule);
    border-radius: 999px;
    font-family: "JetBrains Mono", monospace;
    font-size: 10px;
    font-weight: 500;
    color: var(--r-ink);
    background: transparent;
  }

  .rv1 .live {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: "JetBrains Mono", monospace;
    font-size: 10px;
    font-weight: 600;
    color: var(--r-live);
    letter-spacing: 0.05em;
  }
  .rv1 .live::before {
    content: ""; width: 6px; height: 6px; border-radius: 50%;
    background: var(--r-live);
    animation: pulse 1.6s infinite;
  }

  .rv1 .ph {
    background:
      repeating-linear-gradient(135deg, var(--r-line) 0 8px, var(--r-paper-2) 8px 16px);
    border: 1px dashed var(--r-ink-faint);
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    color: var(--r-ink-soft);
    font-family: "JetBrains Mono", monospace; font-size: 10px;
    letter-spacing: 0.04em;
  }
  .rv1 .ph.dark {
    background: repeating-linear-gradient(135deg, #1a1a1a 0 8px, #232323 8px 16px);
    color: #888; border-color: #555;
  }

  .rv1 .lines i {
    display: block; height: 7px; border-radius: 3px;
    background: var(--r-line);
    margin-bottom: 7px;
  }
  .rv1 .lines.dark i { background: #2a2a2a; }

  .rv1 .stat .n {
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 600; font-size: 28px; line-height: 1;
    letter-spacing: -0.02em;
  }
  .rv1 .stat .l { font-family: "JetBrains Mono", monospace; font-size: 10px; color: var(--r-ink-faint); margin-top: 4px; }

  .rv1 .terminal {
    background: #0d0d0d; color: #d8d8d8;
    border-radius: 10px;
    font-family: "JetBrains Mono", monospace;
    font-size: 12.5px;
    padding: 16px 18px;
    line-height: 1.7;
    border: 1px solid #0d0d0d;
  }
  .rv1 .terminal .tdot { width: 8px; height: 8px; border-radius: 50%; display:inline-block; margin-right: 4px; background:#444; }
  .rv1 .terminal .prompt { color: #7ad9a1; }
  .rv1 .terminal .out { color: #d8d8d8; }
  .rv1 .terminal .dim { color: #777; }
  .rv1 .terminal .accent { color: #f1efe9; font-weight: 500; }

  .rv1 .shorts { display: flex; gap: 6px; }
  .rv1 .shorts div {
    flex: 1; aspect-ratio: 9/16; max-height: 64px;
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 4px;
    display: flex; align-items: center; justify-content: center;
    font-family: "JetBrains Mono", monospace; font-size: 9px; color: #666;
  }

  .rv1 .star-row {
    display: grid; grid-template-columns: 14px 1fr auto;
    gap: 10px; align-items: baseline;
    padding: 11px 0;
    border-bottom: 1px solid var(--r-line);
    cursor: pointer;
    transition: padding-left .15s ease;
  }
  .rv1 .star-row:hover { padding-left: 4px; }
  .rv1 .star-row:last-child { border-bottom: none; }
  .rv1 .star-row .idx { font-family: "JetBrains Mono", monospace; font-size: 11px; color: var(--r-ink-faint); }
  .rv1 .star-row .ti { font-family: "IBM Plex Sans"; font-weight: 500; font-size: 14px; }
  .rv1 .star-row .sub { font-family: "JetBrains Mono"; font-size: 10px; color: var(--r-ink-faint); margin-top: 3px; }
  .rv1 .star-row .arr { font-family: "JetBrains Mono"; font-size: 11px; color: var(--r-ink-faint); }

  .rv1 .commit {
    display: grid; grid-template-columns: 64px 1fr 140px 36px;
    gap: 12px; font-family: "JetBrains Mono", monospace; font-size: 11px;
    padding: 5px 0;
  }
  .rv1 .commit .sha { color: var(--r-ink-faint); }
  .rv1 .commit .msg { color: var(--r-ink); }
  .rv1 .commit .repo { color: var(--r-ink-2); }
  .rv1 .commit .when { color: var(--r-ink-faint); text-align: right; }

  .rv1 .brand {
    display: inline-flex; align-items: baseline; gap: 4px;
    font-family: "JetBrains Mono", monospace;
    font-weight: 600;
    font-size: 16px;
    letter-spacing: -0.02em;
  }
  .rv1 .brand .reg { font-size: 9px; transform: translateY(-7px); color: var(--r-ink-soft); }

  .rv1 .social {
    display: inline-flex; align-items: center; justify-content: center;
    width: 28px; height: 28px; border-radius: 50%;
    border: 1px solid var(--r-rule);
    font-family: "JetBrains Mono", monospace; font-size: 9px; font-weight: 600;
    transition: background .15s ease, color .15s ease;
    cursor: pointer;
  }
  .rv1 .social:hover { background: var(--r-ink); color: var(--r-paper); }

  .rv1 .footer-rule {
    border-top: 1px solid var(--r-line);
    margin-top: 36px;
    padding-top: 20px;
    display: flex; justify-content: space-between; align-items: center;
    font-family: "JetBrains Mono", monospace; font-size: 11px; color: var(--r-ink-faint);
  }
`;

const RefinedV1 = () => {
  return (
    <section data-screen-label="v1·refined — Builder-led" className="rv1">
      <style>{REFINED_CSS}</style>

      <div style={{display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom: 18}}>
        <div>
          <span className="approach-badge"><span className="dot" />v1 · refined</span>
          <h2 className="h-lg" style={{margin:"10px 0 0"}}>Builder-led <span className="uline">tightened</span></h2>
          <p className="description">
            Wireframe refined: real type pairing (IBM Plex Sans + JetBrains Mono),
            strict B&amp;W (one signal red on LIVE only), hover-lift on cards, ® handle.
          </p>
        </div>
        <div className="tags">
          <Tag>v1 refined</Tag><Tag>mono-heavy</Tag><Tag>light-first</Tag>
        </div>
      </div>

      <div style={{background:"var(--r-paper)", border:"1px solid var(--r-rule)", borderRadius: 14, padding: 28}}>

        {/* TOPBAR ───────────────────────────────────── */}
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: 28}}>
          <div style={{display:"flex", alignItems:"center", gap: 14}}>
            <div style={{
              width: 34, height: 34, border:"1px solid var(--r-ink)", borderRadius: 6,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontFamily:"JetBrains Mono", fontWeight: 700, fontSize: 14,
            }}>A</div>
            <span className="brand">
              alex<span style={{color:"var(--r-ink-soft)"}}>.dev</span><span className="reg">®</span>
            </span>
          </div>
          <div style={{display:"flex", gap: 14, alignItems:"center"}}>
            <span className="live">AVAILABLE · Q3 ’24</span>
            <span style={{width:1, height: 14, background:"var(--r-line)"}} />
            <div style={{display:"flex", gap: 8}}>
              <span className="social">GH</span>
              <span className="social">in</span>
              <span className="social">YT</span>
              <span className="social">IG</span>
            </div>
          </div>
        </div>

        {/* BENTO GRID ─────────────────────────────── */}
        <div style={{display:"grid", gridTemplateColumns:"repeat(12, 1fr)", gridAutoRows: 76, gap: 14}}>

          {/* TERMINAL HERO — 7 col, 5 rows */}
          <div style={{gridColumn:"span 7", gridRow:"span 5", display:"flex", flexDirection:"column", gap: 14}}>
            <div className="terminal" style={{flex: 1}}>
              <div style={{display:"flex", marginBottom: 12, alignItems:"center"}}>
                <span className="tdot" style={{background:"#ff5b5b"}} />
                <span className="tdot" style={{background:"#ffbd2e"}} />
                <span className="tdot" style={{background:"#27c93f"}} />
                <span className="dim" style={{marginLeft:"auto", fontSize: 10}}>~/portfolio</span>
              </div>
              <div><span className="prompt">$ </span>whoami</div>
              <div className="out accent">devops engineer · cloud-native builder · oss contributor</div>
              <div className="dim"># shipping infra that doesn't wake me up at 3am</div>
              <div style={{marginTop: 6}}><span className="prompt">$ </span>ls --projects --recent</div>
              <div className="out">tf-aws-landing-zone  k8s-recipes  opa-policies  write-ups</div>
              <div style={{marginTop: 6}}><span className="prompt">$ </span>cat focus.md</div>
              <div className="out">argo rollouts · canary policies · multi-tenant SaaS</div>
              <div style={{marginTop: 6}}><span className="prompt">$ </span>echo 'open to interesting problems'</div>
              <div className="out"><span style={{background:"#d8d8d8", color:"#0d0d0d", padding:"0 2px"}}>_</span></div>
            </div>
            <div className="card" style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
              <div>
                <div className="h-card">Open to interesting problems.</div>
                <div className="meta" style={{marginTop: 6}}>essays · OSS · advisory engagements</div>
              </div>
              <a className="btn dark">$ contact ↗</a>
            </div>
          </div>

          {/* FEATURED REPO — 5 col, 3 rows */}
          <div className="card" style={{gridColumn:"span 5", gridRow:"span 3"}}>
            <div style={{display:"flex", justifyContent:"space-between", marginBottom: 12}}>
              <span className="eyebrow">◇ featured · trending</span>
              <span className="meta">v2.4.0</span>
            </div>
            <div className="h-mono" style={{marginBottom: 4}}>tf-aws-landing-zone</div>
            <p className="body" style={{margin:"6px 0 14px"}}>Multi-account baseline for AWS orgs. SCPs, audit, baseline modules.</p>
            <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none" style={{display:"block"}}>
              <polyline points="0,34 10,30 20,32 30,26 40,28 50,22 60,18 70,15 80,11 90,7 100,4" fill="none" stroke="#0d0d0d" strokeWidth="1.5"/>
            </svg>
            <div className="meta" style={{marginTop: 10, display:"flex", justifyContent:"space-between"}}>
              <span>★ 127  +42 this month</span>
              <span>⑂ 24</span>
            </div>
          </div>

          {/* STACK CMD — 5 col, 2 rows */}
          <div className="card dark" style={{gridColumn:"span 5", gridRow:"span 2", padding: "14px 16px", fontFamily:"JetBrains Mono", fontSize: 11.5, color:"#d8d8d8", lineHeight: 1.75}}>
            <div style={{color:"#7ad9a1"}}>$ stack --list</div>
            <div style={{marginTop: 4}}>
              <span style={{color:"#888"}}>cloud     →</span>  <span style={{color:"#f1efe9"}}>aws · gcp</span><br/>
              <span style={{color:"#888"}}>iac       →</span>  <span style={{color:"#f1efe9"}}>terraform · pulumi</span><br/>
              <span style={{color:"#888"}}>runtime   →</span>  <span style={{color:"#f1efe9"}}>kubernetes · helm</span><br/>
              <span style={{color:"#888"}}>delivery  →</span>  <span style={{color:"#f1efe9"}}>argo · github actions</span><br/>
              <span style={{color:"#888"}}>observ.   →</span>  <span style={{color:"#f1efe9"}}>grafana · loki · tempo</span>
            </div>
          </div>

          {/* VIDEO BAND — 8 col, 3 rows */}
          <div className="card dark flat" style={{gridColumn:"span 8", gridRow:"span 3", display:"flex"}}>
            <div className="ph dark" style={{flex: "0 0 38%", borderRadius: 0, border:"none", borderRight:"1px solid #2a2a2a", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap: 10, minHeight: 200}}>
              <div style={{
                width: 52, height: 52, borderRadius: "50%",
                border: "1px solid #888",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize: 16, color:"#bbb",
              }}>▶</div>
              <div style={{fontSize: 10}}>[ latest talk ]</div>
            </div>
            <div style={{flex: 1, padding: "20px 24px", display:"flex", flexDirection:"column", justifyContent:"space-between", gap: 12}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <span className="mono" style={{fontSize: 11, color:"#7ad9a1"}}>$ video --recent</span>
                <span className="live">LIVE</span>
              </div>
              <div>
                <div className="h-card" style={{color:"#f1efe9", fontSize: 22, marginBottom: 6}}>OSS contribution — KubeCon walkthrough</div>
                <div className="mono" style={{fontSize: 11, color:"#888"}}>YT · Shorts · live fridays · 12k subs · 200+ videos</div>
              </div>
              <div className="shorts">
                <div>S1</div><div>S2</div><div>S3</div><div>S4</div>
              </div>
            </div>
          </div>

          {/* STATUS — 4 col, 3 rows */}
          <div className="card" style={{gridColumn:"span 4", gridRow:"span 3"}}>
            <div className="eyebrow" style={{marginBottom: 12}}>● status</div>
            <div className="mono" style={{fontSize: 12, lineHeight: 2, color:"var(--r-ink)"}}>
              <span style={{color:"#27a35a"}}>●</span> available · q3 ’24<br/>
              <span style={{color:"#27a35a"}}>●</span> shipping weekly<br/>
              <span style={{color:"#27a35a"}}>●</span> live every fri<br/>
              <span style={{color:"#bbb"}}>○</span> not on social much
            </div>
            <div className="meta" style={{marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--r-line)"}}>
              $ uptime <span style={{color:"var(--r-ink-soft)"}}>→</span> 8y 4m running
            </div>
            <div className="meta" style={{marginTop: 4}}>
              $ contributions <span style={{color:"var(--r-ink-soft)"}}>→</span> 1,248 / yr
            </div>
          </div>

          {/* WRITE-UPS — 7 col, 3 rows */}
          <div className="card" style={{gridColumn:"span 7", gridRow:"span 3"}}>
            <div style={{display:"flex", justifyContent:"space-between", marginBottom: 12}}>
              <span className="eyebrow">⌘ latest write-ups</span>
              <a className="meta">./archive →</a>
            </div>
            {[
              ["01", "GitOps with Argo: the boring playbook", "9 min · jun 2024"],
              ["02", "Multi-account landing zones, step by step", "11 min · may 2024"],
              ["03", "Cheap observability that actually scales", "4 min · may 2024"],
              ["04", "Choosing between EKS and ECS in 2024", "6 min · apr 2024"],
            ].map(([n, t, s]) => (
              <div className="star-row" key={n}>
                <span className="idx">{n}</span>
                <div>
                  <div className="ti">{t}</div>
                  <div className="sub">{s}</div>
                </div>
                <span className="arr">↗</span>
              </div>
            ))}
          </div>

          {/* NEWSLETTER DARK — 5 col, 3 rows */}
          <div className="card dark" style={{gridColumn:"span 5", gridRow:"span 3", display:"flex", flexDirection:"column", justifyContent:"center", gap: 12}}>
            <div className="mono" style={{fontSize: 11, color:"#7ad9a1"}}>$ subscribe --monthly</div>
            <div className="h-mono" style={{color:"#f1efe9", fontSize: 18}}>field_notes.subscribe()</div>
            <p className="body" style={{color:"#bbb", margin: 0}}>One letter a month. Builds, lessons, repos worth bookmarking.</p>
            <div style={{display:"flex", gap: 6, border:"1px solid #333", borderRadius: 999, padding: 4, alignItems:"center", background:"#1a1a1a"}}>
              <div style={{flex:1, padding: "6px 14px", fontFamily:"JetBrains Mono", color:"#777", fontSize: 12}}>your@email.com</div>
              <button className="btn" style={{background:"#f1efe9", color:"#0d0d0d", border:"none", fontSize: 11, padding:"7px 14px"}}>./go</button>
            </div>
            <div className="meta" style={{color:"#666", marginTop: 4}}>3,200 readers · no noise</div>
          </div>

        </div>

        {/* FOOTER LINE ─────────────────────────────── */}
        <div className="footer-rule">
          <span>© 2024 alex<span style={{color:"var(--r-ink-soft)"}}>.dev</span><span style={{fontSize: 8, verticalAlign:"super"}}>®</span> · all rights reserved</span>
          <span>built in vim · deployed on a friday</span>
        </div>

      </div>

      <div style={{marginTop: 16, display:"flex", gap:14, alignItems:"flex-start"}}>
        <Flag>NEXT</Flag>
        <p className="body" style={{margin:0, maxWidth: 720, fontFamily:"IBM Plex Sans"}}>
          Wireframe with the type system &amp; tokens locked in. From here →
          mid-fi (real copy, refined sizing, micro-interactions), then hi-fi (real assets,
          subtle motion, content lock).
        </p>
      </div>
    </section>
  );
};

window.RefinedV1 = RefinedV1;
