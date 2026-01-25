/**
 * Stackly - Telecommunications Contractor HTML Template
 * Global Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initStickyHeader();
    initAnimations();
    initA11y();
    initDemoAuth();
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
        // Smooth transition
        icon.style.opacity = '0';
        setTimeout(() => {
            if (theme === 'dark') {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
            icon.style.opacity = '1';
        }, 150);
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
