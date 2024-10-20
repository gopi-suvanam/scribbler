# Scribbler Special Functions Documentation 

1. `scrib.show(...)`: 
   Displays the provided arguments in the output cell. Be cautious with large content to avoid performance issues. An HTML string also can be passed as input to show HTML.

   Example Usage:
   ```javascript
   scrib.show("Hello, Scribbler!"); 
   scrib.show({ name: "Scribbler", version: "1.0" });
   ```
   Example Usage For HTML:
   ```javascript
   //Show a button 
   scrib.show("<input type='button' onclick='btnClick()'>Click me</input>");
   ```

2. `scrib.currCell()`:  
   Returns the current output cell element, allowing further customization like applying styles or modifying content directly.

   Example Usage:
   ```javascript
   let cell = scrib.currCell();
   cell.style.backgroundColor = "lightyellow"; // Change the background of the current cell.
   ```

3. `scrib.waitForDom(id)`:  
   An asynchronous version of `scrib.getDom`, which waits for the element to become available in the DOM and resolves to the DOM once available. Since Scribbler allows top-level `await`, you can directly use `await` without chaining `.then()`.

   Example Usage:
   ```javascript
   let element = await scrib.waitForDom("dynamicElementId");
   if (element) {
     scrib.show("Element found: ", element);
   } else {
     scrib.show("Element not found.");
   }
   ```

4. `scrib.uploadFile()`:  
   Opens a file browser and returns a promise that resolves with the contents of the selected file. Since Scribbler allows top-level `await`, you can directly use `await` without chaining `.then()`.

   Example Usage:
   ```javascript
   let fileContent = await scrib.uploadFile();
   scrib.show("File content: ", fileContent);
   ```

5. `scrib.downloadString(string, exportName, charSet)`:  
   Allows downloading a string as a file. You can specify the file name and character set. 

   Example Usage:
   ```javascript
   let data = "This is a sample text to download.";
   scrib.downloadString(data, "example.txt", "utf-8");
   ```

6. `scrib.loadScript(url, async=true)`:  
   Loads an external JavaScript file from a given URL. By default, it loads the script asynchronously; you can set `async` to `false` for synchronous loading. Since Scribbler allows top-level `await`, you can directly use `await` without chaining `.then()`.

   Example Usage:
   ```javascript
   try {
     await scrib.loadScript("https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.js");
     scrib.show("Script loaded successfully!");
   } catch (err) {
     scrib.show("Failed to load script: ", err);
   }
   ```

7. `import`:  
   Used for dynamically importing modules within Scribbler. This allows you to load ES6 modules on demand. Since Scribbler allows top-level `await`, you can directly use `await` without chaining `.then()`.

   Example Usage:
   ```javascript
   try {
     let module = await import('https://example.com/someModule.js');
     scrib.show("Module imported successfully: ", module);
   } catch (err) {
     scrib.show("Failed to import module: ", err);
   }
   ```

## Explanation 
- Top-level `await`: You no longer need `.then()` and `.catch()` for asynchronous functions. Instead, you can use `await` to simplify the code.
- Error handling: `try...catch` is used to handle errors when awaiting promises in an elegant manner.

