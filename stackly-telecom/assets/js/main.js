/**
 * Stackly - Telecommunications Contractor HTML Template
 * Global Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLanguage(); // Add RTL support
    // initStickyHeader(); // Disabled per user request
    // initAnimations(); // Disabled per user request
    initA11y();
    initDemoAuth();
    // initPageTransitions(); // Disabled per user request
    initProjectFilters();
    initBlogPagination();
});

/* -------------------------------------------------------------------------- */
/*                                Theme Toggle                                */
/* -------------------------------------------------------------------------- */
function initTheme() {
    const themeToggles = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Get saved preference or use system preference
    const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');

    // Apply initial theme
    setTheme(currentTheme);

    themeToggles.forEach(toggle => {
        // Update icon based on initial theme
        updateThemeIconForElement(toggle, currentTheme);

        toggle.addEventListener('click', () => {
            const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
            // Update all toggles
            themeToggles.forEach(t => updateThemeIconForElement(t, newTheme));
        });
    });

    // Listen for system preference changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            setTheme(newTheme);
            themeToggles.forEach(t => updateThemeIconForElement(t, newTheme));
        }
    });
}

function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function updateThemeIcon(theme) {
    const themeToggles = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');
    themeToggles.forEach(t => updateThemeIconForElement(t, theme));
}

function updateThemeIconForElement(element, theme) {
    if (!element) return;

    const icon = element.querySelector('i');
    if (icon) {
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
}

/* -------------------------------------------------------------------------- */
/*                                Language Toggle                             */
/* -------------------------------------------------------------------------- */
function initLanguage() {
    const langToggles = document.querySelectorAll('#language-toggle, #language-toggle-mobile');

    // Get saved preference or use default
    const currentLang = localStorage.getItem('language') || 'ltr';

    // Apply initial language
    setLanguage(currentLang);

    langToggles.forEach(toggle => {
        // Update icon based on initial language
        updateLanguageIconForElement(toggle, currentLang);

        toggle.addEventListener('click', () => {
            const currentDir = document.body.getAttribute('dir') || 'ltr';
            const newLang = currentDir === 'rtl' ? 'ltr' : 'rtl';
            setLanguage(newLang);
            // Update all toggles
            langToggles.forEach(t => updateLanguageIconForElement(t, newLang));
        });
    });
}

function setLanguage(lang) {
    document.body.setAttribute('dir', lang);
    document.documentElement.setAttribute('lang', lang === 'rtl' ? 'ar' : 'en');
    localStorage.setItem('language', lang);
}

function updateLanguageIcon(lang) {
    const langToggles = document.querySelectorAll('#language-toggle, #language-toggle-mobile');
    langToggles.forEach(t => updateLanguageIconForElement(t, lang));
}

function updateLanguageIconForElement(element, lang) {
    if (!element) return;

    if (lang === 'rtl') {
        element.setAttribute('aria-label', 'Switch to English');
    } else {
        element.setAttribute('aria-label', 'Switch to Arabic (RTL)');
    }
}

/* -------------------------------------------------------------------------- */
/*                                Sticky Header                               */
/* -------------------------------------------------------------------------- */
function initStickyHeader() {
    const header = document.querySelector('.navbar');
    if (header) {
        // Initial check
        if (window.scrollY > 10) {
            header.classList.add('shadow-sm');
        }

        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                header.classList.add('shadow-sm');
            } else {
                header.classList.remove('shadow-sm');
            }
        });
    }
}

/* -------------------------------------------------------------------------- */
/*                                Animations                                  */
/* -------------------------------------------------------------------------- */
function initAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    });
    animatedElements.forEach(el => observer.observe(el));
}

/* -------------------------------------------------------------------------- */
/*                                Accessibility                               */
/* -------------------------------------------------------------------------- */
function initA11y() {
    // Fix navbar toggler accessibility
    const toggler = document.querySelector('.navbar-toggler');
    if (toggler && !toggler.getAttribute('aria-label')) {
        toggler.setAttribute('aria-label', 'Toggle navigation');
    }

    // Fix Learn More links
    const readMoreLinks = document.querySelectorAll('a');
    readMoreLinks.forEach(link => {
        if (link.textContent.trim().toLowerCase() === 'learn more') {
            const cardTitle = link.closest('.card')?.querySelector('h4')?.textContent;
            if (cardTitle) {
                link.setAttribute('aria-label', `Learn more about ${cardTitle}`);
            }
        }
    });
}

