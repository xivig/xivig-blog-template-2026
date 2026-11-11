# Architecture & Build Pipeline Guide

This guide explains the modular HTML layout composition, custom Vite 8 static compiler pipeline, ES6+ JavaScript modules, and validation checks powering **Xivig Blog Template 2026**.

---

## Table of Contents

1. [Modular HTML Composition System](#modular-html-composition-system)
2. [Vite 8 Build Pipeline (`vite.config.mjs`)](#vite-8-build-pipeline-viteconfigmjs)
3. [Modular JavaScript Architecture (Zero jQuery)](#modular-javascript-architecture-zero-jquery)
4. [Static Distribution Validator (`scripts/validate-dist.mjs`)](#static-distribution-validator-scriptsvalidate-distmjs)

---

## Modular HTML Composition System

Pages in `src/pages/*.html` never duplicate header, sidebar, or footer boilerplate. Every view uses custom declarative composition tags resolved at both dev request time and build time:

### 1. Layout Shell (`<layout>`)

All 18 editorial pages wrap their page body in [src/layouts/blog.html](../src/layouts/blog.html):

```html
<layout
  src="src/layouts/blog.html"
  title="Video Studio &amp; Engineering Briefings - Xivig Editorial"
  active="video"
  description="Technical walkthrough videos, architectural breakdowns, and interactive episode playlist."
>
  <!-- Page main content injected into <slot /> -->
</layout>
```

Supported `<layout>` attributes:
- `src`: Layout file path relative to project root (`src/layouts/blog.html`).
- `title`: Injected into `<title>{{ title }}</title>` inside [src/partials/head.html](../src/partials/head.html).
- `description`: Injected into `<meta name="description" content="{{ description }}">`.
- `active`: Key matched against `data-nav="..."` and `data-li-nav="..."` navigation items to automatically append `.active` and `aria-current="page"`.

Named slots (`<slot name="scripts">...</slot>`) are also supported for page-specific scripts below the core footer bundle.

### 2. Partials (`<include />`)

Reusable sections in `src/partials/` are embedded recursively (up to depth 10):

- `head.html`: Meta tags, synchronous anti-FOUC theme preloader, Google Fonts (`Outfit`, `Plus Jakarta Sans`, `Source Serif 4`), vendor CSS (`bootstrap.min.css`, `bootstrap-icons.min.css`, `themify-icons.css`, `all.min.css`), and compiled SCSS entry.
- `header.html`: Top utility bar (social links, `v13 Engine` pill badge, Live Feed / Contact quick links, Dark/Light toggle button `#themeToggleBtn`) and primary navbar (`#navbar`).
- `mega-menu.html`: Desktop 3-column Explore mega-menu and mobile dropdown drawer.
- `sidebar.html`: Search Insights widget with live autocomplete (`#sidebarSearchInput`), tabbed Popular/Recent/Replies widget, Topic Categories list, Trending Tags cloud, and sticky Engineering Dispatch newsletter card.
- `pagination.html`: High-contrast Bootstrap 5 pagination navigation.
- `share-buttons.html`: Social share actions (`js-share-link`) and clipboard link copy button (`js-copy-link-btn`).
- `comments.html`: Threaded community discussion block and live demo comment composer (`#demoCommentForm`).
- `footer.html`: Multi-column editorial footer, embedded-button newsletter pill form (`Subscribe`), copyright notice, and circular `.footer-social-btn` actions (Facebook, X, GitHub, LinkedIn).
- `scripts.html`: Pure Bootstrap 5.3.8 bundle (`bootstrap.bundle.min.js`) and modular entrypoint (`/src/js/main.js`).

---

## Vite 8 Build Pipeline (`vite.config.mjs`)

The custom plugin `xivigBlogModularPlugin()` in [vite.config.mjs](../vite.config.mjs) configures Vite 8 (`sass-embedded`) for multi-page development and standalone static production bundles:

| Build Stage | Behavior |
| :--- | :--- |
| **`discoverPageInputs()`** | Scans `src/pages/*.html` and registers all 18 templates as Rollup multi-page inputs. |
| **`configureServer()`** | Rewrites browser requests (`/` -> `/src/pages/index.html`, `/blog-list.html` -> `/src/pages/blog-list.html`) so clean root URLs work natively in `vite` dev mode. |
| **`transformIndexHtml` (`order: 'pre'`)** | Compiles `<layout>`, `<slot>`, `<include />`, `{{ title }}`, `{{ description }}`, and `data-nav` active navigation before Vite processes `<script>` and `<link>` dependencies. |
| **`closeBundle()`** | Copies `src/assets/img` and `src/assets/vendor` into `dist/assets/`, flattens `dist/src/pages/*.html` to `dist/*.html`, rewrites all `/src/assets/` and `../assets/` prefixes to relative `assets/`, converts hashed ES module tags into `<script defer src="assets/js/...">` and removes `crossorigin` attributes for offline `file:///` compatibility, rewrites CSS `url(/assets/...)` references to `../fonts/...` and `../img/...`, and writes `dist/.nojekyll`. |

---

## Modular JavaScript Architecture (Zero jQuery)

The template uses pure native **ES6+ JavaScript** paired directly with **Bootstrap 5.3.8** global APIs (`bootstrap.Dropdown`, `bootstrap.Modal`, `bootstrap.Tab`, `bootstrap.Carousel`). Legacy dependencies (**jQuery**, **Slick**, **Magnific-Popup**) have been completely removed.

All client-side modules are bootstrapped from [src/js/main.js](../src/js/main.js) inside `DOMContentLoaded`:

| File | Primary Export | Responsibilities |
| :--- | :--- | :--- |
| `modules/theme-controller.js` | `initThemeController` | Reads/writes `xivig-theme` in `localStorage`, syncs `[data-bs-theme]` and `[data-theme]`, falls back to `prefers-color-scheme`, attaches `#themeToggleBtn` listeners, and exposes `window.XivigTheme` (`get`, `set`, `toggle`). |
| `modules/navigation-plugins.js` | `initNavigationPlugins` | Desktop (`>= 992px`) hover-intent dropdown menus with 90ms debounce cleanup and `Escape` close using `window.bootstrap.Dropdown`, plus `#scroll-to-top` visibility & smooth scrolling. |
| `modules/sidebar-autocomplete.js` | `initSidebarAutocomplete` | Renders live debounced search results in `#sidebarAutocompleteDropdown` from the local editorial dataset, handling both Vite dev asset URLs and built `dist/` relative URLs. |
| `modules/blog-interactive.js` | `initBlogInteractive` | Powers catalog filtering & 3/4-column grid toggling (`blog-list.html`), gallery filters (`gallery.html`), video stage switching (`video.html`), social share links & copy button feedback, demo contact/comment submission, upvote toggles, and top reading progress (`#articleReadingProgress`). |
| `modules/gallery-lightbox.js` | `initGalleryLightbox` | Exposes `window.openGalleryLightbox(...)` and launches `#galleryLightboxModal` via `window.bootstrap.Modal.getOrCreateInstance(modalEl).show()`. |
| `modules/visual-essay.js` | `initVisualEssay` | Controls `format-image.html` scroll reading indicator (`#vfProgressBar`), Zen Mode focus toggle (`#vfZenToggle`), hero plate filmstrip switcher, fullscreen lightbox (`#vfLightbox`) with zoom and arrow/Escape keyboard controls, and `window.vfCopyShareLink`. |
| `modules/share-buttons.js` | `initShareButtons` | Exposes `window.copyCurrentArticleUrl(btn, url)` with Clipboard API support and temporary confirmation badge. |
| `data/blog-data.js` | `BLOG_CATEGORIES`, `BLOG_POSTS`, `BLOG_TAGS` | Offline JSON-like ES module index driving sidebar instant search autocomplete without requiring a backend endpoint. |

---

## Static Distribution Validator (`scripts/validate-dist.mjs`)

After every build, run `npm run validate` to execute [scripts/validate-dist.mjs](../scripts/validate-dist.mjs). It fails the process on any of the following conditions:

1. **Unresolved Template Syntax**: Any leftover `<include>`, `<layout>`, `<slot>`, Blade directives (`@if`, `@foreach`, etc.), or unreplaced `{{ ... }}` tokens inside `dist/*.html`.
2. **Broken Relative Paths**: Any leftover `/xivig-public/`, `/xivig-admin/`, `/src/assets/`, `../assets/` escape paths, or missing local `href`/`src` targets on disk.
3. **CORS / `file://` Risks**: Any remaining `<script type="module">` tags inside compiled `dist/*.html`.
4. **CSS Asset URL Leaks**: Any unrewritten `url(/assets/...)` references inside compiled `dist/assets/css/*.css`.
5. **Bundle Syntax Errors**: Executes every compiled `dist/assets/js/*.js` inside a Node `vm.Script` context to verify classic deferred execution safety.
