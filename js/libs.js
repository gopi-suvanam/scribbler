const scrib = {};
scrib.MAX_LENGTH_TO_SHOW = 10000;
scrib.TIMEOUT_FOR_BLOCKING_CALLS = 5000;

scrib.blankNB = {
	"metadata": {
		"name": "Scribbler Notebook",
		"language_info": {
			"name": "JavaScipt",
			"version": "8.0"
		}
	},
	"jsnbversion": "v0.1",
	"cells": [],
	"source": "https://github.com/gopi-suvanam/scribbler",
	"run_on_load": false
};

scrib.markdownToJSNB = function (markdown, blankNB) {
	const languageMap = { 'html': 'html', 'markdown': 'md', 'javascript': '' };
	blankNB = blankNB || {};
	const cells = [];
	const lines = markdown.split('\n');
	let currentSection = '';
	let currentType = 'doc'; // Start with documentation by default
	let currentLang = '';

	lines.forEach(line => {
		if (line.trim().startsWith('```')) {
			const lang = line.trim().slice(3).trim(); // Extract the language (e.g., 'html', 'javascript')

			if (currentType === 'code') {
				// End the current code block
				cells.push({ code: currentSection, type: 'code', status: "", output: "" });
				currentSection = '';
				currentType = 'doc'; // Switch to documentation
				currentLang = '';
			} else {
				// End the current documentation section
				const output = marked.parse(currentSection); // Render documentation as HTML
				if (currentSection.trim()) {
					cells.push({ code: currentSection, type: 'html', status: "", output });
				}

				if (lang in languageMap) currentLang = languageMap[lang];
				else currentLang = lang;
				currentSection = currentLang ? '//>' + currentLang : '';
				currentType = 'code'; // Switch to code
			}
		} else {
			currentSection += (currentSection ? '\n' : '') + line;
		}
	});

	// Push the last section
	if (currentSection.trim()) {
		let output = "";
		if (currentType === 'doc') {
			output = marked.parse(currentSection); // Render final doc section as HTML
		}
		cells.push({ code: currentSection, type: currentType == 'doc' ? 'html' : 'code', status: "", output });
	}

	blankNB.cells = cells;
	return blankNB;
}

scrib.jsToJSNB = function (code, blankNB) {
	blankNB = blankNB || {};
	const cells = [];
	cells.push({ code: code, type: 'code', output: "", status: "" });
	blankNB.cells = cells;
	return blankNB;
}

scrib.isInIFrame = function () {
	try {
		return window.self !== window.top;
	} catch (e) {
		return true;
	}
}

scrib.getSecret = function (name) {
	if (scrib.isSandboxed()) throw ("The code is sandboxed. Please take it out of sandbox.");

	let secretStore = localStorage.getItem('secrets');
	if (secretStore) {
		secretStore = JSON.parse(secretStore);
		return secretStore[name];
	}
}

scrib.inputText = function () {
	return new Promise((resolve) => {
		const inputElement = document.createElement('input');
		inputElement.type = 'text';
		inputElement.addEventListener('keypress', (event) => {
			if (event.key === 'Enter') {
				resolve(inputElement.value);
				inputElement.setAttribute('readonly', true); // make it uneditable
			}
		});
		scrib.currCell().appendChild(inputElement);
		inputElement.focus();
	});
};

scrib.error = message => {
	scrib.show("<p class='red'>" + message + "</p>");
}

scrib.showInDom = function (output, ...objs) {
	var to_show = '';
	for (var i = 0; i < objs.length; i += 1) {
		let obj = objs[i];
		if (typeof (obj) == 'object') to_show += JSON.stringify(obj, undefined, 2) + " ";
		else to_show += String(obj) + " ";
	}
	if (to_show.length < scrib.MAX_LENGTH_TO_SHOW)
		document.getElementById(output).innerHTML = document.getElementById(output).innerHTML + to_show;
	else
		document.getElementById(output).innerHTML = document.getElementById(output).innerHTML + "<p class='error'>Object too large to show.</p>";

	if (to_show.length > 0) document.getElementById(output).innerHTML = document.getElementById(output).innerHTML + "<br>";
}

scrib.getDom = x => document.getElementById(x);

scrib.loadScript = function (url, async) {
	if (async == undefined) async = true;
	if (async) {
		if (document.head) {
			return new Promise((resolve, reject) => {
				const script = document.createElement('script');
				script.src = url;
				script.async = true;

				script.onload = () => {
					// The script was successfully loaded
					resolve();
				};

				script.onerror = () => {
					// An error occurred while loading the script
					reject(new Error(`Failed to load script from ${url}. Check logs.`));
				};

				document.head.appendChild(script);
			});
		} else {
			throw ("Asynchronous mode works only in the browser.");
		}
	} else {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, false); // Set the third parameter to false for synchronous request
		xhr.send();

		if (xhr.status === 200) {
			return eval(xhr.responseText);
		} else {
			throw ('Error fetching script. Status:' + xhr.status);
		}
	}
}

scrib.loadCSS = function (css) {
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = css;
	document.head.appendChild(link);
}

const load_script = (...args) => {
	scrib.show("<span style='color:orange'>Warning! load_script() is being deprecated. Use scrib.loadScript().</span>");
	scrib.loadScript(...args);
}

