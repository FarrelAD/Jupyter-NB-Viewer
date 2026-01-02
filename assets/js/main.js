console.log("Hello this is a Jupyter Notebook Viewer script!");

import { parseNotebook } from "./utils/parser.js";
import { notebook2html } from "./utils/converter.js";
import { initFileUpload } from "./components/fileUpload.js";
import { initThemeSelector } from "./components/themeSelector.js";
import { initMobileToggle } from "./components/mobileToggle.js";
import { initActionButtons } from "./components/actionButtons.js";
import { initPreviewPanel } from "./components/previewPanel.js";

// Application State
let currentNotebookHTML = null;
let currentParsedNotebook = null;

// Initialize Components
const fileUpload = initFileUpload({
    onFileSelect: (file) => {
        // Enable action buttons when file is selected
        buttons.enableLoad();
        buttons.enableClear();
    }
});

const themeSelector = initThemeSelector({
    onThemeChange: (theme) => {
        // Re-render notebook with new theme if already loaded
        if (currentParsedNotebook) {
            renderNotebook(currentParsedNotebook, theme);
        }
    }
});

const mobileToggle = initMobileToggle();

const preview = initPreviewPanel();

const buttons = initActionButtons({
    onLoad: loadNotebook,
    onClear: clearNotebook,
    onDownload: downloadHTML
});

// Core Functions

async function loadNotebook() {
    const file = fileUpload.getFile();
    if (!file) return;

    try {
        // Show loading state
        preview.showLoading();
        buttons.disableLoad();

        // Parse notebook (only once)
        if (!currentParsedNotebook) {
            currentParsedNotebook = await parseNotebook(file);
        }

        // Render with current theme
        const theme = themeSelector.getTheme();
        renderNotebook(currentParsedNotebook, theme);

        // Enable download button
        buttons.enableDownload();
        buttons.enableLoad();

    } catch (error) {
        console.error('Error loading notebook:', error);
        alert('Failed to load notebook. Please check the file format.');

        // Reset to empty state
        preview.showEmpty();
        buttons.enableLoad();
    }
}

function renderNotebook(parsedNotebook, theme) {
    // Convert to HTML
    const html = notebook2html(parsedNotebook, theme);

    // Store for download
    currentNotebookHTML = html;

    // Display in preview
    preview.showNotebook(html);
}

function clearNotebook() {
    // Clear file upload
    fileUpload.clearFile();

    // Reset preview
    preview.showEmpty();

    // Clear state
    currentNotebookHTML = null;
    currentParsedNotebook = null;

    // Disable buttons
    buttons.disableAll();
}

function downloadHTML() {
    if (!currentNotebookHTML) return;

    const file = fileUpload.getFile();
    const filename = file ? file.name.replace('.ipynb', '.html') : 'notebook.html';

    const blob = new Blob([currentNotebookHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}