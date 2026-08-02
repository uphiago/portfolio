# Dino Keyboard Scroll Design

## Goal

Prevent `Space` and `ArrowUp` from scrolling a narrow page when they are being used to control the visible Dino game, without taking those keys away from normal page navigation or interactive controls.

## Root cause

The Runner listens for keyboard events on `document` and uses user-agent detection to cancel native scrolling only after `playing` is already true. A desktop browser at mobile width is not classified as mobile, and the first jump always occurs before the condition can pass.

## Design

- Treat `Space` and `ArrowUp` as consumed game input when at least 50px of the game stage is vertically visible.
- Cancel the native key behavior before starting the first jump, independent of user-agent and viewport width.
- When the game is outside the viewport, ignore the jump key and preserve native page scrolling.
- Ignore events already canceled by another component and events originating from inputs, textareas, selects, buttons, links, or editable content.
- Keep touch, mouse, duck, restart, and score behavior unchanged.

## Verification

Execute the actual `public/dino/runner.js` in jsdom and test visible, offscreen, interactive-target, and ArrowUp cases. Then verify the original scroll reproduction in Chromium at 390×664 and run the complete tests and production build.

