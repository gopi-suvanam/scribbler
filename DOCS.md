# DOCS for Scribbler

## TOC
1. [Installing](#installing)
2. [Cells](#cells)
3. [Cell Menu](#cell-menu)
4. [Documentation](#documentation)
5. [File Menu](#file-menu)
6. [Edit Menu](#edit-menu)
7. [URL Structure](#url-structure)
8. [Special Functions](#special-functions)
9. [Keyboard Shortcuts](#keyboard-shortcuts)
10. [Exporting-Importing](#exporting-importing)
11. [Sandboxed Environment](#sandboxed-enviroment)
12. [Embedding Notebooks](#embedding-notebooks)
13. [Using external libraries](#using-external-libraries)

## Installing
- The tool does not require any special installation. It can be downloaded/cloned from GitHub.
- The folder can be put behind a websrver to serve statically. There is no requirement of any backend framework (node/python etc). 
- Github pages hosted version is available here: https://app.scribbler.live

## Cells
- The whole notebook is divided into cells. 
- Each cell can be of two types: doc (html/markdown) or code (JavaScript). 
- Each code cell will have an input block and an output block. 
- When the cell is "played" the doc cell will show the output as html and the code cell will show output in another block below the code. 
- There will be a status show on the output block of the code cells. Status will show a number indicating the run sequence and time taken to run the cell. Status is left blank if there is an error. 
- For doc cells, to edit dbl-click on the output. Once the cell is edited the cell has to be run/played to change the output. 
- Cells can be added, deleted and moved up/down. 
- Doc cells can have <style> tags also inside them. 
- All the elements created in doc cells using html can be accessed in the code cells through document.getelementbyid or document.queryselector. jQuery style $() can also be used by loading/importing jQuery library (see [Using external libraries](#using-external-libraries)). 
- Last evaluated expression of a code cell is displayed in the output. Ensure the last expression is not very large (like a large array or a function declaration).

## Cell Menu
Certain operations can be done on cell-menu. The cell-menu is at top-right corner of the cell (for smaller screens it is above the cell). The menu consists of:
- Toggling type of cell from code to doc and vice-versa
- Running/playing (►) the cell to run the code in the cell or to display the doc content
- Moving the cell up (↑) 
- Moving the cell down (↓)
- Adding another cell below the current cell (✛)
- Deleting the current cell (☓)

## File Menu
The file menu consists of:
- Save: Saving a notebook to the browser storage
- Open: Opening a notebook from the browser storage
- Upload: Opening a .jsnb file from local machine
- Download: Saving the current notebook as .jsnb file on local machine
- GitHub: Loading a file from a GitHub repository or pushing a file to a GitHub repository. An authentication dialogue will pop up asking for Access Toke, username/owner name, repo and file path. Access token is not stored in the back end and is used to authenticate GitHub API calls.
- Download as HTML: Save the current notebook as HTM to local machine. HTLM cells will be displayed as HTML. For code cells both the code and output of the code is displayed as HTML. 
- Download only output as HTML: Save only the output of the current notebook as HTML on local machine.
- Download as JS: Down load the code in cells as a single JavaSript file.

## Documentation
- Create documentation cells by selecting "Doc" from the cell menu
- Documentation is rendered in HTML format

### Markdown Support

- Prefix text with //>md to render documentation in Markdown format

### Magic Words
- //>md: Treat cell content as Markdown
- //>html: Treat cell content as HTML
### Usage
- Use magic words in documentation cells and code cells
- Render code comments or explanations in Markdown
- Embed HTML content in code cells

## Edit Menu
The edit menu consists of:
- Insert code cell: A blank code-type cell is inserted at the end of the current notebook
- Insert doc cell: A blank html-type cell is inserted at the end of the current notebook
- Insert style cell: A blank html-type cell with <style> tags is inserted at the end of the current notebook
  
## URL Structure
- The URL of Github pages deployment is [https://app.scribbler.live](https://app.scribbler.live). 
- For downloaded file it will be file://path/index.html. For self hosted solutions the main link will be as per the deployment. 
- Following the main link, there can be an anchor attached. The location of the anchor is taken as the file to be loaded into the notebook. For example, [https://app.scribbler.live/#./examples/Hello-world.jsnb](https://app.scribbler.live#./examples/Hello-world.jsnb) will "GET" the file https://app.scribbler.live/examples/Hello-world.jsnb and load it into Scribbler. The file has to be available publicly to load in this fashion. 
- Git hub files can be loaded using a shorter notation of github:user-name/repo/path-of-file. So the above file can be linked as : [https://app.scribbler.live#github:gopi-suvanam/scribbler/examples/Hello-world.jsnb](https://app.scribbler.live#github:gopi-suvanam/scirbbler/examples/Hello-world.jsnb). If the repo is public, Scribbler will try to GET it and load it, else GitHub authentication dialoge will pop up. 
- When a file is loded from or pushed to GitHub, the URL updates to this format. The URL can be shared with others for easy collaboration.

## Special Functions
There are a few special functions:
- scrib.show(..) displays the object in the output cell. Ensure the content displayed is not very large, else it will be truncated. 
- scrib.currCell() function returns the element corresponding to the output <div> of the current code cell. 
Both these functions might behave differently when called from within asynchronous code.
  
Other useful functions:
- scrib.getDom(id) is short form for window.getElementById
- scrib.waitForDom(id) is an asynchronous version of scrib.waitForDom, where the function waits for a dom to be available and resolves to the element once it is available. This is useful if a dom is being created by another asynchronous activity. scrib.waitForDom can be used as: scrib.waitForDom(id).then(dom=>{stuff to do with dom}) or inside and async function it can be used as dom = await scrib.waitForDom(id).\
- scrib.uploadFile opens file browser and resolves to the contents of a file if selected.
- scrib.loadScript(url) to load the url as script. Example: To load JQuery use: scrib.loadScript("https://code.jquery.com/jquery-3.6.3.min.js")

## Keyboard Shortcuts
These shortcuts work when a code cell is in focus:
- Ctrl-Enter/Cmd-Enter: Run the current cell
- Shift-Enter': Run the current cell and go to next cell
- Alt-Enter/Option-Enter: Insert new cell
- Alt-D/Option-D: Delete the current cell (no undo at the moment, so be careful)
- Alt/Option-Up Arrow: Move the cell up
- Alt/Option-Up Down: Move the cell down

These shortcuts are global
- Alt-R/Option-R: Run all the cells
- Ctrl-G: Import from/Push to GitHub
- Ctrl-S: Save the notebook to the browser
- Ctrl-O: Load a jsnb from local machine

## Exporting-Importing
- A file on GitHub repo can be loaded into the .jsnb file. The repo has to be public or you should be a collaborator.
- A notebook can be pushed to GiHub. You should be a collaborator on the repo for this.
- GitHub operations will require an [access token from GitHub](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#creating-a-fine-grained-personal-access-token)
- Files in public GitHub repos can be directly accessed as: https://app.scribbler.live#https://raw.githubusercontent.com/[USERNAME]/[REPO]/[BRANCH]/[PATH_TO_FILE]
- If GitHub pages are enabled for the repo, the files can be accessed also using this link: https://app.scribbler.live#https://[USERNAME].github.io/[REPO]/[PATH_TO_FILE]
- The output of a notebook can be downloaded as an HTML file (with code or wothout code)
- The code of a notebook can be downloaded as a JavaScript file
  
## Sandboxed Enviroment
- The Scribbler notebook runs in a sandboxed iFrame. This blocks several functionalities including accessing certain browser APIs, accessing external resources where CORS is not allowed, accessing cookies etc.
- To enable these features, click on the icon ⤯ at the top-right corner above the notebook. After confirmation, the notebook will be reloaded without the sandbox.

## Embedding Notebooks
- Scribbler notebooks can be embedded as an iFrame in other pages.
- For this use the code:
```html
<iframe id="sandbox" style="width:100%;height:100%" src ="https://app.scribbler.live/sandbox.html?jsnb=link-to-the-notebook-file"></iframe>
```
- Replace link-to-the-notebook-file with the path of the file.
- Github file can be embedded using:
```html
<iframe id="sandbox" style="width:100%;height:100%" src ="https://app.scribbler.live/sandbox.html?jsnb=github:user/repository/path-to-file"></iframe>
```
- Note: Embed a notebook in your page only if you trust the notebook.

## Using external libraries
External libraries can be used using two specially built functions:
- scrib.loadScript(url,async) to load the url as script. Example: To load JQuery use: scrib.loadScript("https://code.jquery.com/jquery-3.6.3.min.js")
- Additionally, dynamic import from ES6 can be used to load a module. Example: import("https://unpkg.com/jquery@3.3.1/dist/jquery.min.js")
- D3 and Plotlyjs are preloaded. Also a sister project DI-Labs is preloaded. DI-Labs provides easy interface for working with data including plotting, array manipulation and scientific computing. See this example for more details: [https://app.scribbler.live#./examples/AMM-Simulation.jsnb](https://app.scribbler.live#./examples/AMM-Simulation.jsnb)
  
  
