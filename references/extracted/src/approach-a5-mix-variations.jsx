// A5 Mix — 4 variations exploring HIERARCHY.
// Each one keeps the trio (terminal · write-ups · video) but changes which dominates.

const Sec5Header = ({ id, title, blurb, tags }) => (
  <div style={{display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom: 18}}>
    <div>
      <span className="approach-badge"><span className="dot" />{id}</span>
      <h2 className="h-lg" style={{margin:"10px 0 0"}}>{title}</h2>
      <p className="description">{blurb}</p>
    </div>
    <div className="tags">{tags.map(t => <Tag key={t}>{t}</Tag>)}</div>
  </div>
);

// Re-usable blocks ───────────────────────────────────────────────

const TerminalBlock = ({ compact, prompt = "~/portfolio" }) => (
  <Terminal
    prompt={prompt}
    lines={compact ? [
      { cmd: "whoami" },
      { out: "devops engineer · oss contributor" },
      { cmd: "ls projects" },
      { out: "tf-aws-landing-zone   k8s-recipes   opa-policies" },
      { cmd: "cat focus.md" },
      { out: "argo · canary policies · multi-tenant SaaS" },
    ] : [
      { cmd: "whoami" },
      { out: "devops engineer · cloud-native builder · oss contributor" },
      { comment: "shipping infra that doesn't wake me up at 3am" },
      { cmd: "ls --projects --recent" },
      { out: "tf-aws-landing-zone   k8s-recipes   opa-policies   write-ups" },
      { cmd: "cat focus.md" },
      { out: "argo rollouts · canary policies · multi-tenant SaaS" },
      { cmd: "echo 'open to interesting problems'" },
    ]}
  />
);

const StackCmd = ({ rows }) => (
  <div className="sk dark" style={{gridColumn:`span ${rows ? rows.col : 5}`, gridRow:`span ${rows ? rows.row : 2}`, padding: "14px 16px", fontFamily:"JetBrains Mono", fontSize: 12, color:"#d8d8d8"}}>
    <div style={{color:"#7ad9a1"}}>$ stack --list</div>
    <div style={{lineHeight: 1.7, marginTop: 6}}>
      cloud      → <span style={{color:"#f3f2ec"}}>aws · gcp</span><br/>
      iac        → <span style={{color:"#f3f2ec"}}>terraform · pulumi</span><br/>
      runtime    → <span style={{color:"#f3f2ec"}}>kubernetes · helm</span><br/>
      delivery   → <span style={{color:"#f3f2ec"}}>argo · github actions</span><br/>
      observ.    → <span style={{color:"#f3f2ec"}}>grafana · loki · tempo</span>
    </div>
  </div>
);

const VideoBandHorizontal = ({ colSpan, rowSpan }) => (
  <div className="sk dark" style={{gridColumn:`span ${colSpan}`, gridRow:`span ${rowSpan}`, padding: 0, display:"flex", overflow:"hidden", position:"relative"}}>
    <PlayPh dark label="latest talk" style={{flex: "0 0 38%", border:"none", borderRadius: 0}} />
    <div style={{flex: 1, padding: "14px 18px", display:"flex", flexDirection:"column", justifyContent:"center", gap: 8}}>
      <div style={{display:"flex", justifyContent:"space-between"}}>
        <span className="mono" style={{fontSize: 11, color:"#7ad9a1"}}>$ video --recent</span>
        <LiveDot />
      </div>
      <div className="h-md" style={{color:"#f3f2ec"}}>OSS contribution — KubeCon walkthrough</div>
      <div className="tiny" style={{color:"#bbb", fontFamily:"JetBrains Mono", fontSize: 11}}>YT · Shorts · live fridays · 12k subs</div>
      <ShortsStrip dark />
    </div>
  </div>
);

