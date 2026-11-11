/**
 * Xivig Blog Template Frontend Modular Entry
 * Initializes theme engine, dropdown navigation, search autocomplete, lightboxes, visual essays, and interactive views.
 */
import { initThemeController } from './modules/theme-controller.js';
import { initNavigationPlugins } from './modules/navigation-plugins.js';
import { initSidebarAutocomplete } from './modules/sidebar-autocomplete.js';
import { initShareButtons } from './modules/share-buttons.js';
import { initGalleryLightbox } from './modules/gallery-lightbox.js';
import { initVisualEssay } from './modules/visual-essay.js';
import { initBlogInteractive } from './modules/blog-interactive.js';

document.addEventListener('DOMContentLoaded', () => {
    initThemeController();
    initNavigationPlugins();
    initSidebarAutocomplete();
    initShareButtons();
    initGalleryLightbox();
    initVisualEssay();
    initBlogInteractive();
});
