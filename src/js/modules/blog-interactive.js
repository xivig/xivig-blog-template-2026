/**
 * Client-side progressive enhancement for Xivig static blog templates:
 * - Catalog grid column switcher & live keyword/category filter
 * - Gallery filter chips
 * - Video studio stage switcher
 * - Comment composer, upvote counters, share buttons & newsletter feedback
 * - Reading progress bar on long-form article views
 */

function initCatalogFiltering() {
    const grid = document.getElementById('blogCatalogGrid');
    if (!grid) return;

    const searchInput = document.getElementById('catalogSearchInput');
    const col3Btn = document.getElementById('btnGridCol3');
    const col4Btn = document.getElementById('btnGridCol4');
    const categoryPills = document.querySelectorAll('.js-cat-filter');
    const cards = Array.from(grid.querySelectorAll('.js-catalog-item'));
    const countLabel = document.getElementById('catalogResultCount');
    const emptyState = document.getElementById('catalogEmptyState');

    let activeCategory = 'all';
    let searchQuery = '';

    // Apply initial query string filters (?search=... & ?category=...)
    const params = new URLSearchParams(window.location.search);
    if (params.get('search')) {
        searchQuery = params.get('search').trim().toLowerCase();
        if (searchInput) searchInput.value = params.get('search');
    }
    if (params.get('category')) {
        activeCategory = params.get('category').trim().toLowerCase();
    }

    function applyFilter() {
        let visibleCount = 0;
        cards.forEach((card) => {
            const cat = (card.dataset.category || '').toLowerCase();
            const text = (card.dataset.keywords || card.textContent || '').toLowerCase();
            const matchesCat = activeCategory === 'all' || cat === activeCategory;
            const matchesSearch = !searchQuery || text.includes(searchQuery);
            const show = matchesCat && matchesSearch;
            card.classList.toggle('d-none', !show);
            if (show) visibleCount++;
        });

        if (countLabel) countLabel.textContent = String(visibleCount);
        if (emptyState) emptyState.classList.toggle('d-none', visibleCount > 0);

        categoryPills.forEach((pill) => {
            const pillCat = (pill.dataset.category || '').toLowerCase();
            pill.classList.toggle('active', pillCat === activeCategory);
        });
    }

    categoryPills.forEach((pill) => {
        pill.addEventListener('click', (e) => {
            e.preventDefault();
            activeCategory = (pill.dataset.category || 'all').toLowerCase();
            applyFilter();
        });
    });

    searchInput?.addEventListener('input', () => {
        searchQuery = searchInput.value.trim().toLowerCase();
        applyFilter();
    });

    function setColumns(cols) {
        cards.forEach((card) => {
            card.classList.remove('col-xl-3', 'col-lg-3', 'col-lg-4');
            if (cols === 3) {
                card.classList.add('col-lg-4');
            } else {
                card.classList.add('col-xl-3', 'col-lg-3');
            }
        });
        if (col3Btn) {
            col3Btn.classList.toggle('btn-primary', cols === 3);
            col3Btn.classList.toggle('btn-outline-secondary', cols !== 3);
        }
        if (col4Btn) {
            col4Btn.classList.toggle('btn-primary', cols === 4);
            col4Btn.classList.toggle('btn-outline-secondary', cols !== 4);
        }
    }

    col3Btn?.addEventListener('click', () => setColumns(3));
    col4Btn?.addEventListener('click', () => setColumns(4));

    applyFilter();
}

function initGalleryFiltering() {
    const filterButtons = document.querySelectorAll('.js-gallery-filter');
    const items = document.querySelectorAll('.js-gallery-item');
    if (!filterButtons.length || !items.length) return;

    filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const target = (btn.dataset.filter || 'all').toLowerCase();
            filterButtons.forEach((b) => b.classList.toggle('active', b === btn));
            items.forEach((item) => {
                const cat = (item.dataset.category || '').toLowerCase();
                item.classList.toggle('d-none', target !== 'all' && cat !== target);
            });
        });
    });
}

function initVideoPlaylist() {
    const stageImg = document.getElementById('videoStagePoster');
    const stageTitle = document.getElementById('videoStageTitle');
    const stageCategory = document.getElementById('videoStageCategory');
    const stageDuration = document.getElementById('videoStageDuration');
    const stageSummary = document.getElementById('videoStageSummary');
    const episodeBtns = document.querySelectorAll('.js-video-episode');
    if (!episodeBtns.length || !stageTitle) return;

    episodeBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            episodeBtns.forEach((b) => b.classList.remove('border-primary', 'shadow'));
            btn.classList.add('border-primary', 'shadow');

            if (stageImg && btn.dataset.poster) stageImg.src = btn.dataset.poster;
            if (stageTitle && btn.dataset.title) stageTitle.textContent = btn.dataset.title;
            if (stageCategory && btn.dataset.category) stageCategory.textContent = btn.dataset.category;
            if (stageDuration && btn.dataset.duration) {
                const clockIcon = document.createElement('i');
                clockIcon.className = 'far fa-clock me-1';
                stageDuration.replaceChildren(clockIcon, document.createTextNode(` ${btn.dataset.duration}`));
            }
            if (stageSummary && btn.dataset.summary) stageSummary.textContent = btn.dataset.summary;
            window.scrollTo({ top: 140, behavior: 'smooth' });
        });
    });
}

