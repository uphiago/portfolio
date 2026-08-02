# Dino Mobile Layout Stability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the mobile Dino card at its final height throughout refresh and asynchronous game initialization.

**Architecture:** Reserve the Runner's existing 150px height on the server-rendered wrapper. Protect the contract with a CSS regression test, leaving game and ranking behavior untouched.

**Tech Stack:** Next.js, React, CSS, Vitest, Playwright

---

### Task 1: Protect the initial Dino stage height

**Files:**
- Modify: `tests/portfolio-landing.test.jsx`
- Modify: `src/components/landing/styles/cards.css:320-332`

- [ ] **Step 1: Write the failing test**

Add a test that reads `cards.css` and requires both the server-rendered wrapper and the injected Runner container to reserve 150px:

```jsx
it("reserves the dino stage height before the runner loads", () => {
  const css = readFileSync("src/components/landing/styles/cards.css", "utf8");

  expect(css).toMatch(/\.dino-game-wrap \{[^}]*min-height: 150px;/s);
  expect(css).toMatch(/\.dino-game \.runner-container \{[^}]*height: 150px;/s);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- tests/portfolio-landing.test.jsx -t "reserves the dino stage height"`

Expected: FAIL because `.dino-game-wrap` does not yet define `min-height: 150px`.

- [ ] **Step 3: Implement the minimum reservation**

Add the matching intrinsic height to the existing wrapper rule:

```css
.mfi .dino-game-wrap {
  position: relative;
  width: 100%;
  min-height: 150px;
}
```

- [ ] **Step 4: Run the focused and full tests**

Run: `npm test -- tests/portfolio-landing.test.jsx -t "reserves the dino stage height"`

Expected: PASS.

Run: `npm test`

Expected: all tests PASS.

- [ ] **Step 5: Build and verify mobile layout locally**

Run: `npm run build`

Expected: production build completes successfully.

Start the production server and use Playwright with an iPhone 13 viewport. Delay `/dino/runner.js`, then compare `.video-card` and `.dino-game-wrap` bounding boxes before and after it loads. Expected in both states: card height 221px and wrapper height 150px.

- [ ] **Step 6: Commit the focused fix**

```bash
git add tests/portfolio-landing.test.jsx src/components/landing/styles/cards.css
git commit -m "fix: stabilize dino card on mobile refresh"
```
