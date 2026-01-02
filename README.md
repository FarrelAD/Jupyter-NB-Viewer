# Jupyter-Notebook-Viewer

A simple web-based **Jupyter Notebook viewer**.  
This project allows you to **view Jupyter Notebook files (`.ipynb`) directly in the browser** (read-only), similar to the original Jupyter Notebook interface.

The core idea of the app is straightforward. The rendering process follows these steps:

1. Parse the notebook file (`.ipynb`), which uses a JSON-based format
2. Normalize notebook cells (markdown, code, outputs, etc.)
3. Convert the parsed notebook structure into HTML elements
4. Apply syntax highlighting using `highlight.js` for code cells
5. Render the generated HTML inside an `<iframe>`
6. Provide an option to download the notebook as an HTML file


The web app is live and ready to use:

👉🏻 https://farrelad.github.io/Jupyter-NB-Viewer/


<img width="2475" height="1323" alt="image" src="https://github.com/user-attachments/assets/7a415de2-06c9-4fa7-b64a-b491f2411f9a" />

