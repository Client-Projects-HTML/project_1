document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initCharts();
    initGlobalActions();
});

function initSidebar() {
    const togglers = document.querySelectorAll('.sidebar-toggler');

    // Create overlay if it doesn't exist
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay && document.querySelector('.dashboard-layout')) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);

        overlay.addEventListener('click', () => {
            document.body.classList.remove('sidebar-open');
        });
    }

    if (togglers.length > 0) {
        togglers.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                document.body.classList.toggle('sidebar-open');
            });
        });
    }

    // Close sidebar on link click (mobile)
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                document.body.classList.remove('sidebar-open');
            }
        });
    });
}

/**
 * Global Interactivity for Dashboard Buttons
 */
function initGlobalActions() {
    // Logout Functionality
    const logoutBtns = document.querySelectorAll('a[href*="login.html"], .btn-outline-danger');
    logoutBtns.forEach(btn => {
        if (btn.textContent.includes('Logout')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Are you sure you want to logout?')) {
                    localStorage.removeItem('stackly_session');
                    window.location.href = '../../login.html';
                }
            });
        }
    });

    // Delete Actions
    document.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.text-danger, .btn-outline-danger');
        if (deleteBtn && (deleteBtn.textContent.includes('Delete') || deleteBtn.querySelector('.fa-trash'))) {
            e.preventDefault();
            const itemName = deleteBtn.closest('tr')?.querySelector('td:first-child')?.textContent.trim() || 'this item';
            if (confirm(`Are you sure you want to delete "${itemName}"? This action cannot be undone.`)) {
                showToast('Item deleted successfully', 'success');
                // In a real app, delete logic would go here
            }
        }
    });

    // Edit/Details (Under Development)
    document.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.dropdown-item, .btn-sm');
        if (editBtn && (editBtn.textContent.includes('Edit') || editBtn.textContent.includes('Details'))) {
            const href = editBtn.getAttribute('href');
            if (!href || href === '#' || href === 'javascript:void(0)') {
                e.preventDefault();
                showToast('Advanced management details are under development for this demo.', 'info');
            }
        }
    });

    // Form Submissions (New Project, Add Client, Send Message)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('.btn-primary');
            const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
            }

            setTimeout(() => {
                showToast('Action completed successfully!', 'success');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
                form.reset();
            }, 1000);
        });
    });
}

/**
 * Simple Toast Notification System
 */
function showToast(message, type = 'info') {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }

    const toastId = 'toast-' + Date.now();
    const bgClass = type === 'success' ? 'bg-success' : (type === 'danger' ? 'bg-danger' : 'bg-primary');

    const toastHtml = `
        <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    const toastEl = document.getElementById(toastId);

    setTimeout(() => {
        if (toastEl) {
            toastEl.classList.remove('show');
            setTimeout(() => toastEl.remove(), 500);
        }
    }, 3000);
}

function initCharts() {
    // Placeholder for chart initialization
}
