document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initCharts();
    initGlobalActions();
    initExportButton();
    initProjectActions();
    initClientActions();
    initTechnicianActions();
    initClientMessageActions();
    initDocumentActions();
    initClientProjectActions();
    initChatMessageToggles();
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
                localStorage.removeItem('stackly_session');
                window.location.href = '../../login.html';
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
        // Exclude our functional buttons
        if (editBtn && !editBtn.classList.contains('client-details-btn') && !editBtn.classList.contains('view-project-btn')) {
            if (editBtn.textContent.includes('Edit') || editBtn.textContent.includes('Details')) {
                const href = editBtn.getAttribute('href');
                if (!href || href === '#' || href === 'javascript:void(0)') {
                    e.preventDefault();
                    showToast('Advanced management details are under development for this demo.', 'info');
                }
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

function initExportButton() {
    const exportBtn = document.getElementById('exportTimelineBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            // Collect timeline data
            const timelineData = [
                ['Project Name', 'Start Date', 'End Date', 'Status', 'Progress'],
                ['Metro Fiber Phase 1', 'Jan 5, 2026', 'Feb 15, 2026', 'Completed', '100%'],
                ['Downtown 5G Rollout', 'Jan 10, 2026', 'Mar 20, 2026', 'In Progress', '65%'],
                ['Westside Fiber Expansion', 'Feb 1, 2026', 'Apr 30, 2026', 'Planning', '25%'],
                ['Rural Connectivity Initiative', 'Mar 1, 2026', 'Jun 15, 2026', 'Scheduled', '10%'],
                ['Enterprise Network Upgrade', 'Feb 15, 2026', 'May 10, 2026', 'In Progress', '45%']
            ];

            // Convert to CSV
            const csvContent = timelineData.map(row => row.join(',')).join('\n');

            // Create download link
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', `project_timeline_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Show success message
            showToast('Timeline exported successfully!', 'success');
        });
    }
}

function initProjectActions() {
    // New Project Button
    const newProjectBtn = document.getElementById('newProjectBtn');
    if (newProjectBtn) {
        newProjectBtn.addEventListener('click', () => {
            // Create modal HTML
            const modalHTML = `
                <div class="modal fade" id="newProjectModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header py-2">
                                <h6 class="modal-title fw-bold mb-0">Create New Project</h6>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body py-3">
                                <form id="newProjectForm">
                                    <div class="row g-2">
                                        <div class="col-12">
                                            <label class="form-label small mb-1 text-body">Project Name</label>
                                            <input type="text" class="form-control form-control-sm" required>
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label small mb-1 text-body">Client</label>
                                            <select class="form-select form-select-sm" required>
                                                <option value="">Select Client</option>
                                                <option>MetroFiber Inc.</option>
                                                <option>TechSolutions</option>
                                                <option>ConnectCorp</option>
                                            </select>
                                        </div>
                                        <div class="col-6">
                                            <label class="form-label small mb-1 text-body">Start Date</label>
                                            <input type="date" class="form-control form-control-sm" required>
                                        </div>
                                        <div class="col-6">
                                            <label class="form-label small mb-1 text-body">End Date</label>
                                            <input type="date" class="form-control form-control-sm" required>
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label small mb-1 text-body">Description</label>
                                            <textarea class="form-control form-control-sm" rows="2"></textarea>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer py-2">
                                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-primary btn-sm" id="saveProjectBtn">Create Project</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Remove existing modal if any
            const existingModal = document.getElementById('newProjectModal');
            if (existingModal) existingModal.remove();

            // Add modal to body
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('newProjectModal'));
            modal.show();

            // Handle save button
            document.getElementById('saveProjectBtn').addEventListener('click', () => {
                showToast('Project created successfully!', 'success');
                modal.hide();
                setTimeout(() => document.getElementById('newProjectModal').remove(), 500);
            });
        });
    }

    // View Project Buttons
    const viewProjectBtns = document.querySelectorAll('.view-project-btn');
    viewProjectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.getAttribute('data-project-id');
            const projectName = btn.getAttribute('data-project-name');

            // Create modal HTML
            const modalHTML = `
                <div class="modal fade" id="viewProjectModal" tabindex="-1">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title fw-bold">${projectName}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="text-muted small">Project ID</label>
                                        <div class="fw-semibold">${projectId}</div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="text-muted small">Status</label>
                                        <div><span class="badge bg-primary-subtle text-primary">Active</span></div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="text-muted small">Start Date</label>
                                        <div class="fw-semibold">Jan 10, 2026</div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="text-muted small">End Date</label>
                                        <div class="fw-semibold">Mar 20, 2026</div>
                                    </div>
                                    <div class="col-12">
                                        <label class="text-muted small">Description</label>
                                        <div class="fw-semibold">Deployment of 5G infrastructure across downtown area including tower installations and network optimization.</div>
                                    </div>
                                    <div class="col-12">
                                        <label class="text-muted small">Progress</label>
                                        <div class="progress" style="height: 20px;">
                                            <div class="progress-bar bg-primary" style="width: 75%">75%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Remove existing modal if any
            const existingModal = document.getElementById('viewProjectModal');
            if (existingModal) existingModal.remove();

            // Add modal to body
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('viewProjectModal'));
            modal.show();

            // Clean up modal after it's hidden
            document.getElementById('viewProjectModal').addEventListener('hidden.bs.modal', () => {
                document.getElementById('viewProjectModal').remove();
            });
        });
    });
}


