import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.resolve(__dirname, 'src/pages');

/**
 * Discovers all .html templates inside src/pages/ for multi-page Rollup compilation.
 */
function discoverPageInputs() {
  const inputs = {};
  if (!fs.existsSync(PAGES_DIR)) return inputs;

  for (const file of fs.readdirSync(PAGES_DIR)) {
    if (!file.endsWith('.html')) continue;
    const key = path.basename(file, '.html');
    inputs[key] = path.join(PAGES_DIR, file);
  }
  return inputs;
}

/**
 * Resolves <include src="..." /> recursively up to maxDepth.
 */
function resolveIncludes(html, rootDir, depth = 0) {
  if (depth > 10) return html;
  const includeRegex = /<include\s+([^>]*?)\/>/gi;
  return html.replace(includeRegex, (match, attrs) => {
    const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
    if (!srcMatch) return match;
    const partialPath = path.resolve(rootDir, srcMatch[1]);
    if (!fs.existsSync(partialPath)) {
      console.warn(`[xivig-blog] Missing partial: ${srcMatch[1]}`);
      return `<!-- missing partial: ${srcMatch[1]} -->`;
    }
    const content = fs.readFileSync(partialPath, 'utf-8');
    return resolveIncludes(content, rootDir, depth + 1);
  });
}

/**
 * Parses attributes from an opening <layout ...> tag.
 */
function parseAttributes(attrString) {
  const attrs = {};
  const attrRegex = /([a-zA-Z0-9_-]+)=["']([^"']*)["']/g;
  let match;
  while ((match = attrRegex.exec(attrString)) !== null) {
    attrs[match[1]] = match[2];
  }
  return attrs;
}

/**
 * Adds .active to matching <a data-nav="..."> links AND parent <li class="nav-item">.
 */
function activateNavigation(html, activeKey) {
  if (!activeKey) return html;

  // Activate direct <li class="nav-item" data-li-nav="..."> containers
  let updated = html.replace(
    /(<li\b[^>]*\bdata-li-nav=["']([^"']+)["'][^>]*)(>)/gi,
    (full, prefix, keys, close) => {
      const list = keys.split(',').map((k) => k.trim());
      if (!list.includes(activeKey)) return full;
      return prefix.replace(/\bclass=["']([^"']*)["']/i, (_, cls) => {
        const classes = cls.split(/\s+/).filter(Boolean);
        if (!classes.includes('active')) classes.push('active');
        return `class="${classes.join(' ')}"`;
      }) + close;
    }
  );

  // Activate anchor links carrying data-nav="..."
  updated = updated.replace(
    /(<(?:a|button)\b[^>]*\bdata-nav=["']([^"']+)["'][^>]*)(>)/gi,
    (full, prefix, keys, close) => {
      const list = keys.split(',').map((k) => k.trim());
      if (!list.includes(activeKey)) return full;

      let nextPrefix = prefix;
      if (/\bclass=["']([^"']*)["']/i.test(nextPrefix)) {
        nextPrefix = nextPrefix.replace(/\bclass=["']([^"']*)["']/i, (_, cls) => {
          const classes = cls.split(/\s+/).filter(Boolean);
          if (!classes.includes('active')) classes.push('active');
          return `class="${classes.join(' ')}"`;
        });
      } else {
        nextPrefix += ' class="active"';
      }
      if (!/aria-current=/i.test(nextPrefix)) {
        nextPrefix += ' aria-current="page"';
      }
      return nextPrefix + close;
    }
  );

  return updated;
}

/**
 * Composes <layout ...> + named <slot name="..."> / default <slot /> + <include /> tags.
 */
function resolveLayout(html, rootDir) {
  const layoutRegex = /<layout\s+([^>]*)>([\s\S]*?)<\/layout>/i;
  const match = html.match(layoutRegex);
  if (!match) {
    return resolveIncludes(html, rootDir);
  }

  const attrs = parseAttributes(match[1]);
  const innerContent = match[2];
  const layoutPath = path.resolve(rootDir, attrs.src || 'src/layouts/blog.html');

  if (!fs.existsSync(layoutPath)) {
    console.warn(`[xivig-blog] Missing layout: ${attrs.src}`);
    return resolveIncludes(innerContent, rootDir);
  }

  let layoutHtml = fs.readFileSync(layoutPath, 'utf-8');

  const namedSlots = {};
  const defaultBody = innerContent
    .replace(/<slot\s+name=["']([^"']+)["']>([\s\S]*?)<\/slot>/gi, (_, name, body) => {
      namedSlots[name] = body.trim();
      return '';
    })
    .trim();

  layoutHtml = layoutHtml.replace(/<slot\s+name=["']([^"']+)["'](?:\s*\/>|>\s*<\/slot>)/gi, (_, name) => {
    return namedSlots[name] || '';
  });

  layoutHtml = layoutHtml.replace(/<slot\s*\/>|<slot><\/slot>/gi, defaultBody);
  layoutHtml = resolveIncludes(layoutHtml, rootDir);

  const title = attrs.title || 'Xivig Editorial & Engineering Blog';
  const description =
    attrs.description ||
    'Xivig Engineering Blog & Magazine Portal featuring architectural guides, security advisories, visual essays, and live dispatches.';
  const active = attrs.active || 'index';

  layoutHtml = layoutHtml
    .replace(/\{\{\s*title\s*\}\}/g, title)
    .replace(/\{\{\s*description\s*\}\}/g, description)
    .replace(/\{\{\s*active\s*\}\}/g, active);

  layoutHtml = activateNavigation(layoutHtml, active);
  return layoutHtml;
}

