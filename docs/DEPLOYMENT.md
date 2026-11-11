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

## 2. GitHub Pages (`gh-pages` + Actions Workflow)

`npm run build` automatically creates `dist/.nojekyll` and strictly relative `assets/...` links so GitHub Pages subpath hosting (`https://xivig.github.io/xivig-blog-template-2026/`) works out of the box without any custom Vite base path.

The repository includes [.github/workflows/deploy.yml](../.github/workflows/deploy.yml), which supports **dual deployment** on every push to `main`:

1. Builds `dist/` via `npm ci && npm run build` and runs `npm run validate`.
2. Publishes compiled static output directly to the `gh-pages` branch (`peaceiris/actions-gh-pages@v4`).
3. Uploads and deploys via native GitHub Pages Actions (`actions/configure-pages@v5`, `upload-pages-artifact@v3`, `deploy-pages@v4`) when workflow deployment is enabled in **Settings -> Pages**.

In your GitHub repository **Settings -> Pages**, choose either:
- **Build and deployment -> GitHub Actions**, or
- **Deploy from a branch -> `gh-pages` / `(root)`**

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
