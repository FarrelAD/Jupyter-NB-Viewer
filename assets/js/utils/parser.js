export function joinSource(source) {
    if (Array.isArray(source)) {
        return source.join('')
    }
    return source || ''
}

export function parseOutputs(outputs) {
    return outputs.map(out => {
        if (out.output_type === 'stream') {
            return {
                type: 'text',
                text: joinSource(out.text)
            }
        }

        if (out.output_type === 'execute_result' || out.output_type === 'display_data') {
            return parseData(out.data)
        }

        if (out.output_type === 'error') {
            return {
                type: 'error',
                name: out.ename,
                value: out.evalue,
                traceback: out.traceback
            }
        }
    }).filter(Boolean)
}

export function parseData(data) {
    return Object.entries(data).map(([mimeType, value]) => {
        if (mimeType.startsWith('image/')) {
            return {
                type: 'image',
                mimeType,
                value
            }
        }

        if (mimeType === 'text/markdown') {
            return {
                type: 'markdown',
                value
            }
        }

        return {
            type: 'data',
            mimeType,
            value
        }
    })
}

export async function parseNotebook(notebookFile) {
    const text = await notebookFile.text();
    const notebookJson = JSON.parse(text);

    return notebookJson.cells.map(cell => {
        const base = {
            type: cell.cell_type,
            source: joinSource(cell.source)
        }

        if (cell.cell_type === 'code') {
            return {
                ...base,
                outputs: parseOutputs(cell.outputs || [])
            }
        }

        return base
    })
}
