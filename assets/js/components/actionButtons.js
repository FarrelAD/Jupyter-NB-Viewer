// Action Buttons Component
// Handles Load, Clear, and Download buttons

export function initActionButtons(callbacks) {
    const loadBtn = document.getElementById("load-btn");
    const clearBtn = document.getElementById("clear-btn");
    const downloadBtn = document.getElementById("download-btn");

    // Load button
    loadBtn.addEventListener('click', () => {
        if (callbacks.onLoad) {
            callbacks.onLoad();
        }
    });

    // Clear button
    clearBtn.addEventListener('click', () => {
        if (callbacks.onClear) {
            callbacks.onClear();
        }
    });

    // Download button
    downloadBtn.addEventListener('click', () => {
        if (callbacks.onDownload) {
            callbacks.onDownload();
        }
    });

    // Return API
    return {
        enableLoad: () => loadBtn.disabled = false,
        disableLoad: () => loadBtn.disabled = true,
        enableClear: () => clearBtn.disabled = false,
        disableClear: () => clearBtn.disabled = true,
        enableDownload: () => downloadBtn.disabled = false,
        disableDownload: () => downloadBtn.disabled = true,
        disableAll: () => {
            loadBtn.disabled = true;
            clearBtn.disabled = true;
            downloadBtn.disabled = true;
        }
    };
}
