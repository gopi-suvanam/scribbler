import { scrib } from './libs.js';
import { initialize_git } from './github.js';
import { getAllFileNames, insertOrUpdateFile, getFileById, deleteFileById } from './local-storage.js';
import { openModal, closeModal } from './modal.js';

let fileDetails = {};
let username = '';
let sandbox_iframe;


/****** Loading JSNB *********/

const load_jsnb = async function (content) {
    if (!sandbox_iframe) {
        sandbox_iframe = await scrib.waitForDom("sandbox");
    }
    if (typeof (content) == 'string') var nb = JSON.parse(content);
    else var nb = content;

    const message = {
        action: "sandbox.loadJSNB",
        data: nb,
        call_bk: ""
    };

    sandbox_iframe.contentWindow.postMessage(message, '*');

    const run_on_load = nb.run_on_load || false;
    scrib.getDom("nb_name").innerHTML = nb.metadata.name;
    document.title = nb.metadata.name + ":  Scribbler Notebook";
    const metaDescription = document.querySelector('meta[name="description"]');

    // Set the description dynamically
    const newDescription = nb.metadata.name + " - Notebook for experimenting in JavaScript. Contains editable code and output. Play with html and code using a simple interface - Scribbler.";
    metaDescription.setAttribute("content", newDescription);
    scrib.getDom("run_on_load").checked = run_on_load;

}

const loadFileClick = async function (type) {

	let content = await scrib.uploadFile();

	if (type == 'md') content = scrib.markdownToJSNB(content, scrib.blankNB);
	if (type == 'js') content = scrib.jsToJSNB(content, scrib.blankNB);

	scrib.getDom("sandbox").setAttribute("sandbox", "allow-scripts allow-downloads allow-same-origin allow-top-navigation allow-popups allow-modals");
	scrib.getDom("sandbox").setAttribute("src", "sandbox.html?var=xxx");
	scrib.getDom("break-sandbox").style.display = 'inline';
	sandbox_iframe = await scrib.waitForDom("sandbox");
	sandbox_iframe.addEventListener("load", function () {
		load_jsnb(content);
	}, { once: true });

}

const load_from_url = async function () {
	let url = '';
	const urlParams = new URLSearchParams(window.location.search);
	const hideMenu = urlParams.get('hide-menu');
	const runOnLoad = urlParams.get('run-on-load');
	if (hideMenu === 'true') {
		scrib.getDom("page-header").style.display = "none";
		scrib.getDom("footer").style.display = "none";
	}

	const hideCode = urlParams.get('hide-code');

	try {

		const jsnb_path = urlParams.get('jsnb');
		if (jsnb_path != null && typeof jsnb_path !== 'undefined') url = jsnb_path;
		else url = window.location.href.split("#")[1];
	}
	catch (e) { url = "./examples/Hello-world.jsnb" }
	if (url == undefined) url = "./examples/Hello-world.jsnb";
	let nb = '';
	if (url.length > 1) {
		if (url.split(":")[0].trim() == 'local') {
			const id = url.split(":")[1].trim();
			loadLocalFile(id);
			return;
		}
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
		} else {
			const reponse = await fetch(url);
			nb = await reponse.json();

		}
		if (hideCode === 'true') nb['hideCode'] = true;
		if (runOnLoad === 'true') nb['run_on_load'] = true;
		if (runOnLoad === 'false') nb['run_on_load'] = false;

		await load_jsnb(nb);

	} else {
		scrib.getDom("sandbox").removeAttribute("sandbox");
		scrib.getDom("sandbox").setAttribute("src", "sandbox.html");

		sandbox_iframe = await scrib.waitForDom("sandbox")
		sandbox_iframe.addEventListener("load", async function () {
			console.log("Sanbox loaded");
			scrib.getDom("nb_name").innerHTML = "New JSNB";
			insert_cell("code");
		}
			, { once: true }
		);
		// scrib.getDom("break-sandbox").style.display = 'none';

	}

}


