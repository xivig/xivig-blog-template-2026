# Xivig Blog Template 2026 — Modular Editorial & Magazine Suite

<div align="center">

[![Vite](https://img.shields.io/badge/Vite-8.x%20%7C%20Fast%20HMR-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.8-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Sass](https://img.shields.io/badge/Dart%20Sass-Embedded-CC6699?logo=sass&logoColor=white)](https://sass-lang.com/)
[![JavaScript](https://img.shields.io/badge/ES6%2B%20Modular-Pure%20Vanilla-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/)
[![Zero jQuery](https://img.shields.io/badge/jQuery-Zero%20(Removed)-success)](#)
[![Standalone Build](https://img.shields.io/badge/Dist-18%20Standalone%20Pages-brightgreen)](#)

A modern, responsive editorial blog and digital magazine template suite engineered with **Bootstrap 5.3.8**, modular **HTML layouts & partials**, **Dart Sass (`sass-embedded`)**, pure **ES6+ vanilla JavaScript (zero jQuery)**, and a fast **Vite 8** standalone build pipeline.

[Explore Pages Catalog](docs/PAGES-CATALOG.md) • [Architecture Guide](docs/ARCHITECTURE.md) • [SCSS & Theming](docs/SCSS-THEMING.md) • [Deployment Guide](docs/DEPLOYMENT.md)

</div>

---

## Key Features

- **18 Complete Editorial Pages**: Full suite spanning a Magazine Portal (`index.html`), Filterable Catalog (`blog-list.html`), Live Dispatch Stream (`feed.html`), Technical Guides & Serif Essays (`blog-post.html`, `single-magazine.html`), Visual Essay (`format-image.html`), Curated Bookmark (`format-link.html`), Living Masonry Gallery (`gallery.html`), Video Studio (`video.html`), Categories/Tags/Authors archives, and corporate pages. See [Pages Catalog](docs/PAGES-CATALOG.md).
- **100% Bootstrap 5.3.8 & Pure Vanilla ES6+**: Built cleanly on native **Bootstrap 5.3.8** CSS and JS (`bootstrap.Modal`, `bootstrap.Dropdown`, `bootstrap.Tab`, `bootstrap.Carousel`) with **zero jQuery, Slick, or Magnific-Popup** dependencies.
- **1380px Boxed Editorial Sheet & Sticky Sidebars**: Centered elevated sheet (`boxed-layout-wrapper`) over a subtle radial grid backdrop with responsive fluid internal gutters (`clamp(16px, 2.5vw, 36px)`) and clip-safe sticky sidebars (`overflow-x: clip`).
- **Dual Light & Dark Theme Engine**: Synchronous `<head>` preloader eliminates FOUC on page load, persists user preference (`localStorage['xivig-theme']`), falls back to OS preference, and safeguards dark cards, modals, and photographic overlays across both modes.
- **Offline Interactive Tooling**: Instant sidebar search autocomplete (`src/js/data/blog-data.js`), catalog search + 3/4-column grid toggle, interactive video stage playlist switcher, gallery lightbox modal, Zen reading mode, and reading progress indicators.
- **Standalone Offline `dist/` Output**: Compiles flat `dist/*.html` files with strictly relative `assets/...` links and classic `<script defer>` tags so pages open seamlessly both over HTTP/CDN and directly via `file:///`.

---

## Project Structure

```text
xivig-blog-template-2026/
├── docs/                              # Architecture, pages, theming & deployment docs
│   ├── ARCHITECTURE.md                # Vite 8 composition pipeline & ES6+ JS modules
│   ├── DEPLOYMENT.md                  # file://, GitHub Pages, Vercel/Netlify & Nginx
│   ├── PAGES-CATALOG.md               # All 18 pages, features & query parameters
│   └── SCSS-THEMING.md                # Boxed shell, Light/Dark tokens & contrast rules
├── scripts/
│   └── validate-dist.mjs              # Validates built HTML links, CSS urls & JS syntax
├── src/
│   ├── assets/
│   │   ├── img/                       # Curated covers, slides, gallery plates & avatars
│   │   └── vendor/                    # Bootstrap 5.3.8, Bootstrap Icons, FontAwesome, Themify
│   ├── js/
│   │   ├── data/blog-data.js          # Client-side editorial index for autocomplete search
│   │   ├── modules/                   # Pure vanilla ES6 modules (zero jQuery)
│   │   └── main.js                    # Unified DOMContentLoaded bootstrapper
│   ├── layouts/
│   │   └── blog.html                  # Master 1380px boxed editorial layout wrapper
│   ├── pages/                         # 18 modular editorial HTML source pages
│   ├── partials/                      # head, header, mega-menu, sidebar, pagination, footer, scripts
│   └── scss/                          # Modular Sass stylesheets (_variables.._blog-uniform)
├── vite.config.mjs                    # Custom <layout>/<include> compiler & static bundler
├── package.json                       # Vite 8 + sass-embedded build & validation scripts
└── README.md                          # Project overview & quick start
```

---

## Quick Start

### Prerequisites

Ensure [Node.js](https://nodejs.org/) (v18+ or v20/22 LTS) and npm are installed.

### Installation & Commands

```bash
# 1. Clone the repository
git clone https://github.com/xivig/xivig-blog-template-2026.git
cd xivig-blog-template-2026

# 2. Install dependencies
npm install

# 3. Start Vite dev server with hot-reloading (<layout> & <include> live resolution)
npm run dev

# 4. Build standalone production distribution in dist/
npm run build

# 5. Validate all 18 HTML pages, asset links, CSS urls & classic JS bundles
npm run validate

# 6. Preview built dist/ output locally on http://localhost:4173
npm run preview
```

---

## Documentation Suite

- [**Architecture Guide**](docs/ARCHITECTURE.md) — How `<layout>`, `<include>`, `data-nav`, Vite 8 `closeBundle()` flattening, and vanilla ES6 modules work together.
- [**Pages & Modules Catalog**](docs/PAGES-CATALOG.md) — Inventory of all 18 templates, interactive DOM hooks, and supported URL filter parameters.
- [**SCSS & Theming Guide**](docs/SCSS-THEMING.md) — Design tokens, boxed sheet geometry, anti-FOUC theme engine, and Light/Dark contrast protection.
- [**Deployment Guide**](docs/DEPLOYMENT.md) — Instructions for offline `file:///` distribution, GitHub Pages, Vercel, Netlify, and Nginx.

---

## License

Released under the **MIT License**.
