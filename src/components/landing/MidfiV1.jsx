"use client";

import React from "react";

// Mid-fi v1 — Builder-led, polished
// Real SVG icons (original — geometric interpretations, not platform logos)
// Animated terminal cursor · refined video thumb · architecture diagram in repo card
// Tighter micro-typography, optical alignment, subtle texture on dark blocks

const MIDFI_CSS = `
  .mfi {
    --m-ink: #0a0a0a;
    --m-ink-2: #222;
    --m-ink-soft: #585858;
    --m-ink-faint: #909090;
    --m-paper: #fbfaf6;
    --m-paper-2: #f4f1e8;
    --m-line: #e7e2d6;
    --m-line-strong: #d7d0c0;
    --m-rule: #cbc4b5;
    --m-rule-soft: rgba(30, 26, 20, 0.12);
    --m-shadow: 0 18px 42px rgba(44, 39, 28, 0.08);
    --m-highlight: rgba(255, 255, 255, 0.58);
    --m-live: #e1372a;
    --m-green: #5fb784;
    font-family: "IBM Plex Sans", system-ui, sans-serif;
    color: var(--m-ink);
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    height: 100svh;
    padding: 10px;
    overflow: hidden;
    background: var(--m-paper);
  }
  .mfi-shell {
    background: rgba(251, 250, 246, 0.9);
    border: 1px solid var(--m-rule-soft);
    border-radius: 18px;
    padding: 14px;
    height: calc(100svh - 20px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: var(--m-shadow), inset 0 1px 0 var(--m-highlight);
  }
  .mfi-topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    flex-shrink: 0;
  }
  .mfi-socials {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .mfi-grid {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    grid-auto-rows: minmax(0, 1fr);
    gap: 10px;
    min-height: 0;
    flex: 1;
  }
  .mfi-grid > * {
    min-width: 0;
    min-height: 0;
  }
  .mfi .footer {
    flex-shrink: 0;
  }
  .mfi .mono { font-family: "JetBrains Mono", monospace; font-feature-settings: "ss01" on; }
  .mfi .card {
    background: rgba(251, 250, 246, 0.82);
    border: 1px solid var(--m-rule-soft);
    border-radius: 12px;
    padding: 16px;
    transition: transform .2s cubic-bezier(.2,.7,.3,1), box-shadow .2s ease;
    position: relative;
    overflow: hidden;
    box-shadow: 0 10px 28px rgba(44, 39, 28, 0.055), inset 0 1px 0 var(--m-highlight);
  }
  /* Cards are static surfaces — no hover.
     Hover lives only on clickable children: .btn, .star-row, .vtile, .social. */
  .mfi .card.dark {
    background: #11100d; color: #f1efe8; border-color: rgba(255,255,255,0.1);
    background-image: none;
  }
  .mfi .card.flat { padding: 0; overflow: hidden; }

  .mfi .eyebrow {
    font-family: "JetBrains Mono", monospace;
    font-size: 10.5px; letter-spacing: 0.06em;
    color: var(--m-ink-soft); text-transform: lowercase;
    display: inline-flex; align-items: center; gap: 6px;
    white-space: nowrap;
  }
  .mfi .eyebrow-dark { color: #8c8c8c; }
  .mfi .h-hero {
    font-family: "IBM Plex Sans";
    font-weight: 600; font-size: 44px;
    line-height: 1.05; letter-spacing: -0.025em;
    margin: 0;
  }
  .mfi .h-card {
    font-family: "IBM Plex Sans";
    font-weight: 600; font-size: 19px;
    line-height: 1.25; letter-spacing: -0.015em;
    margin: 0;
  }
  .mfi .h-mono {
    font-family: "JetBrains Mono"; font-weight: 500;
    font-size: 16px; letter-spacing: -0.02em;
    margin: 0;
  }
  .mfi .body {
    font-family: "IBM Plex Sans"; font-size: 13.5px;
    line-height: 1.55; color: var(--m-ink-soft);
  }
  .mfi .meta {
    font-family: "JetBrains Mono"; font-size: 10.5px;
    color: var(--m-ink-faint); letter-spacing: 0.01em;
  }

  .mfi .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 9px 16px;
    border: 1px solid rgba(10, 10, 10, 0.22);
    border-radius: 999px;
    background: rgba(251, 250, 246, 0.82);
    color: var(--m-ink);
    font-family: "JetBrains Mono"; font-size: 12px; font-weight: 500;
    text-decoration: none; cursor: pointer;
    transition: background .15s ease, color .15s ease, transform .15s ease;
  }
  .mfi .btn:hover { background: var(--m-ink); color: var(--m-paper); }
  .mfi .btn:active { transform: scale(.97); }
  .mfi .btn.dark { background: var(--m-ink); color: var(--m-paper); }
  .mfi .btn.dark:hover { background: var(--m-paper); color: var(--m-ink); }
  .mfi .btn.invert { background: #f1efe8; color: #0a0a0a; border: none; }

  .mfi .live {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: "JetBrains Mono"; font-size: 10px; font-weight: 600;
    color: var(--m-live); letter-spacing: 0.08em;
    white-space: nowrap;
  }
  .mfi .live::before {
    content: ""; width: 6px; height: 6px; border-radius: 50%;
    background: var(--m-live); animation: pulse 1.5s infinite;
    box-shadow: 0 0 0 0 rgba(225, 55, 42, 0.4);
  }

  /* Topbar */
  .mfi .brand {
    display: inline-flex; align-items: baseline; gap: 3px;
    font-family: "JetBrains Mono"; font-weight: 600;
    font-size: 16px; letter-spacing: -0.02em;
  }
  .mfi .brand .dot-d { color: var(--m-ink-soft); }
  .mfi .glyph {
    width: 36px; height: 36px;
    border: 1px solid var(--m-rule-soft);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
    background: rgba(255, 255, 255, 0.38);
    box-shadow: inset 0 1px 0 var(--m-highlight);
  }
  .mfi .glyph svg { display: block; }
  .mfi .glyph::after {
    content:""; position:absolute; inset: 0;
    background: transparent;
    pointer-events: none;
  }

  .mfi .social {
    display: inline-flex; align-items: center; justify-content: center;
    width: 28px; height: 28px;
    transition: color .15s ease, transform .15s ease;
    cursor: pointer; color: var(--m-ink-soft);
    text-decoration: none;
  }
  .mfi .social:hover {
    color: var(--m-ink);
    transform: translateY(-1px);
  }
  .mfi .social svg { display: block; width: 18px; height: 18px; }

  /* Terminal */
  .mfi .terminal {
    background: #0a0a0a; color: #d0d0d0;
    border-radius: 12px;
    font-family: "JetBrains Mono"; font-size: 12.5px;
    padding: 14px 18px 16px; line-height: 1.65;
    border: 1px solid rgba(255,255,255,0.08);
    position: relative; overflow: hidden;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 14px 32px rgba(10,10,10,0.12);
  }
  .mfi .terminal::before {
    content: ""; position: absolute; inset: 0;
    background: transparent;
    pointer-events: none;
  }
  .mfi .terminal .tbar { display:flex; gap: 6px; margin-bottom: 14px; align-items: center; }
  .mfi .terminal .tdot { width: 10px; height: 10px; border-radius: 50%; }
  .mfi .terminal .tpath { margin-left: auto; font-size: 10px; color: #666; }
  .mfi .terminal .prompt { color: #6dd49a; }
  .mfi .terminal .accent { color: #f1efe8; font-weight: 500; }
  .mfi .terminal .dim { color: #707070; }
  .mfi .terminal .cursor {
    display: inline-block; width: 7px; height: 14px;
    background: #d0d0d0; vertical-align: -2px;
    animation: blink 1s steps(2, end) infinite;
  }
  @keyframes blink { 50% { opacity: 0; } }

  /* Shorts strip */
  .mfi .shorts { display: flex; gap: 6px; }
  .mfi .shorts .s {
    flex: 1; aspect-ratio: 9/16; max-height: 68px;
    border-radius: 5px;
    background: #121212;
    border: 1px solid #232323;
    display: flex; align-items: flex-end; padding: 5px;
    font-family: "JetBrains Mono"; font-size: 9px; color: #9a9a9a;
    position: relative; overflow: hidden;
    cursor: pointer;
    transition: transform .15s ease, border-color .15s ease;
  }
  .mfi .shorts .s:hover { transform: translateY(-2px); border-color: #444; }
  .mfi .shorts .s::before {
    content:""; position: absolute; left: 50%; top: 38%; transform: translate(-50%, -50%);
    width: 18px; height: 18px; border-radius: 50%;
    background: rgba(255,255,255,0.12); backdrop-filter: blur(2px);
  }
  .mfi .shorts .s::after {
    content:"▶"; position: absolute; left: 50%; top: 38%; transform: translate(-50%, -50%);
    font-size: 7px; color: rgba(255,255,255,0.9);
  }

  /* Video band thumbnail */
  .mfi .vthumb {
    position: relative; overflow: hidden;
    background: #121212;
    display: flex; align-items: center; justify-content: center;
  }
  .mfi .vthumb::before {
    content:""; position: absolute; inset: 0;
    background: transparent;
    pointer-events: none;
  }
  .mfi .vthumb .play {
    width: 64px; height: 64px; border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.5);
    display: flex; align-items: center; justify-content: center;
    color: rgba(255,255,255,0.85); font-size: 20px;
    backdrop-filter: blur(8px);
    background: rgba(255,255,255,0.06);
    transition: transform .2s ease, background .2s ease;
    cursor: pointer;
  }
  .mfi .vthumb:hover .play { transform: scale(1.08); background: rgba(255,255,255,0.12); }
  .mfi .vthumb .topo {
    position: absolute; inset: 0;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 120' fill='none' stroke='%23ffffff' stroke-width='0.4' opacity='0.18'><path d='M0 80 Q 50 60 100 70 T 200 50'/><path d='M0 90 Q 50 75 100 82 T 200 65'/><path d='M0 100 Q 50 88 100 92 T 200 80'/></svg>");
    background-size: cover;
    pointer-events: none;
  }
  .mfi .vthumb .ts {
    position: absolute; right: 10px; bottom: 10px;
    padding: 3px 7px; border-radius: 4px;
    background: rgba(0,0,0,0.7); color: #f1efe8;
    font-family: "JetBrains Mono"; font-size: 10px;
  }

  /* Star rows for write-ups */
  .mfi .star-row {
    display: grid; grid-template-columns: 22px 1fr auto;
    gap: 14px; align-items: baseline;
    padding: 9px 10px;
    border-radius: 6px;
    border-bottom: 1px solid var(--m-line);
    cursor: pointer; position: relative;
    transition: background .2s ease, box-shadow .25s ease, border-color .2s ease;
  }
  .mfi .star-row:last-child { border-bottom: none; padding-bottom: 9px; }
  .mfi .star-row:first-of-type { padding-top: 9px; }
  .mfi .star-row:hover {
    background: rgba(255, 251, 235, 0.6);
    border-bottom-color: transparent;
    box-shadow:
      inset 0 0 0 1px rgba(10, 10, 10, 0.12),
      0 0 0 1px rgba(255, 200, 120, 0.25),
      0 0 14px rgba(255, 180, 80, 0.18);
  }
  .mfi .star-row:hover .arr { transform: translateX(3px); color: var(--m-ink); }
  .mfi .star-row .idx { font-family: "JetBrains Mono"; font-size: 10.5px; color: var(--m-ink-faint); }
  .mfi .star-row .ti {
    font-family: "IBM Plex Sans"; font-weight: 500; font-size: 14.5px;
    line-height: 1.35; letter-spacing: -0.005em;
  }
  .mfi .star-row .sub {
    font-family: "JetBrains Mono"; font-size: 10.5px;
    color: var(--m-ink-faint); margin-top: 3px;
  }
  .mfi .star-row .arr {
    font-family: "JetBrains Mono"; font-size: 12px;
    color: var(--m-ink-faint);
    transition: transform .15s ease, color .15s ease;
  }

  /* Sparkline + chart */
  .mfi .spark { display: block; }
  .mfi .spark polyline { stroke: var(--m-ink); stroke-width: 1.5; fill: none; }
  .mfi .spark .area { fill: rgba(0,0,0,0.05); }

  /* Diagram (small architecture preview) */
  .mfi .diag {
    background: var(--m-paper-2); border-radius: 6px;
    padding: 14px; margin-top: 4px;
    border: 1px solid var(--m-line);
  }

  /* Stack table */
  .mfi .stack-row {
    display: grid; grid-template-columns: 84px 1fr;
    gap: 14px; align-items: baseline;
    padding: 4px 0;
    font-family: "JetBrains Mono"; font-size: 11.5px;
    line-height: 1.7;
  }
  .mfi .stack-row .k { color: #8a8a8a; }
  .mfi .stack-row .v { color: #f1efe8; }

  /* Status list */
  .mfi .stat-row {
    display: flex; gap: 10px; align-items: center;
    padding: 5px 0;
    font-family: "JetBrains Mono"; font-size: 12.5px;
  }
  .mfi .stat-row .bullet {
    width: 8px; height: 8px; border-radius: 50%;
    flex-shrink: 0;
  }
  .mfi .stat-row .b-on { background: var(--m-green); box-shadow: 0 0 0 3px rgba(95, 183, 132, 0.12); }
  .mfi .stat-row .b-off { border: 1px solid #c0c0c0; background: transparent; }

  /* Newsletter input */
  .mfi .nlinput {
    display: flex; align-items: center;
    border: 1px solid #2a2a2a; border-radius: 999px;
    background: #131313; padding: 4px;
  }
  .mfi .nlinput input {
    flex: 1; background: transparent; border: none; outline: none;
    color: #c8c8c8; padding: 7px 14px;
    font-family: "JetBrains Mono"; font-size: 12px;
  }
  .mfi .nlinput input::placeholder { color: #666; }

  /* Footer */
  .mfi .footer {
    border-top: 1px solid var(--m-line);
    margin-top: 10px; padding-top: 10px;
    display: flex; justify-content: space-between; align-items: center;
    font-family: "JetBrains Mono"; font-size: 10.5px; color: var(--m-ink-faint);
  }

  /* ───── Video library (2 YT + 2 Shorts, side-by-side sections) ───── */
  .mfi .vbody {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    padding: 4px 18px 18px;
    flex: 1;
  }
  .mfi .vsection {
    display: flex; flex-direction: column; gap: 10px;
    min-height: 0;
  }
  .mfi .vsection .vlbl {
    display: flex; justify-content: space-between; align-items: baseline;
    font-family: "JetBrains Mono"; font-size: 10px;
    color: #6dd49a; letter-spacing: 0.06em;
    text-transform: lowercase;
    padding-bottom: 2px;
    border-bottom: 0;
  }
  .mfi .vsection .vlbl .count {
    color: #777;
  }
  .mfi .vsection .vlbl .more {
    border: 0;
    border-radius: 0;
    background: transparent;
    color: #9b9b9b;
    padding: 0 0 0 6px;
    font-family: "JetBrains Mono";
    font-size: 13px;
    line-height: 1;
    cursor: pointer;
    transition: color .15s ease, transform .15s ease;
  }
  .mfi .vsection .vlbl .more:hover {
    color: #f1efe8;
    transform: translateY(1px);
  }
  .mfi .vrow {
    display: grid; gap: 12px;
    flex: 1;
    min-height: 0;
    max-height: 154px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 4px;
    align-content: start;
  }
  .mfi .vrow::-webkit-scrollbar { width: 6px; }
  .mfi .vrow::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.18); border-radius: 999px; }
  .mfi ::-webkit-scrollbar-button { display: none; height: 0; width: 0; }
  .mfi .vrow.yt { grid-template-columns: 1fr; }
  .mfi .vrow.short { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .mfi .card.dark.video-card,
  .mfi .card.dark.newsletter-card {
    border-color: transparent;
    box-shadow: none;
  }

  .mfi .vtile { display: flex; cursor: pointer; min-width: 0; }
  .mfi .vtile.yt { gap: 12px; align-items: center; }
  .mfi .vtile.short {
    flex-direction: row; gap: 10px; align-items: center;
    text-align: left; width: 100%;
  }

  .mfi .vthumb-mini {
    position: relative; overflow: hidden;
    background: #121212;
    background-size: cover; background-position: center;
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 8px;
    flex-shrink: 0;
    transition: transform .18s ease, border-color .18s ease, opacity .18s ease;
  }
  .mfi .vtile:hover .vthumb-mini {
    transform: translateY(-1px);
    border-color: rgba(255,255,255,0.24);
    opacity: 0.92;
  }
  .mfi .vthumb-mini::before {
    content:""; position: absolute; inset: 0;
    background: transparent;
    pointer-events: none;
  }
  .mfi .vthumb-mini.yt {
    aspect-ratio: 16/9;
    height: 68px; width: auto;
  }
  .mfi .vthumb-mini.short {
    aspect-ratio: 9/16;
    width: auto; height: 74px;
    margin: 0;
  }
  .mfi .vplay {
    position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
    width: 36px; height: 36px; border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.72);
    background: rgba(0,0,0,0.54);
    backdrop-filter: none;
    color: rgba(255,255,255,1);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px;
    transition: transform .15s ease, background .15s ease;
  }
  .mfi .vtile:hover .vplay { transform: translate(-50%, -50%) scale(1.06); background: rgba(0,0,0,0.7); }
  .mfi .vts {
    position: absolute; right: 5px; bottom: 5px;
    padding: 2px 6px; border-radius: 3px;
    background: #0a0a0a; color: #f1efe8;
    font-family: "JetBrains Mono"; font-size: 9px; font-weight: 500;
    backdrop-filter: none;
  }
  .mfi .vtile .vinfo {
    flex: 1; min-width: 0;
    display: flex; flex-direction: column; justify-content: center; gap: 3px;
  }
  .mfi .vtitle {
    font-family: "IBM Plex Sans"; font-weight: 500;
    font-size: 12.5px; line-height: 1.3; color: #f1efe8;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .mfi .vtile.short .vtitle {
    font-size: 11px; -webkit-line-clamp: 2;
    text-align: left; width: 100%;
    white-space: normal;
  }
  .mfi .vmeta {
    font-family: "JetBrains Mono"; font-size: 9.5px; color: #888;
  }
  .mfi .vtile.short .vmeta {
    font-size: 9.5px; text-align: left; width: 100%;
  }

  .mfi .repo-card {
    cursor: pointer;
    isolation: isolate;
  }
  .mfi .repo-card::before {
    content: "";
    position: absolute;
    right: -18px;
    bottom: -22px;
    width: 152px;
    height: 152px;
    background: url("/assets/github-logo.svg") center / contain no-repeat;
    opacity: 0.045;
    pointer-events: none;
    z-index: 0;
  }
  .mfi .repo-card > * {
    position: relative;
    z-index: 1;
  }
  .mfi .repo-card:focus-visible {
    outline: 2px solid rgba(10, 10, 10, 0.35);
    outline-offset: 3px;
  }
  .mfi .repo-card:hover {
    border-color: rgba(10, 10, 10, 0.22);
  }
  .mfi .repo-card-body {
    margin-top: auto;
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(180px, 0.85fr);
    gap: 12px;
    align-items: start;
  }
  .mfi .repo-note {
    font-family: "IBM Plex Sans";
    font-size: 15px;
    line-height: 1.5;
    color: var(--m-ink);
    margin-bottom: 16px;
    font-weight: 400;
  }
  .mfi .repo-live {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 12px;
  }
  .mfi .repo-live-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .mfi .repo-live-item .k {
    font-family: "JetBrains Mono";
    font-size: 9.5px;
    color: var(--m-ink-faint);
  }
  .mfi .repo-live-item .v {
    font-family: "JetBrains Mono";
    font-size: 13px;
    color: var(--m-ink);
    font-weight: 500;
  }
  .mfi .repo-facts {
    display: grid;
    gap: 8px;
  }
  .mfi .repo-fact {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    border: 1px dashed var(--m-line);
    border-radius: 6px;
    padding: 6px 8px;
    background: transparent;
  }
  .mfi .repo-fact .k {
    font-family: "JetBrains Mono";
    font-size: 9px;
    color: var(--m-ink-faint);
    text-transform: lowercase;
  }
  .mfi .repo-fact .v {
    font-family: "JetBrains Mono";
    font-size: 10.5px;
    color: var(--m-ink);
    text-align: right;
  }
  .mfi .repo-mini-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
  }
  .mfi .repo-mini-tags span {
    border: 1px solid rgba(10,10,10,0.12);
    border-radius: 999px;
    padding: 2px 7px;
    font-family: "JetBrains Mono";
    font-size: 9.5px;
    color: var(--m-ink-soft);
    background: rgba(255,255,255,0.16);
  }
  .mfi .repo-modal {
    width: min(680px, 92vw);
  }
  .mfi .repo-modal .repo-head {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 18px;
    padding-right: 34px;
  }
  .mfi .repo-modal .repo-title {
    font-family: "JetBrains Mono";
    font-size: 21px;
    font-weight: 600;
    letter-spacing: -0.03em;
    margin: 2px 0 8px;
  }
  .mfi .repo-modal .repo-mark {
    width: 58px;
    height: 58px;
    flex: 0 0 auto;
    opacity: 0.22;
    background: url("/assets/github-logo.svg") center / contain no-repeat;
  }
  .mfi .repo-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin: 12px 0 18px;
  }
  .mfi .repo-tags span {
    background: rgba(255,255,255,0.22);
    border: none;
    border-radius: 999px;
    padding: 3px 8px;
    font-family: "JetBrains Mono";
    font-size: 10px;
    color: var(--m-ink-soft);
  }
  .mfi .repo-readme {
    border: 1px solid var(--m-line);
    border-radius: 10px;
    background: rgba(255,255,255,0.32);
    padding: 14px 16px;
    font-family: "JetBrains Mono";
    font-size: 11px;
    line-height: 1.65;
    color: var(--m-ink-soft);
    max-height: 180px;
    overflow: auto;
  }
  .mfi .repo-readme b {
    color: var(--m-ink);
  }
  .mfi .repo-readme .readme-title {
    color: var(--m-ink);
    font-family: "IBM Plex Sans";
    font-size: 17px;
    font-weight: 600;
    line-height: 1.25;
    margin: 8px 0 10px;
  }
  .mfi .repo-readme .readme-line {
    margin: 7px 0;
  }
  .mfi .hero-contact-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 18px 22px;
  }
  .mfi .hero-contact-card .btn {
    flex-shrink: 0;
  }

  /* ───── Modal ───── */
  .mfi-modal-bg {
    position: fixed; inset: 0; z-index: 2147483640;
    background: rgba(10,10,10,0.55);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    animation: mfi-fade .18s ease;
  }
  @keyframes mfi-fade { from { opacity: 0; } to { opacity: 1; } }
  .mfi-modal {
    width: min(520px, 92vw);
    background: var(--m-paper);
    border: 1px solid rgba(30, 26, 20, 0.14);
    border-radius: 14px;
    padding: 28px;
    box-shadow: 0 28px 80px rgba(0,0,0,0.24);
    font-family: "IBM Plex Sans";
    color: var(--m-ink);
    animation: mfi-pop .22s cubic-bezier(.2,.7,.3,1);
    position: relative;
  }
  @keyframes mfi-pop { from { transform: translateY(8px) scale(.98); opacity: 0; } to { transform: none; opacity: 1; } }
  .mfi-modal .x {
    position: absolute; top: 14px; right: 14px;
    width: 28px; height: 28px; border-radius: 50%;
    border: 1px solid rgba(30, 26, 20, 0.14); background: var(--m-paper);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-family: "JetBrains Mono"; font-size: 12px;
    transition: background .15s ease, color .15s ease;
  }
  .mfi-modal .x:hover { background: var(--m-ink); color: var(--m-paper); }
  .mfi-modal .row {
    display: grid; grid-template-columns: 110px 1fr;
    gap: 14px; padding: 9px 0;
    border-bottom: 1px solid var(--m-line);
    align-items: baseline;
  }
  .mfi-modal .row:last-of-type { border-bottom: none; }
  .mfi-modal .row .k {
    font-family: "JetBrains Mono"; font-size: 11px;
    color: var(--m-ink-soft); letter-spacing: 0.02em;
  }
  .mfi-modal .row .v {
    font-family: "IBM Plex Sans"; font-size: 13.5px; color: var(--m-ink);
    line-height: 1.45;
  }
  .mfi-modal label {
    display: block;
    font-family: "JetBrains Mono"; font-size: 11px; color: var(--m-ink-soft);
    margin-bottom: 6px;
  }
  .mfi-modal input, .mfi-modal textarea {
    width: 100%; box-sizing: border-box;
    border: 1px solid var(--m-line-strong);
    border-radius: 8px;
    background: var(--m-paper);
    padding: 10px 12px;
    font-family: "IBM Plex Sans"; font-size: 13.5px;
    color: var(--m-ink); outline: none;
    transition: border-color .15s ease;
    resize: vertical;
  }
  .mfi-modal input:focus, .mfi-modal textarea:focus { border-color: var(--m-ink); }
  .mfi-modal textarea { min-height: 92px; }

  /* ───── Article modal (wider, markdown content) ───── */
  .mfi-article-bg {
    position: fixed; inset: 0; z-index: 2147483640;
    background: rgba(10,10,10,0.6);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    animation: mfi-fade .18s ease;
    padding: 24px;
  }
  .mfi-article {
    width: min(720px, 100%);
    max-height: calc(100vh - 48px);
    background: var(--m-paper);
    border: 1px solid rgba(30, 26, 20, 0.14);
    border-radius: 14px;
    box-shadow: 0 28px 86px rgba(0,0,0,0.28);
    display: flex; flex-direction: column;
    animation: mfi-pop .22s cubic-bezier(.2,.7,.3,1);
    overflow: hidden;
  }
  .mfi-article .ahead {
    padding: 24px 28px 18px;
    border-bottom: 1px solid var(--m-line);
    display: flex; flex-direction: column; gap: 6px;
    position: relative;
  }
  .mfi-article .ahead .x {
    position: absolute; top: 14px; right: 14px;
    width: 28px; height: 28px; border-radius: 50%;
    border: 1px solid rgba(30, 26, 20, 0.14); background: var(--m-paper);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-family: "JetBrains Mono"; font-size: 12px;
    transition: background .15s ease, color .15s ease;
  }
  .mfi-article .ahead .x:hover { background: var(--m-ink); color: var(--m-paper); }
  .mfi-article .ahead .crumb {
    font-family: "JetBrains Mono"; font-size: 10.5px;
    color: var(--m-ink-soft); letter-spacing: 0.04em;
  }
  .mfi-article .ahead .ti {
    font-family: "IBM Plex Sans"; font-weight: 600;
    font-size: 24px; line-height: 1.2; letter-spacing: -0.02em;
    margin: 4px 0 8px;
  }
  .mfi-article .ahead .meta-row {
    display: flex; gap: 10px; align-items: center; flex-wrap: wrap;
    font-family: "JetBrains Mono"; font-size: 11px; color: var(--m-ink-soft);
  }
  .mfi-article .ahead .tag {
    padding: 2px 8px; border: 1px solid var(--m-line-strong);
    border-radius: 999px; font-size: 10px;
  }
  .mfi-article .abody {
    padding: 22px 28px 28px;
    overflow-y: auto;
    flex: 1;
  }
  .mfi-article .abody h3 {
    font-family: "IBM Plex Sans"; font-weight: 600;
    font-size: 16px; letter-spacing: -0.01em;
    margin: 22px 0 8px;
  }
  .mfi-article .abody h3:first-child { margin-top: 0; }
  .mfi-article .abody p {
    font-family: "IBM Plex Sans"; font-size: 14px;
    line-height: 1.6; color: var(--m-ink);
    margin: 0 0 10px;
  }
  .mfi-article .abody pre {
    font-family: "JetBrains Mono"; font-size: 12px;
    background: #0a0a0a; color: #d8d8d8;
    padding: 14px 16px; border-radius: 8px;
    margin: 10px 0 14px; overflow-x: auto;
    line-height: 1.6; white-space: pre;
  }
  .mfi-article .abody ul {
    margin: 4px 0 14px; padding-left: 22px;
    font-family: "IBM Plex Sans"; font-size: 14px;
    line-height: 1.7;
  }
  .mfi-article .abody ul li::marker { color: var(--m-ink-faint); }
  .mfi-article .afoot {
    border-top: 1px solid var(--m-line);
    padding: 14px 28px;
    display: flex; justify-content: space-between; align-items: center;
    font-family: "JetBrains Mono"; font-size: 11px;
    color: var(--m-ink-soft);
    background: var(--m-paper-2);
  }

  /* Write-ups scroll list */
  .mfi .wlist {
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: var(--m-line-strong) transparent;
  }
  .mfi .wlist::-webkit-scrollbar { width: 6px; }
  .mfi .wlist::-webkit-scrollbar-track { background: transparent; }
  .mfi .wlist::-webkit-scrollbar-thumb { background: var(--m-line-strong); border-radius: 3px; }

  /* ───── Video modal ───── */
  .mfi-video-bg {
    position: fixed; inset: 0; z-index: 2147483641;
    background: rgba(5,5,5,0.85);
    backdrop-filter: blur(10px);
    display: flex; align-items: center; justify-content: center;
    animation: mfi-fade .18s ease;
    padding: 24px;
  }
  .mfi-video {
    width: min(880px, 100%);
    background: #0a0a0a; color: #f1efe8;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 30px 90px rgba(0,0,0,0.38);
    animation: mfi-pop .22s cubic-bezier(.2,.7,.3,1);
    display: flex; flex-direction: column;
    max-height: calc(100vh - 48px);
  }
  .mfi-video .vplayer {
    position: relative; width: 100%;
    background-size: cover; background-position: center;
    flex-shrink: 0;
  }
  .mfi-video .vplayer.yt { aspect-ratio: 16/9; }
  .mfi-video .vplayer.short { aspect-ratio: 9/16; max-height: 60vh; }
  .mfi-video .vplayer::before {
    content:""; position: absolute; inset: 0;
    background: rgba(0,0,0,0.18);
  }
  .mfi-video .vplayer .bigplay {
    position: absolute; left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    width: 72px; height: 72px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.85);
    background: rgba(0,0,0,0.4); backdrop-filter: blur(10px);
    color: #fff; font-size: 22px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: transform .15s ease, background .15s ease;
  }
  .mfi-video .vplayer .bigplay:hover { transform: translate(-50%, -50%) scale(1.06); background: rgba(255,255,255,0.18); }
  .mfi-video .vplayer .vdur {
    position: absolute; right: 12px; bottom: 12px;
    padding: 4px 10px; border-radius: 4px;
    background: rgba(0,0,0,0.85); color: #f1efe8;
    font-family: "JetBrains Mono"; font-size: 11px;
  }
  .mfi-video .vplayer .vbadge {
    position: absolute; left: 12px; top: 12px;
    padding: 4px 10px; border-radius: 4px;
    background: rgba(0,0,0,0.65); color: #f1efe8;
    font-family: "JetBrains Mono"; font-size: 10px; font-weight: 600;
    letter-spacing: 0.05em; backdrop-filter: blur(4px);
  }
  .mfi-video .vinfo-block {
    padding: 22px 26px;
    border-top: 1px solid #1a1a1a;
  }
  .mfi-video .vinfo-block .vt {
    font-family: "IBM Plex Sans"; font-weight: 600;
    font-size: 19px; line-height: 1.25; letter-spacing: -0.015em;
    color: #f1efe8; margin: 0 0 8px;
  }
  .mfi-video .vinfo-block .vm {
    font-family: "JetBrains Mono"; font-size: 11px;
    color: #888; margin-bottom: 14px;
  }
  .mfi-video .vinfo-block .vdesc {
    font-family: "IBM Plex Sans"; font-size: 14px;
    line-height: 1.6; color: #c8c8c8;
    margin: 0 0 14px;
  }
  .mfi-video .vinfo-block .vbtns {
    display: flex; gap: 10px; flex-wrap: wrap;
  }
  .mfi-video .vinfo-block .vbtn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 14px;
    background: transparent; color: #f1efe8;
    border: 1px solid #2a2a2a; border-radius: 999px;
    font-family: "JetBrains Mono"; font-size: 11px; font-weight: 500;
    cursor: pointer; text-decoration: none;
    transition: background .15s ease, border-color .15s ease;
  }
  .mfi-video .vinfo-block .vbtn:hover { background: #f1efe8; color: #0a0a0a; border-color: #f1efe8; }
  .mfi-video .vinfo-block .vbtn.primary { background: #f1efe8; color: #0a0a0a; border-color: #f1efe8; }
  .mfi-video .vinfo-block .vbtn.primary:hover { background: transparent; color: #f1efe8; border-color: #f1efe8; }
  .mfi-video .vclose {
    position: absolute; top: 14px; right: 14px; z-index: 2;
    width: 30px; height: 30px; border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.25); background: rgba(0,0,0,0.55);
    color: #f1efe8; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-family: "JetBrains Mono"; font-size: 14px;
    backdrop-filter: blur(6px);
    transition: background .15s ease;
  }
  .mfi-video .vclose:hover { background: rgba(255,255,255,0.18); }

  /* ───── AUDIENCE + ATTENDING card (replaces status/events) ───── */
  .mfi .aud-head {
    display: flex; justify-content: space-between; align-items: baseline;
    margin-bottom: 14px;
  }
  .mfi .aud-top {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 14px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--m-line);
  }
  .mfi .aud-stat { display: flex; flex-direction: column; gap: 3px; }
  .mfi .aud-stat .v {
    font-family: "JetBrains Mono"; font-weight: 600;
    font-size: 34px; line-height: 1; color: var(--m-ink);
    letter-spacing: -0.025em;
  }
  .mfi .aud-stat .v .unit { font-size: 14px; color: var(--m-ink-faint); margin-left: 2px; font-weight: 500; }
  .mfi .aud-stat .k {
    font-family: "JetBrains Mono"; font-size: 10px;
    color: var(--m-ink-soft); letter-spacing: 0.06em; text-transform: uppercase;
    margin-top: 6px;
  }
  .mfi .aud-stat .d {
    font-family: "JetBrains Mono"; font-size: 10px;
    color: #2f7a4d; margin-top: 2px;
  }
  .mfi .aud-sep {
    display: flex; align-items: center; gap: 10px;
    font-family: "JetBrains Mono"; font-size: 9.5px; color: var(--m-ink-soft);
    letter-spacing: 0.06em; text-transform: uppercase;
    margin: 14px 0 6px;
  }
  .mfi .aud-sep::after { content: ""; flex: 1; height: 1px; background: var(--m-line); }
  .mfi .ev-list { flex: 1; display: flex; flex-direction: column; gap: 2px; }
  .mfi .ev-row {
    display: grid; grid-template-columns: 52px 1fr auto;
    gap: 12px; align-items: baseline;
    padding: 9px 10px;
    border-radius: 6px;
    border-bottom: 1px dotted var(--m-line);
    cursor: pointer;
    position: relative;
    transition: background .2s ease, box-shadow .25s ease, border-color .2s ease;
  }
  .mfi .ev-row:last-of-type { border-bottom: none; }
  .mfi .ev-row:hover {
    background: rgba(255, 251, 235, 0.6);
    border-bottom-color: transparent;
    box-shadow:
      inset 0 0 0 1px rgba(10, 10, 10, 0.12),
      0 0 0 1px rgba(255, 200, 120, 0.25),
      0 0 14px rgba(255, 180, 80, 0.18);
  }
  .mfi .ev-row:hover .ev-arr { transform: translateX(3px); color: var(--m-ink); }
  .mfi .ev-row .date {
    font-family: "JetBrains Mono"; font-size: 10px;
    color: var(--m-ink-faint); letter-spacing: 0.05em; text-transform: uppercase;
  }
  .mfi .ev-row .name {
    font-family: "IBM Plex Sans"; font-size: 13px; color: var(--m-ink);
    font-weight: 500;
  }
  .mfi .ev-row .ev-arr {
    font-family: "JetBrains Mono"; font-size: 11px; color: var(--m-ink-faint);
    transition: transform .15s ease, color .15s ease;
  }
  .mfi .aud-foot {
    margin-top: 10px; padding-top: 10px;
    border-top: 1px solid var(--m-line);
    font-family: "JetBrains Mono"; font-size: 10px; color: var(--m-ink-soft);
    display: flex; justify-content: space-between;
  }
  @media (max-width: 920px) {
    .mfi {
      height: auto;
      padding: 8px;
      overflow: visible;
    }
    .mfi-shell {
      height: auto;
      overflow: visible;
      padding: 12px;
    }
    .mfi-topbar {
      align-items: flex-start;
      gap: 12px;
    }
    .mfi-socials {
      flex-wrap: wrap;
      justify-content: flex-end;
      max-width: 190px;
    }
    .mfi-grid {
      display: flex !important;
      flex-direction: column;
      gap: 10px;
    }
    .mfi-grid > * {
      grid-column: auto !important;
      grid-row: auto !important;
      width: 100%;
      min-height: auto;
    }
    .mfi .terminal {
      min-height: 250px;
    }
    .mfi .vbody,
    .mfi .aud-top,
    .mfi .contact-grid {
      grid-template-columns: 1fr;
    }
    .mfi .vrow.short {
      grid-template-columns: 1fr;
    }
    .mfi .repo-card-body {
      grid-template-columns: 1fr;
    }
    .mfi .vthumb-mini.short {
      height: 180px;
    }
    .mfi .h-card,
    .mfi .h-mono {
      overflow-wrap: anywhere;
    }
    .mfi .footer {
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
      padding-top: 12px;
      line-height: 1.5;
    }
    .mfi .hero-contact-card {
      align-items: flex-start;
      flex-direction: column;
      gap: 14px;
    }
    .mfi .hero-contact-card .btn {
      width: 100%;
      justify-content: center;
    }
  }
  @media (max-width: 520px) {
    .mfi {
      padding: 0;
    }
    .mfi-shell {
      border-width: 0 0 1px;
      border-radius: 0;
      padding: 10px;
    }
    .mfi-topbar {
      flex-direction: column;
    }
    .mfi-socials {
      justify-content: flex-start;
      max-width: none;
    }
    .mfi .card,
    .mfi .terminal {
      border-radius: 9px;
    }
    .mfi .card {
      padding: 14px;
    }
    .mfi .repo-live {
      grid-template-columns: 1fr 1fr;
    }
    .mfi .card.flat {
      padding: 0;
    }
    .mfi .terminal {
      font-size: 11px;
      padding: 12px 14px;
    }
    .mfi .hero-contact-card {
      padding: 14px;
    }
    .mfi .hero-contact-card .h-card {
      font-size: 16px;
    }
    .mfi .hero-contact-card .meta {
      font-size: 9.5px;
      line-height: 1.45;
    }
    .mfi .aud-top {
      gap: 10px;
    }
    .mfi .aud-stat .v {
      font-size: 28px;
    }
    .mfi .ev-row {
      grid-template-columns: 48px 1fr auto;
      gap: 8px;
      padding-inline: 6px;
    }
    .mfi .nlinput {
      grid-template-columns: 1fr;
    }
    .mfi-modal,
    .mfi-article,
    .mfi-video {
      width: calc(100vw - 20px);
      max-height: calc(100svh - 20px);
    }
    .mfi .footer {
      font-size: 9.5px;
      margin-top: 10px;
    }
  }
`;

