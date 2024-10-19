- scrib.show(..): Displays the arguments in the output cell. Avoid excessively large content.
- scrib.currCell():  Returns the current output cell element for customization.
- scrib.getDom(id): Shorthand for window.getElementById. Access DOM elements by ID.
- scrib.waitForDom(id): Asynchronous version of scrib.getDom. Waits for the element to become available.
- scrib.uploadFile(): Opens file browser, resolves to selected file contents (asynchronous).
- scrib.downloadString(string, exportName, charSet): Downloads a string as a file.
- scrib.loadScript(url, async=true): Loads an external JavaScript file from a URL. Use false for synchronous loading.
- import: Used for dynamically importing modules.

