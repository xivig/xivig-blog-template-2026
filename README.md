# Xivig Blog Template 2026

Modular HTML, SCSS, and ES Module editorial template suite extracted and unified from `laravel-blog-admin-template` using a zero-runtime-bloat **Vite + `sass-embedded`** flat-HTML build pipeline.

## Key Features

- **18 Complete Editorial Pages**:
  - `index.html` — Magazine Portal with breaking ticker, masthead bar, 3-column hero showcase + carousel, popular grid, analysis matrix, visual briefs, spotlight, and topic channels
  - `blog-list.html` — Searchable catalog with live keyword/category filtering and 3/4-column toggle
  - `blog-post.html` & `single-magazine.html` — Longform technical guide (reading progress bar, collapsible TOC, code blocks, related cards) & serif magazine essay
  - `feed.html` — Real-time editorial dispatch stream
  - `category.html`, `tag.html`, `tags.html`, `author.html`, `authors.html` — Complete taxonomy, alphabetical A–Z tag index, and contributor directory
  - `gallery.html` — Filterable masonry gallery with cinema modal lightbox
  - `video.html` — Interactive cinema video stage & episode playlist switcher
  - `format-image.html` & `format-link.html` — Visual essay (Zen mode, EXIF dock, plate filmstrip, fullscreen lightbox) & curated reference bookmark
  - `about.html`, `contact.html`, `privacy.html`, `terms.html` — Uniform corporate & compliance companion pages
- **Modular Composition System**: Write pages once inside `<layout src="src/layouts/blog.html" ...>` with `<include src="src/partials/..." />` and automatic active nav highlighting (`data-nav`).
- **Unified Light & Dark Mode**: Anti-FOUC synchronous preloader + `localStorage` persistence (`xivig-theme`) across every page and card surface.
- **Offline Client-Side Autocomplete**: Sidebar search queries `src/js/data/blog-data.js` without requiring a backend API server.

## Project Structure

```text
xivig-blog-template-2026/
├── vite.config.mjs          # Custom modular <layout>/<include> plugin & static bundler
├── package.json             # Vite 8 + sass-embedded build scripts
├── scripts/
│   └── validate-dist.mjs    # Verifies zero unresolved templates & zero broken links in dist/
└── src/
    ├── layouts/
    │   └── blog.html        # Master boxed editorial layout shell
    ├── partials/            # Shared head, header, mega-menu, sidebar, share, comments, footer
    ├── pages/               # 18 modular editorial HTML views
    ├── scss/                # Extracted frontend design tokens + _blog-uniform.scss
    ├── js/                  # ES modules (theme, navigation, autocomplete, gallery, visual essay)
    └── assets/
        ├── img/             # Curated blog covers, gallery plates, hero slides & avatars
        └── vendor/          # Pre-bundled Bootstrap 5, FontAwesome, Themify, Slick, jQuery
```

## Quick Start

```bash
# Install dependencies
npm install

# Start hot-reloading Vite development server
npm run dev

# Compile standalone static HTML + hashed CSS/JS + copied assets into dist/
npm run build

# Verify every built HTML page and relative asset path in dist/
npm run validate

# Preview production dist/ bundle locally
npm run preview
```

## Production Output (`dist/`)

Running `npm run build` compiles SCSS into hashed CSS, bundles ES modules cleanly, flattens pages to root (`dist/*.html`), rewrites asset URLs to relative paths (`assets/...`), copies fonts/images/vendor bundles into `dist/assets/`, and creates `dist/.nojekyll` for direct GitHub Pages or CDN hosting.
