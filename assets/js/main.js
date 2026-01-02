console.log("Hello this is a Jupyter Notebook Viewer script!");

import { parseNotebook } from "./utils/parser.js";
import { notebook2html } from "./utils/converter.js";

// DOM Elements
const fileInput = document.getElementById("file-input");
const uploadArea = document.getElementById("upload-area");
const fileInfo = document.getElementById("file-info");
const fileName = document.getElementById("file-name");
const fileSize = document.getElementById("file-size");
const themeSelector = document.getElementById("theme-selector");
const mobileToggle = document.getElementById("mobile-toggle");
const inputPanel = document.getElementById("input-panel");
const loadBtn = document.getElementById("load-btn");
const clearBtn = document.getElementById("clear-btn");
const downloadBtn = document.getElementById("download-btn");
const notebookFrame = document.getElementById("notebook-frame");
const emptyState = document.getElementById("empty-state");
const loadingState = document.getElementById("loading");

// State
let currentNotebookHTML = null;
let currentParsedNotebook = null;
let selectedTheme = 'github';

// File size formatter
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Handle file selection
function handleFileSelect(file) {
    if (!file) return;

    // Safety check
    if (!file.name.endsWith('.ipynb')) {
        alert('Please upload a .ipynb file');
        fileInput.value = '';
        return;
    }

    // Update file info display
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    fileInfo.classList.add('active');

    // Enable buttons
    loadBtn.disabled = false;
    clearBtn.disabled = false;
}

// Load and render notebook
async function loadNotebook() {
    const file = fileInput.files[0];
    if (!file) return;

    try {
        // Show loading state
        emptyState.classList.add('hidden');
        notebookFrame.classList.remove('active');
        loadingState.classList.add('active');
        loadBtn.disabled = true;

        // Parse and convert notebook
        if (!currentParsedNotebook) {
            currentParsedNotebook = await parseNotebook(file);
        }
        const html = notebook2html(currentParsedNotebook, selectedTheme);

        // Store HTML for download
        currentNotebookHTML = html;

        // Render in iframe
        const doc = notebookFrame.contentDocument;
        doc.open();
        doc.write(html);
        doc.close();

        // Show notebook frame
        loadingState.classList.remove('active');
        notebookFrame.classList.add('active');

        // Enable download button
        downloadBtn.disabled = false;
        loadBtn.disabled = false;

    } catch (error) {
        console.error('Error loading notebook:', error);
        alert('Failed to load notebook. Please check the file format.');

        // Reset to empty state
        loadingState.classList.remove('active');
        emptyState.classList.remove('hidden');
        loadBtn.disabled = false;
    }
}

// Clear current notebook
function clearNotebook() {
    // Reset file input
    fileInput.value = '';

    // Hide file info
    fileInfo.classList.remove('active');

    // Reset states
    notebookFrame.classList.remove('active');
    loadingState.classList.remove('active');
    emptyState.classList.remove('hidden');

    // Clear stored data
    currentNotebookHTML = null;
    currentParsedNotebook = null;

    // Disable buttons
    loadBtn.disabled = true;
    clearBtn.disabled = true;
    downloadBtn.disabled = true;
}

// Download HTML
function downloadHTML() {
    if (!currentNotebookHTML) return;

    const file = fileInput.files[0];
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

// Event Listeners

// Click to upload
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

// File input change
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
});

// Drag and drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');

    const file = e.dataTransfer.files[0];
    if (file) {
        // Manually set the file to the input
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;

        handleFileSelect(file);
    }
});

// Button clicks
loadBtn.addEventListener('click', loadNotebook);
clearBtn.addEventListener('click', clearNotebook);
downloadBtn.addEventListener('click', downloadHTML);

// Theme change
themeSelector.addEventListener('change', (e) => {
    selectedTheme = e.target.value;

    // Re-render if notebook is already loaded
    if (currentParsedNotebook) {
        const html = notebook2html(currentParsedNotebook, selectedTheme);
        currentNotebookHTML = html;

        const doc = notebookFrame.contentDocument;
        doc.open();
        doc.write(html);
        doc.close();
    }
});

// Mobile toggle for collapsible panel
mobileToggle.addEventListener('click', () => {
    inputPanel.classList.toggle('collapsed');
});