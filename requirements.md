## UI
- UI could be similar to Jupyter Notebook
- There will be cells with results
- Output could be saved as html
- HTML output can be shown both as code and as html doc
- Add delete cells
- Cells can be code and comment cells.. Comment cells will be markdown display

## Feartures
- Ability to import .js files
- Use variables (global) across the cells
- Ability to save the whole notebook as a file.. with .nb extension
- Code should run in the browser of the user
- show output using show(var) or show_as_html(var)
- Everything else can be done through libraries
- Not using the webworker as webworker has a restriction of running behind http/https. In future can think of using webworker for hosted applications.
- Asynchronous code execution is halmark of javascript so each cell can be run parallelly. Any asynchronous code within a cell will have to dsiplay errors on its own.
- Reload for restarting the kernel

## Use cases
1. Trying new libraries for testing and building
2. Building reproducable research and sharing the results with others

## Not to be used for:
1. Production applications
2. As an alternative to webapps
