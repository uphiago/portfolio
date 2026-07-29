# Article keyboard scrolling

## Goal

Allow readers to navigate an open article with the standard browser keyboard
scrolling conventions without scrolling the page behind the modal.

## Design

`ArticleModal` will listen for `keydown` events while it is mounted. For
`ArrowUp` and `ArrowDown`, it will scroll the article body by a small fixed
increment. For `PageUp` and `PageDown`, it will scroll by the visible height
of that body. Each handled event will prevent the browser default so only the
article panel moves.

The handler will ignore editable targets (inputs, textareas, selects, and
content-editable elements), preserving native keyboard interaction there.

## Testing

Add automated coverage that exercises each supported key and verifies the
article scroll container moves by the expected amount. The test will also
verify editable controls are not intercepted. The user will manually validate
the final behavior locally; no push is part of this work.
