// Mobile Toggle Component
// Handles collapsible panel on mobile devices

export function initMobileToggle() {
    const mobileToggle = document.getElementById("mobile-toggle");
    const inputPanel = document.getElementById("input-panel");

    // Toggle event
    mobileToggle.addEventListener('click', () => {
        inputPanel.classList.toggle('collapsed');
    });

    // Return API
    return {
        collapse: () => inputPanel.classList.add('collapsed'),
        expand: () => inputPanel.classList.remove('collapsed'),
        isCollapsed: () => inputPanel.classList.contains('collapsed')
    };
}
