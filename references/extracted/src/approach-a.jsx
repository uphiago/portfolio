// APPROACH A — "Bento Mosaic"
// Asymmetric grid. Hero block left, content tiles scattered.
// Inspired by the reference but with an original arrangement.

const ApproachA = ({ density, showGrid, showNotes }) => {
  const compact = density === "compact";
  return (
    <section data-screen-label="A — Bento Mosaic">
      <div style={{display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom: 18}}>
        <div>
          <span className="approach-badge"><span className="dot" />Approach A</span>
          <h2 className="h-lg" style={{margin:"10px 0 0"}}>Bento <span className="uline">Mosaic</span></h2>
          <p className="description">
            Single screen. Asymmetric tiles. Bio anchors the top-left, then a mix of article / project /
            social cards in varied sizes. Reads like a personal dashboard.
          </p>
        </div>
        <div className="tags">
          <Tag>single-page</Tag><Tag>dense</Tag><Tag>scannable</Tag>
        </div>
      </div>

      <div className={"sk " + (showGrid ? "grid-bg" : "")} style={{ padding: 28, position:"relative" }}>
        {/* nav row */}
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: 24}}>
          <LogoGlyph />
          <div style={{display:"flex", gap: 18, alignItems:"center"}}>
            <span className="tiny">work</span><span className="tiny">writing</span><span className="tiny">about</span>
            <SocialIcons />
          </div>
        </div>

        {/* mosaic grid: 12 col */}
        <div style={{display:"grid", gridTemplateColumns:"repeat(12, 1fr)", gridAutoRows: compact ? 60 : 72, gap: 14, position:"relative"}}>

          {/* HERO — spans 5 cols x 5 rows */}
          <div className="sk sk-pad-lg" style={{gridColumn:"span 5", gridRow:"span 5", display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
            <div>
              <div className="label">hello —</div>
              <div className="h-xl" style={{marginTop: 10}}>
                I'm <span className="hand" style={{color:"var(--accent)"}}>[your&nbsp;name]</span>.<br/>
                DevOps engineer<br/>building <span className="uline">resilient</span> infra.
              </div>
              <p className="body" style={{marginTop: 16, maxWidth: 380}}>
                Short pitch — who I help, what I ship, the kind of problems I love. ~2 lines of copy.
              </p>
            </div>
            <div style={{display:"flex", gap: 10, alignItems:"center", marginTop: 16}}>
              <a className="btn dark">Work with me <span className="arr">↗</span></a>
              <a className="btn">See projects</a>
            </div>
            {showNotes && <Note style={{right: 12, top: 12}}>← anchor of the page</Note>}
          </div>

          {/* Featured article — 4 col x 3 rows */}
          <div className="sk sk-pad" style={{gridColumn:"span 4", gridRow:"span 3"}}>
            <div style={{display:"flex", justifyContent:"space-between", marginBottom: 8}}>
              <span className="label">⌘ featured post</span>
              <span className="tiny">6 min read</span>
            </div>
            <div className="h-md" style={{marginBottom: 10}}>Headline of the cornerstone essay goes here</div>
            <Lines count={2} widths={["w90","w70"]} />
            <a className="btn" style={{marginTop: 14}}>Read →</a>
          </div>

          {/* Instagram-style square — 3 col x 3 rows */}
          <div className="sk" style={{gridColumn:"span 3", gridRow:"span 3", display:"flex", flexDirection:"column"}}>
            <div style={{display:"flex", justifyContent:"space-between", padding: "12px 14px"}}>
              <span className="label">◎ instagram</span>
              <span className="tiny">2d</span>
            </div>
            <Ph label="square photo" style={{borderRadius: 0, border: "none", borderTop:"1.4px dashed #9a9a9a", borderBottom:"1.4px dashed #9a9a9a", flex: 1}} />
            <div style={{padding: "10px 14px"}} className="tiny">building in public · #devops</div>
          </div>

          {/* Stats strip — 4 col x 2 rows */}
          <div className="sk soft sk-pad" style={{gridColumn:"span 4", gridRow:"span 2", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
            <Stat n="8+" l="years" />
            <Stat n="32" l="projects" />
            <Stat n="18" l="clients" />
            <Stat n="100%" l="remote" />
          </div>

          {/* Github repo card — 3 col x 2 rows */}
          <div className="sk sk-pad" style={{gridColumn:"span 3", gridRow:"span 2"}}>
            <div className="label" style={{marginBottom: 6}}>◐ github · pinned</div>
            <div className="h-sm mono" style={{marginBottom: 8}}>terraform-landing-zone</div>
            <div className="tiny">★ 127 · ⑂ 24 · Terraform</div>
          </div>

          {/* Video block — 7 col x 4 rows */}
          <div className="sk dark" style={{gridColumn:"span 7", gridRow:"span 4", padding: 0, position:"relative"}}>
            <PlayPh label="youtube preview" dark style={{height:"100%", minHeight: compact ? 220 : 280, border: "none", borderRadius: 14}} />
            <div style={{position:"absolute", left: 20, top: 16, color:"#bbb", fontFamily:"Kalam", fontSize: 12}}>▶ youtube · latest</div>
            <div style={{position:"absolute", left: 20, bottom: 18, right: 20}}>
              <div className="h-md" style={{color:"#f3f2ec"}}>Title of the most-watched talk</div>
              <div className="tiny" style={{color:"#999", marginTop: 4}}>Watch on YouTube ↗</div>
            </div>
          </div>

          {/* Project case study — 5 col x 4 rows */}
          <div className="sk sk-pad" style={{gridColumn:"span 5", gridRow:"span 4"}}>
            <div className="label" style={{marginBottom: 6}}>◇ case study</div>
            <div className="h-md" style={{marginBottom: 10}}>Secure multi-tenant platform on AWS</div>
            <Lines count={3} widths={["w90","w80","w60"]} />
            <div className="tags" style={{marginTop: 14}}>
              <Tag>AWS</Tag><Tag>Terraform</Tag><Tag>K8s</Tag>
            </div>
            <a className="btn" style={{marginTop: 14}}>View project →</a>
          </div>

          {/* Testimonial — 4 col x 3 rows */}
          <div className="sk soft sk-pad" style={{gridColumn:"span 4", gridRow:"span 3"}}>
            <div className="label" style={{marginBottom: 8}}>❝ kind words</div>
            <div className="hand" style={{fontSize: 22, lineHeight: 1.25, color:"var(--ink)"}}>
              "Short, punchy quote from a client. Two lines max so it sings."
            </div>
            <div style={{display:"flex", alignItems:"center", gap: 10, marginTop: 14}}>
              <AvatarPh />
              <div>
                <div className="h-sm">[Client Name]</div>
                <div className="tiny">CTO, [Company]</div>
              </div>
            </div>
          </div>

          {/* Newsletter — 4 col x 3 rows */}
          <div className="sk sk-pad" style={{gridColumn:"span 4", gridRow:"span 3"}}>
            <div className="label" style={{marginBottom: 6}}>✉ stay in the loop</div>
            <div className="h-md" style={{marginBottom: 8}}>Notes on cloud, scale, building in public.</div>
            <div className="body" style={{marginBottom: 14}}>Monthly. No spam.</div>
            <div style={{display:"flex", gap: 0, border:"1.6px solid #1a1a1a", borderRadius: 999, padding: 4, alignItems:"center"}}>
              <div style={{flex:1, padding: "6px 12px", fontFamily:"Kalam", color:"#9a9a9a", fontSize: 13}}>your@email.com</div>
              <button className="btn dark" style={{padding:"8px 16px"}}>Subscribe</button>
            </div>
          </div>

          {/* footer strip — full width */}
          <div className="sk soft sk-pad" style={{gridColumn:"span 12", gridRow:"span 2", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <div>
              <div className="hand" style={{fontSize: 24}}>Let's build something.</div>
              <div className="tiny">hello@[domain] · based in [city] · open to consulting</div>
            </div>
            <div style={{display:"flex", gap: 24}}>
              <div>
                <div className="label">services</div>
                <div className="tiny">consulting · architecture · automation</div>
              </div>
              <div>
                <div className="label">stack</div>
                <div className="tiny">AWS · GCP · Terraform · K8s · CI/CD</div>
              </div>
            </div>
          </div>

        </div>

        {showNotes && (
          <>
            <Note style={{left: -8, top: 320, transform:"rotate(-90deg)", transformOrigin:"left top"}}>
              ↑ asymmetric tile sizes
            </Note>
            <Note style={{right: 24, top: 540}}>video = social proof, big</Note>
          </>
        )}
      </div>

      <div style={{marginTop: 16, display:"flex", gap:14, alignItems:"flex-start"}}>
        <Flag>WHY THIS</Flag>
        <p className="body" style={{margin:0, maxWidth: 720}}>
          Every section visible without scrolling. Personality from the layout itself.
          Good when authority + breadth of work matter more than narrative.
        </p>
      </div>
    </section>
  );
};

window.ApproachA = ApproachA;