const VideoBandVertical = ({ colSpan, rowSpan }) => (
  <div className="sk dark" style={{gridColumn:`span ${colSpan}`, gridRow:`span ${rowSpan}`, padding: 0, display:"flex", flexDirection:"column", overflow:"hidden"}}>
    <div style={{padding: "12px 14px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
      <span className="mono" style={{fontSize: 11, color:"#7ad9a1"}}>$ video --recent</span>
      <LiveDot />
    </div>
    <PlayPh dark label="latest talk" style={{flex: 1, border:"none", borderRadius: 0, minHeight: 110}} />
    <div style={{padding: "12px 14px", color:"#f3f2ec"}}>
      <div className="h-sm" style={{color:"#f3f2ec", fontSize: 15, marginBottom: 8}}>OSS — KubeCon walkthrough</div>
      <ShortsStrip dark />
      <div className="tiny" style={{color:"#888", marginTop: 8, fontFamily:"JetBrains Mono", fontSize: 11}}>YT · Shorts · live fri</div>
    </div>
  </div>
);

const WriteUpsList = ({ colSpan, rowSpan, items }) => (
  <div className="sk sk-pad" style={{gridColumn:`span ${colSpan}`, gridRow:`span ${rowSpan}`}}>
    <div style={{display:"flex", justifyContent:"space-between", marginBottom: 10}}>
      <span className="label">⌘ latest write-ups</span>
      <a className="tiny mono">./archive →</a>
    </div>
    {items.map(([t,s]) => <StarRow key={t} title={t} sub={s} />)}
  </div>
);

const DEFAULT_WRITEUPS = [
  ["GitOps with Argo: the boring playbook", "9 min · jun 2024"],
  ["Multi-account landing zones, step by step", "11 min · may 2024"],
  ["Cheap observability that actually scales", "4 min · may 2024"],
  ["Choosing between EKS and ECS in 2024", "6 min · apr 2024"],
];

const FeaturedRepo = ({ colSpan, rowSpan }) => (
  <div className="sk sk-pad" style={{gridColumn:`span ${colSpan}`, gridRow:`span ${rowSpan}`}}>
    <div style={{display:"flex", justifyContent:"space-between", marginBottom: 8}}>
      <span className="label">◇ featured · trending</span>
      <span className="tiny mono">v2.4.0</span>
    </div>
    <div className="h-md mono" style={{marginBottom: 4}}>tf-aws-landing-zone</div>
    <div className="body" style={{marginBottom: 12}}>Multi-account baseline for AWS orgs.</div>
    <Sparkline />
    <div className="tiny" style={{marginTop: 8, fontFamily:"JetBrains Mono"}}>★ 127  +42 this month  ·  ⑂ 24</div>
  </div>
);

const StatusCard = ({ colSpan, rowSpan }) => (
  <div className="sk sk-pad" style={{gridColumn:`span ${colSpan}`, gridRow:`span ${rowSpan}`}}>
    <div className="label" style={{marginBottom: 8}}>● status</div>
    <div className="mono" style={{fontSize: 13, lineHeight: 1.95}}>
      <span style={{color:"#27a35a"}}>●</span> available · q3 ’24<br/>
      <span style={{color:"#27a35a"}}>●</span> shipping weekly<br/>
      <span style={{color:"#27a35a"}}>●</span> live every fri<br/>
      <span style={{color:"#999"}}>○</span> not on social much
    </div>
    <div className="tiny" style={{marginTop: 16, fontFamily:"JetBrains Mono", fontSize: 11, color:"var(--ink-faint)"}}>
      $ uptime → 8y 4m running
    </div>
  </div>
);

const NewsletterDark = ({ colSpan, rowSpan, compact }) => (
  <div className="sk dark" style={{gridColumn:`span ${colSpan}`, gridRow:`span ${rowSpan}`, padding: "16px 18px", display:"flex", flexDirection:"column", justifyContent:"center", gap: 10}}>
    <div className="mono" style={{fontSize: 11, color:"#7ad9a1"}}>$ subscribe --monthly</div>
    <div className="h-md mono" style={{color:"#f3f2ec"}}>field_notes.subscribe()</div>
    {!compact && <div className="tiny" style={{color:"#bbb"}}>One letter a month. Builds, lessons, repos worth bookmarking.</div>}
    <div style={{display:"flex", gap: 0, border:"1.4px solid #555", borderRadius: 999, padding: 4, alignItems:"center", background:"#1a1a1a", marginTop: 6}}>
      <div style={{flex:1, padding: "6px 12px", fontFamily:"JetBrains Mono", color:"#888", fontSize: 12}}>your@email.com</div>
      <button className="btn" style={{padding:"8px 16px", background:"#fafaf7", color:"#1a1a1a", border:"none", fontFamily:"JetBrains Mono", fontSize: 12}}>./go</button>
    </div>
  </div>
);

/* ═════════════════════════════════════════════════════════
   v1 — BUILDER-LED (the current A5)
   Terminal dominates the top-left. Video & writing supporting.
   ═════════════════════════════════════════════════════════ */
const A5v1 = ({ showGrid, showNotes }) => (
  <section data-screen-label="A5·v1 — Builder-led">
    <Sec5Header
      id="v1 · Builder-led"
      title={<>Terminal Mix <span className="hand" style={{color:"var(--ink-faint)", fontSize: 26}}>— builder dominant</span></>}
      blurb="Terminal owns the top-left. Video is a supporting band. Write-ups list anchors the bottom. Best when the work itself is the strongest signal."
      tags={["builder-led","mono-hero","balanced-trio"]}
    />
    <div className={"sk " + (showGrid ? "grid-bg" : "")} style={{ padding: 28, position:"relative" }}>
      <Topbar subtitle="$ whoami" />
      <div style={{display:"grid", gridTemplateColumns:"repeat(12, 1fr)", gridAutoRows: 72, gap: 14}}>

        <div style={{gridColumn:"span 7", gridRow:"span 5", display:"flex", flexDirection:"column", gap: 14}}>
          <TerminalBlock />
          <div className="sk sk-pad" style={{flex: 1, display:"flex", alignItems:"center", justifyContent:"space-between"}}>
            <div>
              <div className="h-md">Open to interesting problems.</div>
              <div className="tiny">Long-form essays · OSS · advisory engagements</div>
            </div>
            <a className="btn dark">$ contact me ↗</a>
          </div>
          {showNotes && <Note style={{left: 12, top: -22}}>terminal as the anchor</Note>}
        </div>

        <FeaturedRepo colSpan={5} rowSpan={3} />
        <StackCmd rows={{col: 5, row: 2}} />
        <VideoBandHorizontal colSpan={8} rowSpan={3} />
        <StatusCard colSpan={4} rowSpan={3} />
        <WriteUpsList colSpan={7} rowSpan={3} items={DEFAULT_WRITEUPS} />
        <NewsletterDark colSpan={5} rowSpan={3} />

      </div>
    </div>
    <WhyThis>
      Engineers visiting first see what you're working on (terminal output). Video and writing become evidence. Most "for builders by builder" feel.
    </WhyThis>
  </section>
);

/* ═════════════════════════════════════════════════════════
   v2 — BROADCASTER-LED
   Video hero. Big wide video band at top, terminal smaller.
   ═════════════════════════════════════════════════════════ */
const A5v2 = ({ showGrid, showNotes }) => (
  <section data-screen-label="A5·v2 — Broadcaster-led">
    <Sec5Header
      id="v2 · Broadcaster-led"
      title={<>Terminal Mix <span className="hand" style={{color:"var(--ink-faint)", fontSize: 26}}>— video dominant</span></>}
      blurb="Video gets the hero slot. Massive horizontal band sets the tone first. Terminal becomes a tech-credibility badge below. Best if your audience finds you through YT/Shorts."
      tags={["broadcaster-led","video-hero","cinematic"]}
    />
    <div className={"sk " + (showGrid ? "grid-bg" : "")} style={{ padding: 28, position:"relative" }}>
      <Topbar subtitle="$ whoami" />
      <div style={{display:"grid", gridTemplateColumns:"repeat(12, 1fr)", gridAutoRows: 72, gap: 14}}>

        {/* HERO VIDEO — 12 col, 6 rows */}
        <div className="sk dark" style={{gridColumn:"span 12", gridRow:"span 6", padding: 0, display:"flex", overflow:"hidden", position:"relative"}}>
          <PlayPh dark label="featured video / live" style={{flex: "0 0 55%", border:"none", borderRadius: 0, minHeight: 360}} />
          <div style={{flex: 1, padding: "32px 32px", display:"flex", flexDirection:"column", justifyContent:"center", gap: 14}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <span className="mono" style={{fontSize: 12, color:"#7ad9a1"}}>$ video --featured</span>
              <LiveDot />
            </div>
            <div style={{fontFamily:"Caveat", fontWeight: 700, fontSize: 56, lineHeight: 1.1, color:"#f3f2ec"}}>
              I build &amp; <span className="uline">broadcast</span><br/>cloud-native ops.
            </div>
            <div className="tiny" style={{color:"#bbb", fontFamily:"JetBrains Mono", fontSize: 12}}>YouTube · Shorts · live every fri · 12k subs · 200+ videos</div>
            <ShortsStrip dark />
            <div style={{display:"flex", gap: 10, marginTop: 10}}>
              <a className="btn" style={{background:"#fafaf7", color:"#1a1a1a", border:"none"}}>Watch latest ↗</a>
              <a className="btn" style={{background:"transparent", color:"#f3f2ec", borderColor:"#555"}}>Subscribe</a>
            </div>
          </div>
          {showNotes && <Note style={{left: 12, top: -22}}>video hero — first impression</Note>}
        </div>

        {/* Terminal (smaller) — 7 col, 4 rows */}
        <div style={{gridColumn:"span 7", gridRow:"span 4"}}>
          <TerminalBlock compact />
        </div>

        {/* Stack as cmd — 5 col, 2 rows */}
        <StackCmd rows={{col: 5, row: 2}} />

        {/* Status — 5 col, 2 rows */}
        <StatusCard colSpan={5} rowSpan={2} />

        {/* Featured repo — 5 col, 3 rows */}
        <FeaturedRepo colSpan={5} rowSpan={3} />

        {/* Write-ups list — 7 col, 3 rows */}
        <WriteUpsList colSpan={7} rowSpan={3} items={DEFAULT_WRITEUPS.slice(0, 3)} />

        {/* Newsletter — 12 col, 2 rows full width */}
        <NewsletterDark colSpan={12} rowSpan={2} compact />

      </div>
    </div>
    <WhyThis>
      Maximum scroll-stopping power. Video occupies the eye-grabbing top zone. Terminal and write-ups become depth proof — "this guy actually ships, not just posts."
    </WhyThis>
  </section>
);

/* ═════════════════════════════════════════════════════════
   v3 — WRITER-LED
   Write-ups & cornerstone essay dominate. Terminal is a badge.
   ═════════════════════════════════════════════════════════ */
const A5v3 = ({ showGrid, showNotes }) => (
  <section data-screen-label="A5·v3 — Writer-led">
    <Sec5Header
      id="v3 · Writer-led"
      title={<>Terminal Mix <span className="hand" style={{color:"var(--ink-faint)", fontSize: 26}}>— writing dominant</span></>}
      blurb="A cornerstone essay leads. Mini terminal as a tech-cred sidebar. Video is a card, not a band. Best when long-form is the strongest signal."
      tags={["writer-led","cornerstone-essay","depth-first"]}
    />
    <div className={"sk " + (showGrid ? "grid-bg" : "")} style={{ padding: 28, position:"relative" }}>
      <Topbar subtitle="$ whoami" />
      <div style={{display:"grid", gridTemplateColumns:"repeat(12, 1fr)", gridAutoRows: 72, gap: 14}}>

        {/* Cornerstone essay HERO — 8 col, 5 rows */}
        <div className="sk sk-pad-lg" style={{gridColumn:"span 8", gridRow:"span 5", display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
          <div>
            <div style={{display:"flex", justifyContent:"space-between", marginBottom: 14}}>
              <span className="label">★ cornerstone essay · issue 24</span>
              <span className="tiny">14 min · jun 2024</span>
            </div>
            <div className="h-xl" style={{lineHeight: 1.1}}>
              The DevOps playbook<br/>for <span className="uline">high-growth</span> startups.
            </div>
            <p className="body" style={{marginTop: 18, maxWidth: 560}}>
              Eight chapters on shipping resilient infrastructure without slowing the team down.
              The one essay people keep linking back to.
            </p>
          </div>
          <div style={{display:"flex", gap: 12, alignItems:"center"}}>
            <a className="btn dark">Read the essay ↗</a>
            <span className="tiny mono">$ cat playbook.md | less</span>
          </div>
          {showNotes && <Note style={{left: 12, top: -22}}>writing leads</Note>}
        </div>

        {/* Mini terminal badge — 4 col, 3 rows */}
        <div style={{gridColumn:"span 4", gridRow:"span 3"}}>
          <TerminalBlock compact prompt="~/who" />
        </div>

        {/* Status card — 4 col, 2 rows */}
        <StatusCard colSpan={4} rowSpan={2} />

        {/* Write-ups list (taller) — 6 col, 4 rows */}
        <WriteUpsList colSpan={6} rowSpan={4} items={[
          ["GitOps with Argo: the boring playbook", "9 min · jun 2024"],
          ["Multi-account landing zones, step by step", "11 min · may 2024"],
          ["Cheap observability that actually scales", "4 min · may 2024"],
          ["Choosing between EKS and ECS in 2024", "6 min · apr 2024"],
          ["The terraform module structure I always reach for", "7 min · mar 2024"],
          ["OPA policies for human readability", "5 min · feb 2024"],
        ]} />

        {/* Video card (vertical, smaller) — 3 col, 4 rows */}
        <VideoBandVertical colSpan={3} rowSpan={4} />

        {/* Featured repo — 3 col, 4 rows */}
        <FeaturedRepo colSpan={3} rowSpan={4} />

        {/* Newsletter — 12 col, 2 rows */}
        <NewsletterDark colSpan={12} rowSpan={2} compact />

      </div>
    </div>
    <WhyThis>
      Long-form depth signals expertise. The cornerstone essay is the "calling card" — people share that link. Terminal + repo + video become supporting evidence of being an actual practitioner.
    </WhyThis>
  </section>
);

/* ═════════════════════════════════════════════════════════
   v4 — SYMMETRIC SPLIT
   Terminal + Video share the top. Equal heroes. Most balanced.
   ═════════════════════════════════════════════════════════ */
const A5v4 = ({ showGrid, showNotes }) => (
  <section data-screen-label="A5·v4 — Symmetric Split">
    <Sec5Header
      id="v4 · Symmetric"
      title={<>Terminal Mix <span className="hand" style={{color:"var(--ink-faint)", fontSize: 26}}>— equal weight</span></>}
      blurb="Terminal and Video split the top 50/50. No single dominant identity — visitors choose which channel to enter through."
      tags={["symmetric","split-hero","balanced"]}
    />
    <div className={"sk " + (showGrid ? "grid-bg" : "")} style={{ padding: 28, position:"relative" }}>
      <Topbar subtitle="$ whoami" />
      <div style={{display:"grid", gridTemplateColumns:"repeat(12, 1fr)", gridAutoRows: 72, gap: 14}}>

        {/* Terminal LEFT — 6 col, 5 rows */}
        <div style={{gridColumn:"span 6", gridRow:"span 5", display:"flex", flexDirection:"column", gap: 14}}>
          <TerminalBlock />
          <div className="sk sk-pad" style={{flex: 1, display:"flex", alignItems:"center", justifyContent:"space-between"}}>
            <div className="h-sm">Open to interesting problems.</div>
            <a className="btn dark" style={{fontSize: 13, padding:"8px 14px"}}>$ contact ↗</a>
          </div>
        </div>

        {/* Video RIGHT — 6 col, 5 rows */}
        <div className="sk dark" style={{gridColumn:"span 6", gridRow:"span 5", padding: 0, display:"flex", flexDirection:"column", overflow:"hidden", position:"relative"}}>
          <div style={{padding: "14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <span className="mono" style={{fontSize: 12, color:"#7ad9a1"}}>$ video --recent</span>
            <LiveDot />
          </div>
          <PlayPh dark label="latest talk" style={{flex: 1, border:"none", borderRadius: 0, minHeight: 180}} />
          <div style={{padding: "14px 18px", color: "#f3f2ec"}}>
            <div className="h-md" style={{color:"#f3f2ec", marginBottom: 6}}>KubeCon walkthrough</div>
            <div className="tiny" style={{color:"#bbb", fontFamily:"JetBrains Mono", marginBottom: 10}}>YT · Shorts · live fri · 12k subs</div>
            <ShortsStrip dark />
          </div>
          {showNotes && <Note style={{right: 12, top: -22}}>two heroes, equal weight</Note>}
        </div>

        {/* Featured repo — 4 col, 3 rows */}
        <FeaturedRepo colSpan={4} rowSpan={3} />

        {/* Write-ups list — 4 col, 3 rows */}
        <WriteUpsList colSpan={4} rowSpan={3} items={DEFAULT_WRITEUPS} />

        {/* Stack as cmd — 4 col, 3 rows */}
        <div className="sk dark" style={{gridColumn:"span 4", gridRow:"span 3", padding: "14px 16px", fontFamily:"JetBrains Mono", fontSize: 12, color:"#d8d8d8"}}>
          <div style={{color:"#7ad9a1"}}>$ stack --list</div>
          <div style={{lineHeight: 1.85, marginTop: 6}}>
            cloud      → <span style={{color:"#f3f2ec"}}>aws · gcp</span><br/>
            iac        → <span style={{color:"#f3f2ec"}}>terraform · pulumi</span><br/>
            runtime    → <span style={{color:"#f3f2ec"}}>kubernetes · helm</span><br/>
            delivery   → <span style={{color:"#f3f2ec"}}>argo · github actions</span><br/>
            observ.    → <span style={{color:"#f3f2ec"}}>grafana · loki · tempo</span><br/>
            langs      → <span style={{color:"#f3f2ec"}}>go · python · ts</span>
          </div>
        </div>

        {/* Status — 4 col, 2 rows */}
        <StatusCard colSpan={4} rowSpan={2} />

        {/* Newsletter — 8 col, 2 rows */}
        <NewsletterDark colSpan={8} rowSpan={2} compact />

      </div>
    </div>
    <WhyThis>
      No hierarchy decision needed. Lets visitors self-select — engineers go to terminal, viewers go to video. Risk: nothing is "the headline", harder to remember.
    </WhyThis>
  </section>
);

window.A5v1 = A5v1;
window.A5v2 = A5v2;
window.A5v3 = A5v3;
window.A5v4 = A5v4;
