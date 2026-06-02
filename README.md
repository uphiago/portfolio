# Portfolio

Next.js portfolio app for Vercel deployment.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Checks

```bash
npm test
npm run lint
npm run build
```

## Structure

- `app/` - Next.js App Router pages, layout, and global CSS.
- `src/components/landing/` - landing page components.
  - `cards/` - bento cards (terminal hero, reels, write-ups, audience).
  - `modals/` - contact, article, and video dialogs (`BaseModal` shared shell).
  - `styles/` - scoped CSS split into `base`, `cards`, `modals`, `responsive`.
  - `data.js` - editable portfolio content (videos, articles).
- `public/assets/` - static assets served by Next.js.

## Environment

Copy `.env.example` to `.env.local` and adjust as needed. `NEXT_PUBLIC_SITE_URL`
is used for SEO canonical and Open Graph metadata.
