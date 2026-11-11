/**
 * Xivig Unified Dark/Light Mode Engine
 * Real-time theme switching with LocalStorage persistence and OS fallback.
 */
const STORAGE_KEY = 'xivig-theme';

export function getPreferredTheme() {
    const storedTheme = localStorage.getItem(STORAGE_KEY);
    if (storedTheme) {
        return storedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    if (document.body) {
        document.body.setAttribute('data-bs-theme', theme);
        document.body.setAttribute('data-theme', theme);
    }

    localStorage.setItem(STORAGE_KEY, theme);

    document.querySelectorAll('.theme-toggle-btn').forEach((btn) => {
        const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
        btn.setAttribute('aria-label', label);
        btn.setAttribute('title', label);
    });

    const adminCheckbox = document.getElementById('theme-view');
    if (adminCheckbox) {
        adminCheckbox.checked = theme === 'dark';
    }

    window.dispatchEvent(new CustomEvent('xivig:theme:changed', { detail: { theme } }));
}

export function initThemeController() {
    window.XivigTheme = {
        get: getPreferredTheme,
        set: applyTheme,
        toggle() {
            const current = document.documentElement.getAttribute('data-bs-theme') || getPreferredTheme();
            const next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            return next;
        },
    };

    applyTheme(getPreferredTheme());

    document.querySelectorAll('.theme-toggle-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.XivigTheme.toggle();
        });
    });

    const adminCheckbox = document.getElementById('theme-view');
    if (adminCheckbox) {
        adminCheckbox.addEventListener('change', function () {
            applyTheme(this.checked ? 'dark' : 'light');
        });
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}
