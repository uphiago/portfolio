# Modal Background Scroll Lock Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reliably freeze the page behind all site modals on mobile and desktop and restore its exact position after close.

**Architecture:** Centralize a reference-counted fixed-body scroll lock in `BaseModal`, already shared by article, contact, video, and Dino ranking dialogs. Preserve prior inline styles and keep modal content scrolling independent.

**Tech Stack:** React, Next.js, Vitest, jsdom, Playwright

---

### Task 1: Add an iOS-safe shared modal scroll lock

**Files:**
- Modify: `src/components/landing/modals/BaseModal.jsx`
- Modify: `tests/portfolio-landing.test.jsx`

- [ ] **Step 1: Add failing regression tests**

Render a modal at a simulated non-zero scroll position and assert that `body.position` becomes `fixed`, `body.top` stores the negative scroll offset, and both root elements hide overflow. Close it and assert that the original inline styles and scroll position are restored. Render two modals and assert that removing one does not unlock the page.

- [ ] **Step 2: Verify RED**

Run: `npm test -- tests/portfolio-landing.test.jsx -t "locks background scroll"`

Expected: FAIL because the current implementation changes only `body.overflow`.

- [ ] **Step 3: Implement the shared lock**

Add module-level lock state and `lockBackgroundScroll`/cleanup behavior to `BaseModal.jsx`. Capture styles only for the first lock, restore only after the final lock, and call `window.scrollTo(0, savedScrollY)` after restoration.

- [ ] **Step 4: Verify GREEN and regressions**

Run the focused test, then `npm test` and `npm run build`. All commands must pass.

- [ ] **Step 5: Verify mobile behavior locally**

Use an iPhone Playwright viewport at a non-zero page scroll. Open contact, article, and Dino ranking dialogs individually, attempt background scrolling, close each, and verify the page stays fixed and returns to its original position.

- [ ] **Step 6: Commit and publish**

Commit the scroll lock separately, then push all validated local commits to `origin/main` as explicitly requested.