scrib.reloadScript = function (url, async) {
	if (url.includes('?')) url = url + '&' + (Math.random() + 1).toString(36).substring(7);
	else url = url + '?' + (Math.random() + 1).toString(36).substring(7);
	return scrib.loadScript(url, async);
}

scrib.waitForDom = function (id) {
	return new Promise(resolve => {
		if (scrib.getDom(id)) {
			return resolve(scrib.getDom(id));
		}

		const observer = new MutationObserver(() => {
			if (scrib.getDom(id)) {
				resolve(scrib.getDom(id));
				observer.disconnect();
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	});
}

function _insert_after(el0, el1) {
	try {
		el0.after(el1)
	} catch (err) {
		try {
			console.log(err.message)
			el0.parentNode.insertBefore(el1, el0.nextSibling);
		} catch (err) {
			console.log(err.message)
			el0.parentNode.appendChild(el1)
		}
	}
}

scrib.downloadString = function (str, exportName) {
	const blob = new Blob([str], { type: "text/plain" });

	const downloadAnchorNode = document.createElement("a");
	downloadAnchorNode.href = URL.createObjectURL(blob);

	downloadAnchorNode.setAttribute("download", exportName);
	document.body.appendChild(downloadAnchorNode); // required for firefox
	downloadAnchorNode.click();
	downloadAnchorNode.remove();
}

scrib.readFile = async function (url) {
	const reponse = await fetch(url);
	const result = await reponse.text();
	return result;
}

scrib.isSandboxed = function () {
	try {
		// If running inside an iframe and cannot access parent, it's sandboxed
		if (window.self !== window.top) {
			try {
				window.parent.location.href; // Try accessing parent - will throw if sandboxed
				return false;
			} catch (e) {
				return true;
			}
		}
		return false; // Not in an iframe, not sandboxed
	} catch (e) {
		return true; // Any error, assume sandboxed
	}
}

scrib.uploadFile = async function (type) {
	const file_loader = document.createElement('input');
	let file_id = (Math.random() + 1).toString(36).substring(7);
	file_loader.id = file_id;
	file_loader.type = "file";
	file_loader.style.display = 'none';
	document.body.appendChild(file_loader);

	await scrib.waitForDom(file_id);

	let x = await new Promise(resolve => {
		scrib.getDom(file_id).addEventListener("change", () => {
			const fr = new FileReader();
			fr.onload = async function (event) {
				let content = event.target.result;
				scrib.getDom(file_id).remove();
				resolve(content);
			};

			if (type == 'text' || type == undefined || type == null) fr.readAsText(scrib.getDom(file_id).files[0]);
			else if (type === 'buffer') fr.readAsArrayBuffer(scrib.getDom(file_id).files[0]);
		});

		scrib.getDom(file_id).click();
	});
	return x;
}

const load_file = scrib.uploadFile;

var parse_response = async response => {
	const isJson = response.headers.get('content-type')?.includes('application/json');
	const data = isJson ? await response.json() : await response.text();
	// check for error response
	if (!response.ok) {
		// get error message from body or default to response status
		const error = (data && data.message) || response.status;
		return Promise.reject(error);
	}
	return data;
}

scrib.copyText = (textId) => {
	// Get the text to be copied
	var text = document.getElementById(textId).innerText;

	// Create a temporary textarea element
	var textarea = document.createElement("textarea");

	// Set the value of the textarea to the text to be copied
	textarea.value = text;

	// Append the textarea to the document body
	document.body.appendChild(textarea);

	// Select the text inside the textarea
	textarea.select();

	// Copy the selected text to the clipboard
	navigator.clipboard.writeText(text);

	// Remove the temporary textarea
	document.body.removeChild(textarea);
}

scrib.nbToJS = nb => {
	let js = nb.cells.filter(x => x.type == 'code').map(x => x['code']);
	js = js.join("\n/*---------*/\n");
	js = "/*Generated by JSNB: https://github.com/gopi-suvanam/jsnb*/\n\n" + js;
	return js;
}

scrib.getFileFromUrl = async url => {
	let nb = '';
	if (url.length > 1) {
		if (url.split(":")[0].trim() == 'github') {
			const link = url.split(":")[1].trim();
			let components = link.split("/")
			const user = components.shift();
			const repo = components.shift();
			const path = components.join("/");

			scrib.getDom("user").value = user;
			scrib.getDom("repo").value = repo;
			scrib.getDom("path").value = path;

			scrib.getDom("git-stars").src = `https://ghbtns.com/github-btn.html?user=${user}&repo=${repo}&type=star&count=true&size=small`;

			url = `https://raw.githubusercontent.com/${user}/${repo}/HEAD/${path}`;
			const reponse = await fetch(url);

			nb = await reponse.json();
		}
		else if (url.split(":")[0].trim() == 'local') {
			if (scrib.isSandboxed()) throw ("The code is sandboxed. Please take it out of sandbox");
			nb = await window.parent.getFileById(url.split(":")[1].trim());
			nb = nb.nb;
		}
		else {
			const reponse = await fetch(url);
			nb = await reponse.json();
		}
	}
	return nb;
};

scrib.runNBFromUrl = async url => {
	const nb = await scrib.getFileFromUrl(url);
	const js = scrib.nbToJS(nb);
	eval(js);
};

window.scrib = scrib; // Expose the scrib object globally

// Export only the necessary front-end functions and the scrib object
export { scrib, parse_response, load_script, load_file };