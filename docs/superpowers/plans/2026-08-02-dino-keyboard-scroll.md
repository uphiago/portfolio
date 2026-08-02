# Dino Keyboard Scroll Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make keyboard jumping stable at mobile resolutions while preserving normal keyboard navigation outside the game.

**Architecture:** Add target and viewport eligibility checks directly to the existing Runner input path. Test the real public engine in jsdom and verify browser scrolling with Playwright.

**Tech Stack:** JavaScript, jsdom, Vitest, Playwright

---

### Task 1: Scope jump keys to the visible game

**Files:**
- Create: `tests/dino-runner-input.test.js`
- Modify: `public/dino/runner.js:668-700`

- [ ] **Step 1: Write failing behavior tests**

Evaluate `runner.js` in jsdom and invoke its real `onKeyDown` handler. Require visible `Space` and `ArrowUp` events to be canceled and start the game, offscreen Space to remain native, and Space on a button to remain native.

- [ ] **Step 2: Verify RED**

Run: `npm test -- tests/dino-runner-input.test.js`

Expected: visible Space is not canceled and offscreen Space incorrectly starts the game.

- [ ] **Step 3: Implement minimal input eligibility**

Add Runner helpers for interactive targets and vertical visibility. In `onKeyDown`, return for interactive/already-canceled events, ignore keyboard jump keys while the game is offscreen, and call `preventDefault()` for eligible jump keys before the first jump.

- [ ] **Step 4: Verify GREEN and regressions**

Run the focused test, full `npm test`, and `npm run build`. All must pass.

- [ ] **Step 5: Verify the browser symptom**

At 390×664, scroll until the Dino is visible, press and hold Space, and verify `scrollY` remains unchanged. Scroll the Dino offscreen and verify Space resumes normal page scrolling. Verify a focused button remains activatable with Space.

- [ ] **Step 6: Commit locally**

Create an atomic fix commit. Do not push until explicitly requested.

