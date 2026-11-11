import { BLOG_CATEGORIES, BLOG_POSTS, BLOG_TAGS } from '../data/blog-data.js';

/**
 * Sidebar live search autocomplete widget powered by the local static editorial index.
 */
function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, (m) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    })[m]);
}

export function initSidebarAutocomplete() {
    const wrapper = document.getElementById('sidebarSearchWrapper');
    const searchInput = document.getElementById('sidebarSearchInput');
    const dropdown = document.getElementById('sidebarAutocompleteDropdown');
    const resultsBox = document.getElementById('autocompleteResultsContent');

    if (!wrapper || !searchInput || !dropdown || !resultsBox) return;

    const fallbackAvatar = wrapper.dataset.fallbackAvatar || 'assets/img/avatar.png';
    let debounceTimer = null;

    function resolveAssetUrl(url) {
        if (!url) return fallbackAvatar;
        const isDev = Boolean(document.querySelector('script[src*="/@vite/client"]'));
        if (isDev) {
            return url.startsWith('assets/') ? `/src/${url}` : url;
        }
        return url;
    }

    function renderResults(query) {
        const needle = query.toLowerCase();

        const posts = BLOG_POSTS.filter((p) => {
            const haystack = `${p.title} ${p.category} ${(p.keywords || []).join(' ')}`.toLowerCase();
            return haystack.includes(needle);
        }).slice(0, 5);

        const categories = BLOG_CATEGORIES.filter((c) => c.name.toLowerCase().includes(needle)).slice(0, 4);
        const tags = BLOG_TAGS.filter((t) => t.name.toLowerCase().includes(needle)).slice(0, 6);

        let html = '';

        if (posts.length > 0) {
            html += '<div class="small fw-bold text-uppercase text-muted mb-2" style="font-size: 10px; letter-spacing: 0.5px;">Articles</div>';
            posts.forEach((p) => {
                html += `<a href="${escapeHtml(p.url)}" class="d-flex align-items-center mb-2 pb-2 border-bottom text-decoration-none text-body">`
                    + `<img src="${escapeHtml(resolveAssetUrl(p.thumbnail))}" class="rounded me-2 flex-shrink-0" style="width: 36px; height: 36px; object-fit: cover;" onerror="this.onerror=null;this.src='${escapeHtml(fallbackAvatar)}';">`
                    + '<div class="min-w-0 flex-grow-1" style="line-height: 1.25;">'
                    + `<div class="fw-bold text-truncate" style="font-size: 12.5px;">${escapeHtml(p.title)}</div>`
                    + `<small class="text-muted" style="font-size: 10.5px;">${escapeHtml(p.category)} · ${escapeHtml(p.reading_time)}</small>`
                    + '</div>'
                    + '</a>';
            });
        }

        if (categories.length > 0) {
            html += '<div class="small fw-bold text-uppercase text-muted mt-2 mb-1" style="font-size: 10px;">Categories</div><div class="d-flex flex-wrap gap-1 mb-2">';
            categories.forEach((c) => {
                html += `<a href="${escapeHtml(c.url)}" class="badge bg-light border text-primary me-1 mb-1 px-2 py-1 text-decoration-none" style="font-size: 11px;"><i class="far fa-folder me-1"></i>${escapeHtml(c.name)}</a>`;
            });
            html += '</div>';
        }

        if (tags.length > 0) {
            html += '<div class="small fw-bold text-uppercase text-muted mt-2 mb-1" style="font-size: 10px;">Tags</div><div class="d-flex flex-wrap gap-1">';
            tags.forEach((t) => {
                html += `<a href="${escapeHtml(t.url)}" class="badge bg-light border text-secondary me-1 mb-1 px-2 py-1 text-decoration-none" style="font-size: 11px;">#${escapeHtml(t.name)}</a>`;
            });
            html += '</div>';
        }

        if (!html) {
            html = `<div class="text-center py-3 text-muted small"><i class="fas fa-search me-1"></i> No matching results for "<strong>${escapeHtml(query)}</strong>"</div>`;
        }

        resultsBox.innerHTML = html;
        dropdown.classList.remove('d-none');
    }

    searchInput.addEventListener('input', function () {
        const q = this.value.trim();
        clearTimeout(debounceTimer);
        if (q.length < 2) {
            dropdown.classList.add('d-none');
            return;
        }
        debounceTimer = setTimeout(() => renderResults(q), 120);
    });

    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
            dropdown.classList.add('d-none');
        }
    });
}