// Icon set — social glyphs
const Ico = {
  github: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1.5a6.5 6.5 0 0 0-2.05 12.67c.32.06.44-.14.44-.31 0-.15-.01-.66-.01-1.2-1.79.39-2.17-.76-2.17-.76-.29-.74-.71-.94-.71-.94-.58-.4.04-.39.04-.39.65.04.99.66.99.66.57.97 1.5.69 1.87.53.06-.41.22-.69.4-.85-1.43-.16-2.93-.71-2.93-3.17 0-.7.25-1.27.66-1.72-.07-.16-.29-.81.06-1.69 0 0 .54-.17 1.77.66a6.16 6.16 0 0 1 3.22 0c1.23-.83 1.77-.66 1.77-.66.35.88.13 1.53.06 1.69.41.45.66 1.02.66 1.72 0 2.46-1.5 3-2.93 3.16.23.2.43.59.43 1.19 0 .86-.01 1.55-.01 1.76 0 .17.12.38.45.31A6.5 6.5 0 0 0 8 1.5Z"/>
    </svg>
  ),
  linkedin: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
      <path d="M3.4 5.8H5.4V13H3.4V5.8ZM4.4 4.8a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4ZM7 5.8H9V6.8C9.4 6.2 10.1 5.6 11.2 5.6c2 0 2.4 1.3 2.4 3v4.4h-2V9.4c0-.8 0-1.9-1.2-1.9-1.2 0-1.4.9-1.4 1.8V13H7V5.8Z"/>
    </svg>
  ),
  youtube: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
      <path d="M14.6 5.2a1.7 1.7 0 0 0-1.2-1.2C12.3 3.7 8 3.7 8 3.7s-4.3 0-5.4.3a1.7 1.7 0 0 0-1.2 1.2C1.1 6.3 1.1 8 1.1 8s0 1.7.3 2.8a1.7 1.7 0 0 0 1.2 1.2c1.1.3 5.4.3 5.4.3s4.3 0 5.4-.3a1.7 1.7 0 0 0 1.2-1.2c.3-1.1.3-2.8.3-2.8s0-1.7-.3-2.8ZM6.7 10V6l3.6 2-3.6 2Z"/>
    </svg>
  ),
  instagram: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
      <rect x="2.4" y="2.4" width="11.2" height="11.2" rx="3.2"/>
      <circle cx="8" cy="8" r="2.6"/>
      <circle cx="11.3" cy="4.7" r="0.75" fill="currentColor"/>
    </svg>
  ),
  tiktok: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
      <path d="M10.4 1.5h1.85c.1 1.1.55 2.05 1.4 2.7.6.45 1.35.7 2.05.75v1.9c-.7 0-1.4-.15-2.1-.45-.3-.13-.6-.3-.85-.5v4.55c0 1.05-.3 2-.85 2.75a4.05 4.05 0 0 1-3.3 1.7 4.05 4.05 0 0 1-3.55-2.05 4.1 4.1 0 0 1 0-4.15 4.05 4.05 0 0 1 3.55-2.05c.25 0 .5.02.75.06v2.05a2.1 2.1 0 0 0-.75-.14 2.05 2.05 0 0 0-2.05 2.05 2.05 2.05 0 0 0 4.1 0V1.5h-.25Z"/>
    </svg>
  ),
  x: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
      <path d="M11.95 2H14l-4.55 5.2L14.8 14h-4.2L7.3 9.7 3.5 14H1.45l4.85-5.55L1 2h4.3l3 3.95L11.95 2Zm-.7 10.7h1.15L4.85 3.2H3.6l7.65 9.5Z"/>
    </svg>
  ),
  arrow: (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 8 L 8 2 M 4 2 H 8 V 6"/>
    </svg>
  ),
  star: (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor">
      <path d="M6 0.5 L 7.4 4.3 L 11.5 4.5 L 8.3 7 L 9.5 11 L 6 8.8 L 2.5 11 L 3.7 7 L 0.5 4.5 L 4.6 4.3 Z"/>
    </svg>
  ),
  fork: (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3">
      <circle cx="3" cy="2.5" r="1.2"/>
      <circle cx="9" cy="2.5" r="1.2"/>
      <circle cx="6" cy="9.5" r="1.2"/>
      <path d="M3 3.7 V 6 Q 3 7 6 7 Q 9 7 9 6 V 3.7"/>
    </svg>
  ),
};

