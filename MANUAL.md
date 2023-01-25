# Manual for JSNB
TOC
1. [Installing](#installing)
2. [Cells](#cells)
3. [Cell Menu](#cell-menu)
4. [File Menu](#file-menu)
5. [Edit Menu](#edit-menu)
6. [URL Structure](#url-structure)
7. [Special Functions](#special-functions)
8. [Key-board Shortcuts](#key-board-shortcuts)
## Installing
The tool does not require any special installation. It can be downloaded and used directly from file system by opening index.html. The folder can be put behind a websrver to serve statically. There is no requirement of any backend framework (node/python etc). Some external libraries and features like WebRTC, Blockchain wallets may work only when the tool is hosted behind a server i.e. served through http and not as file:///. 
## Cells
- The whole notebook is divided into cells. 
- Each cell can be of two types: html or code (JavaScript). 
- Each code cell will have an input block and an output block. 
- When the cell is "played" the html cell will show the output as html and the code cell will show output in another block below the code. 
- There will be a status show on the output block of the code cells. Status will show a number indicating the run sequence and time taken to run the cell. Status is left blank if there is an error. 
- For html cells, to edit the html click on the output again (the cell has to be run/played to change the output). 
- Cells can be added, deleted and moved up/down. 
- HTML cells can have <style> tags also inside them. 
- All the elements created in html can be accessed in the code cells through document.getelementbyid or document.queryselector. jQuery style $() can also be used by loading/importing jQuery library (see [Using external libraries](#using-external-libraries)). 
## Cell Menu
Certain operations can be done on cell-menu. The cell-menu is at top-right corner of the cell (for smaller screens it is above the cell). The menu consists of:
  1. Toggling type of cell from code to html and vice-versa
  2. Running/playing (►) the cell to run the code in the cell or to display the html content
  3. Moving the cell uo (↑) 
  4. Moving the cell down (↓)
  5. Adding another cell below the current cell (✛)
  6. Deleting the current cell (☓)
## File Menu
The file menu consists of:
  1. Open: Opening a JSNB file from local machine
  2. Download: Saving the current notebook as JSNB file on local machine
  3. GitHub: Loading a file from a GitHub repository or pushing a file to a GitHub repository. An authentication dialogue will pop up asking for Access Toke, username/owner name, repo and file path. Access token is not stored in the back end and is used to authenticate GitHub API calls.
  4. Download as HTML: Save the current notebook as HTM to local machine. HTLM cells will be displayed as HTML. For code cells both the code and output of the code is displayed as HTML. 
  5. Download only output as HTML: Save only the output of the current notebook as HTML on local machine.
  6. Download as JS: Down load the code in cells as a single JavaSript file.
## Edit Menu
The edit menu consists of:
  1. Insert code cell: A blank code-type cell is inserted at the end of the current notebook
  2. Insert html cell: A blank html-type cell is inserted at the end of the current notebook
## URL Structure
- The URL of Github pages deployment is https://gopi-suvanam.github.io/jsnb/. 
- For downloaded file it will be file://path/index.html. For self hosted solutions the main link will be as per the deployment. 
- Following the main link, there can be an anchor attached. The location of the anchor is taken as the file to be loaded into the notebook. For example, https://gopi-suvanam.github.io/jsnb/#https://gopi-suvanam.github.io/jsnb/examples/Hello%20world.jsnb will "GET" the file https://gopi-suvanam.github.io/jsnb/examples/Hello%20world.jsnb and load it into JSNB. The file has to be available publicly to load in this fashion. 
- Git hub files can be loaded using a shorter notation of github:user-name/repo/path-of-file. So the above file can be linked as : https://gopi-suvanam.github.io/jsnb/#github:gopi-suvanam/jsnb/examples/Hello%20world.jsnb. If the repo is public, JSNB will try to GET it and load it, else GitHub authentication dialoge will pop up. 
- When a file is loded from or pushed to GitHub, the URL updates to this format. The URL can be shared with others for easy collaboration.
## Special Functions
There are two special functions:
  1. show(..). This function displays the object in the output cell. 
  2. curr_cell(). This function returns the element corresponding to the output <div> of the current code cell. 
Both these functions might behave differentyl when called from within asynchronous code.
## Key-board Shortcuts
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
- Ctrl-S: Download the jsnb to local machine
- Ctrl-O: Load a jsnb from local machine
## Using external libraries
External libraries can be used using two specially built functions:
  1. load_script(url) to load the url as script. 
  2. import_module(module,features) to load an ES6 module. "module" is a file location. "features" is dictionary. The keys in features dictionary are loaded from the module and exposed globall as the values. 
Additionally, dynamic import from ES6 can be used to load a module.
  
