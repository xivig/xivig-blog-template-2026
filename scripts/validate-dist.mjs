import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
  console.error('[validate] ERROR: dist/ does not exist. Run `npm run build` first.');
  process.exit(1);
}

const htmlFiles = fs.readdirSync(distDir).filter((f) => f.endsWith('.html'));
if (htmlFiles.length === 0) {
  console.error('[validate] ERROR: No HTML files found in dist/.');
  process.exit(1);
}

const forbiddenPatterns = [
  { name: 'Unresolved <include>', regex: /<include\s+/i },
  { name: 'Unresolved <layout>', regex: /<layout\s+/i },
  { name: 'Unresolved <slot>', regex: /<slot[\s/>]/i },
  { name: 'Blade directive (@if/@foreach/@csrf)', regex: /@(if|else|endif|foreach|endforeach|extends|section|include|csrf|php)\b/i },
  { name: 'Unreplaced template token ({{ ... }})', regex: /\{\{.*?\}\}/ },
  { name: 'Leftover /xivig-public or /xivig-admin path', regex: /xivig-(public|admin)\//i },
  { name: 'Unrewritten /src/assets/ reference', regex: /\/src\/assets\//i },
  { name: 'Relative escape (../assets/)', regex: /(?:href|src)=["'][^"']*\.\.\/assets\//i },
  { name: 'Module script CORS risk for file://', regex: /<script\s+type=["']module["']/i },
];

const missingTargets = [];
const patternViolations = [];
const cssViolations = [];
const jsViolations = [];

for (const file of htmlFiles) {
  const fullPath = path.join(distDir, file);
  const content = fs.readFileSync(fullPath, 'utf-8');

  for (const rule of forbiddenPatterns) {
    if (rule.regex.test(content)) {
      patternViolations.push(`${file}: ${rule.name}`);
    }
  }

  // Verify every local href / src asset target exists inside dist/
  const attrRegex = /\b(?:href|src)=["']([^"'#?:]+)(?:[?#][^"']*)?["']/gi;
  let match;
  while ((match = attrRegex.exec(content)) !== null) {
    const rawTarget = match[1];
    if (!rawTarget || rawTarget.startsWith('http') || rawTarget.startsWith('mailto:') || rawTarget.startsWith('data:')) {
      continue;
    }
    const cleanTarget = rawTarget.replace(/^\.\//, '');
    const candidatePath = path.resolve(distDir, cleanTarget);
    if (!fs.existsSync(candidatePath)) {
      missingTargets.push(`${file} -> ${rawTarget}`);
    }
  }
}

// Verify compiled CSS has relative ../fonts/ & ../img/ paths
const distCssDir = path.join(distDir, 'assets', 'css');
if (fs.existsSync(distCssDir)) {
  for (const cssFile of fs.readdirSync(distCssDir)) {
    if (!cssFile.endsWith('.css')) continue;
    const cssContent = fs.readFileSync(path.join(distCssDir, cssFile), 'utf-8');
    if (/url\((["']?)\/assets\//i.test(cssContent)) {
      cssViolations.push(`${cssFile}: contains unrewritten url(/assets/...)`);
    }
  }
}

// Verify compiled JS bundle can execute as classic deferred script (file:// safe)
const distJsDir = path.join(distDir, 'assets', 'js');
if (fs.existsSync(distJsDir)) {
  for (const jsFile of fs.readdirSync(distJsDir)) {
    if (!jsFile.endsWith('.js')) continue;
    const jsContent = fs.readFileSync(path.join(distJsDir, jsFile), 'utf-8');
    try {
      new vm.Script(jsContent, { filename: jsFile });
    } catch (err) {
      jsViolations.push(`${jsFile}: ${err.message}`);
    }
  }
}

if (patternViolations.length > 0 || missingTargets.length > 0 || cssViolations.length > 0 || jsViolations.length > 0) {
  console.error('[validate] Validation FAILED:');
  for (const v of patternViolations) console.error(`  - PATTERN: ${v}`);
  for (const m of missingTargets) console.error(`  - MISSING LINK/ASSET: ${m}`);
  for (const c of cssViolations) console.error(`  - CSS URL: ${c}`);
  for (const j of jsViolations) console.error(`  - JS SCRIPT: ${j}`);
  process.exit(1);
}

console.log(`[validate] OK: ${htmlFiles.length} HTML pages, CSS urls, and classic JS bundles verified in dist/.`);
