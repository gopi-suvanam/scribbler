# JavaScript Notebook (JSNB)
Notebook for javascript experimentation (in the browser). Features:
1. Easy to use javascript experimentation tool.
2. Runs without backend (node.js/npm/pip install/ngnix etc etc)
3. Can be loaded from the web (i.e. behind a webserver) or from the file system   (certain features like WebRTC might require a server)
4. UI is similar close to jupyter notebook (for the sake familiarity for python developers)
5. Uses minimal external libraries and no frameworks (i.e. Vanilla JS). This is to increase the speed6. 
6. Uses Codemirror for formatting the code area and Pico CSS for styling (https://picocss.com/)

## How to use
1. Clone this repository (git clone or better still - download) on any machine and double-click index.html. That's it. No Ngnix, no npm, no node, no pip install, no apt-get install.
2. If you want to host the the app online, you can put the folder in web directory of the server and use the link to index.html.
3. You can also try the git hosted version (without downloading anything) here: https://gopi-suvanam.github.io/jsnb/#
4. A notebook downloaded as json (has a default extension of .jsnb) can be loaded back into the app.
5. A .jsnb file can also be directly loaded into the app by suffixing the url of the file after "#" something like: https://gopi-suvanam.github.io/jsnb/#link_to_file.jsnb. The url of the file should be accessible by the browser through GET method.
6. For adding more functionality import an external library through import(...) or by adding <script> element.
7. There are two special functions included in the app: show(...) for showing some string in the output box. curr_cell() for getting the element corresponding to the output cell.

## Sample notebooks
1. A hello-world notebook: https://gopi-suvanam.github.io/jsnb/#https://gopi-suvanam.github.io/jsnb/examples/Hello%20world.jsnb
2. An example of using Plotly graphs: https://gopi-suvanam.github.io/jsnb/#https://gopi-suvanam.github.io/jsnb/examples/Plotly%20Example.jsnb
3. You can download more examples from the folder examples/ in the repository.

## Keyboard Shortcuts
- Ctrl-Enter/Cmd-Enter: Run the current cell
- Shift-Enter': Run the current cell and go to next cell
- Ctrl-Del: Delete all code in the cell
- Alt-Enter/Option-Enter: Insert new cell

## Use cases
1. For trying new libraries for testing and building
2. For building reproducible research and sharing the results with others

## Not to be used for:
1. Production use cases
2. As an alternative to webapps

## How is different from Jsfiddle/codepen etc?
- JSNB is an open source application and hence can be downloaded, modified and used freely. Jsfiddle/codepen are cloud based platforms.
- JSNB can have multiple cells so it can create long documents.
- Intended use is for experimenting and computing in javascript. HTML and CSS are secondary in the case of JSNB. Whereas for Jsfiddle and codepen the main use case to test javascript along with html and css.
- JSNB can also be used for scientific computation using several open source javascript libraries.

