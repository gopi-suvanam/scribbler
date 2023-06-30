# Outline of the Code
## HTML
Scribbler is a single page app (SPA), or rather for security reasons two-pade app. Bulk of the HTML is in sandbox.html with a wrapper of index.html (containing mainly menu and footer). In future there could be more pages for html, integration with other tools, and accessing stored files/data.

## JavaScript
JavaScript code of Scribbler is organized into the following files (in the js/ folder):
1. controller.js: This controls the UI aspects (downloading, interacting with Github, loading notebooks etc.) and interacting with the iframe.
2. sanbox-controller.js: This controls the UI of the sanboxed notebook rederrer (adding cells, deleting cells etc.) and interacting with the parent document.
3. libs.js: This contains reusable functions in other modules. This is loaded in both index.html and sandbox.html.
4. worker.js: This is code where the user generated code is excecuted. This is loaded in sandbox.html.
5. github.js: Functions for interacting with GitHub API. This is loaded in index.html.
6. modal.js: Functions for operating modal (UI) - this is from PICO-CSS. This is loaded in index.html.


## Codemirror
Codemirror is an opesource UI framework for showing code editor in HTML. Three files (in the file codemirror/) are used in Scribbler. License for the same is copied in the folder. This is downloaded and kept along with the repo so that there is no version clash and the app works without network. Same with PICO CSS.
1. codemirror.css: Styling for the editor.
2. codemirror.js: Core codemirror functions.
3. javascript.js: JavaScript specific functionality of codemirror.


## CSS
The CSS is kept minimal with the following files (in css/ folder):
1. pico.min.css: PICO CSS (This is downloaded and kept so that the app can work without network)
2. style.css: Custom CSS