const ArchDiagram = () => (
  <svg viewBox="0 0 240 60" width="100%" style={{display:"block"}} fill="none" stroke="#0a0a0a" strokeWidth="1.1">
    {/* nodes */}
    <rect x="6" y="6" width="44" height="18" rx="3"/>
    <text x="28" y="18" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="#0a0a0a" stroke="none">api</text>
    <rect x="6" y="36" width="44" height="18" rx="3"/>
    <text x="28" y="48" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="#0a0a0a" stroke="none">cron</text>
    <rect x="98" y="6" width="44" height="18" rx="3"/>
    <text x="120" y="18" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="#0a0a0a" stroke="none">n8n</text>
    <rect x="98" y="36" width="44" height="18" rx="3"/>
    <text x="120" y="48" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="#0a0a0a" stroke="none">queue</text>
    <rect x="190" y="21" width="44" height="18" rx="3"/>
    <text x="212" y="33" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="#0a0a0a" stroke="none">out</text>
    {/* connectors */}
    <path d="M50 15 H 98" strokeDasharray="2 2"/>
    <path d="M50 45 H 98" strokeDasharray="2 2"/>
    <path d="M142 15 Q 170 15 190 27"/>
    <path d="M142 45 Q 170 45 190 33"/>
    <path d="M28 24 V 36"/>
    <path d="M120 24 V 36"/>
  </svg>
);

