# SCSS Architecture, Layout & Dual-Theme Guide

The visual system in **Xivig Blog Template 2026** compiles modular Sass stylesheets via `sass-embedded` starting from [src/scss/main.scss](../src/scss/main.scss) on top of **Bootstrap v5.3.8** (`src/assets/vendor/bootstrap/bootstrap.min.css`).

---

## Stylesheet Import Pipeline

[src/scss/main.scss](../src/scss/main.scss) loads modules in deterministic specificity order:

1. `_variables.scss`: Core `:root` typography, brand colors, gradients, radii, and elevation shadows.
2. `_base.scss`: `.boxed-layout-body` canvas grid, `.boxed-layout-wrapper` sheet rules, compatibility spacing helpers, `.btn-elite*` and `.form-control-elite` controls, scroll-to-top FAB, and lightweight fade-in keyframe helpers.
3. `_header.scss`: Top utility strip (`.header-top`), sticky frosted navbar (`#navbar`), dropdown hover bridges, and `.theme-toggle-btn` sun/moon state selectors.
4. `_hero.scss`: Hero typography and decorative rules.
5. `_sections.scss`: Feature icon boxes, footer column striping reset (`transparent`), and `.footer-social-btn` circular social link styling.
6. `_blog.scss`: Catalog cards (`.blog-item-elite`), `.cat-pill` filters, `.share-circle-btn`, sidebar widgets (`.sidebar-widget-card`), living masonry grid (`.living-gallery` + `.gallery-caption`), magazine grid (`.mag-card`, `.mag-list-row`, `.mag-visual-tile`, `.mag-channel-card`), and visual essay UI (`.vf-hero`, `.vf-telemetry-dock`, `.vf-lightbox`).
7. `_themes.scss`: Explicit Dark (`[data-bs-theme="dark"]`, `[data-theme="dark"]`) and Light (`[data-bs-theme="light"]`, `[data-theme="light"]`) rules, including dark-scrim contrast protection and WCAG-safe badge colors.
8. `_blog-uniform.scss`: Sticky-sidebar preservation (`overflow-x: clip`), uniform internal `.container` scaling across the 1380px boxed sheet, semantic `--xivig-card-bg` / `--xivig-card-border` tokens, and reading progress bar (`.xivig-reading-progress`).

---

## Boxed Editorial Shell & Sticky Sidebars

The master shell [src/layouts/blog.html](../src/layouts/blog.html) wraps all pages inside:

```html
<body class="boxed-layout-body" data-page="{{ active }}">
  <div class="boxed-layout-wrapper">
    <include src="src/partials/header.html" />
    <main class="xivig-main-content"><slot /></main>
    <include src="src/partials/footer.html" />
  </div>
</body>
```

- **Outer Canvas (`body.boxed-layout-body`)**: Fixed radial aura mesh + subtle 40px blueprint grid lines framing the centered page sheet.
- **Centered Sheet (`.boxed-layout-wrapper`)**: `max-width: 1380px`, `min-height: 100vh`, `display: flex; flex-direction: column`, and `overflow-x: clip !important` in `_blog-uniform.scss` so `position: sticky` sidebars (`top: 90px`) remain functional across all viewports (whereas `overflow-x: hidden` would break sticky positioning).
- **Fluid Container Gutters**: `.boxed-layout-wrapper .container*` expands to `100%` width of the 1380px sheet with `clamp(16px, 2.5vw, 36px)` horizontal padding so all page headers, grids, and footer columns align flush with one another.

---

## Anti-FOUC Theme Engine & Dual Attributes

### 1. Synchronous Head Preloader

[src/partials/head.html](../src/partials/head.html) runs an inline synchronous script immediately before stylesheets paint:

```js
var savedTheme = localStorage.getItem('xivig-theme');
if (savedTheme === 'dark' || savedTheme === 'light') {
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.documentElement.setAttribute('data-bs-theme', savedTheme);
}
```

This eliminates light/dark flash of unstyled content (FOUC) on every page navigation.

### 2. Runtime Sync & Public API

`initThemeController()` in [src/js/modules/theme-controller.js](../src/js/modules/theme-controller.js) updates both `[data-bs-theme]` (Bootstrap 5.3 native variable scope) and `[data-theme]` on `<html>` and `<body>`, broadcasts a `xivig:theme:changed` custom event, listens to OS `prefers-color-scheme` changes when no user override is saved, and exposes:

```js
window.XivigTheme.get();    // 'light' | 'dark'
window.XivigTheme.set('dark');
window.XivigTheme.toggle(); // toggles and persists to localStorage['xivig-theme']
```

---

## Core Design Tokens & Contrast Rules

| Token / Class | Light Mode | Dark Mode | Purpose |
| :--- | :--- | :--- | :--- |
| `--color-primary` | `#4f46e5` | `#4f46e5` | Primary brand indigo accent |
| `--gradient-primary` | `#4f46e5 -> #7c3aed -> #ec4899` | `#4f46e5 -> #7c3aed -> #ec4899` | Primary CTAs, embedded pill buttons & reading bar |
| `--xivig-card-bg` | `#ffffff` | `#0f172a` | Surface cards & live autocomplete dropdown |
| `--xivig-card-border` | `rgba(15, 23, 42, 0.08)` | `rgba(148, 163, 184, 0.14)` | Hairline borders on cards and sidebar widgets |
| `.badge.bg-light` | `#f1f5f9` / `#475569` | `#1e293b` / `#cbd5e1` | Native Bootstrap 5 neutral/tag badge (`bg-light.text-primary` uses `#eef2ff` / `#4f46e5` in Light Mode) |
| `.badge.bg-info.bg-opacity-10.text-info` | `rgba(2, 132, 199, 0.12)` / `#0369a1` | Bootstrap dark info token | Accessible Light Mode contrast on card metadata pills |
| `.badge.bg-warning.bg-opacity-10.text-warning` | `rgba(217, 119, 6, 0.12)` / `#b45309` | Bootstrap dark warning token | Accessible Light Mode amber contrast on featured badges |

### Dark Surfaces & Photographic Overlay Safeguards

In `_themes.scss`, Light Mode `.card` and `h1..h6` rules explicitly exclude dark utility surfaces and colored utilities:
- `.card.bg-dark`, `.modal-content.bg-dark`, `.gallery-caption h4`, `#videoStageTitle`, `#lightboxCaption`, `.mag-visual-scrim`, and `.vf-hero` always retain dark backdrops and `#ffffff` headings in **both Light and Dark themes**.
- `#videoStageSummary` and `#lightboxSubtitle` maintain `rgba(241, 245, 249, 0.86)` contrast over dark scrims.
- `.card.border-primary` and `.border-white` bypass neutral `.border` color resets so active episode cards (`video.html`) and hero avatar frames (`format-image.html`) stay visually highlighted.

---

## Embedded Pill Controls & Footer Social Row

- **Search & Newsletter Pill Inputs**: `blog-list.html` (`#catalogSearchInput`), `src/partials/sidebar.html` (`#sidebarSearchInput` and newsletter form), and `src/partials/footer.html` newsletter form nest the submit button inside `position-relative.w-100` pill containers with matching right padding (`padding-right: 52px` for icon circles, `84px` for `Join`, `118px` for `Subscribe`).
- **Circular Footer Social Icons (`.footer-social-btn`)**: Standardized 40x40 circular links in [src/partials/footer.html](../src/partials/footer.html) featuring Bootstrap Icons (`bi-facebook`, `bi-twitter-x`, `bi-github`, `bi-linkedin`) with adaptive border contrast and gradient hover glow.
