# JavaScript Notebook
Notebook for javascript experimentation (in the browser). Features:
1. Easy to use javascript experimentation tool.
2. Runs without backend (node.js/npm/pip install/ngnix etc etc)
3. Can be loaded from the web (i.e. behind a webserver) or from the file system   (certain features like WebRTC might require a server)
4. UI to be close to jupyter notebook (for familiarity)
5. Uses minimal external libraries and no frameworks (i.e. Vanilla JS). This is to increase the speed6. Uses Codemirror for formatting the code area and Pico CSS for styling (https://picocss.com/)

## How to use
1. Clone this repository on any machine and double-click index.html. That's it. No Ngnix, no npm, no node, no pip install, no apt-get install.
2. If you want to host the the app online, you can put the folder in web directory of the server and use the link to index.html.
3. You can also try the git hosted version (without downloading anything) here: https://gopi-suvanam.github.io/jsnb/
4. A notebook downloaded as json (has default extension of .jsnb) can be loaded back into the app.
5. A .jsnb file can also be directly loaded into the app by suffixing the url after # something like: https://gopi-suvanam.github.io/jsnb/#link_to_.jsnb_file. The url of the file should be accessible by the browser through GET method.

## Sample notebooks
1. For hello-world notebook check out: https://gopi-suvanam.github.io/jsnb#https://gopi-suvanam.github.io/jsnb/examples/Hello%20world.jsnb
2. For an example of using Plotly graphs check out: https://gopi-suvanam.github.io/jsnb/#https://gopi-suvanam.github.io/jsnb/examples/Plotly%20Example.jsnb
3. You can download more examples from the folder examples/

## Keyboard Shortcuts
- Ctrl-Enter/Cmd-Enter: Run the current cell and go to next cell
- Shift-Enter': Run the current cell
- Ctrl-Del: Delete all code in the cell
- Alt-Enter/Option-Enter: Insert new cell

## Use cases
1. For trying new libraries for testing and building
2. For building reproducible research and sharing the results with others

## Not to be used for:
1. Production use cases
2. As an alternative to webapps


