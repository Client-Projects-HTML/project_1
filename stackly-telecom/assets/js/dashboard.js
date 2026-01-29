/**
 * Stackly - Dashboard Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initCharts(); // Placeholder
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

function initCharts() {
    // Placeholder for chart initialization
    // In a real app, we would use Chart.js or ApexCharts here
}
