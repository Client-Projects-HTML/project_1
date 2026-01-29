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
});

/* -------------------------------------------------------------------------- */
/*                                Theme Toggle                                */
/* -------------------------------------------------------------------------- */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Get saved preference or use system preference
    const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');

    // Apply initial theme
    setTheme(currentTheme);

    if (themeToggle) {
        // Update icon based on initial theme
        updateThemeIcon(currentTheme);

        themeToggle.addEventListener('click', () => {
            const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
            updateThemeIcon(newTheme);
        });
    }

    // Listen for system preference changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            setTheme(newTheme);
            updateThemeIcon(newTheme);
        }
    });
}

function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const icon = themeToggle.querySelector('i');
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
    const langToggle = document.getElementById('language-toggle');

    // Get saved preference or use default
    const currentLang = localStorage.getItem('language') || 'ltr';

    // Apply initial language
    setLanguage(currentLang);

    if (langToggle) {
        // Update icon based on initial language
        updateLanguageIcon(currentLang);

        langToggle.addEventListener('click', () => {
            const currentDir = document.body.getAttribute('dir') || 'ltr';
            const newLang = currentDir === 'rtl' ? 'ltr' : 'rtl';
            setLanguage(newLang);
            updateLanguageIcon(newLang);
        });
    }
}

function setLanguage(lang) {
    document.body.setAttribute('dir', lang);
    localStorage.setItem('language', lang);
}

function updateLanguageIcon(lang) {
    const langToggle = document.getElementById('language-toggle');
    if (!langToggle) return;

    const icon = langToggle.querySelector('i');

    if (lang === 'rtl') {
        if (icon) icon.className = 'fas fa-globe';
        langToggle.setAttribute('aria-label', 'Switch to English');
    } else {
        if (icon) icon.className = 'fas fa-language';
        langToggle.setAttribute('aria-label', 'Switch to Arabic (RTL)');
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
        localStorage.removeItem('stackly_session');
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
        const role = email.endsWith('@stackly.com') ? 'admin' : 'client';
        const session = {
            user: email,
            role: role,
            token: 'demo-token-' + Date.now()
        };

        localStorage.setItem('stackly_session', JSON.stringify(session));

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

