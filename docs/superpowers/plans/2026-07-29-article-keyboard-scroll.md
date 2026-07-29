# Article Keyboard Scroll Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable standard arrow and page keyboard scrolling inside an open article modal.

**Architecture:** Keep the keyboard listener local to `ArticleModal`, where it can address the existing `.abody` scroll container. A small exported key-to-delta helper keeps browser-event handling and scroll-distance rules independently testable.

**Tech Stack:** React 19, Vitest 4, jsdom.

---

## File structure

- Modify `src/components/landing/modals/ArticleModal.jsx`: map supported keyboard keys to scroll distances, ignore editable controls, and scroll `bodyRef`.
- Modify `tests/portfolio-landing.test.jsx`: test native-sized keyboard deltas, editable-target preservation, and component event handling.

### Task 1: Specify keyboard scrolling behavior

**Files:**
- Modify: `tests/portfolio-landing.test.jsx`
- Test: `tests/portfolio-landing.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
import { getArticleScrollDelta } from "@/src/components/landing/modals/ArticleModal";

it("maps browser scroll keys to article body deltas", () => {
  expect(getArticleScrollDelta("ArrowDown", 480)).toBe(40);
  expect(getArticleScrollDelta("ArrowUp", 480)).toBe(-40);
  expect(getArticleScrollDelta("PageDown", 480)).toBe(480);
  expect(getArticleScrollDelta("PageUp", 480)).toBe(-480);
  expect(getArticleScrollDelta("Enter", 480)).toBeNull();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/portfolio-landing.test.jsx`

Expected: FAIL because `getArticleScrollDelta` is not exported.

### Task 2: Implement the local keyboard handler

**Files:**
- Modify: `src/components/landing/modals/ArticleModal.jsx`
- Test: `tests/portfolio-landing.test.jsx`

- [ ] **Step 1: Add the minimal implementation**

```jsx
export function getArticleScrollDelta(key, clientHeight) {
  if (key === "ArrowDown") return 40;
  if (key === "ArrowUp") return -40;
  if (key === "PageDown") return clientHeight;
  if (key === "PageUp") return -clientHeight;
  return null;
}
```

Within an effect, listen to `window` keydown events, return for editable targets, calculate the delta with `bodyRef.current.clientHeight`, call `bodyRef.current.scrollBy({ top: delta })`, and call `event.preventDefault()`.
Remove the listener in the effect cleanup.

- [ ] **Step 2: Run the focused test to verify it passes**

Run: `npm test -- tests/portfolio-landing.test.jsx`

Expected: PASS with the keyboard-delta test green.

- [ ] **Step 3: Add event-handling coverage**

```jsx
it("scrolls the article body for supported keys without intercepting editable targets", async () => {
  // Render ArticleModal, mock body.scrollBy, dispatch PageDown, and assert
  // { top: body.clientHeight }. Then dispatch ArrowDown from an input and
  // assert neither scrolling nor default prevention occurred.
});
```

- [ ] **Step 4: Run the focused test suite**

Run: `npm test -- tests/portfolio-landing.test.jsx`

Expected: PASS, including event interception coverage.

### Task 3: Validate locally

**Files:**
- Verify: `src/components/landing/modals/ArticleModal.jsx`

- [ ] **Step 1: Run all automated tests**

Run: `npm test`

Expected: PASS with no failures.

- [ ] **Step 2: Build the Next.js app**

Run: `npm run build`

Expected: build completes successfully.

- [ ] **Step 3: Manually verify in the local site**

Run: `npm run dev`

Open a long article, then confirm Arrow Up/Down make short jumps and Page Up/Down move by the visible article-panel height. Confirm keyboard interaction with any editable control remains native.

- [ ] **Step 4: Commit locally, without pushing**

```bash
git add src/components/landing/modals/ArticleModal.jsx tests/portfolio-landing.test.jsx docs/superpowers/plans/2026-07-29-article-keyboard-scroll.md
git commit -m "feat: add article keyboard scrolling"
```
