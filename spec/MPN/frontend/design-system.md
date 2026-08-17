# Design System

The MPN design system is derived directly from the approved HTML prototype (`media-portal-demo.html`). The prototype is the source of truth — no new design decisions in implementation.

---

## Brand Colours

```css
/* globals.css */
:root {
  --blue:  #1B4384;   /* primary — CTAs, active nav, table headers */
  --green: #50B58B;   /* success, stat highlights, Workshop badge */
  --navy:  #0d1f3c;   /* hero backgrounds, dark banners */
  --cream: #faf9f7;   /* page background */

  --text:      #1e293b;   /* body text */
  --text-muted: #64748b;  /* secondary text, labels */
  --border:    #e2e8f0;   /* dividers, card borders */
  --card-bg:   #ffffff;

  --r: 10px;             /* standard border radius (cards, rows) */
  --bar-h: 64px;         /* floating nav height */
}
```

---

## Typography

| Use | Font | Weight | Size |
|-----|------|--------|------|
| Page title (H1) | Poppins | 700 | 2rem |
| Section heading (H2) | Poppins | 600 | 1.5rem |
| Card title (H3) | Poppins | 600 | 1.125rem |
| Nav brand | Poppins | 700 | 1.125rem |
| Stat number | Poppins | 700 | 2rem |
| Body | Inter | 400 | 0.9375rem |
| Label / caption | Inter | 500 | 0.8125rem |
| Button | Inter | 600 | 0.875rem |
| Badge | Inter | 600 | 0.75rem |

Load via Google Fonts in `app/layout.tsx`:
```ts
import { Poppins, Inter } from 'next/font/google'

const poppins = Poppins({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-poppins' })
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-inter' })
```

---

## Spacing & Layout

| Token | Value | Used for |
|-------|-------|----------|
| Page horizontal padding | `24px` (desktop) · `16px` (mobile) | Content wrapper |
| Section gap | `32px` | Between major sections |
| Card gap | `12px` | Between list items / cards |
| Filter sidebar width | `188px` | Left sidebar |
| Filter layout gap | `32px` | Between sidebar and content |

---

## Floating Nav

```css
.nav {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  height: var(--bar-h);
  background: white;
  border-radius: 100px;       /* pill */
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  z-index: 100;
  padding: 0 24px;
}
```

Active link: `background: var(--blue); color: white; border-radius: 100px; padding: 6px 16px;`

---

## Filter Sidebar

```css
.filter-sidebar {
  width: 188px;
  flex-shrink: 0;
  position: sticky;
  top: calc(var(--bar-h) + 64px + 22px + 12px);
  background: white;
  border-radius: var(--r);
  padding: 20px 14px 24px;
  height: calc(100vh - var(--bar-h) - 64px - 22px - 24px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.12) transparent;
}

.filter-btn {
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  font-size: 0.875rem;
  color: var(--text);
  padding: 7px 10px;
  border-radius: 8px;
  cursor: pointer;
}

.filter-btn.active {
  background: var(--blue);
  color: white;
  font-weight: 600;
}
```

---

## Card / Row

```css
.card {
  background: white;
  border-radius: var(--r);
  padding: 20px 24px;
  border: 1px solid var(--border);
}

.item-row {
  background: white;
  border-radius: 10px;
  padding: 16px 20px;
  border: 1px solid var(--border);
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
```

---

## Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: var(--font-inter);
}

/* Variants */
.badge-blue    { background: #EEF2FF; color: var(--blue); }
.badge-green   { background: #ECFDF5; color: #059669; }
.badge-orange  { background: #FFF7ED; color: #C2410C; }
.badge-gray    { background: #F1F5F9; color: var(--text-muted); }
```

---

## Buttons

| Variant | Background | Text | Use |
|---------|-----------|------|-----|
| Primary | `--blue` | white | Main CTA |
| Secondary | white | `--blue` | Bordered, secondary actions |
| Ghost | transparent | `--text` | Tertiary / icon buttons |
| Danger | `#EF4444` | white | Destructive actions (admin) |

Button border radius: `8px` (standard) · `100px` (pill, in nav/filter context)

---

## Responsive Breakpoints

| Breakpoint | Behaviour |
|------------|-----------|
| `> 900px` (desktop) | Full layout: sidebar + content, horizontal nav |
| `640px – 900px` (tablet) | Sidebar collapses, nav stays horizontal |
| `< 640px` (mobile) | Hamburger nav, filter sidebar hidden behind toggle button, single-column layout |

Mobile filter toggle button:
```css
.filter-sidebar-toggle-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 14px;
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--r);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}
```

---

## Author Hover Card

```css
.author-hover-card {
  position: fixed;
  z-index: 9999;
  background: white;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.14);
  padding: 14px 18px;
  min-width: 200px;
  pointer-events: none;
  display: none;
}
```

---

## Toast Notification

Appears bottom-right, auto-dismisses after 3 seconds:

```css
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--navy);
  color: white;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 0.875rem;
  z-index: 9999;
  animation: slideUp 0.2s ease;
}
```

---

## Tailwind Config

Add SCPH tokens to `tailwind.config.ts`:

```ts
theme: {
  extend: {
    colors: {
      blue:  '#1B4384',
      green: '#50B58B',
      navy:  '#0d1f3c',
      cream: '#faf9f7',
    },
    fontFamily: {
      poppins: ['var(--font-poppins)', 'sans-serif'],
      inter:   ['var(--font-inter)', 'sans-serif'],
    },
    borderRadius: {
      card: '10px',
      pill: '100px',
    },
  },
}
```
