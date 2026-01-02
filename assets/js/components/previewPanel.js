// Preview Panel Component
// Handles notebook preview display states

export function initPreviewPanel() {
    const notebookFrame = document.getElementById("notebook-frame");
    const emptyState = document.getElementById("empty-state");
    const loadingState = document.getElementById("loading");

    // Return API
    return {
        showEmpty: () => {
            notebookFrame.classList.remove('active');
            loadingState.classList.remove('active');
            emptyState.classList.remove('hidden');
        },
        showLoading: () => {
            emptyState.classList.add('hidden');
            notebookFrame.classList.remove('active');
            loadingState.classList.add('active');
        },
        showNotebook: (html) => {
            loadingState.classList.remove('active');

            const doc = notebookFrame.contentDocument;
            doc.open();
            doc.write(html);
            doc.close();

            notebookFrame.classList.add('active');
        },
        getFrame: () => notebookFrame
    };
}
