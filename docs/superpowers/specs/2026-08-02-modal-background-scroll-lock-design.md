# Modal Background Scroll Lock Design

## Goal

Prevent the page behind every modal from scrolling on desktop and mobile, including iOS, while preserving and restoring the exact background position when the last modal closes.

## Existing behavior and root cause

All article, contact, video, and Dino ranking dialogs use `BaseModal`. It currently sets only `document.body.style.overflow = "hidden"`. Mobile Safari does not reliably treat that as a viewport scroll lock, so the page behind a fixed overlay can still move or rubber-band.

## Design

Implement a shared, reference-counted scroll lock in `BaseModal.jsx`:

- On the first open modal, capture the current scroll position and the relevant inline styles on `html` and `body`.
- Freeze the body with `position: fixed` and a negative `top` equal to the current scroll position. Lock overflow on both `html` and `body`.
- Allow modal-owned scroll containers to keep their existing overflow behavior; do not cancel touch events globally.
- Increment a lock count for additional modals. Only the last closing modal restores the captured styles and calls `window.scrollTo` with the saved position.
- Preserve any inline styles that existed before the modal opened.

## Verification

- A regression test must fail against the current overflow-only implementation.
- Tests must verify fixed-body locking, exact style restoration, scroll restoration, and nested modal safety.
- Run the full test suite and production build.
- Verify locally in an iPhone viewport that the page scroll position does not change while contact, article, and Dino ranking modals are open and returns to the original position after closing.