function initClientActions() {
    // Add Client Button
    const addClientBtn = document.getElementById('addClientBtn');
    if (addClientBtn) {
        addClientBtn.addEventListener('click', () => {
            const modalHTML = `
                <div class="modal fade" id="addClientModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header py-2">
                                <h6 class="modal-title fw-bold mb-0">Add New Client</h6>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body py-3">
                                <form id="addClientForm">
                                    <div class="row g-2">
                                        <div class="col-12">
                                            <label class="form-label small mb-1 text-body">Company Name</label>
                                            <input type="text" class="form-control form-control-sm" required>
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label small mb-1 text-body">Business Type</label>
                                            <select class="form-select form-select-sm" required>
                                                <option value="">Select Type</option>
                                                <option>Telecom Provider</option>
                                                <option>Infrastructure</option>
                                                <option>Enterprise</option>
                                                <option>Government</option>
                                            </select>
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label small mb-1 text-body">Location</label>
                                            <input type="text" class="form-control form-control-sm" placeholder="City, State" required>
                                        </div>
                                        <div class="col-6">
                                            <label class="form-label small mb-1 text-body">Email</label>
                                            <input type="email" class="form-control form-control-sm" required>
                                        </div>
                                        <div class="col-6">
                                            <label class="form-label small mb-1 text-body">Phone</label>
                                            <input type="tel" class="form-control form-control-sm" required>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer py-2">
                                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-primary btn-sm" id="saveClientBtn">Add Client</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            const existingModal = document.getElementById('addClientModal');
            if (existingModal) existingModal.remove();

            document.body.insertAdjacentHTML('beforeend', modalHTML);
            const modal = new bootstrap.Modal(document.getElementById('addClientModal'));
            modal.show();

            document.getElementById('saveClientBtn').addEventListener('click', () => {
                showToast('Client added successfully!', 'success');
                modal.hide();
                setTimeout(() => document.getElementById('addClientModal').remove(), 500);
            });
        });
    }

    // Client Details Buttons
    const clientDetailsBtns = document.querySelectorAll('.client-details-btn');
    clientDetailsBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const clientName = btn.getAttribute('data-client-name');
            const clientType = btn.getAttribute('data-client-type');
            const clientLocation = btn.getAttribute('data-client-location');
            const clientStatus = btn.getAttribute('data-client-status');

            // Create modal HTML
            const modalHTML = `
                <div class="modal fade" id="clientDetailsModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header py-2">
                                <h6 class="modal-title fw-bold mb-0">${clientName}</h6>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body py-3">
                                <div class="row g-2">
                                    <div class="col-6">
                                        <label class="text-muted small">Company</label>
                                        <div class="fw-semibold small">${clientName}</div>
                                    </div>
                                    <div class="col-6">
                                        <label class="text-muted small">Type</label>
                                        <div class="fw-semibold small">${clientType}</div>
                                    </div>
                                    <div class="col-6">
                                        <label class="text-muted small">Location</label>
                                        <div class="fw-semibold small"><i class="fas fa-map-marker-alt me-1 text-primary"></i>${clientLocation}</div>
                                    </div>
                                    <div class="col-6">
                                        <label class="text-muted small">Status</label>
                                        <div><span class="badge bg-success-subtle text-success">${clientStatus}</span></div>
                                    </div>
                                    <div class="col-6">
                                        <label class="text-muted small">Email</label>
                                        <div class="fw-semibold small">contact@${clientName.toLowerCase().replace(/\s+/g, '')}.com</div>
                                    </div>
                                    <div class="col-6">
                                        <label class="text-muted small">Phone</label>
                                        <div class="fw-semibold small">+1 (555) 123-4567</div>
                                    </div>
                                    <div class="col-6">
                                        <label class="text-muted small">Projects</label>
                                        <div class="fw-semibold small">3 active</div>
                                    </div>
                                    <div class="col-6">
                                        <label class="text-muted small">Manager</label>
                                        <div class="fw-semibold small">John Smith</div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer py-2">
                                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Remove existing modal if any
            const existingModal = document.getElementById('clientDetailsModal');
            if (existingModal) existingModal.remove();

            // Add modal to body
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('clientDetailsModal'));
            modal.show();

            // Clean up modal after it's hidden
            document.getElementById('clientDetailsModal').addEventListener('hidden.bs.modal', () => {
                document.getElementById('clientDetailsModal').remove();
            });
        });
    });
}

