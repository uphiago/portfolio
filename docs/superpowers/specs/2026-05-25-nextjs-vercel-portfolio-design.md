# Next.js Vercel Portfolio Design

## Goal

Create a real Next.js portfolio application ready for Vercel deployment, using the extracted landing prototype files as references rather than as runtime architecture.

## Approved Approach

Use a clean Next.js App Router project at the repository root. The published app will be implemented as normal React components and CSS, not as Babel-loaded JSX scripts from `index.html`.

## Structure

- `app/layout.jsx` defines root metadata and imports global styles.
- `app/page.jsx` renders the landing page.
- `app/globals.css` contains the site styling.
- `src/components/landing/` holds focused landing-page components.
- `public/assets/` stores image assets that may be served by Next.js.
- `references/` preserves the extracted prototype files, experiments, screenshots, and original zip for consultation.

## Migration Rules

- Keep only production-facing code in `app/`, `src/`, and `public/`.
- Move current prototype code and experiment HTML out of the runtime path.
- Use static data objects for portfolio content so sections can be edited without digging through layout code.
- Use plain CSS first; avoid adding dependencies beyond what `create-next-app` provides unless the implementation requires them.
- Favor server components by default. Add client components only if interactive UI requires browser state.

## Vercel Requirements

- Include `package.json` scripts for `dev`, `build`, `start`, and `lint`.
- Ensure `npm run build` succeeds locally.
- Keep the app compatible with Vercel's standard Next.js detection.

## References Checked

- Next.js App Router getting started docs, updated March 16, 2026.
- Next.js deployment docs, updated March 25, 2026.
- Vercel Next.js framework page, crawled May 25, 2026.
