/**
 * Article share link copy handler.
 */
function showCopiedFeedback(btn) {
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check text-success"></i> <span class="text-success fw-bold">COPIED!</span>';
    btn.classList.add('copied');
    setTimeout(() => {
        btn.innerHTML = originalHtml;
        btn.classList.remove('copied');
    }, 2200);
}

export function copyCurrentArticleUrl(btn, url) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => showCopiedFeedback(btn));
        return;
    }

    const tempInput = document.createElement('input');
    tempInput.value = url;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showCopiedFeedback(btn);
}

export function initShareButtons() {
    window.copyCurrentArticleUrl = copyCurrentArticleUrl;
    window.showCopiedFeedback = showCopiedFeedback;
}