function initTechnicianActions() {
    // New Technician Button
    const newTechBtn = document.getElementById('newTechnicianBtn');
    if (newTechBtn) {
        newTechBtn.addEventListener('click', () => {
            const modalHTML = `
                <div class="modal fade" id="newTechnicianModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header py-2">
                                <h6 class="modal-title fw-bold mb-0">Add New Technician</h6>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body py-3">
                                <form id="newTechnicianForm">
                                    <div class="row g-2">
                                        <div class="col-12">
                                            <label class="form-label small mb-1 text-body">Full Name</label>
                                            <input type="text" class="form-control form-control-sm" required>
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label small mb-1 text-body">Email</label>
                                            <input type="email" class="form-control form-control-sm" required>
                                        </div>
                                        <div class="col-6">
                                            <label class="form-label small mb-1 text-body">Phone</label>
                                            <input type="tel" class="form-control form-control-sm" required>
                                        </div>
                                        <div class="col-6">
                                            <label class="form-label small mb-1 text-body">Skill</label>
                                            <select class="form-select form-select-sm" required>
                                                <option value="">Select Skill</option>
                                                <option>Fiber Optic</option>
                                                <option>5G Installation</option>
                                                <option>Network Setup</option>
                                            </select>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer py-2">
                                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-primary btn-sm" id="saveTechnicianBtn">Add Technician</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            const existingModal = document.getElementById('newTechnicianModal');
            if (existingModal) existingModal.remove();

            document.body.insertAdjacentHTML('beforeend', modalHTML);
            const modal = new bootstrap.Modal(document.getElementById('newTechnicianModal'));
            modal.show();

            document.getElementById('saveTechnicianBtn').addEventListener('click', () => {
                showToast('Technician added successfully!', 'success');
                modal.hide();
                setTimeout(() => document.getElementById('newTechnicianModal').remove(), 500);
            });
        });
    }

    // Message Technician Buttons
    const messageBtns = document.querySelectorAll('.message-tech-btn');
    messageBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const techName = btn.getAttribute('data-tech-name');
            const techId = btn.getAttribute('data-tech-id');

            const modalHTML = `
                <div class="modal fade" id="messageTechModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header py-2">
                                <h6 class="modal-title fw-bold mb-0">Message ${techName}</h6>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body py-3">
                                <div class="mb-3">
                                    <label class="text-muted small">To: ${techName} (${techId})</label>
                                </div>
                                <form id="messageTechForm">
                                    <div class="mb-2">
                                        <label class="form-label small mb-1 text-body">Subject</label>
                                        <input type="text" class="form-control form-control-sm" required>
                                    </div>
                                    <div class="mb-2">
                                        <label class="form-label small mb-1 text-body">Message</label>
                                        <textarea class="form-control form-control-sm" rows="4" required></textarea>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer py-2">
                                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-primary btn-sm" id="sendMessageBtn">Send Message</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            const existingModal = document.getElementById('messageTechModal');
            if (existingModal) existingModal.remove();

            document.body.insertAdjacentHTML('beforeend', modalHTML);
            const modal = new bootstrap.Modal(document.getElementById('messageTechModal'));
            modal.show();

            document.getElementById('sendMessageBtn').addEventListener('click', () => {
                showToast('Message sent to ' + techName + '!', 'success');
                modal.hide();
                setTimeout(() => document.getElementById('messageTechModal').remove(), 500);
            });

            document.getElementById('messageTechModal').addEventListener('hidden.bs.modal', () => {
                document.getElementById('messageTechModal').remove();
            });
        });
    });
}

