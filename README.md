# hiago.sh

Personal portfolio — live at **[hiago.sh](https://hiago.sh)**.

Built with Next.js App Router. Deployed on Vercel.

## What's here

- **Write-ups** — synced live from [dotmindblog](https://dotmindblog.vercel.app) via GitHub raw. Click to read inline, `?post=XX` for direct link sharing.
- **Reels** — pulls the latest videos from a [YouTube playlist](https://www.youtube.com/playlist?list=PL6N1UVmmKz5Y6V3doyQQn4n3sB7F3Uj9W). Configured in `youtube.js`.
- **Terminal** — bio, contact modal, social links.
- **Bento grid** — responsive CSS grid layout, no Tailwind.

## Development

```bash
npm install
npm run dev       # localhost:3000
npm test
npm run lint
npm run build
```

## Structure

```
app/                  → Next.js App Router (page, layout, globals)
src/components/landing/
  cards/              → TerminalHero, VideoCard, WriteupsCard
  modals/             → ArticleModal, ContactModal, BaseModal
  styles/             → base.css, cards.css, modals.css, responsive.css
  blog.js             → fetches posts from dotmindblog GitHub repo
  youtube.js          → fetches playlist from YouTube Data API
  data.js             → fallback content
```