function initShareInteractions() {
    document.querySelectorAll('.js-share-link').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            const network = link.dataset.network;
            const targets = {
                facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
                x: `https://x.com/intent/post?url=${url}&text=${title}`,
                linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
                whatsapp: `https://api.whatsapp.com/send?text=${title}%20${url}`,
                telegram: `https://t.me/share/url?url=${url}&text=${title}`,
            };
            if (targets[network]) {
                window.open(targets[network], '_blank', 'noopener,noreferrer');
            }
        });
    });

    document.querySelectorAll('.js-copy-link-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const parent = btn.closest('.social-share-bar') || document;
            const badge = parent.querySelector('.js-copy-badge');
            const finishCopy = () => {
                if (!badge) return;
                badge.style.display = 'inline-block';
                setTimeout(() => {
                    badge.style.display = 'none';
                }, 2200);
            };
            if (navigator.clipboard?.writeText) {
                navigator.clipboard.writeText(window.location.href).then(finishCopy).catch(finishCopy);
            } else {
                finishCopy();
            }
        });
    });
}

function initDemoFormsAndComments() {
    document.querySelectorAll('.js-newsletter-form').forEach((form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const feedbackId = form.dataset.feedback;
            const feedbackEl = feedbackId ? document.getElementById(feedbackId) : null;
            if (feedbackEl) {
                feedbackEl.textContent = 'Subscribed to the weekly Xivig Engineering Dispatch.';
                feedbackEl.classList.remove('d-none');
            }
            form.reset();
        });
    });

    const contactForm = document.getElementById('demoContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const alertBox = document.getElementById('contactSuccessAlert');
            if (alertBox) alertBox.classList.remove('d-none');
            contactForm.reset();
        });
    }

    document.querySelectorAll('.js-comment-like').forEach((btn) => {
        btn.addEventListener('click', () => {
            const countSpan = btn.querySelector('span');
            const current = parseInt(btn.dataset.count || countSpan?.textContent || '0', 10);
            const liked = btn.classList.toggle('btn-primary');
            btn.classList.toggle('btn-outline-secondary', !liked);
            const next = liked ? current + 1 : current;
            if (countSpan) countSpan.textContent = String(next);
        });
    });

    const commentForm = document.getElementById('demoCommentForm');
    const commentsContainer = document.getElementById('commentsListContainer');
    const totalCountEl = document.getElementById('commentsTotalCount');
    if (commentForm && commentsContainer) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('commentAuthorInput')?.value.trim();
            const body = document.getElementById('commentBodyInput')?.value.trim();
            if (!name || !body) return;

            const wrapper = document.createElement('div');
            wrapper.className = 'comment-thread-group p-4 bg-body-tertiary rounded-4 border border-primary-subtle';
            const header = document.createElement('div');
            header.className = 'd-flex justify-content-between align-items-start mb-2';
            const authorHeading = document.createElement('h6');
            authorHeading.className = 'fw-bold mb-0 text-body';
            authorHeading.textContent = name;
            const timeEl = document.createElement('small');
            timeEl.className = 'text-primary fw-semibold';
            timeEl.textContent = 'Just now';
            header.append(authorHeading, timeEl);

            const bodyEl = document.createElement('p');
            bodyEl.className = 'text-body-secondary mb-0';
            bodyEl.textContent = body;

            wrapper.append(header, bodyEl);
            commentsContainer.prepend(wrapper);
            if (totalCountEl) {
                totalCountEl.textContent = String(commentsContainer.querySelectorAll('.comment-thread-group').length);
            }
            commentForm.reset();
        });
    }
}

function initReadingProgress() {
    const bar = document.getElementById('articleReadingProgress');
    if (!bar) return;
    const onScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const pct = height > 0 ? Math.min(100, Math.max(0, (scrollTop / height) * 100)) : 0;
        bar.style.width = `${pct}%`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

export function initBlogInteractive() {
    initCatalogFiltering();
    initGalleryFiltering();
    initVideoPlaylist();
    initShareInteractions();
    initDemoFormsAndComments();
    initReadingProgress();
}