function initClientMessageActions() {
    const sendBtn = document.getElementById('sendMessageBtn');
    const messageInput = document.getElementById('messageInput');

    if (sendBtn && messageInput) {
        const sendMessage = () => {
            const message = messageInput.value.trim();
            if (message) {
                // Get the messages container
                const messagesContainer = document.querySelector('.flex-grow-1.p-4.overflow-auto');

                // Create message element
                const messageHTML = `
                    <div class="d-flex justify-content-end mb-3">
                        <div class="bg-primary text-white rounded-3 px-3 py-2" style="max-width: 70%;">
                            ${message}
                        </div>
                    </div>
                `;

                // Add message to container
                if (messagesContainer) {
                    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
                    // Scroll to bottom
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }

                // Clear input
                messageInput.value = '';

                // Show success notification
                showToast('Message sent!', 'success');
            }
        };

        // Send on button click
        sendBtn.addEventListener('click', sendMessage);

        // Send on Enter key
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }
}

function initDocumentActions() {
    // Download Document Buttons
    const downloadBtns = document.querySelectorAll('.download-doc-btn');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filename = btn.getAttribute('data-filename');
            const filesize = btn.getAttribute('data-filesize');

            // In a real application, this would trigger an actual download
            // For demo purposes, we'll show a success message
            showToast(`Downloading ${filename} (${filesize})...`, 'success');

            // Simulate download progress
            setTimeout(() => {
                showToast(`${filename} downloaded successfully!`, 'success');
            }, 1500);
        });
    });

    // Browse File Button
    const browseBtn = document.getElementById('browseFileBtn');
    const fileInput = document.getElementById('fileUploadInput');

    if (browseBtn && fileInput) {
        browseBtn.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                const fileNames = Array.from(files).map(f => f.name).join(', ');
                showToast(`Selected ${files.length} file(s): ${fileNames}`, 'success');

                // Simulate upload
                setTimeout(() => {
                    showToast('Files uploaded successfully!', 'success');
                    fileInput.value = ''; // Clear selection
                }, 1500);
            }
        });
    }
}

function initClientProjectActions() {
    const addProjectBtn = document.getElementById('addProjectBtn');

    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', () => {
            const modalHTML = `
                <div class="modal fade" id="addProjectModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header py-2">
                                <h6 class="modal-title fw-bold mb-0">Add New Project</h6>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body py-3">
                                <form id="addProjectForm">
                                    <div class="row g-2">
                                        <div class="col-12">
                                            <label class="form-label small mb-1 text-body">Project Name</label>
                                            <input type="text" class="form-control form-control-sm" required>
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label small mb-1 text-body">Project Type</label>
                                            <select class="form-select form-select-sm" required>
                                                <option value="">Select Type</option>
                                                <option>5G Network Deployment</option>
                                                <option>Fiber Optic Installation</option>
                                                <option>Tower Construction</option>
                                                <option>Network Upgrade</option>
                                                <option>Infrastructure Maintenance</option>
                                            </select>
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label small mb-1 text-body">Location</label>
                                            <input type="text" class="form-control form-control-sm" placeholder="City, State" required>
                                        </div>
                                        <div class="col-6">
                                            <label class="form-label small mb-1 text-body">Start Date</label>
                                            <input type="date" class="form-control form-control-sm" required>
                                        </div>
                                        <div class="col-6">
                                            <label class="form-label small mb-1 text-body">Budget</label>
                                            <input type="text" class="form-control form-control-sm" placeholder="$" required>
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label small mb-1 text-body">Description</label>
                                            <textarea class="form-control form-control-sm" rows="3" required></textarea>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer py-2">
                                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-primary btn-sm" id="saveProjectBtn">Add Project</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            const existingModal = document.getElementById('addProjectModal');
            if (existingModal) existingModal.remove();

            document.body.insertAdjacentHTML('beforeend', modalHTML);
            const modal = new bootstrap.Modal(document.getElementById('addProjectModal'));
            modal.show();

            document.getElementById('saveProjectBtn').addEventListener('click', () => {
                showToast('Project added successfully!', 'success');
                modal.hide();
                setTimeout(() => document.getElementById('addProjectModal').remove(), 500);
            });
        });
    }
}

function initChatMessageToggles() {
    const chatItems = document.querySelectorAll('.chat-item');
    const backBtn = document.getElementById('backToChatList');
    const chatList = document.getElementById('chatList');
    const chatView = document.getElementById('chatView');

    if (chatItems.length > 0 && chatList && chatView) {
        chatItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    chatList.classList.add('d-none');
                    chatView.classList.remove('d-none');
                }
            });
        });
    }

    if (backBtn && chatList && chatView) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            chatView.classList.add('d-none');
            chatList.classList.remove('d-none');
        });
    }
}
