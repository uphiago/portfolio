# Stable Tab Title Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure the portfolio browser tab keeps the root layout's default title for blog-post URLs.

**Architecture:** The root layout already declares the default title. The page-level metadata generator will retain post-specific social and SEO metadata but omit its title override, so it cannot replace the root title during navigation.

**Tech Stack:** Next.js App Router, React, Vitest.

---

### Task 1: Cover the title ownership rule

**Files:**
- Modify: `tests/portfolio-landing.test.jsx`
- Test: `tests/portfolio-landing.test.jsx`

- [ ] **Step 1: Write the failing test**

Add `generateMetadata` import from `@/app/page` and this test:

```jsx
it("keeps the root title when generating metadata for a blog post", async () => {
  const metadata = await generateMetadata({
    searchParams: Promise.resolve({ post: "2026/ai/pentest-recon" }),
  });

  expect(metadata.title).toBeUndefined();
  expect(metadata.openGraph.title).toBeTruthy();
  expect(metadata.twitter.title).toBeTruthy();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/portfolio-landing.test.jsx`

Expected: FAIL because `generateMetadata` currently returns an article title override.

### Task 2: Keep post social metadata without overriding the tab title

**Files:**
- Modify: `app/page.jsx:22-43`
- Test: `tests/portfolio-landing.test.jsx`

- [ ] **Step 1: Write the minimal implementation**

Remove this property from the object returned by `generateMetadata`:

```jsx
title: `${article.title} — hiago.sh`,
```

- [ ] **Step 2: Run the regression test to verify it passes**

Run: `npm test -- tests/portfolio-landing.test.jsx`

Expected: PASS, with the post Open Graph and Twitter titles still present.

- [ ] **Step 3: Run the production build**

Run: `npm run build`

Expected: PASS, including Next.js metadata validation.

- [ ] **Step 4: Commit**

```bash
git add app/page.jsx tests/portfolio-landing.test.jsx docs/superpowers/specs/2026-07-29-stable-tab-title-design.md docs/superpowers/plans/2026-07-29-stable-tab-title.md
git commit -m "fix: keep default browser tab title"
```
