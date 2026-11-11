/**
 * Navigation, scroll-to-top, testimonial carousel, and portfolio lightbox initialization.
 */
export function initNavigationPlugins() {
    const $ = window.jQuery;

    if ($) {
        const $testimonialWrap = $('.testimonial-wrap');
        if ($testimonialWrap.length && typeof $testimonialWrap.slick === 'function') {
            $testimonialWrap.slick({
                slidesToShow: 2,
                slidesToScroll: 2,
                infinite: true,
                dots: true,
                arrows: false,
                autoplay: true,
                autoplaySpeed: 6000,
                responsive: [
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            infinite: true,
                            dots: true,
                        },
                    },
                    {
                        breakpoint: 900,
                        settings: { slidesToShow: 1, slidesToScroll: 1 },
                    },
                    {
                        breakpoint: 600,
                        settings: { slidesToShow: 1, slidesToScroll: 1 },
                    },
                    {
                        breakpoint: 480,
                        settings: { slidesToShow: 1, slidesToScroll: 1 },
                    },
                ],
            });
        }

        const $portfolioGallery = $('.portfolio-gallery');
        if ($portfolioGallery.length && typeof $.fn.magnificPopup === 'function') {
            $portfolioGallery.each(function () {
                $(this).find('.popup-gallery').magnificPopup({
                    type: 'image',
                    gallery: { enabled: true },
                });
            });
        }
    }

    // Desktop hover-intent dropdown behavior with clean mouseout cleanup
    const desktopQuery = window.matchMedia('(min-width: 992px)');
    const navDropdowns = Array.from(document.querySelectorAll('#navbar .nav-item.dropdown'));

    const closeDropdown = (item) => {
        const toggle = item.querySelector('.dropdown-toggle');
        const menu = item.querySelector('.dropdown-menu');
        if (item._hoverTimer) {
            clearTimeout(item._hoverTimer);
            item._hoverTimer = null;
        }
        if (window.bootstrap?.Dropdown && toggle) {
            window.bootstrap.Dropdown.getInstance(toggle)?.hide();
        }
        if (menu) menu.classList.remove('show');
        if (toggle) {
            toggle.classList.remove('show');
            toggle.setAttribute('aria-expanded', 'false');
        }
        if (document.activeElement && item.contains(document.activeElement)) {
            document.activeElement.blur();
        }
    };

    navDropdowns.forEach((dropdownItem) => {
        const toggle = dropdownItem.querySelector('.dropdown-toggle');
        const menu = dropdownItem.querySelector('.dropdown-menu');
        if (!toggle || !menu) return;

        const openMenu = () => {
            if (dropdownItem._hoverTimer) {
                clearTimeout(dropdownItem._hoverTimer);
                dropdownItem._hoverTimer = null;
            }
            navDropdowns.forEach((other) => {
                if (other !== dropdownItem) closeDropdown(other);
            });
            menu.classList.add('show');
            toggle.classList.add('show');
            toggle.setAttribute('aria-expanded', 'true');
        };

        const scheduleClose = () => {
            if (dropdownItem._hoverTimer) clearTimeout(dropdownItem._hoverTimer);
            dropdownItem._hoverTimer = setTimeout(() => {
                if (!dropdownItem.matches(':hover') && !menu.matches(':hover')) {
                    closeDropdown(dropdownItem);
                }
            }, 90);
        };

        dropdownItem.addEventListener('mouseenter', () => {
            if (desktopQuery.matches) openMenu();
        });

        dropdownItem.addEventListener('mouseleave', () => {
            if (desktopQuery.matches) scheduleClose();
        });

        menu.addEventListener('mouseenter', () => {
            if (desktopQuery.matches) openMenu();
        });

        menu.addEventListener('mouseleave', () => {
            if (desktopQuery.matches) scheduleClose();
        });

        toggle.addEventListener('click', (e) => {
            if (desktopQuery.matches && toggle.getAttribute('href') === '#') {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && desktopQuery.matches) {
            navDropdowns.forEach(closeDropdown);
        }
    });

    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        const toggleScrollBtn = () => {
            scrollToTopBtn.style.display = window.scrollY >= 200 ? 'block' : 'none';
        };
        window.addEventListener('scroll', toggleScrollBtn, { passive: true });
        toggleScrollBtn();

        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}
