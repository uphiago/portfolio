# Dino Mobile Layout Stability Design

## Goal

Prevent the Dino card from changing height when `/dino/runner.js` finishes loading after a mobile refresh.

## Root cause

The server-rendered `.dino-game-wrap` has no intrinsic height because its game container is empty and its hint is absolutely positioned. The Runner later injects a `.runner-container` whose fixed height is 150px. Mobile cards use automatic height, so this changes the card from 71px to 221px after first paint.

## Design

Reserve a minimum height of 150px on `.dino-game-wrap`, matching the Runner's existing 150px canvas height. Keep the game loader, markup, ranking requests, and responsive layout unchanged. The existing absolutely positioned hint will use the reserved area and remain centered before the Runner is ready.

Using the wrapper keeps the card stable while allowing the game element itself to be populated normally. A minimum height is preferred over animating the card or delaying its display because it removes the layout shift instead of disguising it.

## Verification

- Add a CSS regression test asserting that the wrapper reserves 150px and the injected Runner remains 150px tall.
- Run the focused test and full test suite.
- Build the production bundle.
- Load the local production build with an iPhone viewport while delaying `runner.js`; verify that the card and wrapper have identical heights before and after Runner initialization.