/***** Downloading ************/
// Sets up a new MessageChannel
// so we can return a Promise with the nb
function get_nb() {
	return new Promise((resolve) => {
		const channel = new MessageChannel();
		// this will fire when iframe will answer

		channel.port1.onmessage = e => {
			var nb = e.data;
			nb['run_on_load'] = scrib.getDom("run_on_load").checked;
			nb.metadata.name = scrib.getDom("nb_name").innerHTML;
			return resolve(nb);
		}
		// let iframe know we're expecting an answer
		// send it its own port
		sandbox_iframe.contentWindow.postMessage({ "action": 'sandbox.getNB' }, '*', [channel.port2]);
	});
}


// Sets up a new MessageChannel
// so we can return a Promise with the html
function get_html(view) {
	return new Promise((resolve) => {
		const channel = new MessageChannel();
		// this will fire when iframe will answer

		channel.port1.onmessage = e => {
			var doc = e.data;
			return resolve(doc);
		}
		// let iframe know we're expecting an answer
		// send it its own port
		sandbox_iframe.contentWindow.postMessage({ "action": 'sandbox.getHTML', "view": view }, '*', [channel.port2]);
	});
}

const download_js = async function () {
	const nb = await get_nb();
	let js = nb.cells.filter(x => x.type == 'code').map(x => x['code']);

	//This is avoid repeated comments when you download from Scribbler and reupload
	js = js.map(x => x.replaceAll("\n/*---------*/\n", "\n"));
	js = js.map(x => x.replaceAll("/*Generated by JSNB: https://github.com/gopi-suvanam/jsnb*/\n\n", "\n"));

	js = js.join("\n/*---------*/\n");
	js = "/*Generated by JSNB: https://github.com/gopi-suvanam/jsnb*/\n\n" + js;
	let file_name = scrib.getDom("nb_name").innerHTML.replaceAll(' ', '-') + '.js';
	scrib.downloadString(js, file_name, "data:text/js;charset=utf-8");

}

const download_html = async function (view) {
	// Send a message object to the iframe
	let doc = await get_html(view);
	doc = doc.replace("______title", scrib.getDom("nb_name").innerHTML);
	let file_name = scrib.getDom("nb_name").innerHTML.replaceAll(' ', '-') + '.html';
	scrib.downloadString(doc, file_name, "data:text/html;charset=utf-8");

}

const download_nb = async function () {
	// Send a message object to the iframe
	const nb = await get_nb();
	let url = '';
	let file_name = '';
	try {

		const urlParams = new URLSearchParams(window.location.search);
		const jsnb_path = urlParams.get('jsnb');
		if (jsnb_path != null && typeof jsnb_path !== 'undefined') url = jsnb_path;
		else url = window.location.href.split("#")[1];
	} catch (e) {
		console.log(e);
		url = ''
	}

	if (url != undefined && url.length > 1 && url.split(":")[0].trim() != 'local') {
		file_name = url.split('/').slice(-1)[0]
	} else {

		file_name = nb.metadata.name.replaceAll(' ', '-') + '.jsnb'
	}
	scrib.downloadString(JSON.stringify(nb, undefined, 2), file_name, "data:text/json;charset=utf-8");


}


/****** Other Functionality ************/
const run_all = function () {

	// Send a message object to the iframe

	const message = {
		action: "sandbox.runAll",
		data: ""
	};
	sandbox_iframe.contentWindow.postMessage(message, '*');

}

const insert_cell = function (type) {
	// Send a message object to the iframe

	const message = {
		action: "sandbox.insertCell",
		data: { type: type },
		call_bk: ""
	};
	sandbox_iframe.contentWindow.postMessage(message, '*');
}

const break_sandbox = async function () {
	const confirmation = prompt("!!! Alert !!! You are about to break the Sandbox. This can give the notebook access to your cookies, cache etc. Do so only if you trust the code in the notebook !!! Enter 'I trust' below if you trust the notebook.");
	if (confirmation !== 'I trust') return;
	const nb = await get_nb();
	scrib.getDom("sandbox").removeAttribute("sandbox");
	scrib.getDom("sandbox").setAttribute("src", "sandbox.html");

	sandbox_iframe = await scrib.waitForDom("sandbox")
	sandbox_iframe.addEventListener("load", async function () {
		console.log("Sanbox loaded");
		load_jsnb(nb);
	}
		, { once: true }
	);
	scrib.getDom("break-sandbox").style.display = 'none';
}


