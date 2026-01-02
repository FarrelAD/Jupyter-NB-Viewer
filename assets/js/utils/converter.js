// Simple markdown parser for basic formatting
function parseMarkdown(text) {
    if (!text) return '';

    let html = text;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');

    // Inline code
    html = html.replace(/`(.+?)`/g, '<code>$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');

    // Lists (basic support)
    html = html.replace(/^\* (.+)$/gim, '<li>$1</li>');
    html = html.replace(/^- (.+)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    return `<p>${html}</p>`;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Render a single output
function renderOutput(output) {
    if (!output) return '';

    // Handle array of outputs (from parseData)
    if (Array.isArray(output)) {
        return output.map(renderOutput).join('');
    }

    // Text output (stream)
    if (output.type === 'text') {
        return `<div class="nb-output-text"><pre>${escapeHtml(output.text)}</pre></div>`;
    }

    // Error output
    if (output.type === 'error') {
        const traceback = output.traceback ? output.traceback.join('\n') : '';
        return `
            <div class="nb-output-error">
                <pre>${escapeHtml(output.name)}: ${escapeHtml(output.value)}\n${escapeHtml(traceback)}</pre>
            </div>
        `;
    }

    // Image output
    if (output.type === 'image') {
        return `<div class="nb-output-image"><img src="data:${output.mimeType};base64,${output.value}" alt="Output"></div>`;
    }

    // Markdown output
    if (output.type === 'markdown') {
        const markdownText = Array.isArray(output.value) ? output.value.join('') : output.value;
        return `<div class="nb-output-markdown">${parseMarkdown(markdownText)}</div>`;
    }

    // Generic data output (text/plain, text/html, etc.)
    if (output.type === 'data') {
        if (output.mimeType === 'text/html') {
            const htmlContent = Array.isArray(output.value) ? output.value.join('') : output.value;
            return `<div class="nb-output-html">${htmlContent}</div>`;
        }

        if (output.mimeType === 'text/plain') {
            const plainText = Array.isArray(output.value) ? output.value.join('') : output.value;
            return `<div class="nb-output-text"><pre>${escapeHtml(plainText)}</pre></div>`;
        }

        // Fallback for unknown mime types
        const content = Array.isArray(output.value) ? output.value.join('') : output.value;
        return `<div class="nb-output-text"><pre>${escapeHtml(String(content))}</pre></div>`;
    }

    return '';
}

// Render a markdown cell
function renderMarkdownCell(cell) {
    const content = parseMarkdown(cell.source);
    return `
        <div class="nb-cell nb-markdown-cell">
            <div class="nb-cell-content">
                ${content}
            </div>
        </div>
    `;
}

// Render a code cell
function renderCodeCell(cell) {
    const outputs = cell.outputs && cell.outputs.length > 0
        ? `<div class="nb-outputs">${cell.outputs.map(renderOutput).join('')}</div>`
        : '';

    return `
        <div class="nb-cell nb-code-cell">
            <div class="nb-input">
                <div class="nb-input-prompt">In:</div>
                <div class="nb-input-area">
                    <pre><code class="language-python">${escapeHtml(cell.source)}</code></pre>
                </div>
            </div>
            ${outputs}
        </div>
    `;
}

// Generate CSS for notebook styling
function getNotebookCSS() {
    return `
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
                font-size: 14px;
                line-height: 1.6;
                color: #000;
                background-color: #fff;
                padding: 20px;
            }
            
            .nb-notebook {
                max-width: 100%;
                margin: 0 auto;
            }
            
            .nb-cell {
                margin-bottom: 0;
                border-top: 1px solid transparent;
                border-bottom: 1px solid transparent;
            }
            
            .nb-cell:hover {
                background-color: #f9f9f9;
            }
            
            /* Markdown Cells */
            .nb-markdown-cell {
                padding: 10px 20px;
            }
            
            .nb-markdown-cell h1 {
                font-size: 2em;
                margin: 0.67em 0;
                font-weight: 600;
            }
            
            .nb-markdown-cell h2 {
                font-size: 1.5em;
                margin: 0.75em 0;
                font-weight: 600;
            }
            
            .nb-markdown-cell h3 {
                font-size: 1.17em;
                margin: 0.83em 0;
                font-weight: 600;
            }
            
            .nb-markdown-cell p {
                margin: 1em 0;
            }
            
            .nb-markdown-cell code {
                background-color: #f5f5f5;
                padding: 2px 6px;
                border-radius: 3px;
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                font-size: 0.9em;
            }
            
            .nb-markdown-cell a {
                color: #0066cc;
                text-decoration: none;
            }
            
            .nb-markdown-cell a:hover {
                text-decoration: underline;
            }
            
            .nb-markdown-cell ul {
                margin: 1em 0;
                padding-left: 2em;
            }
            
            .nb-markdown-cell li {
                margin: 0.5em 0;
            }
            
            /* Code Cells */
            .nb-code-cell {
                display: flex;
                flex-direction: column;
            }
            
            .nb-input {
                display: flex;
                background-color: #f7f7f7;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
                margin: 10px 20px;
            }
            
            .nb-input-prompt {
                padding: 10px 15px;
                color: #303f9f;
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                font-weight: 600;
                min-width: 60px;
                text-align: right;
                border-right: 1px solid #e0e0e0;
                background-color: #fafafa;
                flex-shrink: 0;
            }
            
            .nb-input-area {
                flex: 1;
                overflow-x: auto;
            }
            
            .nb-input-area pre {
                margin: 0;
                padding: 10px 15px;
                overflow-x: auto;
            }
            
            .nb-input-area code {
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                font-size: 13px;
                line-height: 1.5;
                color: #000;
            }
            
            /* Outputs */
            .nb-outputs {
                margin: 0 20px 10px 20px;
            }
            
            .nb-output-text,
            .nb-output-error,
            .nb-output-html {
                background-color: #fff;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
                margin-top: 5px;
            }
            
            .nb-output-text pre,
            .nb-output-error pre {
                padding: 10px 15px;
                margin: 0;
                overflow-x: auto;
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                font-size: 13px;
                line-height: 1.5;
                white-space: pre-wrap;
                word-wrap: break-word;
            }
            
            .nb-output-error {
                background-color: #fff5f5;
                border-color: #ffcdd2;
            }
            
            .nb-output-error pre {
                color: #c62828;
            }
            
            .nb-output-image {
                padding: 10px;
                text-align: center;
                background-color: #fff;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
                margin-top: 5px;
            }
            
            .nb-output-image img {
                max-width: 100%;
                height: auto;
            }
            
            .nb-output-html {
                padding: 10px 15px;
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                body {
                    padding: 10px;
                }
                
                .nb-input {
                    margin: 10px 5px;
                }
                
                .nb-outputs {
                    margin: 0 5px 10px 5px;
                }
                
                .nb-markdown-cell {
                    padding: 10px;
                }
                
                .nb-input-prompt {
                    min-width: 40px;
                    padding: 10px 8px;
                    font-size: 12px;
                }
                
                .nb-input-area pre,
                .nb-output-text pre,
                .nb-output-error pre {
                    font-size: 12px;
                }
            }
        </style>
    `;
}

// Main converter function
export function notebook2html(notebook, theme = 'github') {
    const cells = notebook.map(cell => {
        if (cell.type === 'code') {
            return renderCodeCell(cell);
        }

        if (cell.type === 'markdown') {
            return renderMarkdownCell(cell);
        }

        return '';
    }).join('');

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Jupyter Notebook</title>
            
            <!-- Highlight.js for syntax highlighting -->
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${theme}.min.css">
            <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/python.min.js"></script>
            
            ${getNotebookCSS()}
        </head>
        <body>
            <div class="nb-notebook">
                ${cells}
            </div>
            
            <!-- Initialize Highlight.js -->
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    hljs.highlightAll();
                });
            </script>
        </body>
        </html>
    `;
}