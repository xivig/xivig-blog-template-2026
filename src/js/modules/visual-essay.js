/**
 * Immersive visual essay controls: reading progress bar, zen mode, filmstrip, cinema lightbox.
 */
export function vfCopyShareLink() {
    const showToast = () => {
        const toast = document.getElementById('vfToast');
        if (!toast) return;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2600);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(window.location.href).then(showToast).catch(showToast);
    } else {
        showToast();
    }
}

export function initVisualEssay() {
    window.vfCopyShareLink = vfCopyShareLink;

    const framesEl = document.getElementById('vfFramesData');
    const articleRoot = document.getElementById('vfArticleRoot');
    if (!framesEl && !articleRoot) return;

    let frames = [];
    if (framesEl) {
        try {
            frames = JSON.parse(framesEl.textContent || '[]');
        } catch {
            frames = [];
        }
    }
    let currentFrame = 0;

    const progressBar = document.getElementById('vfProgressBar');
    function updateProgress() {
        if (!progressBar) return;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
        progressBar.style.width = `${pct}%`;
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    const zenToggle = document.getElementById('vfZenToggle');
    const zenLabel = document.getElementById('vfZenLabel');
    if (zenToggle && articleRoot) {
        zenToggle.addEventListener('click', () => {
            const active = articleRoot.classList.toggle('vf-zen-mode');
            if (zenLabel) {
                zenLabel.textContent = active ? 'Exit Zen' : 'Zen Mode';
            }
        });
    }

    const heroBg = document.getElementById('vfHeroBg');
    const activeCaption = document.getElementById('vfActivePlateCaption');
    const filmBtns = document.querySelectorAll('.vf-filmstrip-btn');
    const lightbox = document.getElementById('vfLightbox');
    const lightboxImg = document.getElementById('vfLightboxImg');
    const lightboxTitle = document.getElementById('vfLightboxTitle');
    const lightboxCounter = document.getElementById('vfLightboxCounter');

    function setActiveFrame(idx) {
        if (!frames.length) return;
        currentFrame = (idx + frames.length) % frames.length;
        const f = frames[currentFrame];
        if (heroBg) heroBg.src = f.url;
        if (activeCaption) activeCaption.textContent = f.title || '';
        filmBtns.forEach((btn, i) => btn.classList.toggle('active', i === currentFrame));
        if (lightboxImg) {
            lightboxImg.src = f.url;
            lightboxImg.alt = f.alt || f.title || '';
            lightboxImg.classList.remove('zoomed');
        }
        if (lightboxTitle) lightboxTitle.textContent = f.title || '';
        if (lightboxCounter) lightboxCounter.textContent = `${currentFrame + 1} / ${frames.length}`;
    }

    function openLightbox(idx) {
        if (!lightbox) return;
        if (typeof idx === 'number') setActiveFrame(idx);
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
        if (lightboxImg) lightboxImg.classList.remove('zoomed');
    }

    filmBtns.forEach((btn) => {
        btn.addEventListener('click', function () {
            setActiveFrame(parseInt(this.dataset.frameIdx || '0', 10));
        });
        btn.addEventListener('dblclick', function () {
            openLightbox(parseInt(this.dataset.frameIdx || '0', 10));
        });
    });

    document.getElementById('vfOpenLightboxBtn')?.addEventListener('click', () => openLightbox(currentFrame));
    document.getElementById('vfDockLightboxBtn')?.addEventListener('click', () => openLightbox(currentFrame));
    document.getElementById('vfCloseLightboxBtn')?.addEventListener('click', closeLightbox);
    document.getElementById('vfPrevFrameBtn')?.addEventListener('click', () => setActiveFrame(currentFrame - 1));
    document.getElementById('vfNextFrameBtn')?.addEventListener('click', () => setActiveFrame(currentFrame + 1));

    const toggleZoom = () => lightboxImg?.classList.toggle('zoomed');
    document.getElementById('vfLightboxZoomBtn')?.addEventListener('click', toggleZoom);
    lightboxImg?.addEventListener('click', toggleZoom);

    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') setActiveFrame(currentFrame - 1);
        if (e.key === 'ArrowRight') setActiveFrame(currentFrame + 1);
    });
}