/******** Functions for handling local (IndexedDB) files */
const openFileNamesModal = function () {
	// Get the modal
	const modal = document.getElementById('fileNamesModal');

	// Call function to retrieve file names and populate the modal
	getAllFileNames()
		.then(files => {
			const fileNamesList = document.getElementById('fileNamesList');

			// Clear existing list items
			fileNamesList.innerHTML = '';

			// Populate the modal with file names
			files.forEach(file => {
				const li = document.createElement('li');
				const fileLink = document.createElement('a');
				fileLink.textContent = file.name;//+" "+file.update_time;
				fileLink.onclick = () => {
					loadLocalFile(file.id);
					closeModal(scrib.getDom('fileNamesModal'));
				}

				const deleteBtn = document.createElement('a');

				deleteBtn.classList.add("file-delete");
				deleteBtn.onclick = () => deleteLocalFile(file.id, file.name);
				deleteBtn.innerHTML = '&#9747;';

				const updateTime = document.createElement('p');
				updateTime.textContent = "Last updated at: " + file.updateTime;//+" "+file.update_time;
				updateTime.classList.add("update-time");

				li.appendChild(fileLink);
				li.appendChild(deleteBtn);
				li.appendChild(updateTime);

				fileNamesList.appendChild(li);
			});


		})
		.catch(error => {
			alert('Error retrieving file names:' + error);
		});
}

const saveLocalFile = async function () {
	scrib.getDom("save-button").setAttribute("aria-busy", "true");
	try {
		let nb = await get_nb();
		if (scrib.getDom("sandbox").getAttribute("sandbox")) nb['trustLocally'] = false;
		else nb['trustLocally'] = true;

		const updateTime = new Date();
		const id = await insertOrUpdateFile(nb, nb.metadata.name, updateTime, fileDetails['id']);
		openFileNamesModal();
		fileDetails['id'] = id;

		const nextURL = `./#local:${id}`;
		const nextTitle = 'JavaScript Notebook: ' + nb.metadata.name;
		const nextState = { additionalInformation: 'Updated the URL with JS' };

		window.history.pushState(nextState, nextTitle, nextURL);

	} catch (e) {

		alert("Error saving file locally: " + String(e));
	}
	setTimeout(() =>
		scrib.getDom("save-button").removeAttribute("aria-busy"),
		500);
}

const resetNB = async function () {
	scrib.getDom("sandbox").removeAttribute("sandbox");
	scrib.getDom("sandbox").setAttribute("src", "sandbox.html");
	sandbox_iframe = await scrib.waitForDom("sandbox")
	sandbox_iframe.addEventListener("load", async function () {
		console.log("Sanbox loaded");
		scrib.getDom("nb_name").innerHTML = "Scribbler Notebook";
		insert_cell("code");
	}
		, { once: true }
	);
	scrib.getDom("break-sandbox").style.display = 'none';
}

const deleteLocalFile = function (id, name) {
	let c = confirm("Deleting : " + name);
	if (c)
		deleteFileById(parseInt(id)).then(x => openFileNamesModal()).catch(err => { alert("Error in deletion:" + error) });

}

const loadLocalFile = async function (id) {
	try {
		const obj = await getFileById(id);

		if (obj.nb.trustLocally) {
			scrib.getDom("sandbox").removeAttribute("sandbox");
			scrib.getDom("break-sandbox").style.display = 'none';
		}
		else {
			scrib.getDom("sandbox").setAttribute("sandbox", "allow-scripts allow-downloads allow-top-navigation allow-modals allow-same-origin");
			scrib.getDom("break-sandbox").style.display = 'inline';
		}
		scrib.getDom("sandbox").setAttribute("src", "sandbox.html?var=xxx");
		sandbox_iframe = await scrib.waitForDom("sandbox");
		sandbox_iframe.addEventListener("load", function () {
			load_jsnb(obj.nb);
			fileDetails['id'] = obj.id

			const nextURL = `./#local:${obj.id}`;
			const nextTitle = 'JavaScript Notebook: ' + obj.nb.metadata.name;
			const nextState = { additionalInformation: 'Updated the URL with JS' };

			window.history.pushState(nextState, nextTitle, nextURL);

		}, { once: true });
	} catch (err) { alert("Error in Loading file:" + err) };

}