/**
 * Recursive directory copy helper for production static asset bundling.
 */
function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Custom Xivig Modular Blog HTML + Standalone Static Bundle Plugin.
 */
function xivigBlogModularPlugin() {
  let rootDir = __dirname;

  return {
    name: 'xivig-blog-modular-plugin',
    configResolved(config) {
      rootDir = config.root;
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const cleanUrl = (req.url || '/').split('?')[0].split('#')[0];

        if (cleanUrl === '/' || cleanUrl === '/index.html') {
          req.url = '/src/pages/index.html';
        } else if (
          cleanUrl.endsWith('.html') &&
          !cleanUrl.startsWith('/src/') &&
          !cleanUrl.startsWith('/@')
        ) {
          const candidate = path.join(rootDir, 'src', 'pages', path.basename(cleanUrl));
          if (fs.existsSync(candidate)) {
            req.url = `/src/pages/${path.basename(cleanUrl)}`;
          }
        }
        next();
      });
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return resolveLayout(html, rootDir);
      },
    },
    closeBundle() {
      const distDir = path.resolve(rootDir, 'dist');
      if (!fs.existsSync(distDir)) return;

      // 1. Copy static curated images & pre-built vendor libraries into dist/assets/
      const assetsTarget = path.join(distDir, 'assets');
      copyDirSync(path.resolve(rootDir, 'src/assets/img'), path.join(assetsTarget, 'img'));
      copyDirSync(path.resolve(rootDir, 'src/assets/vendor'), path.join(assetsTarget, 'vendor'));

      // 2. Flatten dist/src/pages/*.html -> dist/*.html with relative standalone paths (works over HTTP AND file://)
      const builtPagesDir = path.join(distDir, 'src', 'pages');
      if (fs.existsSync(builtPagesDir)) {
        for (const file of fs.readdirSync(builtPagesDir)) {
          if (!file.endsWith('.html')) continue;
          const srcFile = path.join(builtPagesDir, file);
          const outFile = path.join(distDir, file);
          let content = fs.readFileSync(srcFile, 'utf-8');

          // Normalize any relative/root asset prefixes (../../assets/, ./assets/, /src/assets/, /assets/) to assets/
          content = content
            .replace(/(href|src|action|data-href|data-poster)=["'](?:(?:\.\.\/)+|\.\/|\/src\/|\/)?(?:src\/)?assets\//gi, '$1="assets/')
            .replace(/\/src\/assets\//g, 'assets/');

          // Convert module bundle tag into classic deferred script so double-clicking dist/index.html (file://) works without CORS blocks
          content = content.replace(
            /<script\s+type=["']module["']\s+crossorigin\s+src=["']assets\/js\/([^"']+)["']\s*><\/script>/gi,
            '<script defer src="assets/js/$1"></script>'
          );

          // Strip crossorigin attribute on local stylesheets for file:// compatibility
          content = content.replace(
            /<link\s+rel=["']stylesheet["']\s+crossorigin\s+href=["']assets\/css\/([^"']+)["']>/gi,
            '<link rel="stylesheet" href="assets/css/$1">'
          );

          fs.writeFileSync(outFile, content, 'utf-8');
        }
        fs.rmSync(path.join(distDir, 'src'), { recursive: true, force: true });
      }

      // 3. Rewrite url(/assets/...) inside compiled CSS to relative ../fonts/ & ../img/
      const distCss = path.join(distDir, 'assets', 'css');
      if (fs.existsSync(distCss)) {
        for (const cssFile of fs.readdirSync(distCss)) {
          if (!cssFile.endsWith('.css')) continue;
          const cssPath = path.join(distCss, cssFile);
          let cssContent = fs.readFileSync(cssPath, 'utf-8');
          cssContent = cssContent
            .replace(/url\((["']?)(?:\/|\.\/)?assets\/fonts\/([^"')]+)\1\)/gi, 'url($1../fonts/$2$1)')
            .replace(/url\((["']?)(?:\/|\.\/)?assets\/img\/([^"')]+)\1\)/gi, 'url($1../img/$2$1)');
          fs.writeFileSync(cssPath, cssContent, 'utf-8');
        }
      }

      // 4. GitHub Pages support
      fs.writeFileSync(path.join(distDir, '.nojekyll'), '', 'utf-8');
      console.log('[xivig-blog] Built standalone HTML bundle cleanly in dist/');
    },
  };
}

export default defineConfig({
  plugins: [xivigBlogModularPlugin()],
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      input: discoverPageInputs(),
      output: {
        format: 'es',
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0] || assetInfo.name || '';
          if (/\.(css)$/i.test(name)) {
            return 'assets/css/[name]-[hash][extname]';
          }
          if (/\.(png|jpe?g|svg|gif|webp|ico)$/i.test(name)) {
            return 'assets/img/[name]-[hash][extname]';
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(name)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
