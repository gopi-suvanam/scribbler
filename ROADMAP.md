# Roadmap for Scribbler
## Done
### UI
- UI similar to Jupyter Notebook
- There will be cells with results
- Output could be saved as html
- HTML output can be shown both as code and as html doc 
- Add/delete cells
- Cells can be code and comment cells.. Comment cells will be markdown display
- Github integration for storing: done through Access Token. Can think of alternative authentication mechanisms.
- Mimic static import (browser/deno style)
- Dark mode enabled
- Keyboard shortcuts
  
### Feartures
- Ability to import .js files dynamically
- Use global variables across the cells
- Ability to save the whole notebook as a file.. with .jsnb extension
- Code should run in the browser of the user
- Show output using show(var)
- Asynchronous code execution is halmark of javascript so each cell can be run parallelly. Any asynchronous code within a cell will have to dsiplay errors on its own.
- Reload for restarting the kernel
- Store files temporarily in browser cache (indexeddb)
- Share a link of notebook
- Auto-suggestion


## To Do
### UI
- Undo-cut
- Sleeker menu
- More keyboard shortcuts
- Make it more responsive so that coding on mobile also becomes easy

### Features
- Use GPU where possible
- Restart kernel/inturrept kernel features
- More collaboration features (store in google drive etc.)
- Improve auto-suggestion


