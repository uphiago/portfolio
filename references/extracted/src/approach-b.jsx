// APPROACH B — "Editorial Stack"
// Big bold hero, then full-width sections stacked top to bottom.
// Reads like a personal magazine. Slower pacing, more breathing room.

const ApproachB = ({ density, showGrid, showNotes }) => {
  return (
    <section data-screen-label="B — Editorial Stack">
      <div style={{display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom: 18}}>
        <div>
          <span className="approach-badge"><span className="dot" />Approach B</span>
          <h2 className="h-lg" style={{margin:"10px 0 0"}}>Editorial <span className="uline">Stack</span></h2>
          <p className="description">
            Magazine pacing. Huge hero statement, then full-width sections stacked top→bottom.
            Each section gets room to breathe. Best when you want the writing to lead.
          </p>
        </div>
        <div className="tags">
          <Tag>scroll-led</Tag><Tag>narrative</Tag><Tag>roomy</Tag>
        </div>
      </div>

      <div className={"sk " + (showGrid ? "grid-bg" : "")} style={{ padding: 28, position:"relative" }}>
        {/* nav */}
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: 36, paddingBottom: 16, borderBottom:"1.2px solid #1a1a1a"}}>
          <div style={{display:"flex", alignItems:"center", gap: 12}}>
            <LogoGlyph />
            <div>
              <div className="hand" style={{fontSize: 18, lineHeight: 1}}>[your name]</div>
              <div className="tiny">devops · cloud · consulting</div>
            </div>
          </div>
          <div style={{display:"flex", gap: 22, alignItems:"center"}}>
            <span className="tiny">writing</span><span className="tiny">projects</span><span className="tiny">talks</span><span className="tiny">contact</span>
            <SocialIcons />
          </div>
        </div>

        {/* HERO — big editorial statement */}
        <div style={{padding: "30px 40px 40px", position:"relative"}}>
          <div className="label" style={{marginBottom: 18}}>— a portfolio of cloud-native work —</div>
          <div style={{fontFamily:"Caveat", fontWeight: 700, fontSize: 96, lineHeight: 0.95, letterSpacing: "0.5px"}}>
            Resilient<br/>infrastructure<br/>for <span className="uline">ambitious</span> teams.
          </div>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginTop: 36, gap: 40}}>
            <p className="body" style={{maxWidth: 460, fontSize: 16}}>
              I'm a DevOps engineer. I help startups and scale-ups design, automate
              and operate cloud platforms that don't wake them up at 3am.
            </p>
            <div style={{display:"flex", gap: 10}}>
              <a className="btn dark">Start a project ↗</a>
              <a className="btn">Read the blog</a>
            </div>
          </div>
          {showNotes && <Note style={{right: 24, top: 36}}>headline does the heavy lifting</Note>}
        </div>

        <HandRule />

        {/* Stats row */}
        <div style={{display:"grid", gridTemplateColumns:"repeat(4, 1fr)", padding: "30px 40px", gap: 24, borderBottom:"1.2px dashed #cfcdc4"}}>
          {[
            ["8+", "years shipping infra"],
            ["32", "production platforms"],
            ["18", "clients · 4 continents"],
            ["100%", "remote, async-first"],
          ].map(([n,l],i) => (
            <div key={i}>
              <div style={{fontFamily:"Caveat", fontWeight:700, fontSize: 56, lineHeight: 1}}>{n}</div>
              <div className="tiny" style={{marginTop: 4}}>{l}</div>
            </div>
          ))}
        </div>

        {/* Featured article — wide split */}
        <div style={{display:"grid", gridTemplateColumns: "1.1fr 1fr", gap: 28, padding: "36px 40px", borderBottom:"1.2px dashed #cfcdc4"}}>
          <div>
            <div className="label" style={{marginBottom: 10}}>★ featured essay · 6 min read</div>
            <div className="h-lg" style={{marginBottom: 16}}>The DevOps playbook for high-growth startups</div>
            <Lines count={4} widths={["w90","w80","w90","w60"]} />
            <a className="btn" style={{marginTop: 18}}>Read the essay ↗</a>
          </div>
          <Ph label="essay hero illustration" className="xtall" />
        </div>

        {/* Selected work — 3-up grid */}
        <div style={{padding: "36px 40px", borderBottom:"1.2px dashed #cfcdc4"}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom: 24}}>
            <div className="h-lg">Selected work <span className="hand" style={{color:"var(--ink-faint)", fontSize: 24}}>— 2022–now</span></div>
            <a className="tiny">all projects →</a>
          </div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap: 20}}>
            {[
              ["AWS Landing Zone", "Reusable Terraform modules for multi-account orgs.", ["AWS","Terraform"]],
              ["Multi-tenant SaaS infra", "Isolation, monitoring & automation for fintech.", ["K8s","Helm","Argo"]],
              ["LLM-powered runbooks", "Natural-language ops assistant on top of GPT.", ["OpenAI","LangChain"]],
            ].map(([t,d,tags], i) => (
              <div key={i} className="sk sk-pad" style={{display:"flex", flexDirection:"column", gap: 12}}>
                <Ph label={"case " + (i+1)} style={{minHeight: 140}} />
                <div className="h-md">{t}</div>
                <div className="body">{d}</div>
                <div className="tags">{tags.map(x => <Tag key={x}>{x}</Tag>)}</div>
                <a className="tiny" style={{marginTop: "auto"}}>view case →</a>
              </div>
            ))}
          </div>
        </div>

        {/* Talks / video band — dark */}
        <div style={{padding: "36px 40px", borderBottom:"1.2px dashed #cfcdc4"}}>
          <div className="sk dark" style={{padding: 0, display:"grid", gridTemplateColumns:"1.1fr 1fr", overflow:"hidden"}}>
            <PlayPh label="talk · YouTube" dark style={{minHeight: 280, border: "none", borderRadius: 0}} />
            <div style={{padding: 28, display:"flex", flexDirection:"column", justifyContent:"center", gap: 14, color:"#f3f2ec"}}>
              <div className="label" style={{color:"#999"}}>▶ latest talk</div>
              <div className="h-lg" style={{color:"#f3f2ec"}}>AWS multi-account strategy, explained</div>
              <div className="body" style={{color:"#bbb"}}>30-min walk-through from a recent conference. Slides & repo linked.</div>
              <a className="btn" style={{background:"transparent", color:"#f3f2ec", borderColor:"#bbb", alignSelf:"flex-start"}}>Watch ↗</a>
            </div>
          </div>
        </div>

        {/* Testimonial band */}
        <div style={{padding: "44px 40px", textAlign:"center", borderBottom:"1.2px dashed #cfcdc4"}}>
          <div className="label" style={{marginBottom: 18}}>❝ kind words</div>
          <div className="hand" style={{fontSize: 34, lineHeight: 1.2, maxWidth: 820, margin:"0 auto"}}>
            "Rare mix of deep technical expertise and clear communication.
            Built us a platform that just <span className="uline">works</span>."
          </div>
          <div style={{display:"flex", justifyContent:"center", alignItems:"center", gap: 12, marginTop: 22}}>
            <AvatarPh />
            <div style={{textAlign:"left"}}>
              <div className="h-sm">[Client Name]</div>
              <div className="tiny">CTO · [Company]</div>
            </div>
          </div>
        </div>

        {/* Newsletter + footer */}
        <div style={{display:"grid", gridTemplateColumns:"1.2fr 1fr", gap: 28, padding: "36px 40px 24px"}}>
          <div>
            <div className="h-lg" style={{marginBottom: 10}}>Stay in the loop.</div>
            <div className="body" style={{maxWidth: 460, marginBottom: 18}}>Monthly notes on DevOps, cloud, AI ops & building in public.</div>
            <div style={{display:"flex", gap: 0, border:"1.6px solid #1a1a1a", borderRadius: 999, padding: 4, alignItems:"center", maxWidth: 460}}>
              <div style={{flex:1, padding: "6px 14px", fontFamily:"Kalam", color:"#9a9a9a", fontSize: 13}}>your@email.com</div>
              <button className="btn dark" style={{padding:"8px 18px"}}>Subscribe</button>
            </div>
          </div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap: 16}}>
            <div>
              <div className="label">services</div>
              <div className="tiny" style={{lineHeight: 1.8}}>Consulting<br/>Architecture<br/>Automation<br/>Advisory</div>
            </div>
            <div>
              <div className="label">stack</div>
              <div className="tiny" style={{lineHeight: 1.8}}>AWS · GCP<br/>Terraform<br/>K8s · Helm<br/>CI/CD</div>
            </div>
            <div>
              <div className="label">connect</div>
              <div className="tiny" style={{lineHeight: 1.8}}>GitHub<br/>LinkedIn<br/>Instagram<br/>YouTube</div>
            </div>
          </div>
        </div>

        {showNotes && (
          <>
            <Note style={{left: -4, top: 220, transform:"rotate(-90deg)", transformOrigin:"left top"}}>
              ↑ huge editorial hero
            </Note>
            <Note style={{right: 28, top: 760}}>quotes sized like art</Note>
          </>
        )}
      </div>

      <div style={{marginTop: 16, display:"flex", gap:14, alignItems:"flex-start"}}>
        <Flag>WHY THIS</Flag>
        <p className="body" style={{margin:0, maxWidth: 720}}>
          Pacing tells the story. Good if your essays / talks are the strongest assets and you want
          visitors to slow down. Easier to extend with more sections over time.
        </p>
      </div>
    </section>
  );
};

window.ApproachB = ApproachB;
