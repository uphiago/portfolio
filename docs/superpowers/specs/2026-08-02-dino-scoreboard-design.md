# Dino Scoreboard Design

## Goal

Turn the Dino score modal into a smooth two-view scoreboard while preserving
its intentional honeypot behavior. The scoreboard is not only a global
ranking: it shows recent personal-best activity and also offers a top-ten view.

## Product semantics

### Nickname identity

- A nickname is preserved literally, including capitalization, Unicode,
  repeated internal whitespace, and leading or trailing whitespace.
- Nicknames that differ by any character are different identities.
- A nickname must contain at least one non-whitespace character.
- A nickname may contain at most 24 Unicode characters. Longer values are
  rejected with feedback; they are never silently truncated.

### Legitimate scores

- A score submitted through the application is legitimate only when it is
  greater than the exact nickname's previous legitimate personal best.
- Equal or lower application scores are acknowledged but not stored.
- Pirate scores never affect or block the legitimate personal-best sequence.
- The legitimate score threshold is 1 through 49,999 inclusive.

### Pirate honeypot

- Anonymous direct inserts into Supabase remain intentionally available.
- Every anonymous direct insert is marked as pirate by the database,
  regardless of its score.
- Every score of 50,000 or higher is marked as pirate, including scores sent
  through the application endpoint.
- Database logic overwrites client-provided origin and flag values so a caller
  cannot clear the pirate marker.
- Pirate entries remain visible as part of the experience.

## Data integrity

Supabase is the source of truth for score classification and legitimate score
progression.

- A database function performs application submissions atomically.
- For scores below 50,000, the function serializes concurrent submissions for
  the same exact nickname, checks the best legitimate score, and inserts only
  an improvement. Scores of 50,000 or higher are inserted as pirate events and
  do not participate in that comparison.
- A trigger records the submission origin and derives the pirate flag.
- Public reads remain enabled.
- Anonymous direct table inserts are re-enabled for the honeypot and are
  constrained by nickname and score validation.
- The application uses the server credential only for the application
  submission function.

Existing rows are preserved. Historical unflagged rows that fail to improve on
the preceding legitimate best are ignored by scoreboard queries rather than
deleted or reclassified.

## Scoreboard views

All nickname grouping uses exact identity; it must not lowercase, trim, or
collapse whitespace.

### Recent

- Shows the most recent eligible event for each exact nickname.
- Eligible events are valid legitimate personal-best improvements and all
  pirate entries.
- If a pirate entry is followed by a newer legitimate personal best for the
  same nickname, the legitimate entry becomes the visible recent event.
- Pirate entries are always visible in this view.
- Results are ordered by event creation time descending and limited to ten
  nicknames.

### Top 10

- Shows one entry per exact nickname, ordered by score descending.
- With pirates visible, the highest eligible score of either type represents
  each nickname.
- With pirates hidden, the highest valid legitimate score represents each
  nickname. A nickname with only pirate entries is omitted.
- Equal scores are ordered by the earliest achievement first, then by a stable
  row identifier.
- The pirate filter starts enabled every time the modal opens and is not
  persisted.

The database or a dedicated database function produces the complete result;
the implementation must not fetch an arbitrary recent sample and deduplicate
it in JavaScript.

## API contract

The score-reading endpoint returns three independently computed arrays:

```json
{
  "ok": true,
  "recent": [],
  "topWithPirates": [],
  "topLegitimate": []
}
```

Each entry contains the literal nickname, score, creation timestamp, pirate
flag, and origin needed by the UI. Responses are dynamic and uncached.

The write endpoint preserves the submitted nickname and returns explicit
outcomes:

- inserted legitimate personal best;
- skipped because the score did not improve;
- inserted and classified as pirate;
- rejected nickname or score with a user-facing validation reason;
- rate-limited or unavailable.

## Modal UX

- The existing modal gains accessible `Recent` and `Top 10` tabs.
- The active tab is visually obvious and keyboard navigable using standard tab
  semantics.
- The Top 10 tab includes a pirate-flag toggle. It starts on and switches
  between the two server-provided top arrays without another request.
- The Recent tab has no pirate toggle and always shows pirate markers.
- Tab and filter changes use a short opacity/position transition while keeping
  the modal dimensions stable.
- Loading uses ten stable skeleton rows; empty and disabled states explain what
  happened without collapsing the modal.
- Request failure retains the modal and offers a retry action.
- The triggering control should describe the broader scoreboard rather than
  only "latest" after both views exist.
- Nicknames use ellipsis visually but preserve their literal value in an
  accessible label or tooltip.
- The current player's exact nickname is highlighted only on exact equality.

## Edge cases

- `Hiago`, `hiago`, ` Hiago`, and `Hiago ` are four different nicknames.
- A nickname containing only whitespace is invalid.
- Unicode length is measured by characters rather than UTF-16 code units so an
  emoji is not split.
- URL-sensitive characters such as `@`, `%`, `+`, `?`, and spaces are encoded
  exactly once.
- Concurrent legitimate submissions cannot insert a lower score after a
  higher score for the same nickname.
- Direct pirate insertion cannot poison the legitimate personal best.
- A low direct score is still pirate because origin, not only magnitude,
  classifies it.
- A pirate row cannot set `flagged=false` or impersonate the legitimate
  submission origin.
- Historical lower unflagged rows do not become recent events or top scores.
- More than 30 events from a small number of nicknames cannot reduce the result
  below ten when ten eligible nicknames exist.

## Testing

Automated coverage will verify:

- literal nickname preservation and exact grouping;
- whitespace-only and over-length rejection without truncation;
- Unicode and URL-sensitive nickname handling;
- atomic legitimate improvement behavior, including equal, lower, and
  concurrent submissions;
- origin- and threshold-based pirate classification;
- pirate scores not blocking legitimate records;
- historical invalid-row exclusion;
- Recent, Top With Pirates, and Top Legitimate ordering and deduplication;
- tab semantics, default pirate visibility, toggle behavior, loading, empty,
  error, retry, and exact current-player highlighting;
- existing Dino game and portfolio regression suites.

## Non-goals

- Authenticating or reserving nicknames.
- Identifying whether two different literal nicknames belong to one person.
- Hiding or deleting pirate activity.
- Retrospectively deleting existing score rows.
