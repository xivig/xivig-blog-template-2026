# Deployment & Hosting Guide

**Xivig Blog Template 2026** compiles into a zero-backend, 100% standalone static bundle inside `dist/` that runs identically over local `file:///`, GitHub Pages, CDNs, or traditional web servers.

---

## Build & Verify Locally

```bash
# Install devDependencies (Vite 8 + sass-embedded)
npm install

# Compile production distribution into dist/
npm run build

# Validate HTML templates, assets, CSS relative urls & classic JS execution
npm run validate

# Preview production bundle on http://localhost:4173
npm run preview
```

---

## 1. Direct Offline Viewing (`file:///`)

During `npm run build`, [vite.config.mjs](../vite.config.mjs) rewrites all asset links to strictly relative paths (`assets/css/...`, `assets/js/...`, `assets/img/...`), strips `crossorigin` attributes from local stylesheets, and converts compiled JS module tags into `<script defer src="assets/js/...">`.

You can zip and distribute `dist/` directly, or open `dist/index.html` straight from your file manager without running an HTTP server.

---

## 2. GitHub Pages

`npm run build` automatically creates `dist/.nojekyll` so GitHub Pages serves static files without Jekyll processing.

### Option A: Automated GitHub Actions Workflow

Save `.github/workflows/deploy.yml`:

```yaml
name: Deploy Xivig Blog Template

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build_and_deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - run: npm run validate
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

Then enable **Settings -> Pages -> Source: GitHub Actions** in your repository.

---

## 3. Vercel / Netlify / Cloudflare Pages

Configure any static host with:

| Setting | Value |
| :--- | :--- |
| **Build Command** | `npm run build && npm run validate` |
| **Output Directory** | `dist` |
| **Node.js Version** | `20` or `22` |

---

## 4. Nginx / Apache Virtual Host

Serve `dist/` as the document root:

```nginx
server {
    listen 80;
    server_name blog.example.com;
    root /var/www/xivig-blog-template-2026/dist;
    index index.html;

    location /assets/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri.html $uri/ =404;
    }
}
```
