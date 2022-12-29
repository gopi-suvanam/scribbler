# JavaScript Notebook (JSNB)
Notebook for javascript experimentation (in the browser). Features:
1. Easy to use javascript experimentation tool.
2. Runs without backend (node.js/npm/pip install/ngnix etc etc)
3. Can be loaded from the web (i.e. behind a webserver) or from the file system (certain features like WebRTC might require a server)
4. UI is similar/close to jupyter notebook (for the sake familiarity for python developers)
5. Uses minimal external libraries and no frameworks (i.e. Vanilla JS). This is to increase the speed. 
6. Uses Codemirror for formatting the code area and Pico CSS for styling (https://picocss.com/)

## How to use
1. Clone this repository (git clone or better still - download) on any machine and double-click index.html. That's it. No Ngnix, no npm, no node, no pip install, no apt-get install.
2. If you want to host the app online, you can put the folder in web directory of the server and use the link to index.html.
3. You can also try the git-hosted version (without downloading anything) here: https://gopi-suvanam.github.io/jsnb/#

## Features
- The notebook consists of cells. Each cell will have user inputted html/code and an output. There is a menu at the top right corner of the cell (or above the cell in case of smaller screens).
- There are two types of cells: code and html. The type of cell can be toggled using a switch in the cell menu.
- To get the output of a cell press play ► button on the cell menu (or Cmd/Ctrl-Enter on keyboard after selecting the cell).
- For code cells input and output are both shown. For html cells, input is hidden and opens up if you click the output.
- The cell menu also has buttons for moving the cell up ↑, down ↓, adding a new cell ✛ and deleting the current cell ☓.
- A notebook can be downloaded as json (has a default extension of .jsnb). IT can be loaded back into the app. The notebook or only the output can also be downloaded as html.
- A .jsnb file can also be directly loaded into the app by suffixing the url of the file after "#" something like: https://gopi-suvanam.github.io/jsnb/#link_to_file.jsnb. The url of the file should be accessible by the browser through GET method.
- There are two special functions included in the app: show(...) for showing some string in the output box. curr_cell() for getting the element corresponding to the output cell.
- For adding more functionality import an external library through import(...) or by adding <script> element.

## Sample notebooks
1. A hello-world notebook: https://gopi-suvanam.github.io/jsnb/#https://gopi-suvanam.github.io/jsnb/examples/Hello%20world.jsnb
2. Using Plotly graphs: https://gopi-suvanam.github.io/jsnb/#https://gopi-suvanam.github.io/jsnb/examples/Plotly%20Example.jsnb
3. Evaluating performance of code: https://gopi-suvanam.github.io/jsnb/#https://gopi-suvanam.github.io/jsnb/examples/Timing%20experiment.jsnb
4. Using curr_cell function to format the output cell: https://gopi-suvanam.github.io/jsnb/#https://gopi-suvanam.github.io/jsnb/examples/curr_cell_example.jsnb
5. More examples will be added in the folder examples/ in the repository.

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

## How is JSNB different from Jsfiddle/codepen etc?
- JSNB is an open source application and hence can be downloaded, modified and used freely. Jsfiddle/codepen are cloud based platforms.
- JSNB can have multiple cells so it can create long documents.
- Intended use is for experimenting and computing in javascript. HTML and CSS are secondary in the case of JSNB. Whereas for Jsfiddle and codepen the main use case to test javascript along with html and css.
- JSNB can also be used for scientific computation using several open source javascript libraries.

