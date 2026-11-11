# Pages & Modules Catalog

**Xivig Blog Template 2026** ships **18 standalone production HTML pages** built from modular templates inside `src/pages/*.html` and unified through `src/layouts/blog.html`. Every page supports the **1380px boxed layout shell**, **Light/Dark theme persistence**, **sticky sidebar intelligence** (on multi-column views), and **native Bootstrap 5.3.8** components.

---

## Page Inventory Overview

| Output File | Active Key | Sidebar | Interactive Modules & Key Components |
| :--- | :--- | :--- | :--- |
| `index.html` | `index` | Sticky 4-col | Breaking ticker bar, editorial masthead, 3-column hero showcase + Bootstrap 5 Carousel (`#heroMagCarousel`), Popular 4-col grid, Analysis Matrix, Visual Briefs tiles, Editorial Spotlight, Economics showcase, Video briefings, Editor's Picks, and Topic Channels. |
| `blog-list.html` | `blog-list` | Full 12-col grid | Instant keyword search (`#catalogSearchInput` with embedded pill icon), URL `?search=` / `?category=` pre-filtering, category pills (`.js-cat-filter`), 3/4-column layout toggle (`#btnGridCol3` / `#btnGridCol4`), dynamic counter (`#catalogResultCount`), empty state, and pagination. |
| `feed.html` | `feed` | Sticky 4-col | Spotlight feature card, compact highlight cards, and reverse-chronological dispatch stream. |
| `blog-post.html` | `blog-post` | Sticky 4-col | Top scroll progress bar (`#articleReadingProgress`), breadcrumb, collapsible Table of Contents (`#tocCollapse`), syntax code block, inline gallery, tag pills, social share/copy widget, prev/next cards, related posts, and interactive comments (`#demoCommentForm`). |
| `single-magazine.html` | `single-magazine` | Sticky 4-col | Serif (`Source Serif 4`) longform editorial typography header, pull-quote callout, share bar, reading progress (`#articleReadingProgress`), and threaded discussion composer. |
| `format-image.html` | `format-image` | Toggleable (`Zen`) | Full-bleed photographic hero (`vf-hero`), frosted breadcrumbs, **Zen Reading Mode** (`#vfZenToggle`), floating EXIF telemetry dock (`vf-telemetry-dock`), interactive filmstrip switcher, fullscreen modal lightbox (`#vfLightbox`) with zoom + keyboard (`Esc`, arrows), share toast (`#vfToast`), and comments. |
| `format-link.html` | `format-link` | Sticky 4-col | Curated external technical bookmark card, external reference banner (`target="_blank" rel="noopener noreferrer"`), engineering takeaways, and share bar. |
| `gallery.html` | `gallery` | Full 12-col | Dense CSS Grid masonry layout (`living-gallery`), live category filtering (`.js-gallery-filter`), hover overlay captions, and Bootstrap 5 Modal lightbox (`#galleryLightboxModal` triggered via `openGalleryLightbox()`). |
| `video.html` | `video` | Sticky 4-col | Cinematic 16:9 dark video stage (`#videoStagePoster`, `#videoStageTitle`, `#videoStageSummary`, `#videoStageDuration`), episode playlist switcher (`.js-video-episode` highlighting active `border-primary`), and Bootstrap 5 playback preview modal (`#videoPreviewModal`). |
| `category.html` | `category` | Sticky 4-col | Category archive banner (`bg-primary text-white` circular icon + breadcrumbs), pinned/featured story cards, and pagination. |
| `tags.html` | `tags` | Sticky 4-col | Knowledge index header, trending high-volume topic pills with count badges, quick-jump letter bar (`A–Z`), and alphabetical directory index (`#letter-A` through `#letter-Z`). |
| `tag.html` | `tag` | Sticky 4-col | Single tag stream view (`#laravel-13`) with filtered publication cards and pagination. |
| `authors.html` | `authors` | Full 12-col | Editorial contributor card grid with publication count badges, specialty bios, profile links, and social icon buttons. |
| `author.html` | `author` | Sticky 4-col | Author bio card with verified status badge, metric pills (`Publications`, `Reads`, `Core Fellow`), social buttons, and contributor publication grid. |
| `about.html` | `about` | Full 12-col | Editorial mission statement, collaboration photography banner, and 3-column architectural feature cards (`icon-box-elite`). |
| `contact.html` | `contact` | Full 12-col | Interactive contact inquiry form (`#demoContactForm`) with client-side submission validation & alert feedback (`#contactSuccessAlert`), paired with headquarters/contact cards. |
| `privacy.html` | `privacy` | Full 12-col | Compliance & privacy commitment sections explaining minimal `localStorage` usage (`xivig-theme`). |
| `terms.html` | `terms` | Full 12-col | Editorial licensing & terms of usage page. |

---

## Navigation & Mega-Menu Mapping

Navigation active state highlighting is driven automatically by matching the `active` attribute on `<layout>` against `data-nav="..."` and `data-li-nav="..."` attributes inside [src/partials/header.html](../src/partials/header.html) and [src/partials/mega-menu.html](../src/partials/mega-menu.html):

- **Top-Level Links**: `Magazine` (`index,magazine`), `Catalog` (`blog-list`), `Explore` mega-menu (`blog-post,single-magazine,feed,format-image,format-link,category,tag,tags,author,authors`), `Gallery` (`gallery`), `Videos` (`video`), `Pages` dropdown (`about,contact,privacy,terms`), and `Live Stream` pill CTA.

---

## URL Query Parameters

Several interactive features preserve state or deep-link across static HTML views using browser query parameters:

- `blog-list.html?search=<keyword>` — Pre-populates `#catalogSearchInput` and immediately filters matching article cards. Selected popular tags in `src/partials/sidebar.html` (e.g., `Laravel`, `Passkeys`, `Architecture`, `Zero-Trust`) use this route.
- `blog-list.html?category=<slug>` — Activates matching `.js-cat-filter` tab (`cloud`, `security`, `frontend`, `database`) upon page load.
