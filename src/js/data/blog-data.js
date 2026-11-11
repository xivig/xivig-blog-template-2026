/**
 * Static editorial dataset powering client-side search autocomplete and interactive filtering.
 */
export const BLOG_CATEGORIES = [
    { name: 'Cloud & Infrastructure', url: 'category.html' },
    { name: 'Security & Zero-Trust', url: 'category.html' },
    { name: 'Frontend & Design Systems', url: 'category.html' },
    { name: 'AI Systems & Telemetry', url: 'category.html' },
    { name: 'Database Engineering', url: 'category.html' },
];

export const BLOG_TAGS = [
    { name: 'laravel-13', url: 'tag.html' },
    { name: 'zero-trust', url: 'tag.html' },
    { name: 'passkeys', url: 'tag.html' },
    { name: 'vite-8', url: 'tag.html' },
    { name: 'kubernetes', url: 'tag.html' },
    { name: 'mysql-tuning', url: 'tag.html' },
    { name: 'design-tokens', url: 'tag.html' },
];

export const BLOG_POSTS = [
    {
        title: 'Laravel 13 Hyperscale Octane Blueprints',
        url: 'blog-post.html',
        thumbnail: 'assets/img/blog/laravel-hyperscale-architecture.jpg',
        category: 'Cloud & Infrastructure',
        reading_time: '8 min read',
        keywords: ['laravel', 'octane', 'swoole', 'architecture', 'scaling', 'cloud'],
    },
    {
        title: 'Zero-Trust Fortify Passkey Migration Guide',
        url: 'single-magazine.html',
        thumbnail: 'assets/img/blog/fortify-passkey-security.jpg',
        category: 'Security & Zero-Trust',
        reading_time: '7 min read',
        keywords: ['passkeys', 'webauthn', 'zero-trust', 'security', 'auth', 'fortify'],
    },
    {
        title: 'Tokenized UI Architecture for Multi-Brand Systems',
        url: 'format-image.html',
        thumbnail: 'assets/img/blog/reactive-ui-engineering.jpg',
        category: 'Frontend & Design Systems',
        reading_time: '6 min read',
        keywords: ['css', 'tokens', 'dark-mode', 'design', 'scss', 'ui'],
    },
    {
        title: 'Deterministic Edge Caching with Stale-While-Revalidate',
        url: 'feed.html',
        thumbnail: 'assets/img/blog/blog-1.webp',
        category: 'Cloud & Infrastructure',
        reading_time: '5 min read',
        keywords: ['cdn', 'edge', 'cache', 'http', 'performance'],
    },
    {
        title: 'Studio Walkthrough: Zero-Downtime Schema Migrations',
        url: 'video.html',
        thumbnail: 'assets/img/blog/video-feature-fallback.jpg',
        category: 'Database Engineering',
        reading_time: '11 min watch',
        keywords: ['mysql', 'database', 'migration', 'video', 'zero-downtime'],
    },
    {
        title: 'RFC 9530 Digest Fields & Request Signing Standard',
        url: 'format-link.html',
        thumbnail: 'assets/img/blog/bookmark-link-fallback.jpg',
        category: 'Security & Zero-Trust',
        reading_time: '4 min read',
        keywords: ['rfc', 'api', 'security', 'signing', 'bookmark'],
    },
    {
        title: 'Distributed Trace Correlation Across Microservices',
        url: 'blog-post.html',
        thumbnail: 'assets/img/blog/blog-2.webp',
        category: 'AI Systems & Telemetry',
        reading_time: '9 min read',
        keywords: ['opentelemetry', 'tracing', 'telemetry', 'microservices', 'observability'],
    },
    {
        title: 'Building Ultra-Fast Vite 8 Multi-Page Asset Pipelines',
        url: 'single-magazine.html',
        thumbnail: 'assets/img/blog/blog-3.webp',
        category: 'Frontend & Design Systems',
        reading_time: '6 min read',
        keywords: ['vite', 'rollup', 'scss', 'build', 'frontend'],
    },
];
