/**
 * Stackly - Dashboard Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initCharts(); // Placeholder
});

function initSidebar() {
    const togglers = document.querySelectorAll('.sidebar-toggler');
    const layout = document.querySelector('.dashboard-layout');

    if (togglers.length > 0 && layout) {
        togglers.forEach(btn => {
            btn.addEventListener('click', () => {
                layout.classList.toggle('sidebar-collapsed');
            });
        });
    }
}

function initCharts() {
    // Placeholder for chart initialization
    // In a real app, we would use Chart.js or ApexCharts here
}
