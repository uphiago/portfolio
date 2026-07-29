# Barbarossa Blog Tutorial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the obsolete Hermes two-container article with an accurate English tutorial for the current configurable Barbarossa runtime.

**Architecture:** Rewrite the existing post in place so its URL remains stable. Use the public Barbarossa repository and checked-in reference profile as the source of truth, distinguish configurable architecture from current defaults, and verify commands, links, front matter, and sensitive-term exclusions locally.

**Tech Stack:** Hugo Markdown, TOML front matter, Bash verification, Barbarossa Docker Compose documentation

---

### Task 1: Rewrite The Tutorial

**Files:**
- Modify: `content/posts/2026/ai/hermes-agent-recon.md`

- [ ] **Step 1: Replace the front matter**

Set the title to `I'm Barbarossa. This Is How I Work.`, attribute the post to
`Barbarossa + @uphiago`, describe the capability-oriented runtime, retain the
existing slug, and update tags to cover Barbarossa, agents, MCP, Docker,
Codex, and infrastructure.

- [ ] **Step 2: Replace the obsolete architecture**

Open with the public Barbarossa artwork and repository link. Explain the
orchestrator, typed MCP router, isolated Forge and Recon workers, durable job
lifecycle, and the difference between configurable architecture and the
checked-in reference profile. Do not compare with or preserve the retired
two-container design.

- [ ] **Step 3: Add the operator tutorial**

Document requirements, `.env`, external credential files, `./setup.sh`,
Telegram pairing, dashboard tunneling, capability routing, Codex and image
jobs, direct versus Tor networking, retained state, verification, extension,
and version-tagged production deployment using commands present in the current
Barbarossa README.

- [ ] **Step 4: Keep the first-person field voice**

Write as Barbarossa, keep the authorized-security boundary explicit, and avoid
marketing filler. Treat DeepSeek, Hermes, Codex, worker count, and concurrency
as replaceable reference-profile choices.

### Task 2: Verify The Published Document

**Files:**
- Verify: `content/posts/2026/ai/hermes-agent-recon.md`

- [ ] **Step 1: Validate stale and sensitive terms**

Run:

```bash
! rg -n 'two containers|shared volume|Charlie|Oscar|Papa|root@worker|WORKER_HOST|WORKER_PORT|OPENROUTER_API_KEY|54\\.39\\.' \
  content/posts/2026/ai/hermes-agent-recon.md
```

Expected: no matches.

- [ ] **Step 2: Validate required topics**

Run:

```bash
rg -n 'github.com/uphiago/barbarossa|typed MCP|Forge|Recon|media\\.image|network\\.tor|pairing approve|v2\\.0\\.0' \
  content/posts/2026/ai/hermes-agent-recon.md
```

Expected: every required topic is present.

- [ ] **Step 3: Validate Markdown links and formatting**

Parse local Markdown links, confirm that the article contains one TOML front
matter block and `<!--more-->`, then run:

```bash
git diff --check
```

Expected: all local links resolve and no whitespace errors are reported.

- [ ] **Step 4: Review the final diff**

Compare the rewritten article against
`/home/hiago/repositories/red/infra/barbarossa/README.md` and confirm that no
model, provider, worker count, or concurrency value is presented as an
architectural requirement.
