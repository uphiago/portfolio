// Bento variations — builder/contributor focus, no faces or clients.
// Site is about projects, articles, repos, contributions.

const Topbar = ({ subtitle }) => (
  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: 24}}>
    <div style={{display:"flex", alignItems:"center", gap: 12}}>
      <LogoGlyph />
      <div>
        <div className="hand" style={{fontSize: 18, lineHeight: 1}}>[handle]</div>
        <div className="tiny">{subtitle}</div>
      </div>
    </div>
    <div style={{display:"flex", gap: 14, alignItems:"center"}}>
      <span className="tiny mono" style={{display:"flex", alignItems:"center", gap: 6}}>
        <span style={{width:6, height:6, borderRadius:"50%", background:"var(--accent)", display:"inline-block"}} />
        available · q3 ’24
      </span>
      <SocialIcons />
    </div>
  </div>
);

const SectionHeader = ({ id, title, blurb, tags }) => (
  <div style={{display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom: 18}}>
    <div>
      <span className="approach-badge"><span className="dot" />{id}</span>
      <h2 className="h-lg" style={{margin:"10px 0 0"}}>{title}</h2>
      <p className="description">{blurb}</p>
    </div>
    <div className="tags">{tags.map(t => <Tag key={t}>{t}</Tag>)}</div>
  </div>
);

const WhyThis = ({ children }) => (
  <div style={{marginTop: 16, display:"flex", gap:14, alignItems:"flex-start"}}>
    <Flag>WHY THIS</Flag>
    <p className="body" style={{margin:0, maxWidth: 720}}>{children}</p>
  </div>
);

// Strip of 4 vertical "shorts" thumbnails
const ShortsStrip = ({ dark }) => (
  <div style={{display:"flex", gap: 6}}>
    {[1,2,3,4].map(i => (
      <div key={i} style={{
        flex: 1, aspectRatio: "9/16", maxHeight: 70,
        background: dark ? "#222" : "#e8e6df",
        border: "1.2px dashed " + (dark ? "#555" : "#9a9a9a"),
        borderRadius: 6,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontFamily:"JetBrains Mono", fontSize: 9, color: dark ? "#888" : "#9a9a9a",
      }}>S{i}</div>
    ))}
  </div>
);

// Live indicator pill
const LiveDot = () => (
  <span className="tiny" style={{display:"flex", alignItems:"center", gap: 6, color:"var(--accent)", fontWeight: 700}}>
    <span style={{width:7, height:7, borderRadius:"50%", background:"var(--accent)", display:"inline-block", animation:"pulse 1.6s infinite"}} />
    LIVE
  </span>
);

/* ─────────────────────────────────────────────────────────
   A1 — BUILDER'S WORKSHOP
   Name+role hero, big hero project, repos, articles grid,
   recent commits feed. Stack as labels.
   ───────────────────────────────────────────────────────── */
