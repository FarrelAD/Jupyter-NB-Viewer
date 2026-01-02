// Theme Selector Component
// Handles syntax highlighting theme selection

export function initThemeSelector(callbacks) {
    const themeSelector = document.getElementById("theme-selector");
    let selectedTheme = 'github';

    // Theme change event
    themeSelector.addEventListener('change', (e) => {
        selectedTheme = e.target.value;

        // Trigger callback
        if (callbacks.onThemeChange) {
            callbacks.onThemeChange(selectedTheme);
        }
    });

    // Return API
    return {
        getTheme: () => selectedTheme
    };
}