/********* Share and Publish *********/
const shareBtn = function () {
	let url = '';
	scrib.getDom("sharableLink").innerHTML = window.location;//.origin+window.location.pathname+'?jsnb='+url;

	try {
		const urlParams = new URLSearchParams(window.location.search);
		const jsnb_path = urlParams.get('jsnb');
		if (jsnb_path != null && typeof jsnb_path !== 'undefined') url = jsnb_path;
		else url = window.location.href.split("#")[1];
	} catch (e) {
		url = '';
	}
	if (url == undefined) url = '';
	scrib.getDom("sharableLinkClean").innerHTML = window.origin + window.location.pathname + `?jsnb=${url}&hide-menu=true&hide-code=true`;

	if (url.length > 0) {

		scrib.getDom("iframeLink").innerText = '<iframe id="sandbox" style="width:100%;height:100%" src ="' + window.location.origin + window.location.pathname + 'sandbox.html?jsnb=' + url + '"></iframe>';
		openModal(scrib.getDom('shareNB'));
	}
	else {
		alert("Push the notebook to Github first to publish the notebook in an iFrame");
		openModal(scrib.getDom('git-import-export'));
	}
}

const toggleJsDlvr = function () {
	let jsDlvrUrl = 'https://cdn.jsdelivr.net/gh/';
	if (scrib.getDom("iframeLink").innerText(":")[0].trim() == 'github') {
		scrib.getDom("iframeLink").innerText = scrib.getDom("iframeLink").innerText.replace('github:', jsDlvrUrl);
	}
	else if (scrib.getDom("iframeLink").innerText(":")[0].trim() == jsDlvrUrl) {
		scrib.getDom("iframeLink").innerText = scrib.getDom("iframeLink").innerText.replace('github:', jsDlvrUrl);
	}
}


/********* Initialize Certain Global Variables and Load the JSNB from URL *****/
const keyDown = function (e) {
	if (e.ctrlKey && e.key === 's') {
		saveLocalFile();
	} else if (e.ctrlKey && e.key === 'g') {
		openModal(scrib.getDom('git-import-export'));
	} else if (e.ctrlKey && e.key === 'o') {
		openModal(scrib.getDom('fileNamesModal'));
		openFileNamesModal()
	}
	else if (e.altKey && e.key === '®') {
		run_all()
	}
	else if (e.altKey && e.key === 'r') {
		run_all()
	}
}


//This loads components dynamically
class DynamicInclude extends HTMLElement {
	connectedCallback() {
		const url = this.getAttribute('data');
		fetch(url)
			.then(response => response.text())
			.then(content => {
				this.innerHTML = content;
			});
	}
}

customElements.define('html-component', DynamicInclude);

const initialize_page = async function () {

	window.onload = function () {
		let first_load = true;
		//scrib.getDom("sandbox").setAttribute("sandbox","allow-scripts allow-downloads allow-top-navigation allow-popups allow-modals");
		//scrib.getDom("sandbox").setAttribute("src","sandbox.html");
		scrib.waitForDom("break-sandbox").then(result => result.style.display = 'inline');
		initialize_git();

		scrib.waitForDom('sandbox').then(result => {
			const sandbox_iframe = result;

			console.log("Loading from URL");
			load_from_url();
			first_load = false;

			document.addEventListener('keydown', keyDown);
		});

		// listen for messages from iframe(child)
		window.addEventListener("message", async (event) => {
			// verify message is from the sandbox iframe
			if (event.source !== document.getElementById("sandbox").contentWindow) return;

			const data = event.data;
			if (!data || data.type !== "writeClipboard") return;

			try {
				await navigator.clipboard.writeText(data.text);
				event.source.postMessage({ type: "clipboardWriteSuccess" }, "*");
			} catch (err) {
				console.error("Failed to write to clipboard:", err);
				event.source.postMessage({
					type: "clipboardWriteError",
					error: err.message
				}, event.origin);
			}
		});
	};

}

window.openFileNamesModal = openFileNamesModal;
window.saveLocalFile = saveLocalFile;
window.loadFileClick = loadFileClick;
window.download_nb = download_nb;
window.download_js = download_js;
window.download_html = download_html;
window.shareBtn = shareBtn;
window.insert_cell = insert_cell;
window.break_sandbox = break_sandbox;
window.run_all = run_all;
window.resetNB = resetNB;

export { initialize_page }