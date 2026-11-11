/**
 * Blog living gallery modal lightbox controller.
 */
export function openGalleryLightbox(url, caption, title, postLink) {
    const imgEl = document.getElementById('lightboxImg');
    const captionEl = document.getElementById('lightboxCaption');
    const subtitleEl = document.getElementById('lightboxSubtitle');
    const postLinkBtn = document.getElementById('lightboxPostLink');
    const modalEl = document.getElementById('galleryLightboxModal');

    if (!modalEl || !imgEl) return;

    imgEl.src = url;
    if (captionEl) captionEl.innerText = caption;
    if (subtitleEl) subtitleEl.innerText = title;

    if (postLinkBtn) {
        if (postLink) {
            postLinkBtn.href = postLink;
            postLinkBtn.style.display = 'inline-flex';
        } else {
            postLinkBtn.style.display = 'none';
        }
    }

    if (window.bootstrap && window.bootstrap.Modal) {
        window.bootstrap.Modal.getOrCreateInstance(modalEl).show();
    } else if (window.jQuery) {
        window.jQuery(modalEl).modal('show');
    }
}

export function initGalleryLightbox() {
    window.openGalleryLightbox = openGalleryLightbox;
}
