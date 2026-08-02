# Dino Scoreboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Recent and Top 10 scoreboard views with an intentional pirate honeypot, exact nickname identity, atomic personal-best updates, and smooth accessible controls.

**Architecture:** Supabase owns classification, concurrency, historical-row eligibility, and the three scoreboard projections. Next.js validates requests and calls narrow RPCs; the modal switches between server-provided arrays without refetching or resizing.

**Tech Stack:** PostgreSQL/Supabase RLS and RPC, Next.js route handlers, React 19, Vitest, jsdom.

---

## File structure

- Create `supabase/migrations/20260802120000_dino_scoreboard.sql`: origin classification trigger, anonymous honeypot policy, atomic application-submission RPC, and scoreboard RPC.
- Modify `src/lib/dinoRanking.js`: literal nickname validation and RPC clients.
- Modify `app/api/dino/score/route.js`: explicit validation errors and atomic submission.
- Modify `app/api/dino/scores/route.js`: return Recent, Top With Pirates, and Top Legitimate.
- Modify `src/components/landing/cards/DinoGame.jsx`: rename the modal trigger and refresh the new response contract.
- Modify `src/components/landing/cards/RankingModal.jsx`: accessible tabs, pirate toggle, stable states, and retry.
- Modify `src/components/landing/styles/cards.css`: compact controls, transitions, and stable modal layout.
- Modify `tests/dino-ranking.test.js`: backend validation, RPC, API, exact-nickname, and threshold coverage.
- Modify `tests/portfolio-landing.test.jsx`: modal semantics and interaction coverage.

### Task 1: Supabase invariants and projections

**Files:**
- Create: `supabase/migrations/20260802120000_dino_scoreboard.sql`
- Test: `tests/dino-ranking.test.js`

- [ ] **Step 1: Add a failing migration-contract test**

Read the migration and assert it contains:

```js
expect(sql).toContain("create or replace function public.submit_dino_score");
expect(sql).toContain("create or replace function public.get_dino_scoreboard");
expect(sql).toContain("grant insert (nickname, score)");
expect(sql).toContain("p_score >= 50000");
expect(sql).toContain("pg_advisory_xact_lock");
expect(sql).toContain('collate "C"');
```

- [ ] **Step 2: Run the focused test and observe failure**

Run: `npm test -- tests/dino-ranking.test.js`

Expected: FAIL because the new migration does not exist.

- [ ] **Step 3: Implement the migration**

The migration must:

```sql
alter table public.dino_scores
  add column if not exists submission_source text not null default 'server';

-- BEFORE INSERT trigger overwrites source/flag from auth.role() and score.
-- submit_dino_score validates literal nicknames, locks by exact nickname,
-- inserts every 50k+ score as pirate, and stores sub-50k only on improvement.
-- get_dino_scoreboard excludes historical non-improvements, then returns
-- recent, topWithPirates, and topLegitimate as ordered JSON arrays.
```

Use exact nickname grouping with `COLLATE "C"`, `char_length`, a non-whitespace
check, and `created_at, id` tie breakers. Re-enable only column-level anonymous
insert for `nickname, score`; trigger-controlled fields remain unwritable.

- [ ] **Step 4: Run migration-contract tests**

Run: `npm test -- tests/dino-ranking.test.js`

Expected: migration contract tests PASS.

- [ ] **Step 5: Commit atomically**

```bash
git add supabase/migrations/20260802120000_dino_scoreboard.sql tests/dino-ranking.test.js
git commit -m "feat: define dino scoreboard invariants"
```

### Task 2: RPC-backed score API

**Files:**
- Modify: `src/lib/dinoRanking.js`
- Modify: `app/api/dino/score/route.js`
- Modify: `app/api/dino/scores/route.js`
- Test: `tests/dino-ranking.test.js`

- [ ] **Step 1: Add failing library and route tests**

Cover these exact behaviors:

```js
expect(validateNickname(" Hiago ")).toEqual({ value: " Hiago ", error: null });
expect(validateNickname("   ").error).toBe("nickname_blank");
expect(validateNickname("x".repeat(25)).error).toBe("nickname_too_long");
expect(isHackerScore(49999)).toBe(false);
expect(isHackerScore(50000)).toBe(true);
```

