// APPROACH C — "Sticky Bio + Feed"
// Left sticky sidebar with bio/avatar/links/stats.
// Right column = chronological feed of mixed content cards.

const FeedItem = ({ kind, title, body, tags, dark, big }) => (
  <div className={"sk sk-pad " + (dark ? "dark" : "")} style={{display:"flex", flexDirection:"column", gap: 10}}>
    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
      <span className="label" style={dark ? {color:"#999"} : null}>{kind}</span>
      <span className="tiny" style={dark ? {color:"#888"} : null}>{big ? "pinned" : "2 weeks ago"}</span>
    </div>
    {big && <Ph dark={dark} label={dark ? "dark hero" : "preview"} className="tall" />}
    <div className="h-md" style={dark ? {color:"#f3f2ec"} : null}>{title}</div>
    {body && <Lines count={2} dark={dark} widths={["w90","w60"]} />}
    {tags && <div className="tags" style={{marginTop: 4}}>{tags.map(t => <Tag key={t}>{t}</Tag>)}</div>}
    <a className="tiny" style={Object.assign({marginTop: 4}, dark ? {color:"#bbb"} : {})}>{body || ""} read more ↗</a>
  </div>
);

const ApproachC = ({ density, showGrid, showNotes }) => {
  return (
    <section data-screen-label="C — Sticky Bio + Feed">
      <div style={{display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom: 18}}>
        <div>
          <span className="approach-badge"><span className="dot" />Approach C</span>
          <h2 className="h-lg" style={{margin:"10px 0 0"}}>Sticky Bio + <span className="uline">Feed</span></h2>
          <p className="description">
            Identity stays pinned on the left while a chronological feed scrolls on the right —
            articles, projects, repos, talks, posts all mixed. Feels alive, like a personal channel.
          </p>
        </div>
        <div className="tags">
          <Tag>build-in-public</Tag><Tag>scrolling-feed</Tag><Tag>recurring-visits</Tag>
        </div>
      </div>

      <div className={"sk " + (showGrid ? "grid-bg" : "")} style={{ padding: 0, position:"relative", overflow:"hidden" }}>
        <div style={{display:"grid", gridTemplateColumns:"360px 1fr", minHeight: 760}}>

          {/* LEFT — sticky bio */}
          <aside style={{borderRight:"1.6px solid #1a1a1a", padding: 32, display:"flex", flexDirection:"column", gap: 24, background:"var(--paper)"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <LogoGlyph />
              <span className="tiny">v3.2 · 2024</span>
            </div>

            <div>
              <div style={{width: 120, height: 120, borderRadius: "50%", border:"1.8px solid #1a1a1a",
                background: "repeating-linear-gradient(135deg, #e8e6df 0 8px, #f3f2ec 8px 16px)"}} />
              <div className="hand" style={{fontSize: 16, color:"var(--ink-soft)", marginTop: 14}}>hi, I'm</div>
              <div className="h-lg" style={{margin: "2px 0 6px"}}>[your name]</div>
              <div className="hand" style={{fontSize: 22, color:"var(--accent)"}}>DevOps engineer</div>
              <p className="body" style={{marginTop: 14}}>
                I help teams ship cloud-native platforms that scale calmly.
                Based in [city]. Open to consulting.
              </p>
            </div>

            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap: 12}}>
              <Stat n="8+" l="years" />
              <Stat n="32" l="projects" />
              <Stat n="18" l="clients" />
              <Stat n="100%" l="remote" />
            </div>

            <div>
              <div className="label" style={{marginBottom: 8}}>stack</div>
              <div className="tags">
                {["AWS","GCP","Terraform","K8s","Helm","Argo","Python"].map(x => <Tag key={x}>{x}</Tag>)}
              </div>
            </div>

            <div style={{display:"flex", flexDirection:"column", gap: 8}}>
              <a className="btn dark">Work with me <span className="arr">↗</span></a>
              <a className="btn">Download CV</a>
            </div>

            <div style={{marginTop:"auto", display:"flex", flexDirection:"column", gap: 10}}>
              <div className="label">find me</div>
              <SocialIcons />
              <div className="tiny">hello@[domain]</div>
            </div>

            {showNotes && <Note style={{right: -110, top: 200}}>← sticky, always visible</Note>}
          </aside>

          {/* RIGHT — feed */}
          <div style={{padding: 28, display:"flex", flexDirection:"column", gap: 18, background:"var(--paper-2)"}}>
            {/* feed filter */}
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding: "4px 0"}}>
              <div className="hand" style={{fontSize: 22}}>The feed <span style={{color:"var(--ink-faint)"}}>— everything I publish</span></div>
              <div className="tags">
                {["all","writing","projects","talks","repos","social"].map((t,i) => (
                  <span key={t} className="pill" style={i===0 ? {background:"#1a1a1a", color:"#fafaf7"} : null}>{t}</span>
                ))}
              </div>
            </div>

            {/* feed items */}
            <FeedItem
              kind="◐ pinned project"
              title="terraform-aws-landing-zone"
              body="Reusable modules for multi-account AWS landing zones."
              tags={["AWS","Terraform","★ 127"]}
              big
            />

            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap: 18}}>
              <FeedItem
                kind="★ essay"
                title="The DevOps playbook for high-growth startups"
                body="Building resilient infra without slowing the team down."
                tags={["essay","6 min"]}
              />
              <FeedItem
                kind="▶ talk"
                title="AWS multi-account strategy, explained"
                tags={["YouTube","30 min"]}
                dark
                big
              />
            </div>

            <FeedItem
              kind="◇ case study"
              title="Secure multi-tenant SaaS platform"
              body="Isolation, monitoring, and Terraform-driven automation for a fintech client."
              tags={["AWS","K8s","Helm"]}
            />

            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap: 18}}>
              <FeedItem
                kind="◎ instagram"
                title="Another productive day in the cloud"
                tags={["#devops","#aws"]}
              />
              <FeedItem
                kind="⌘ experiment"
                title="Infrastructure assistant with LLMs"
                body="Exploring natural-language ops on top of OpenAI + LangChain."
                tags={["OpenAI","LangChain"]}
              />
            </div>

            <div className="sk soft sk-pad" style={{padding: 22}}>
              <div className="label" style={{marginBottom: 6}}>❝ kind words</div>
              <div className="hand" style={{fontSize: 22, lineHeight: 1.25}}>
                "Rare mix of deep technical expertise and clear communication."
              </div>
              <div style={{display:"flex", gap: 10, alignItems:"center", marginTop: 12}}>
                <AvatarPh />
                <div>
                  <div className="h-sm">[Client Name]</div>
                  <div className="tiny">CTO · [Company]</div>
                </div>
              </div>
            </div>

            <div className="sk sk-pad" style={{padding: 22, display:"flex", justifyContent:"space-between", alignItems:"center", gap: 24}}>
              <div>
                <div className="h-md" style={{marginBottom: 4}}>Get the monthly note.</div>
                <div className="tiny">DevOps, cloud, AI ops, and building in public.</div>
              </div>
              <div style={{display:"flex", gap: 0, border:"1.6px solid #1a1a1a", borderRadius: 999, padding: 4, alignItems:"center", minWidth: 340}}>
                <div style={{flex:1, padding: "6px 12px", fontFamily:"Kalam", color:"#9a9a9a", fontSize: 13}}>your@email.com</div>
                <button className="btn dark" style={{padding:"8px 16px"}}>Subscribe</button>
              </div>
            </div>

            <div style={{textAlign:"center", padding: "14px 0"}}>
              <span className="tiny">load older posts ↓</span>
            </div>

            {showNotes && <Note style={{right: 22, top: 100}}>mixed content, one stream</Note>}
          </div>
        </div>
      </div>

      <div style={{marginTop: 16, display:"flex", gap:14, alignItems:"flex-start"}}>
        <Flag>WHY THIS</Flag>
        <p className="body" style={{margin:0, maxWidth: 720}}>
          Bio is your anchor, the feed is always fresh — visitors come back to see what's new.
          Best when you publish often across multiple channels. Easier to maintain (just append).
        </p>
      </div>
    </section>
  );
};

window.ApproachC = ApproachC;