const A1 = ({ showGrid, showNotes }) => (
  <section data-screen-label="A1 — Builder's Workshop">
    <SectionHeader
      id="A1"
      title={<>Builder's <span className="uline">Workshop</span></>}
      blurb="Hero is text + a big featured project. Below: repos, articles, recent commits feed. Pure builder mode."
      tags={["projects-first","commits-feed","no-faces"]}
    />
    <div className={"sk " + (showGrid ? "grid-bg" : "")} style={{ padding: 28, position:"relative" }}>
      <Topbar subtitle="builder · contributor · cloud-native" />
      <div style={{display:"grid", gridTemplateColumns:"repeat(12, 1fr)", gridAutoRows: 76, gap: 14, position:"relative"}}>

        {/* HERO text — 7 col, 4 rows */}
        <div className="sk sk-pad-lg" style={{gridColumn:"span 7", gridRow:"span 4", display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
          <div>
            <div className="label">— building infra in public —</div>
            <div className="h-xl" style={{marginTop: 12}}>
              I build, document &amp; share <span className="uline">cloud-native</span> infrastructure.
            </div>
            <p className="body" style={{marginTop: 16, maxWidth: 540}}>
              A workshop of open-source modules, write-ups and recommended reading for engineers
              shipping serious platforms.
            </p>
          </div>
          <div style={{display:"flex", gap: 10, marginTop: 18}}>
            <a className="btn dark">Browse projects ↗</a>
            <a className="btn">Read the notes</a>
          </div>
        </div>

        {/* Featured project — 5 col, 4 rows */}
        <div className="sk dark" style={{gridColumn:"span 5", gridRow:"span 4", padding: 0, position:"relative", display:"flex", flexDirection:"column"}}>
          <div style={{padding: "14px 18px 0", display:"flex", justifyContent:"space-between"}}>
            <span className="label" style={{color:"#999"}}>◇ featured build</span>
            <span className="tiny" style={{color:"#888"}}>active</span>
          </div>
          <Ph dark label="architecture diagram" style={{flex: 1, margin: 18, minHeight: 140}} />
          <div style={{padding: "0 18px 18px", color: "#f3f2ec"}}>
            <div className="h-md mono" style={{color:"#f3f2ec"}}>terraform-aws-landing-zone</div>
            <div className="body" style={{color:"#bbb", marginTop: 6}}>Reusable modules for multi-account AWS orgs. SCPs, baseline, audit.</div>
            <div className="tiny" style={{color:"#888", marginTop: 10}}>★ 127  ·  ⑂ 24  ·  MIT</div>
          </div>
          {showNotes && <Note style={{right: -8, top: -22}}>← project as hero, not face</Note>}
        </div>

        {/* Recent commits ticker — 7 col, 3 rows */}
        <div className="sk soft sk-pad" style={{gridColumn:"span 7", gridRow:"span 3"}}>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom: 12}}>
            <span className="label">◐ recent commits</span>
            <span className="tiny">live · last 7 days</span>
          </div>
          <div style={{fontFamily:"JetBrains Mono", fontSize: 12, lineHeight: 1.85}}>
            {[
              ["aa1c4f", "feat: add eks node-group autoscaler","tf-aws-landing-zone","2h"],
              ["7b2e90", "fix: cors on signed urls","s3-upload-helpers","1d"],
              ["3d99e2", "docs: write-up on opa policies","write-ups","3d"],
              ["18c4ab", "chore: bump terraform to 1.9","tf-modules","4d"],
              ["fe2210", "feat: argo rollouts canary","k8s-recipes","6d"],
            ].map(([sha, msg, repo, when]) => (
              <div key={sha} style={{display:"grid", gridTemplateColumns:"80px 1fr 180px 50px", gap: 14}}>
                <span style={{color: "var(--ink-faint)"}}>{sha}</span>
                <span>{msg}</span>
                <span style={{color:"var(--accent)"}}>{repo}</span>
                <span style={{color:"var(--ink-faint)", textAlign:"right"}}>{when}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stack — 5 col, 3 rows */}
        <div className="sk sk-pad" style={{gridColumn:"span 5", gridRow:"span 3"}}>
          <div className="label" style={{marginBottom: 10}}>≡ stack I build with</div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap: 10}}>
            {[
              ["cloud","AWS · GCP"],
              ["IaC","Terraform"],
              ["orchestration","K8s · Helm"],
              ["delivery","Argo · GH Actions"],
              ["observ.","Grafana · Loki"],
              ["langs","Go · Python · TS"],
            ].map(([k,v]) => (
              <div key={k} style={{padding: "10px 12px", border:"1.4px solid #1a1a1a", borderRadius: 10}}>
                <div className="tiny">{k}</div>
                <div className="mono" style={{fontSize: 12, marginTop: 2, fontWeight: 500}}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Article 1 */}
        <div className="sk sk-pad" style={{gridColumn:"span 4", gridRow:"span 3"}}>
          <div className="label" style={{marginBottom: 8}}>⌘ write-up · 6 min</div>
          <div className="h-md" style={{marginBottom: 8}}>Designing a landing zone for 50+ AWS accounts</div>
          <Lines count={2} widths={["w90","w60"]} />
          <a className="btn" style={{marginTop: 14}}>Read →</a>
        </div>

        {/* Article 2 */}
        <div className="sk sk-pad" style={{gridColumn:"span 4", gridRow:"span 3"}}>
          <div className="label" style={{marginBottom: 8}}>⌘ write-up · 9 min</div>
          <div className="h-md" style={{marginBottom: 8}}>GitOps with Argo: the boring playbook</div>
          <Lines count={2} widths={["w90","w70"]} />
          <a className="btn" style={{marginTop: 14}}>Read →</a>
        </div>

        {/* Video / Shorts / Live — 4 col, 3 rows (replaces article 3) */}
        <div className="sk dark" style={{gridColumn:"span 4", gridRow:"span 3", padding: 0, display:"flex", flexDirection:"column", overflow:"hidden"}}>
          <div style={{padding: "12px 14px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <span className="label" style={{color:"#999"}}>▶ watch — YT · Shorts · Live</span>
            <LiveDot />
          </div>
          <PlayPh dark label="featured video" style={{flex: 1, border:"none", borderRadius: 0, minHeight: 110}} />
          <div style={{padding: "10px 14px 12px"}}>
            <div className="h-sm" style={{color:"#f3f2ec", fontSize: 15, marginBottom: 8}}>Multi-account AWS, end to end</div>
            <ShortsStrip dark />
            <div className="tiny" style={{color:"#888", marginTop: 8, fontFamily:"JetBrains Mono", fontSize: 11}}>+ 14 shorts · live every fri</div>
          </div>
        </div>

        {/* Newsletter strip */}
        <div className="sk sk-pad" style={{gridColumn:"span 8", gridRow:"span 2", display:"flex", alignItems:"center", justifyContent:"space-between", gap: 22}}>
          <div>
            <div className="h-md" style={{marginBottom: 4}}>Monthly notes from the workshop.</div>
            <div className="tiny">Builds, lessons, repos worth bookmarking.</div>
          </div>
          <div style={{display:"flex", gap: 0, border:"1.6px solid #1a1a1a", borderRadius: 999, padding: 4, alignItems:"center", minWidth: 320}}>
            <div style={{flex:1, padding: "6px 12px", fontFamily:"Kalam", color:"#9a9a9a", fontSize: 13}}>your@email.com</div>
            <button className="btn dark" style={{padding:"8px 16px"}}>Subscribe</button>
          </div>
        </div>

        {/* Stats */}
        <div className="sk soft sk-pad" style={{gridColumn:"span 4", gridRow:"span 2", display:"grid", gridTemplateColumns:"1fr 1fr", gap: 8, alignContent:"center"}}>
          <Stat n="32" l="repos shipped" />
          <Stat n="1.4k" l="github stars" />
          <Stat n="48" l="write-ups" />
          <Stat n="8 yrs" l="building" />
        </div>

      </div>
    </div>
    <WhyThis>
      Builder identity comes from the work, not a portrait. The featured project block is the hero — every visit shows what you're actively shipping. Commits ticker proves you're still in the saddle.
    </WhyThis>
  </section>
);

/* ─────────────────────────────────────────────────────────
   A2 — READING ROOM
   Writing leads. Big featured essay, supporting tiles for
   recommended repos to read, bookmarks, tools.
   ───────────────────────────────────────────────────────── */
const A2 = ({ showGrid, showNotes }) => (
  <section data-screen-label="A2 — Reading Room">
    <SectionHeader
      id="A2"
      title={<>Reading <span className="uline">Room</span></>}
      blurb="Writing & curated reading lead. Repos and tools are bookmarks. Authority through what you publish and what you recommend."
      tags={["writing-first","curated","essays"]}
    />
    <div className={"sk " + (showGrid ? "grid-bg" : "")} style={{ padding: 28, position:"relative" }}>
      <Topbar subtitle="notes · essays · recommended reading" />
      <div style={{display:"grid", gridTemplateColumns:"repeat(12, 1fr)", gridAutoRows: 72, gap: 14}}>

        {/* HERO essay — 8 col, 5 rows */}
        <div className="sk sk-pad-lg" style={{gridColumn:"span 8", gridRow:"span 5", display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
          <div>
            <div style={{display:"flex", justifyContent:"space-between", marginBottom: 14}}>
              <span className="label">★ cornerstone essay · issue 24</span>
              <span className="tiny">14 min read · updated jun 2024</span>
            </div>
            <div className="h-xl" style={{lineHeight: 1.0}}>
              The DevOps playbook<br/>for <span className="uline">high-growth</span> startups.
            </div>
            <p className="body" style={{marginTop: 18, maxWidth: 560}}>
              Eight chapters on shipping resilient infrastructure without slowing the team down. The
              one essay people keep linking back to.
            </p>
          </div>
          <div style={{display:"flex", gap: 12, alignItems:"center"}}>
            <a className="btn dark">Read the essay ↗</a>
            <span className="tiny">also: <span className="hand" style={{fontSize: 16}}>part 2 dropped last week</span></span>
          </div>
          {showNotes && <Note style={{right: 18, top: 18}}>essay = the hero</Note>}
        </div>

        {/* Sidebar: about — 4 col, 2 rows */}
        <div className="sk soft sk-pad" style={{gridColumn:"span 4", gridRow:"span 2"}}>
          <div className="label" style={{marginBottom: 6}}>— who's writing —</div>
          <p className="hand" style={{fontSize: 22, lineHeight: 1.2, margin: 0}}>
            A DevOps engineer publishing field notes, build logs &amp; opinions from 8 years in cloud.
          </p>
        </div>

        {/* Watch — talks, longform, live — 4 col, 3 rows */}
        <div className="sk dark" style={{gridColumn:"span 4", gridRow:"span 3", padding: 0, display:"flex", flexDirection:"column", overflow:"hidden"}}>
          <div style={{padding: "12px 14px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <span className="label" style={{color:"#999"}}>▶ watch — talks · live</span>
            <LiveDot />
          </div>
          <PlayPh dark label="latest talk" style={{flex: 1, border:"none", borderRadius: 0, minHeight: 110}} />
          <div style={{padding: "10px 14px 12px"}}>
            <div className="h-sm" style={{color:"#f3f2ec", fontSize: 15, marginBottom: 8}}>The boring path to GitOps</div>
            <ShortsStrip dark />
            <div className="tiny" style={{color:"#888", marginTop: 8, fontFamily:"JetBrains Mono", fontSize: 11}}>YT · 12k subs · live fridays</div>
          </div>
        </div>

        {/* Latest write-ups — 6 col, 3 rows */}
        <div className="sk sk-pad" style={{gridColumn:"span 6", gridRow:"span 3"}}>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom: 10}}>
            <span className="label">⌘ latest write-ups</span>
            <a className="tiny">archive →</a>
          </div>
          {[
            ["GitOps with Argo: the boring playbook", "9 min · jun 2024"],
            ["Cheap observability that actually scales", "4 min · may 2024"],
            ["Multi-account landing zones, step by step", "11 min · may 2024"],
            ["Choosing between EKS and ECS in 2024", "6 min · apr 2024"],
          ].map(([t, s]) => <StarRow key={t} title={t} sub={s} />)}
        </div>

        {/* Recommended repos (curated) — 6 col, 3 rows */}
        <div className="sk sk-pad" style={{gridColumn:"span 6", gridRow:"span 3"}}>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom: 10}}>
            <span className="label">◐ repos worth your time</span>
            <span className="tiny">curated</span>
          </div>
          <StarRow title="terraform-aws-modules/*" sub="the modules I actually reach for" />
          <StarRow title="external-secrets/external-secrets" sub="secrets done right" />
          <StarRow title="argoproj/argo-rollouts" sub="canary deploys for k8s" />
          <StarRow title="open-policy-agent/conftest" sub="policy as code, simple" />
        </div>

        {/* Tools I use — 6 col, 2 rows */}
        <div className="sk sk-pad" style={{gridColumn:"span 6", gridRow:"span 2"}}>
          <div className="label" style={{marginBottom: 10}}>⚙ tools on my desk</div>
          <div className="tags">
            {["Terraform","K8s","Argo CD","Grafana","Loki","Tailscale","1Password","Neovim","Raycast","GH CLI"].map(t => <Tag key={t}>{t}</Tag>)}
          </div>
        </div>

        {/* Newsletter — 6 col, 2 rows */}
        <div className="sk dark sk-pad" style={{gridColumn:"span 6", gridRow:"span 2", display:"flex", flexDirection:"column", justifyContent:"center", gap: 10}}>
          <div className="label" style={{color:"#999"}}>✉ join the reading list</div>
          <div className="h-md" style={{color:"#f3f2ec"}}>One essay a month. Zero noise.</div>
          <div style={{display:"flex", gap: 0, border:"1.4px solid #555", borderRadius: 999, padding: 4, alignItems:"center", background:"#1a1a1a"}}>
            <div style={{flex:1, padding: "6px 12px", fontFamily:"Kalam", color:"#888", fontSize: 13}}>your@email.com</div>
            <button className="btn" style={{padding:"8px 16px", background:"#fafaf7", color:"#1a1a1a", border:"none"}}>Subscribe</button>
          </div>
        </div>

      </div>
    </div>
    <WhyThis>
      Authority through curation. The "repos worth your time" tile signals taste and saves the reader's time — both make people come back. Hero essay anchors the page; everything else is supporting evidence.
    </WhyThis>
  </section>
);

/* ─────────────────────────────────────────────────────────
   A3 — CONTRIBUTION HEATMAP
   Open source / contribution story. Heatmap as visual hero.
   List of repos contributed to, OSS stats, write-ups.
   ───────────────────────────────────────────────────────── */
const A3 = ({ showGrid, showNotes }) => (
  <section data-screen-label="A3 — Contribution Heatmap">
    <SectionHeader
      id="A3"
      title={<>Contribution <span className="uline">Heatmap</span></>}
      blurb="OSS contributor story. The heatmap is the portrait. Tiles list repos contributed to, write-ups, current focus."
      tags={["oss-contributor","data-led","github-native"]}
    />
    <div className={"sk " + (showGrid ? "grid-bg" : "")} style={{ padding: 28, position:"relative" }}>
      <Topbar subtitle="open-source contributor · cloud-native" />
      <div style={{display:"grid", gridTemplateColumns:"repeat(12, 1fr)", gridAutoRows: 70, gap: 14}}>

        {/* Heatmap hero — 12 col, 4 rows */}
        <div className="sk sk-pad-lg" style={{gridColumn:"span 12", gridRow:"span 4", display:"flex", flexDirection:"column", gap: 14, position:"relative"}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline"}}>
            <div>
              <div className="label" style={{marginBottom: 4}}>— 1,248 contributions in the last year —</div>
              <div className="h-lg">Open-source <span className="uline">in public</span>, every week.</div>
            </div>
            <div style={{display:"flex", gap: 36}}>
              <Stat n="1,248" l="contributions / year" />
              <Stat n="142" l="repos touched" />
              <Stat n="38" l="merged PRs in OSS" />
            </div>
          </div>
          <div style={{flex: 1, display:"flex", alignItems:"center"}}>
            <Heatmap cols={42} rows={7} />
          </div>
          <div style={{display:"flex", justifyContent:"space-between"}}>
            <span className="tiny">jul ’23</span><span className="tiny">oct</span><span className="tiny">jan</span><span className="tiny">apr</span><span className="tiny">jul ’24</span>
          </div>
          {showNotes && <Note style={{right: 18, top: 14}}>data IS the portrait</Note>}
        </div>

        {/* Top repos contributed to — 7 col, 5 rows */}
        <div className="sk sk-pad" style={{gridColumn:"span 7", gridRow:"span 5"}}>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom: 12}}>
            <span className="label">◐ where I send PRs</span>
            <a className="tiny">all activity →</a>
          </div>
          {[
            ["hashicorp/terraform-provider-aws", "12 merged · last in jul", "★ 9.7k"],
            ["argoproj/argo-cd", "7 merged · docs + bugfix", "★ 17k"],
            ["external-secrets/external-secrets", "4 merged · maintainer", "★ 4.2k"],
            ["kubernetes-sigs/kustomize", "3 merged · feature", "★ 11k"],
            ["open-policy-agent/conftest", "2 merged · plugin", "★ 2.8k"],
          ].map(([repo, sub, stars]) => (
            <div key={repo} style={{display:"grid", gridTemplateColumns: "1fr 100px", gap: 10, padding:"12px 0", borderBottom:"1px dashed #d6d4cc", alignItems:"center"}}>
              <div>
                <div className="mono" style={{fontSize: 13, fontWeight: 500}}>{repo}</div>
                <div className="tiny" style={{marginTop: 2}}>{sub}</div>
              </div>
              <div className="tiny" style={{textAlign:"right", fontFamily:"JetBrains Mono"}}>{stars}</div>
            </div>
          ))}
        </div>

        {/* Currently focused — 5 col, 2 rows */}
        <div className="sk dark sk-pad" style={{gridColumn:"span 5", gridRow:"span 2"}}>
          <div className="label" style={{color:"#999", marginBottom: 6}}>● currently focused on</div>
          <div className="h-md" style={{color:"#f3f2ec"}}>Argo Rollouts canary policies</div>
          <div className="body" style={{color:"#bbb", marginTop: 6}}>Drafting an RFC for traffic-split with OPA-driven safety checks.</div>
        </div>

        {/* My repos — 5 col, 3 rows */}
        <div className="sk sk-pad" style={{gridColumn:"span 5", gridRow:"span 3"}}>
          <div className="label" style={{marginBottom: 10}}>◇ my repos</div>
          <StarRow title="tf-aws-landing-zone" sub="★ 127 · multi-account baseline" />
          <StarRow title="k8s-recipes" sub="★ 84 · production-ready helm" />
          <StarRow title="opa-policies" sub="★ 41 · rego patterns" />
          <StarRow title="dotfiles" sub="★ 12 · neovim + tmux" />
        </div>

        {/* Latest talk / live — 8 col, 3 rows */}
        <div className="sk dark" style={{gridColumn:"span 8", gridRow:"span 3", padding: 0, display:"flex", overflow:"hidden"}}>
          <PlayPh dark label="latest talk" style={{flex: "0 0 38%", border:"none", borderRadius: 0}} />
          <div style={{flex: 1, padding: "14px 18px", display:"flex", flexDirection:"column", justifyContent:"center", gap: 8}}>
            <div style={{display:"flex", justifyContent:"space-between"}}>
              <span className="label" style={{color:"#999"}}>▶ on video</span>
              <LiveDot />
            </div>
            <div className="h-md" style={{color:"#f3f2ec"}}>OSS contribution — KubeCon walkthrough</div>
            <div className="tiny" style={{color:"#bbb"}}>YouTube · Shorts · live every fri · 12k subs</div>
            <ShortsStrip dark />
          </div>
        </div>

        {/* Sponsor / newsletter — 4 col, 2 rows */}
        <div className="sk sk-pad" style={{gridColumn:"span 4", gridRow:"span 2", display:"flex", flexDirection:"column", justifyContent:"center"}}>
          <div className="label" style={{marginBottom: 6}}>♥ support the work</div>
          <div className="h-sm">Sponsor on GitHub →</div>
          <div className="tiny" style={{marginTop: 6}}>Or just star a repo. Both help.</div>
        </div>

      </div>
    </div>
    <WhyThis>
      The heatmap is data-as-art and proves contribution without a face. Good if OSS contributions are your strongest authority signal — recruiters and maintainers recognize this shape immediately.
    </WhyThis>
  </section>
);

/* ─────────────────────────────────────────────────────────
   A4 — TERMINAL VIBES
   Dark + monospace heavy. Terminal block as hero,
   repos rendered as code, articles with mono headings.
   ───────────────────────────────────────────────────────── */
const A4 = ({ showGrid, showNotes }) => (
  <section data-screen-label="A4 — Terminal Vibes">
    <SectionHeader
      id="A4"
      title={<>Terminal <span className="uline">Vibes</span></>}
      blurb="Bento where the hero is a terminal session. Cards lean monospace; one dominant dark block. For the engineer who lives in a shell."
      tags={["tech-forward","mono","dark-accent"]}
    />
    <div className={"sk " + (showGrid ? "grid-bg" : "")} style={{ padding: 28, position:"relative" }}>
      <Topbar subtitle="$ whoami" />
      <div style={{display:"grid", gridTemplateColumns:"repeat(12, 1fr)", gridAutoRows: 72, gap: 14}}>

        {/* Terminal hero — 7 col, 5 rows */}
        <div style={{gridColumn:"span 7", gridRow:"span 5", display:"flex", flexDirection:"column", gap: 14}}>
          <Terminal
            prompt="~/portfolio"
            lines={[
              { cmd: "whoami" },
              { out: "devops engineer · cloud-native builder" },
              { comment: "building infra that doesn't wake me up at 3am" },
              { cmd: "ls --projects --recent" },
              { out: "tf-aws-landing-zone   k8s-recipes   opa-policies   write-ups" },
              { cmd: "cat focus.md" },
              { out: "argo rollouts · canary policies · multi-tenant SaaS" },
              { cmd: "echo 'open to interesting problems'" },
              { out: "" },
            ]}
          />
          <div className="sk sk-pad" style={{flex: 1, display:"flex", alignItems:"center", justifyContent:"space-between"}}>
            <div>
              <div className="h-md">Open to interesting problems.</div>
              <div className="tiny">Long-form essays · OSS · advisory engagements</div>
            </div>
            <a className="btn dark">$ contact me ↗</a>
          </div>
        </div>

        {/* Right column hero — featured repo card with sparkline — 5 col, 3 rows */}
        <div className="sk sk-pad" style={{gridColumn:"span 5", gridRow:"span 3"}}>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom: 8}}>
            <span className="label">◇ featured · trending</span>
            <span className="tiny mono">v2.4.0</span>
          </div>
          <div className="h-md mono" style={{marginBottom: 4}}>tf-aws-landing-zone</div>
          <div className="body" style={{marginBottom: 12}}>Multi-account baseline for AWS orgs.</div>
          <Sparkline />
          <div className="tiny" style={{marginTop: 8, fontFamily:"JetBrains Mono"}}>★ 127  +42 this month  ·  ⑂ 24</div>
        </div>

        {/* Stack as command output — 5 col, 2 rows */}
        <div className="sk dark" style={{gridColumn:"span 5", gridRow:"span 2", padding: "14px 16px", fontFamily:"JetBrains Mono", fontSize: 12, color:"#d8d8d8"}}>
          <div style={{color:"#7ad9a1"}}>$ stack --list</div>
          <div style={{lineHeight: 1.7, marginTop: 6}}>
            cloud      → <span style={{color:"#f3f2ec"}}>aws · gcp</span><br/>
            iac        → <span style={{color:"#f3f2ec"}}>terraform · pulumi</span><br/>
            runtime    → <span style={{color:"#f3f2ec"}}>kubernetes · helm</span><br/>
            delivery   → <span style={{color:"#f3f2ec"}}>argo · github actions</span><br/>
            observ.    → <span style={{color:"#f3f2ec"}}>grafana · loki · tempo</span>
          </div>
        </div>

        {/* Article 1 mono heading */}
        <div className="sk sk-pad" style={{gridColumn:"span 4", gridRow:"span 3"}}>
          <div className="label" style={{marginBottom: 6}}>⌘ post · 9 min</div>
          <div className="mono" style={{fontSize: 18, fontWeight: 600, marginBottom: 10}}>gitops_argo_playbook.md</div>
          <Lines count={2} widths={["w90","w70"]} />
          <a className="btn" style={{marginTop: 12}}>./read ↗</a>
        </div>

        {/* Article 2 */}
        <div className="sk sk-pad" style={{gridColumn:"span 4", gridRow:"span 3"}}>
          <div className="label" style={{marginBottom: 6}}>⌘ post · 6 min</div>
          <div className="mono" style={{fontSize: 18, fontWeight: 600, marginBottom: 10}}>landing_zone_50_accts.md</div>
          <Lines count={2} widths={["w90","w60"]} />
          <a className="btn" style={{marginTop: 12}}>./read ↗</a>
        </div>

        {/* Video tile — terminal-themed — 4 col, 3 rows */}
        <div className="sk dark" style={{gridColumn:"span 4", gridRow:"span 3", padding: 0, display:"flex", flexDirection:"column", overflow:"hidden"}}>
          <div style={{padding: "12px 14px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <span className="mono" style={{fontSize: 11, color:"#7ad9a1"}}>$ video --recent</span>
            <LiveDot />
          </div>
          <PlayPh dark label="livestream.mp4" style={{flex: 1, border:"none", borderRadius: 0, minHeight: 100}} />
          <div style={{padding: "10px 14px 12px", color: "#f3f2ec"}}>
            <div className="mono" style={{fontSize: 14, fontWeight: 600, marginBottom: 8}}>./watch/live</div>
            <ShortsStrip dark />
            <div className="mono" style={{fontSize: 10, color:"#888", marginTop: 8}}>YT · 14 shorts · fri 8pm</div>
          </div>
        </div>

        {/* uptime / status — 4 col, 2 rows */}
        <div className="sk sk-pad" style={{gridColumn:"span 4", gridRow:"span 2"}}>
          <div className="label" style={{marginBottom: 6}}>● status</div>
          <div className="mono" style={{fontSize: 13, lineHeight: 1.7}}>
            <span style={{color:"#27a35a"}}>●</span> available · q3 ’24<br/>
            <span style={{color:"#27a35a"}}>●</span> shipping weekly<br/>
            <span style={{color:"#999"}}>○</span> not on social much
          </div>
        </div>

        {/* Newsletter mono — 8 col, 2 rows */}
        <div className="sk dark" style={{gridColumn:"span 8", gridRow:"span 2", padding: "16px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", gap: 18}}>
          <div style={{color:"#f3f2ec"}}>
            <div className="mono" style={{fontSize: 12, color:"#7ad9a1"}}>$ subscribe --monthly</div>
            <div className="h-md mono" style={{color:"#f3f2ec", marginTop: 6}}>field_notes.subscribe()</div>
          </div>
          <div style={{display:"flex", gap: 0, border:"1.4px solid #555", borderRadius: 999, padding: 4, alignItems:"center", background:"#1a1a1a", minWidth: 320}}>
            <div style={{flex:1, padding: "6px 12px", fontFamily:"JetBrains Mono", color:"#888", fontSize: 12}}>your@email.com</div>
            <button className="btn" style={{padding:"8px 16px", background:"#fafaf7", color:"#1a1a1a", border:"none", fontFamily:"JetBrains Mono", fontSize: 12}}>./go</button>
          </div>
        </div>

      </div>
    </div>
    <WhyThis>
      The strongest "tech builder" signal. Terminal hero filters the audience — speaks directly to engineers, less to recruiters. Works if your readers are practitioners.
    </WhyThis>
  </section>
);

window.A1 = A1;
window.A2 = A2;
window.A3 = A3;
window.A4 = A4;

/* ─────────────────────────────────────────────────────────
   A5 — TERMINAL MIX
   A4 terminal base + A2 latest write-ups list + A3 on-video band.
   ───────────────────────────────────────────────────────── */
const A5 = ({ showGrid, showNotes }) => (
  <section data-screen-label="A5 — Terminal Mix">
    <SectionHeader
      id="A5"
      title={<>Terminal <span className="uline">Mix</span></>}
      blurb="Mash-up: terminal hero (A4) + curated write-ups list (A2) + horizontal video band (A3). Tech-forward, writing-rich, with video front-and-center."
      tags={["mash-up","terminal","video","writing"]}
    />
    <div className={"sk " + (showGrid ? "grid-bg" : "")} style={{ padding: 28, position:"relative" }}>
      <Topbar subtitle="$ whoami" />
      <div style={{display:"grid", gridTemplateColumns:"repeat(12, 1fr)", gridAutoRows: 72, gap: 14}}>

        {/* Terminal hero — 7 col, 5 rows */}
        <div style={{gridColumn:"span 7", gridRow:"span 5", display:"flex", flexDirection:"column", gap: 14}}>
          <Terminal
            prompt="~/portfolio"
            lines={[
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
          <div className="sk sk-pad" style={{flex: 1, display:"flex", alignItems:"center", justifyContent:"space-between"}}>
            <div>
              <div className="h-md">Open to interesting problems.</div>
              <div className="tiny">Long-form essays · OSS · advisory engagements</div>
            </div>
            <a className="btn dark">$ contact me ↗</a>
          </div>
          {showNotes && <Note style={{left: 12, top: -22}}>terminal hero (from A4)</Note>}
        </div>

        {/* Featured repo + sparkline — 5 col, 3 rows */}
        <div className="sk sk-pad" style={{gridColumn:"span 5", gridRow:"span 3"}}>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom: 8}}>
            <span className="label">◇ featured · trending</span>
            <span className="tiny mono">v2.4.0</span>
          </div>
          <div className="h-md mono" style={{marginBottom: 4}}>tf-aws-landing-zone</div>
          <div className="body" style={{marginBottom: 12}}>Multi-account baseline for AWS orgs.</div>
          <Sparkline />
          <div className="tiny" style={{marginTop: 8, fontFamily:"JetBrains Mono"}}>★ 127  +42 this month  ·  ⑂ 24</div>
        </div>

        {/* Stack as cmd output — 5 col, 2 rows */}
        <div className="sk dark" style={{gridColumn:"span 5", gridRow:"span 2", padding: "14px 16px", fontFamily:"JetBrains Mono", fontSize: 12, color:"#d8d8d8"}}>
          <div style={{color:"#7ad9a1"}}>$ stack --list</div>
          <div style={{lineHeight: 1.7, marginTop: 6}}>
            cloud      → <span style={{color:"#f3f2ec"}}>aws · gcp</span><br/>
            iac        → <span style={{color:"#f3f2ec"}}>terraform · pulumi</span><br/>
            runtime    → <span style={{color:"#f3f2ec"}}>kubernetes · helm</span><br/>
            delivery   → <span style={{color:"#f3f2ec"}}>argo · github actions</span><br/>
            observ.    → <span style={{color:"#f3f2ec"}}>grafana · loki · tempo</span>
          </div>
        </div>

        {/* ON VIDEO band — 8 col, 3 rows (from A3) */}
        <div className="sk dark" style={{gridColumn:"span 8", gridRow:"span 3", padding: 0, display:"flex", overflow:"hidden", position:"relative"}}>
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
          {showNotes && <Note style={{right: 12, top: -22}}>on-video band (from A3)</Note>}
        </div>

        {/* Status — 4 col, 3 rows */}
        <div className="sk sk-pad" style={{gridColumn:"span 4", gridRow:"span 3"}}>
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

        {/* Latest write-ups list — 7 col, 3 rows (from A2) */}
        <div className="sk sk-pad" style={{gridColumn:"span 7", gridRow:"span 3"}}>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom: 10}}>
            <span className="label">⌘ latest write-ups</span>
            <a className="tiny mono">./archive →</a>
          </div>
          <StarRow title="GitOps with Argo: the boring playbook" sub="9 min · jun 2024" />
          <StarRow title="Multi-account landing zones, step by step" sub="11 min · may 2024" />
          <StarRow title="Cheap observability that actually scales" sub="4 min · may 2024" />
          <StarRow title="Choosing between EKS and ECS in 2024" sub="6 min · apr 2024" />
          {showNotes && <Note style={{left: 12, top: -22}}>write-ups list (from A2)</Note>}
        </div>

        {/* Newsletter — 5 col, 3 rows (terminal style) */}
        <div className="sk dark" style={{gridColumn:"span 5", gridRow:"span 3", padding: "16px 18px", display:"flex", flexDirection:"column", justifyContent:"center", gap: 10}}>
          <div className="mono" style={{fontSize: 11, color:"#7ad9a1"}}>$ subscribe --monthly</div>
          <div className="h-md mono" style={{color:"#f3f2ec"}}>field_notes.subscribe()</div>
          <div className="tiny" style={{color:"#bbb"}}>One letter a month. Builds, lessons, repos worth bookmarking.</div>
          <div style={{display:"flex", gap: 0, border:"1.4px solid #555", borderRadius: 999, padding: 4, alignItems:"center", background:"#1a1a1a", marginTop: 6}}>
            <div style={{flex:1, padding: "6px 12px", fontFamily:"JetBrains Mono", color:"#888", fontSize: 12}}>your@email.com</div>
            <button className="btn" style={{padding:"8px 16px", background:"#fafaf7", color:"#1a1a1a", border:"none", fontFamily:"JetBrains Mono", fontSize: 12}}>./go</button>
          </div>
        </div>

      </div>
    </div>
    <WhyThis>
      Terminal hero filters for engineers. Writing list shows depth of opinion. Video band signals you ship across formats — shorts, longform, lives. Three identity axes (builder · writer · broadcaster) in one screen.
    </WhyThis>
  </section>
);

window.A5 = A5;