Assert `submitScore` posts `{ p_nickname, p_score }` to
`/rest/v1/rpc/submit_dino_score`, and `fetchScoreboard` calls
`/rest/v1/rpc/get_dino_scoreboard`. Assert GET returns the three arrays and POST
preserves literal nicknames while returning explicit validation errors.

- [ ] **Step 2: Run tests and observe failures**

Run: `npm test -- tests/dino-ranking.test.js`

Expected: FAIL on missing validators/RPC clients and old response fields.

- [ ] **Step 3: Implement minimal RPC clients and routes**

Use these interfaces:

```js
validateNickname(value) -> { value, error }
submitScore({ nickname, score }) -> { inserted, skipped, hacker }
fetchScoreboard(limit = 10) -> { recent, topWithPirates, topLegitimate }
```

Do not trim, lowercase, collapse, truncate, or pre-encode nicknames. Let
`JSON.stringify` and the RPC body preserve them exactly.

- [ ] **Step 4: Run backend tests and the full suite**

Run: `npm test -- tests/dino-ranking.test.js && npm test`

Expected: all tests PASS.

- [ ] **Step 5: Commit atomically**

```bash
git add src/lib/dinoRanking.js app/api/dino/score/route.js app/api/dino/scores/route.js tests/dino-ranking.test.js
git commit -m "feat: serve atomic dino scoreboard data"
```

### Task 3: Smooth accessible scoreboard modal

**Files:**
- Modify: `src/components/landing/cards/DinoGame.jsx`
- Modify: `src/components/landing/cards/RankingModal.jsx`
- Modify: `src/components/landing/styles/cards.css`
- Test: `tests/portfolio-landing.test.jsx`

- [ ] **Step 1: Add failing modal tests**

Verify:

```jsx
expect(screen.querySelector('[role="tab"][aria-selected="true"]')).toHaveTextContent("recent");
// Recent always includes pirate entries.
// Top starts with pirates visible.
// Clicking the flag toggle swaps to topLegitimate without a request.
// Reopening resets the toggle to visible.
// Error state exposes a retry action.
```

Use the repository's existing `createRoot`, `act`, and DOM-query pattern rather
than adding a testing dependency.

- [ ] **Step 2: Run the focused test and observe failure**

Run: `npm test -- tests/portfolio-landing.test.jsx`

Expected: FAIL because tabs and the pirate toggle do not exist.

- [ ] **Step 3: Implement the modal and trigger**

Use `role="tablist"`, `role="tab"`, `aria-selected`, and a pressed flag button.
Keep ten rows rendered for every state. Fetch once per open, switch arrays
locally, reset to Recent + pirates visible on each open, and animate only the
panel content with a short reduced-motion-aware transition. Rename the game
control from `latest` to `scores`.

- [ ] **Step 4: Run UI tests and full suite**

Run: `npm test -- tests/portfolio-landing.test.jsx && npm test`

Expected: all tests PASS without warnings attributable to the new modal.

- [ ] **Step 5: Commit atomically**

```bash
git add src/components/landing/cards/DinoGame.jsx src/components/landing/cards/RankingModal.jsx src/components/landing/styles/cards.css tests/portfolio-landing.test.jsx
git commit -m "feat: add dino scoreboard views"
```

### Task 4: Apply and validate locally against Supabase

**Files:**
- Verify: `supabase/migrations/20260802120000_dino_scoreboard.sql`
- Verify: all modified application files

- [ ] **Step 1: Apply the migration with configured sandbox credentials**

Back up the existing `dino_scores` rows first. Apply the migration using the
available Supabase CLI/project credentials. Do not delete or rewrite existing
rows.

- [ ] **Step 2: Validate database behavior with reversible test identities**

Confirm literal nickname distinctions, lower-score skipping, pirate scores not
blocking legitimate progression, direct anonymous inserts becoming pirate,
and all three projections. Use clearly prefixed temporary test nicknames and
remove only those test rows afterward when safe.

- [ ] **Step 3: Run application verification**

Run:

```bash
npm test
npm run build
npm run dev
```

Open the game modal locally at desktop and mobile sizes. Check tab keyboard
behavior, default pirate visibility, toggle transitions, exact nick rendering,
loading/error stability, and retry.

- [ ] **Step 4: Run final repository checks**

Run: `git diff --check && git status --short --branch`

Expected: no unintended files and no uncommitted implementation changes.