/* -------------------------------------------------------------------------- */
/*                           Demo Authentication                              */
/* -------------------------------------------------------------------------- */
function initDemoAuth() {
    // Clear session if on login page
    if (window.location.pathname.includes('login.html')) {
        localStorage.removeItem('Stackly_session');
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }

    // Password Toggle
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            const icon = togglePassword.querySelector('i');
            if (type === 'text') {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
}

function handleLogin() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorAlert = document.getElementById('loginError');

    // Reset errors
    if (errorAlert) errorAlert.classList.add('d-none');
    if (emailInput) emailInput.classList.remove('is-invalid');
    if (passwordInput) passwordInput.classList.remove('is-invalid');

    if (!emailInput || !passwordInput) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Basic Validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        showError('Please enter a valid email address.');
        emailInput.classList.add('is-invalid');
        return;
    }

    if (!password) {
        showError('Please enter your password.');
        passwordInput.classList.add('is-invalid');
        return;
    }

    // Demo Logic
    if (password === 'admin') {
        // Success
        const role = email.endsWith('@Stackly.com') ? 'admin' : 'client';
        const session = {
            user: email,
            role: role,
            token: 'demo-token-' + Date.now()
        };

        localStorage.setItem('Stackly_session', JSON.stringify(session));

        // Show success state briefly
        const btn = document.querySelector('button[type="submit"]');
        if (btn) {
            btn.innerHTML = '<i class="fas fa-circle-notch fa-spin me-2"></i> Signing In...';
            btn.disabled = true;
        }

        setTimeout(() => {
            if (role === 'admin') {
                window.location.href = '../dashboard/admin/index.html';
            } else {
                window.location.href = '../dashboard/client/index.html';
            }
        }, 1000);

    } else {
        // Invalid Password
        showError('Invalid credentials. For demo, use password: <strong>admin</strong>');
        passwordInput.classList.add('is-invalid');
    }
}

function showError(msg) {
    const errorAlert = document.getElementById('loginError');
    if (errorAlert) {
        errorAlert.innerHTML = msg;
        errorAlert.classList.remove('d-none');
    }
}

/* -------------------------------------------------------------------------- */
/*                            Page Transitions                                */
/* -------------------------------------------------------------------------- */
function initPageTransitions() {
    // Get all navigation links (excluding external links and anchors)
    const navLinks = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="http"]):not([target="_blank"])');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if it's a special link (login, dashboard, etc.)
            if (!href || href === '#' || this.hasAttribute('data-no-transition')) {
                return;
            }

            e.preventDefault();

            // Add transitioning class to trigger fade-out
            document.body.classList.add('page-transitioning');

            // Navigate after animation completes
            setTimeout(() => {
                window.location.href = href;
            }, 200); // Match the fadeOut animation duration
        });
    });
}

/* -------------------------------------------------------------------------- */
/*                            Project Filters                                 */
/* -------------------------------------------------------------------------- */
function initProjectFilters() {
    const categoryButtons = document.querySelectorAll('#categoryFilter button');
    const statusSelect = document.getElementById('statusFilter');
    const projectCards = document.querySelectorAll('.project-card');

    if (!categoryButtons.length || !statusSelect || !projectCards.length) {
        return; // Not on projects page
    }

    let activeCategory = 'all';
    let activeStatus = 'all';

    // Category button click handler
    categoryButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Update active category
            activeCategory = this.getAttribute('data-filter');

            // Apply filters
            filterProjects();
        });
    });

    // Status dropdown change handler
    statusSelect.addEventListener('change', function () {
        activeStatus = this.value;
        filterProjects();
    });

    // Filter function
    function filterProjects() {
        projectCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardStatus = card.getAttribute('data-status');

            const categoryMatch = activeCategory === 'all' || cardCategory === activeCategory;
            const statusMatch = activeStatus === 'all' || cardStatus === activeStatus;

            if (categoryMatch && statusMatch) {
                card.style.display = '';
                card.style.animation = 'fadeIn 0.3s ease-in';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

/* -------------------------------------------------------------------------- */
/*                            Blog Pagination                                 */
/* -------------------------------------------------------------------------- */
function initBlogPagination() {
    const pagination = document.getElementById('blog-pagination');
    if (!pagination) return;

    const items = document.querySelectorAll('.blog-post-item');
    const pageLinks = pagination.querySelectorAll('.page-link');
    let currentPage = 1;
    const totalPages = 2; // Fixed for now based on added content

    function showPage(page) {
        if (page < 1 || page > totalPages) return;
        currentPage = parseInt(page);

        // Update posts
        items.forEach(item => {
            if (parseInt(item.getAttribute('data-page')) === currentPage) {
                item.classList.remove('d-none');
                item.style.animation = 'fadeIn 0.3s ease-in';
            } else {
                item.classList.add('d-none');
            }
        });

        // Update pagination UI
        const pageItems = pagination.querySelectorAll('.page-item');
        pageItems.forEach(item => {
            item.classList.remove('active');
            item.classList.remove('disabled');
        });

        document.getElementById(`page-${currentPage}`).classList.add('active');

        if (currentPage === 1) {
            document.getElementById('pagination-prev').classList.add('disabled');
        } else if (currentPage === totalPages) {
            document.getElementById('pagination-next').classList.add('disabled');
        }

        // Scroll to top of posts
        window.scrollTo({ top: document.querySelector('.section-padding').offsetTop - 100, behavior: 'smooth' });
    }

    pageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');

            if (page === 'prev') {
                showPage(currentPage - 1);
            } else if (page === 'next') {
                showPage(currentPage + 1);
            } else {
                showPage(page);
            }
        });
    });
}