const Sparkline2 = () => (
  <svg viewBox="0 0 240 44" width="100%" className="spark" preserveAspectRatio="none" style={{display:"block"}}>
    <polyline className="area" points="0,40 0,30 22,28 44,30 66,24 88,26 110,20 132,17 154,13 176,10 198,8 220,6 240,4 240,40" />
    <polyline points="0,30 22,28 44,30 66,24 88,26 110,20 132,17 154,13 176,10 198,8 220,6 240,4" />
    <circle cx="240" cy="4" r="2.5" fill="#0a0a0a"/>
  </svg>
);

const VIDEOS = {
  yt: [
    {
      id: "yt1",
      title: "Self-hosted CI/CD with n8n — replacing $$$ SaaS",
      meta: "8.2k views · 3 days ago · 22:14",
      duration: "22:14",
      thumb: "https://picsum.photos/seed/n8n-cicd-2026/800/450",
      desc: "Walk-through of the n8n-based CI/CD I run for my own projects. From webhook to deploy, no GitHub Actions minutes burned.",
    },
    {
      id: "yt2",
      title: "MCP architectures & tool-calling agents",
      meta: "5.4k views · 2 weeks ago · 17:42",
      duration: "17:42",
      thumb: "https://picsum.photos/seed/mcp-agents-2026/800/450",
      desc: "Deep-dive on Model Context Protocol — what it solves, how to write an MCP server, and patterns for tool-calling LLM agents.",
    },
    {
      id: "yt3",
      title: "GitOps drift checks that don't wake you up",
      meta: "3.1k views · 1 month ago · 14:08",
      duration: "14:08",
      thumb: "https://picsum.photos/seed/gitops-drift-2026/800/450",
      desc: "A practical drift detection setup for Kubernetes clusters, with alerts that only fire when a human needs to act.",
    },
    {
      id: "yt4",
      title: "Homelab monitoring stack from scratch",
      meta: "2.8k views · 2 months ago · 19:36",
      duration: "19:36",
      thumb: "https://picsum.photos/seed/homelab-observability-2026/800/450",
      desc: "Prometheus, Grafana, logs, uptime checks, and a simple incident dashboard for a small self-hosted environment.",
    },
  ],
  shorts: [
    {
      id: "s1",
      title: "n8n flow in 40 sec",
      meta: "31k · trending",
      duration: "0:42",
      thumb: "https://picsum.photos/seed/n8n-tip-2026/400/720",
      desc: "Drop-in n8n workflow that watches a Slack channel for keywords and triages incidents. Forty seconds, zero fluff.",
    },
    {
      id: "s2",
      title: "Terraform tip · GitOps",
      meta: "22k · last week",
      duration: "0:58",
      thumb: "https://picsum.photos/seed/tf-tip-2026/400/720",
      desc: "Terraform module pattern I use across every multi-cloud project. Drift-resistant, GitOps-friendly, painfully simple.",
    },
    {
      id: "s3",
      title: "Docker cleanup alias",
      meta: "18k · quick tip",
      duration: "0:31",
      thumb: "https://picsum.photos/seed/docker-cleanup-2026/400/720",
      desc: "The cleanup alias I use before every demo box gets out of hand.",
    },
    {
      id: "s4",
      title: "One-line k8s context check",
      meta: "14k · saved",
      duration: "0:27",
      thumb: "https://picsum.photos/seed/k8s-context-2026/400/720",
      desc: "Tiny shell prompt check that prevents deploying to the wrong Kubernetes context.",
    },
    {
      id: "s5",
      title: "n8n retry pattern",
      meta: "11k · automation",
      duration: "0:45",
      thumb: "https://picsum.photos/seed/n8n-retry-2026/400/720",
      desc: "A compact retry pattern for n8n workflows that call flaky external APIs.",
    },
  ],
};

