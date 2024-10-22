sandboxAI = {};

sandboxAI.query = function (query) {
	
	function extractCode(input) {
		// Use a regular expression to find all code blocks and capture text until the end
		const regex = /```javascript([\s\S]*?)(?:(?=```)|$)/g;
		const codeBlocks = [];
		
		let match;

		// Find all matches in the input string
		while ((match = regex.exec(input)) !== null) {
			// Extract the code from each match and trim any extra whitespace
			const code = match[1].trim();
			if (code) {  // Only add non-empty code blocks
				codeBlocks.push(code);
			}
		}

		// Return the code blocks as a single string with comments
		return codeBlocks.map(code => `${code}`).join('\n\n');
	}

    return new Promise((resolve, reject) => {
        const channel = new MessageChannel();
        const port1 = channel.port1;
        const port2 = channel.port2;
		const input_dom=scrib.getDom("input"+scrib.currBlock);
		const codemirror= input_dom.childNodes[0].CodeMirror;

		const originalContent=codemirror.getValue();
        // Create an array to hold received chunks
        const chunks = [];
		let reply='';
        // Listen for messages on port2 (from parent)
        port2.onmessage = (event) => {
			
            if (event.data && event.data.hasOwnProperty('final-reply')) {
				codemirror.setValue( extractCode(event.data['final-reply'] ));
				console.log(event.data['final-reply']);
                resolve({ chunks, finalReply: event.data['final-reply'] }); // Resolve with chunks and final reply
				
            } else if (event.data && event.data.hasOwnProperty('chunk')) {
                reply=reply+event.data.chunk;
				codemirror.setValue(originalContent+"\n"+extractCode(reply));
            } else if (event.data && event.data.hasOwnProperty('error')) {
				reject(new Error(event.data.error)); // Reject on error				
			}
        };

        // Listen for message errors on port2
        port2.onmessageerror = (event) => {
            console.error(event.data);
            reject(new Error(event.data)); // Reject on error
        };

        // Send the query to the parent window
		const markedownNB=sandbox.getMarkdownNB();
		
        window.parent.postMessage({ 'ai-query': query,'markedownNB':markedownNB }, '*', [port1]);
    });
};

