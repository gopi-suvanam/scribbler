# Outline of the Code
## HTML
JSNB is a single page app (SPA). The HTML is in index.htm. In future there could be more pages for html, integration with other tools, and accessing stored files/data.

## JavaScript
JavaScript code of JSNB is organized into the following files (in the js/ folder):
1. controller.js: This controls the UI aspects (adding cells, deleting cells, loading noteboks etc.)
2. libs.js: This contains reusable functions in other modules.
3. worker.js: This is code where the user generated code is excecuted.
4. github.js: Functions for interacting with GitHub API.
5. modal.js: Functions for operating modal (UI) - this is from PICOCSS

## CSS
The CSS is kept minimal with the following files (in css/ folder):
1. pico.min.css: PICO CSS
2. style.css: Custom CSS

## Codemirror
Codemirror is an opesource UI framework for showing code editor in HTML. Three files (in the file codemirror/) are used in JSNB. License for the same is copied in the folder.
1. codemirror.css: Styling for the editor.
2. codemirror.js: Core codemirror functions.
3. javascript.js: JavaScript specific functionality of codemirror.