const FEATURED_REPO = {
  name: "n8n-workflows-library",
  version: "v2.4.0",
  description: "n8n flows I run in production. Open source.",
  stars: "127",
  growth: "+42 / month",
  status: "active",
  stack: ["n8n", "docker", "webhooks", "ops"],
  note: "A repo worth studying when the process matters as much as the code.",
  url: "https://github.com/",
  readme: [
    "Reusable n8n workflows for deploys, alerts, content pipelines, and ops automation.",
    "Designed around small composable flows instead of one huge automation graph.",
    "Next step: load this preview from the repository README.md instead of hardcoded data.",
  ],
};

function mergeFeaturedRepo(repo) {
  return {
    ...FEATURED_REPO,
    ...repo,
    stack: repo?.stack?.length ? repo.stack : FEATURED_REPO.stack,
    readme: repo?.readme?.length ? repo.readme : FEATURED_REPO.readme,
    note: repo?.note || FEATURED_REPO.note,
  };
}

const ARTICLES = [
  {
    id: "01",
    title: "Self-hosted CI/CD with n8n — replacing $$$ SaaS",
    meta: "9 min · set 2026",
    tags: ["n8n", "self-hosted", "ci/cd"],
    body: [
      { t: "h", v: "Why self-host CI/CD" },
      { t: "p", v: "After a year paying four figures a month for hosted CI, I rebuilt the same flows on n8n + a single VPS. Costs dropped 92% and reliability went up." },
      { t: "p", v: "This post walks through the architecture, the trade-offs, and the n8n nodes I lean on the most." },
      { t: "h", v: "The architecture" },
      { t: "code", v: "github-webhook → n8n → docker-build → registry → argo-deploy" },
      { t: "p", v: "n8n handles the orchestration. GitHub Actions still runs unit tests, but everything past that lives on our side." },
      { t: "h", v: "What I learned" },
      { t: "ul", v: ["self-hosting isn't scary — it's mostly observability","most SaaS CI features are just sugar","you can rebuild any of them in a weekend"] },
      { t: "p", v: "The repo is open source. PRs welcome." },
    ],
  },
  {
    id: "02",
    title: "MCP architectures & tool-calling agents",
    meta: "11 min · ago 2026",
    tags: ["ai", "mcp", "agents"],
    body: [
      { t: "h", v: "What MCP solves" },
      { t: "p", v: "Model Context Protocol gives LLMs a structured way to call tools — APIs, file systems, databases — without prompt-engineering the schema every time." },
      { t: "h", v: "A minimal MCP server" },
      { t: "code", v: "// tools.ts\nexport const tools = {\n  query_db: { schema, handler },\n  fetch_logs: { schema, handler },\n};" },
      { t: "p", v: "From there, any LLM client that speaks MCP can discover and invoke your tools — Claude Desktop, custom agents, n8n nodes." },
      { t: "h", v: "Patterns that work" },
      { t: "ul", v: ["narrow tools beat wide tools","return structured errors","cache aggressively, the LLM will retry"] },
    ],
  },
  {
    id: "03",
    title: "Multi-cloud networking — AWS, GCP & Azure",
    meta: "8 min · jul 2026",
    tags: ["cloud", "networking", "terraform"],
    body: [
      { t: "h", v: "The real cost of multi-cloud" },
      { t: "p", v: "It's not the compute — it's the network. Egress fees, peering, DNS, latency. Plan the network first, services second." },
      { t: "h", v: "VPN mesh vs interconnect" },
      { t: "p", v: "For < 1 Gbps steady traffic, a Tailscale or Wireguard mesh is fine. Past that, dedicated interconnect pays for itself in egress savings inside the first quarter." },
      { t: "h", v: "Terraform patterns" },
      { t: "code", v: "module \"network\" {\n  source = \"./modules/multi-cloud-net\"\n  providers = { aws, gcp, azurerm }\n}" },
      { t: "p", v: "One module, three providers, shared variables. The repo has the full source." },
    ],
  },
  {
    id: "04",
    title: "13 years in infrastructure — what I'd do differently",
    meta: "6 min · jun 2026",
    tags: ["retrospective", "career"],
    body: [
      { t: "p", v: "Half-baked retrospective from a Sunday evening. Not advice, just notes." },
      { t: "h", v: "Three things I'd start sooner" },
      { t: "ul", v: ["self-host earlier — SaaS is a tax on inertia","write more, ship more public code","say no to one-off heroics"] },
      { t: "h", v: "Three things I'm glad I did" },
      { t: "ul", v: ["went deep on networking before going wide on cloud","worked across three industries (gov, esports, fintech)","kept a personal lab running for 10 years"] },
      { t: "p", v: "The pattern: every long-term win came from controlling my own stack." },
    ],
  },
];

