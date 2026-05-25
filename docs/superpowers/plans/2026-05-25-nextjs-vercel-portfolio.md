# Next.js Vercel Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a real Next.js App Router portfolio app that can deploy directly to Vercel.

**Architecture:** Scaffold a clean Next.js app at the repository root, move prototype material into `references/`, and rebuild the landing page as focused React components backed by static data. Keep the production runtime limited to `app/`, `src/`, `public/`, and standard Next configuration files.

**Tech Stack:** Next.js App Router, React, JavaScript, CSS, ESLint, npm, Vercel-compatible build scripts.

---

## File Structure

- Create: `package.json` with Next scripts and dependencies.
- Create: `next.config.mjs` for standard Next configuration.
- Create: `jsconfig.json` with `@/*` alias.
- Create: `.gitignore` for Next, Node, and Vercel outputs.
- Create: `app/layout.jsx` for metadata and root document shell.
- Create: `app/page.jsx` for the landing route.
- Create: `app/globals.css` for global layout and component styles.
- Create: `src/components/landing/PortfolioLanding.jsx` as the composed page.
- Create: `src/components/landing/Hero.jsx`, `StatusPanel.jsx`, `ProjectGrid.jsx`, `SocialLinks.jsx`, `ActivityTimeline.jsx`.
- Create: `src/data/portfolio.js` for editable content.
- Move: `src/`, `experiments/`, `assets/screenshots/`, `assets/uploads/`, `archive/`, and old static `index.html` under `references/extracted/`.
- Copy: useful served assets from `references/extracted/assets/uploads/` into `public/assets/`.
- Modify: `README.md` with Next/Vercel development commands.

## Task 1: Preserve Prototype References

- [ ] Move current extracted files out of the production runtime:

```bash
mkdir -p references/extracted
mv src references/extracted/src
mv experiments references/extracted/experiments
mv assets references/extracted/assets
mv archive references/extracted/archive
mv index.html references/extracted/index.html
```

- [ ] Verify the runtime root is clear:

```bash
find . -maxdepth 2 -type d | sort
```

Expected: root contains `docs`, `references`, and no production `src`, `assets`, or `experiments` directories from the prototype.

## Task 2: Scaffold Next.js Project Files

- [ ] Create the Next files with App Router, JavaScript, and CSS:

```bash
npm install next@latest react@latest react-dom@latest
npm install -D eslint eslint-config-next
mkdir -p app src/components/landing src/data public/assets
```

- [ ] Create `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
  "devDependencies": {
    "eslint": "latest",
    "eslint-config-next": "latest"
  }
}
```

- [ ] Create `next.config.mjs`:

```js
const nextConfig = {};

export default nextConfig;
```

- [ ] Create `jsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Task 3: Add Portfolio Content Data

- [ ] Create `src/data/portfolio.js` with content extracted from the prototype direction:

```js
export const profile = {
  name: "Hiago",
  role: "DevOps Engineer",
  headline: "I build reliable systems, automate delivery, and make infrastructure easier to operate.",
  location: "Brazil",
  availability: "Open to remote DevOps and platform work",
};

export const stats = [
  { label: "Focus", value: "DevOps" },
  { label: "Stack", value: "Cloud + CI/CD" },
  { label: "Mode", value: "Automation first" },
];

export const projects = [
  {
    title: "Homelab Platform",
    description: "Infrastructure experiments for self-hosted services, observability, and deployment workflows.",
    tags: ["Linux", "Docker", "Networking"],
  },
  {
    title: "CI/CD Automation",
    description: "Reusable pipeline patterns for safer releases, faster feedback, and repeatable environments.",
    tags: ["GitHub Actions", "Deploy", "Quality"],
  },
  {
    title: "Operational Dashboards",
    description: "Interfaces and signals that help teams understand system health without digging through noise.",
    tags: ["Monitoring", "SLOs", "Incident Response"],
  },
];

export const activity = [
  "Designing deployment workflows for small teams",
  "Documenting homelab infrastructure decisions",
  "Improving portfolio and public project presentation",
];

export const socials = [
  { label: "GitHub", href: "https://github.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "Email", href: "mailto:hello@example.com" },
];
```

## Task 4: Build Landing Components

- [ ] Create `src/components/landing/Hero.jsx`:

```jsx
import { profile, stats } from "@/src/data/portfolio";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__copy">
        <p className="eyebrow">{profile.role}</p>
        <h1 id="hero-title">{profile.name}</h1>
        <p className="hero__headline">{profile.headline}</p>
        <div className="hero__actions" aria-label="Primary actions">
          <a className="button button--primary" href="#projects">View work</a>
          <a className="button" href="#contact">Contact</a>
        </div>
      </div>
      <div className="hero__panel" aria-label="Profile status">
        {stats.map((stat) => (
          <div className="stat" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] Create the remaining components with the same pattern: import data, render semantic sections, no browser-only state.

## Task 5: Wire App Router

- [ ] Create `app/layout.jsx`:

```jsx
import "./globals.css";

export const metadata = {
  title: "Hiago | DevOps Engineer",
  description: "Portfolio for a DevOps engineer focused on reliable systems, automation, and infrastructure.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] Create `app/page.jsx`:

```jsx
import { PortfolioLanding } from "@/src/components/landing/PortfolioLanding";

export default function Page() {
  return <PortfolioLanding />;
}
```

## Task 6: Style And Verify

- [ ] Create `app/globals.css` with responsive, production-facing styles inspired by the refined prototype.
- [ ] Run:

```bash
npm run build
```

Expected: Next production build exits successfully.

- [ ] Run:

```bash
npm run dev
```

Expected: local development server starts and serves the portfolio.

## Self-Review

- Spec coverage: preserves references, creates real Next app, keeps Vercel-compatible scripts, builds landing as components.
- Placeholder scan: no implementation placeholders remain in required files or commands.
- Type consistency: all paths and imports use JavaScript files and `@/*` alias consistently.
