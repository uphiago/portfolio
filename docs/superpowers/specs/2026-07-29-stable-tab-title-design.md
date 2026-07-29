# Stable Tab Title Design

## Goal

Keep the browser tab title at the site default, `Hiago | Sr. Systems Specialist & DevOps`, regardless of whether a blog post is opened from a direct external link or through the landing page.

## Design

The root layout remains the single owner of the document title. `app/page.jsx` will continue generating article-specific description, canonical URL, Open Graph, and Twitter metadata for `?post=` URLs, but it will no longer return a `title` field. This avoids a post title replacing the layout default during route transitions or browser history changes.

## Validation

Add a regression test that calls `generateMetadata` for a known post and verifies the returned metadata has no `title` override while retaining its post-specific Open Graph and Twitter titles.