export function MidfiV1({ initialFeaturedRepo = null } = {}) {
  const [contactOpen, setContactOpen] = React.useState(false);
  const [openArticle, setOpenArticle] = React.useState(null);
  const [openVideo, setOpenVideo] = React.useState(null);
  const [openRepo, setOpenRepo] = React.useState(null);
  const [featuredRepo, setFeaturedRepo] = React.useState(() => mergeFeaturedRepo(initialFeaturedRepo || FEATURED_REPO));
  const ytRowRef = React.useRef(null);
  const shortsRowRef = React.useRef(null);
  const scrollVideoRow = (rowRef) => {
    const row = rowRef.current;
    if (!row) return;
    const amount = Math.max(120, row.clientHeight * 0.75);
    const max = row.scrollHeight - row.clientHeight;
    row.scrollTop = row.scrollTop >= max ? 0 : Math.min(max, row.scrollTop + amount);
  };
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenArticle(null);
        setContactOpen(false);
        setOpenVideo(null);
        setOpenRepo(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  React.useEffect(() => {
    const controller = new AbortController();

    fetch("/api/github/repo", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("GitHub repo API request failed");
        return response.json();
      })
      .then((repo) => setFeaturedRepo(mergeFeaturedRepo(repo)))
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      });

    return () => controller.abort();
  }, []);
  return (
  <section data-screen-label="v1·midfi — Builder-led" className="mfi">
    <style>{MIDFI_CSS}</style>

    <div className="mfi-shell">

      {/* TOPBAR */}
      <div className="mfi-topbar">
        <div style={{display:"flex", alignItems:"center", gap: 14}}>
          <div className="glyph">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#0a0a0a" strokeWidth="1.6" strokeLinejoin="round">
              <path d="M3 15 L 9 3 L 15 15 M 5.5 10.5 H 12.5"/>
            </svg>
          </div>
          <span className="brand">
            hiago<span className="dot-d">.sh</span>
          </span>
        </div>
        <div className="mfi-socials">
          <a className="social" title="github" href="#">{Ico.github}</a>
          <a className="social" title="linkedin" href="#">{Ico.linkedin}</a>
          <a className="social" title="x" href="#">{Ico.x}</a>
          <a className="social" title="youtube" href="#">{Ico.youtube}</a>
          <a className="social" title="tiktok" href="#">{Ico.tiktok}</a>
          <a className="social" title="instagram" href="#">{Ico.instagram}</a>
        </div>
      </div>

      {/* BENTO */}
      <div className="mfi-grid">

        {/* TERMINAL HERO — 7 col, 5 rows */}
        <div style={{gridColumn:"span 7", gridRow:"span 5", display:"flex", flexDirection:"column", gap: 16}}>
          <div className="terminal" style={{flex: 1}}>
            <div className="tbar" style={{marginBottom: 8, justifyContent: "flex-end"}}>
              <span className="tpath"></span>
            </div>
            <div><span className="prompt">$ </span>cat ~/about</div>
            <div style={{height: 18}} />
            <div className="accent">hiago felipe</div>
            <div>platform engineer · são paulo · <span style={{color:"#ffb86c"}}>13y</span></div>
            <div style={{height: 18}} />
            <div>i build infra that doesn&apos;t page you at 3am.</div>
            <div>deep in <span style={{color:"#a8e6a3"}}>n8n</span>, <span style={{color:"#a8e6a3"}}>mcp</span>, self-hosting everything.</div>
            <div>gov, esports, fintech — all production.<span className="cursor" /></div>
          </div>
          <div className="card hero-contact-card">
            <div>
              <div className="h-card">Open to interesting problems.</div>
              <div className="meta" style={{marginTop: 6}}>devops · platform engineer · consulting · remote &amp; onsite</div>
            </div>
            <a className="btn dark" onClick={() => setContactOpen(true)} style={{cursor:"pointer"}}>$ contact{" "}{Ico.arrow}</a>
          </div>
        </div>

        {/* AUDIENCE + ATTENDING — 5 col, 5 rows */}
        <div className="card" style={{gridColumn:"span 5", gridRow:"span 5", display:"flex", flexDirection:"column"}}>
          <div className="aud-head">
            <span className="eyebrow">◇ presence · 2026</span>
            <span className="meta">may 2026</span>
          </div>
          <div className="aud-top">
            <div className="aud-stat">
              <span className="v">12.4<span className="unit">k</span></span>
              <span className="k">audience · 6 nets</span>
              <span className="d">↑ +312 · 30d</span>
            </div>
            <div className="aud-stat">
              <span className="v">84<span className="unit">k</span></span>
              <span className="k">reach · 30d</span>
              <span className="d">↑ +28% mom</span>
            </div>
          </div>
          <div className="aud-sep">attending · next 3</div>
          <div className="ev-list">
            <div className="ev-row">
              <span className="date">12 nov</span>
              <span className="name">Web Summit Lisbon</span>
              <span className="ev-arr">↗</span>
            </div>
            <div className="ev-row">
              <span className="date">28 nov</span>
              <span className="name">Blockchain Rio</span>
              <span className="ev-arr">↗</span>
            </div>
            <div className="ev-row">
              <span className="date">05 dec</span>
              <span className="name">Tokenation SP</span>
              <span className="ev-arr">↗</span>
            </div>
          </div>
          <div className="aud-foot">
            <span>say hi at any of these</span>
            <span></span>
          </div>
        </div>

        {/* VIDEO BAND — 8 col, 4 rows · 2 YouTube + 2 Shorts */}
        <div className="card dark flat video-card" style={{gridColumn:"span 7", gridRow:"span 4", display:"flex", flexDirection:"column"}}>
          <div style={{padding: "14px 18px 10px", display:"flex", justifyContent:"space-between", alignItems:"center", gap: 12, flexWrap:"wrap"}}>
            <div style={{display:"flex", gap: 14, alignItems:"center", whiteSpace:"nowrap"}}>
              <span className="mono" style={{fontSize: 11, color:"#6dd49a", whiteSpace:"nowrap"}}>$ video</span>
              <span className="meta" style={{color:"#909090", whiteSpace:"nowrap"}}>self-hosted ops · n8n · ai workflows</span>
            </div>
          </div>
          <div className="vbody">
            <div className="vsection">
              <div className="vlbl">
                <span>▶ youtube</span>
                <span>
                  <span className="count">{VIDEOS.yt.length} of 48</span>
                  <button
                    type="button"
                    className="more"
                    onClick={() => scrollVideoRow(ytRowRef)}
                    aria-label="Scroll YouTube videos down"
                  >
                    ↓
                  </button>
                </span>
              </div>
              <div className="vrow yt" ref={ytRowRef}>
                {VIDEOS.yt.map(v => (
                  <div className="vtile yt" key={v.id} onClick={() => setOpenVideo(v)}>
                    <div className="vthumb-mini yt">
                      <img src={v.thumb} loading="lazy" alt="" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
                      <div className="vplay" style={{zIndex: 1}}>▶</div>
                      <span className="vts" style={{zIndex: 1}}>{v.duration}</span>
                    </div>
                    <div className="vinfo">
                      <div className="vtitle">{v.title}</div>
                      <div className="vmeta">{v.meta.split(" · ").slice(0, 2).join(" · ")}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="vsection">
              <div className="vlbl">
                <span>▶ shorts <span style={{color:"#555"}}>· 9:16</span></span>
                <span>
                  <span className="count">{VIDEOS.shorts.length} of 28</span>
                  <button
                    type="button"
                    className="more"
                    onClick={() => scrollVideoRow(shortsRowRef)}
                    aria-label="Scroll shorts down"
                  >
                    ↓
                  </button>
                </span>
              </div>
              <div className="vrow short" ref={shortsRowRef}>
                {VIDEOS.shorts.map(v => (
                  <div className="vtile short" key={v.id} onClick={() => setOpenVideo(v)}>
                    <div className="vthumb-mini short">
                      <img src={v.thumb} loading="lazy" alt="" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
                      <div className="vplay" style={{zIndex: 1}}>▶</div>
                      <span className="vts" style={{zIndex: 1}}>{v.duration}</span>
                    </div>
                    <div className="vinfo">
                      <div className="vtitle">{v.title}</div>
                      <div className="vmeta">{v.meta}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FEATURED GITHUB REPO — 4 col, 4 rows (swapped from status, now under video) */}
        <div
          className="card repo-card"
          role="button"
          tabIndex={0}
          onClick={() => setOpenRepo(featuredRepo)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpenRepo(featuredRepo);
            }
          }}
          style={{gridColumn:"span 5", gridRow:"span 4", display:"flex", flexDirection:"column"}}
        >
          <div style={{display:"flex", justifyContent:"space-between", marginBottom: 10, alignItems:"center"}}>
            <span className="eyebrow">◇ github · i use this</span>
            <span className="meta">{featuredRepo.version}</span>
          </div>
          <div className="h-mono">{featuredRepo.name}</div>
          <p className="body" style={{margin:"6px 0 10px"}}>{featuredRepo.description}</p>
          <div className="repo-card-body">
            <div>
              <div className="repo-note">{featuredRepo.note}</div>
              <div className="repo-live">
                <div className="repo-live-item">
                  <span className="k">stars</span>
                  <span className="v">{featuredRepo.stars}</span>
                </div>
                <div className="repo-live-item">
                  <span className="k">forks</span>
                  <span className="v">{featuredRepo.forks || featuredRepo.growth.replace(" forks", "")}</span>
                </div>
                <div className="repo-live-item">
                  <span className="k">issues</span>
                  <span className="v">{featuredRepo.issues?.replace(" issues", "") || "0"}</span>
                </div>
                <div className="repo-live-item">
                  <span className="k">updated</span>
                  <span className="v">{featuredRepo.updated?.replace(/^updated\s+/, "") || featuredRepo.status.replace(/^updated\s+/, "")}</span>
                </div>
              </div>
            </div>
            <div className="repo-facts">
              <div className="repo-fact">
                <span className="k">language</span>
                <span className="v">{featuredRepo.language || "—"}</span>
              </div>
              <div className="repo-fact">
                <span className="k">visibility</span>
                <span className="v">{featuredRepo.visibility || "—"}</span>
              </div>
              <div className="repo-fact">
                <span className="k">license</span>
                <span className="v">{featuredRepo.license || "—"}</span>
              </div>
              <div className="repo-fact">
                <span className="k">branch</span>
                <span className="v">{featuredRepo.branch || "—"}</span>
              </div>
            </div>
          </div>
          <div className="meta" style={{marginTop: 10, display:"flex", justifyContent:"space-between"}}>
            <span style={{display:"inline-flex", alignItems:"center", gap: 6}}>{featuredRepo.updated || featuredRepo.status}</span>
            <span style={{display:"inline-flex", alignItems:"center", gap: 6}}>open repo {Ico.arrow}</span>
          </div>
        </div>

        {/* WRITE-UPS — 7 col, 4 rows · click to open article */}
        <div className="card" style={{gridColumn:"span 7", gridRow:"span 4", display:"flex", flexDirection:"column"}}>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom: 12, alignItems:"center", flexShrink: 0}}>
            <span className="eyebrow">⌘ latest write-ups</span>
            <span className="meta" style={{display:"inline-flex", alignItems:"center", gap: 6}}>
              {ARTICLES.length} articles
            </span>
          </div>
          <div className="wlist" style={{flex: 1, overflow: "hidden", paddingRight: 4}}>
            {ARTICLES.map(a => (
              <div className="star-row" key={a.id} onClick={() => setOpenArticle(a)}>
                <span className="idx">{a.id}</span>
                <div>
                  <div className="ti">{a.title}</div>
                  <div className="sub">{a.meta}</div>
                </div>
                <span className="arr">↗</span>
              </div>
            ))}
          </div>
        </div>

        {/* NEWSLETTER DARK — 5 col, 4 rows */}
        <div className="card dark newsletter-card" style={{gridColumn:"span 5", gridRow:"span 4", display:"flex", flexDirection:"column", justifyContent:"center", gap: 12}}>
          <div className="mono" style={{fontSize: 11, color:"#6dd49a"}}>$ subscribe --monthly</div>
          <div className="h-mono" style={{color:"#f1efe8", fontSize: 18}}>field_notes.subscribe()</div>
          <div className="nlinput" style={{marginTop: 4}}>
            <input type="email" placeholder="your@email.com" defaultValue="" />
            <button className="btn invert" style={{fontSize: 11, padding:"7px 14px"}}>./go</button>
          </div>
          <div className="meta" style={{color:"#777", marginTop: 2}}>3,200 readers · no spam, just notes</div>
        </div>

      </div>

      {/* FOOTER */}
      <div className="footer">
        <span>
          2026 hiago<span style={{color:"var(--m-ink-soft)"}}>.sh</span> · self-hosted, deployed on a friday
        </span>
        <span>
          🇧🇷 SP · UTC−3 · hey@hiago.sh
        </span>
      </div>

    </div>

    {contactOpen && (
      <div className="mfi-modal-bg" onClick={() => setContactOpen(false)}>
        <div className="mfi-modal" onClick={(e) => e.stopPropagation()}>
          <button className="x" onClick={() => setContactOpen(false)} aria-label="close">×</button>
          <div className="mono" style={{fontSize: 11, color:"var(--m-ink-soft)", marginBottom: 4}}>$ contact</div>
          <div className="h-card" style={{fontSize: 22, marginBottom: 4}}>Let’s talk.</div>
          <p className="body" style={{margin:"0 0 18px"}}>
            Platform engineering, n8n automation, AI workflows, self-hosted ops, multi-cloud - or a 30-min chat.
          </p>

          <div style={{margin:"0 0 16px"}}>
            <div className="row"><span className="k">role</span><span className="v">DevOps · Platform Engineer · Consultant</span></div>
            <div className="row"><span className="k">based</span><span className="v">São Paulo, Brazil</span></div>
            <div className="row"><span className="k">timezone</span><span className="v">Brasília · UTC−3</span></div>
            <div className="row"><span className="k">response</span><span className="v">usually within 24h</span></div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setContactOpen(false); }}>
            <div style={{marginBottom: 12}}>
              <label htmlFor="mfi-email">email</label>
              <input id="mfi-email" type="email" placeholder="you@company.com" required />
            </div>
            <div style={{marginBottom: 14}}>
              <label htmlFor="mfi-msg">what are you building?</label>
              <textarea id="mfi-msg" placeholder="A line or two on the project — stack, scale, timing." />
            </div>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <span className="meta">or email <span style={{color:"var(--m-ink)"}}>hey@hiago.sh</span></span>
              <button type="submit" className="btn dark">./send {Ico.arrow}</button>
            </div>
          </form>
        </div>
      </div>
    )}

    {openRepo && (
      <div className="mfi-modal-bg" onClick={() => setOpenRepo(null)}>
        <div className="mfi-modal repo-modal" onClick={(e) => e.stopPropagation()}>
          <button className="x" onClick={() => setOpenRepo(null)} aria-label="close">×</button>
          <div className="repo-head">
            <div>
              <div className="mono" style={{fontSize: 11, color:"var(--m-ink-soft)", marginBottom: 4}}>$ github repo</div>
              <div className="repo-title">{openRepo.name}</div>
              <p className="body" style={{margin:"0"}}>{openRepo.description}</p>
            </div>
            <div className="repo-mark" aria-hidden="true" />
          </div>

          <div style={{margin:"0 0 14px"}}>
            <div className="row"><span className="k">version</span><span className="v">{openRepo.version}</span></div>
            <div className="row"><span className="k">status</span><span className="v">{openRepo.status}</span></div>
            <div className="row"><span className="k">stats</span><span className="v">{openRepo.stars} stars · {openRepo.growth} · {openRepo.issues}</span></div>
          </div>

          <div className="repo-tags">
            {openRepo.stack.map((tag) => <span key={tag}>{tag}</span>)}
          </div>

          <div className="repo-readme">
            <b>README preview</b>
            {openRepo.readme[0] && <div className="readme-title">{openRepo.readme[0]}</div>}
            {openRepo.readme.slice(1).map((line) => (
              <div className="readme-line" key={line}>{line}</div>
            ))}
          </div>

          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop: 16, gap: 12}}>
            <span className="meta">public repo data from GitHub API</span>
            <a className="btn dark" href={openRepo.url} target="_blank" rel="noreferrer">open github {Ico.arrow}</a>
          </div>
        </div>
      </div>
    )}

    {openArticle && (
      <div className="mfi-article-bg" onClick={() => setOpenArticle(null)}>
        <div className="mfi-article" onClick={(e) => e.stopPropagation()}>
          <div className="ahead">
            <button className="x" onClick={() => setOpenArticle(null)} aria-label="close">×</button>
            <div className="crumb">⌘ write-ups · {openArticle.id}</div>
            <div className="ti">{openArticle.title}</div>
            <div className="meta-row">
              <span>{openArticle.meta}</span>
              {openArticle.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}
            </div>
          </div>
          <div className="abody">
            {openArticle.body.map((block, i) => {
              if (block.t === "h") return <h3 key={i}>{block.v}</h3>;
              if (block.t === "p") return <p key={i}>{block.v}</p>;
              if (block.t === "code") return <pre key={i}>{block.v}</pre>;
              if (block.t === "ul") return <ul key={i}>{block.v.map((li, j) => <li key={j}>{li}</li>)}</ul>;
              return null;
            })}
          </div>
          <div className="afoot">
            <span>esc to close · ↑↓ to scroll</span>
            <span>share · copy link {Ico.arrow}</span>
          </div>
        </div>
      </div>
    )}
    {openVideo && (
      <div className="mfi-video-bg" onClick={() => setOpenVideo(null)}>
        <div className="mfi-video" onClick={(e) => e.stopPropagation()}>
          <div className={"vplayer " + (openVideo.id.startsWith("s") ? "short" : "yt")}>
            <img src={openVideo.thumb} loading="lazy" alt="" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0}} />
            <button className="vclose" style={{zIndex: 1}} onClick={() => setOpenVideo(null)} aria-label="close">×</button>
            <span className="vbadge" style={{zIndex: 1}}>{openVideo.id.startsWith("s") ? "SHORT · 9:16" : "▶ YOUTUBE"}</span>
            <button className="bigplay" aria-label="play">▶</button>
            <span className="vdur">{openVideo.duration}</span>
          </div>
          <div className="vinfo-block">
            <div className="vt">{openVideo.title}</div>
            <div className="vm">{openVideo.meta}</div>
            <p className="vdesc">{openVideo.desc}</p>
            <div className="vbtns">
              <a className="vbtn primary">▶ watch full {Ico.arrow}</a>
              <a className="vbtn">save</a>
              <a className="vbtn">share</a>
              <a className="vbtn">transcript</a>
            </div>
          </div>
        </div>
      </div>
    )}
  </section>
  );
};
