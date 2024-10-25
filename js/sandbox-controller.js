

const sandbox={}

sandbox.statusData={
	num_blocks:0,
	block_run:0,
	running_embedded:false
}

blankNB={
  "metadata" : {
     "name":"Starting JS Notebook Example",
    "language_info": {
        "name" : "JavaScipt",
        "version": "8.0"
    }
  },
  "jsnbversion":"v0.1",
  "cells" : [],
  "source":"https://github.com/gopi-suvanam/jsnb",
  "run_on_load":false
}

sandbox.editors={}

sandbox.toggleEditor=function(i){
	if(scrib.getDom("cell_type"+i).value=='code') return;
	
	
	{
		input_dom=scrib.getDom("input"+i)
		input_dom.style.display = "block";
		scrib.getDom("cell_menu"+i).style.display = "block";
		scrib.getDom("result"+i).style.display = "none";
		cm=input_dom.childNodes[0].CodeMirror;
		cm.focus();
		cm.setCursor(1,0)
		
	}
}

const selectElements = document.querySelectorAll('.cell-type');

selectElements.forEach(select => {
  select.addEventListener('mousedown', (event) => {
    event.stopPropagation();
  });


});


sandbox.unfocusEditor=function(i){
	return; //Right now not making the run.. it will run only play button is pressed..
	if(scrib.getDom("cell_type"+i).value=='code') return;
	else{
		setTimeout(function(){
		    if(scrib.getDom("cell_type"+i).value=='code') return;
		    worker.run(i);
		}, 200);
		
		
	}
}
sandbox.deleteCell=function(i){
	scrib.getDom("block"+i).remove();
	delete sandbox.editors[i];
}
sandbox.moveUp=function(i){
	curr=scrib.getDom("block"+i)
	prev=curr.previousSibling
	curr.parentNode.insertBefore(curr,prev);
	
	input_dom=scrib.getDom("input"+i)
	cm=input_dom.childNodes[0].CodeMirror;
	cm.focus();
	cm.setCursor(1,0)
}
sandbox.moveDown=function(i){
	curr=scrib.getDom("block"+i)
	next=curr.nextSibling
	curr.parentNode.insertBefore(curr, next.nextSibling)
	
	input_dom=scrib.getDom("input"+i)
	cm=input_dom.childNodes[0].CodeMirror;
	cm.focus();
	cm.setCursor(1,0)
}

sandbox.goToNextCell=function(i){

	curr=scrib.getDom("block"+i);
	next=curr.nextSibling;
	if(next==null) {
		sandbox.insertCell('code');
		return;
	}
	next_block_id=next.id.replace("block","");

	sandbox.goToInputCell(next_block_id);
	
}

sandbox.goToInputCell=function(i){
	
	if(!(scrib.getDom("cell_type"+i).value==='code')){
		const input_dom=scrib.getDom("input"+i)
		input_dom.style.display = "block";
		scrib.getDom("cell_menu"+i).style.display = "block";
		scrib.getDom("result"+i).style.display = "none";
		const cm=input_dom.childNodes[0].CodeMirror;
		cm.focus();
		cm.setCursor(1,0)
		
	}else{
		const input_dom=scrib.getDom("input"+i)
		const cm=input_dom.childNodes[0].CodeMirror;
		cm.focus();
		cm.setCursor(1,0)
	}
}

// Custom hint function to dynamically show function parameters
CodeMirror.registerHelper('hint', 'functionParams', function(editor) {
  const cur = editor.getCursor();
  const token = editor.getTokenAt(cur);

  if (token.type === 'variable') {
    return token.string;
  }

  return null;
});


sandbox.code_theme = 'duotone-light';
const userPreferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
if (userPreferredTheme === 'dark') {
   sandbox.code_theme='cobalt'; // Apply a dark theme (adjust theme name)
} 


sandbox.codeMirrorOptions={
  value: "",
   	tabSize: 4,
     mode: 'javascript',
     lineNumbers: true,
     lineWrapping:true,
     //styleActiveSelected: true,
     //styleActiveLine: true,
     indentWithTabs: true,
     matchBrackets: true,
     highlightMatches: true,
     theme:sandbox.code_theme,
     extraKeys: {
          'Ctrl-Enter': (cm) => { worker.run(cm.i)},
          'Cmd-Enter': (cm) => {worker.run(cm.i)},
          'Shift-Enter': (cm) => {worker.run(cm.i);sandbox.goToNextCell(cm.i) },
          'Alt-Enter': (cm) => {sandbox.insertCell('code',cm.i);},
           //'Alt-R':(cm)=>{runAll()},	
           'Alt-D':(cm)=>{sandbox.deleteCell(cm.i)},	
           'Alt-Up':(cm)=>{sandbox.moveUp(cm.i)},	
           'Alt-Down':(cm)=>{sandbox.moveDown(cm.i)},	
           "Ctrl-Space": "autocomplete",
           ".": function(cm) {
		      setTimeout(function() {
		        CodeMirror.commands.autocomplete(cm, null, { completeSingle: false });
		      }, 100);
		      return CodeMirror.Pass;
		    }
			     
          }
}

sandbox.insertCell=async function(type,after){
	let i=sandbox.statusData.num_blocks;
	
	
	// Apply the appropriate CodeMirror theme
	
	let block_html=scrib.getDom("code_block_template").innerHTML;
	block_html=block_html.replaceAll('_block_id',i);
	block_html= block_html.replaceAll(/(\r\n|\n|\r|\t)/gm, "");

	const div = document.createElement('div');
  	div.innerHTML = block_html; 
  	div.setAttribute('id','block'+i);

  	//
  	if(after==undefined){
  		scrib.getDom("main").appendChild(div);
  		
  	}else{
  		scrib.getDom("block"+after).after(div)
  	}

	const input_div=await scrib.waitForDom("input"+i); 
	{
	
		cm = new CodeMirror(
			node=>{input_div.appendChild(node);}, 
			sandbox.codeMirrorOptions
		);
		cm.i=i;
		scrib.getDom('cell_type'+i).value=type;

		if(type=='code'){
  			
	  	}
	  	else{
	  		scrib.getDom('result'+i).style.display='flex';
	  		scrib.getDom('input'+i).style.display='none';
	  		scrib.getDom('status'+i).style.display='none';
	  		scrib.getDom("cell_menu"+i).style.display = "none";
	  		if(type=='style') {
	  			scrib.getDom('input'+i).childNodes[0].CodeMirror.setValue("<style>\n\n</style>");
	  		}
	  	}
	  	cm.focus();
		cm.setCursor(1,0);
	  	sandbox.editors[i]=cm;

	}
	

	sandbox.statusData.num_blocks=i+1;

}







sandbox.getNB=function(){
	const nb=JSON.parse(JSON.stringify(blankNB));
 	
 	const main=scrib.getDom("main");
 	const blocks=main.childNodes;
 	
 	
 	blocks.forEach(x=>{
 		const block_id=x.id.replace("block","")
 		const menu=scrib.getDom("cell_menu"+block_id);
	 	const code=scrib.getDom("input"+block_id).childNodes[0].CodeMirror.getValue();
	 	const result=scrib.getDom("result"+block_id);
	 	const status=scrib.getDom("status"+block_id).innerHTML;
	 	const output=scrib.getDom("output"+block_id).innerHTML;
	 	const type=scrib.getDom("cell_type"+block_id).value;
	 	nb.cells.push({code:code,status:status,output:output,type:type})
	 	
 	});
 	return nb;
	
}


sandbox.getMarkdownNB=function(){
	let nb='';
 	
 	const main=scrib.getDom("main");
 	const blocks=main.childNodes;
 	
 	
 	blocks.forEach(x=>{
 		const block_id=x.id.replace("block","")
 		let input ='';
 		const code=scrib.getDom("input"+block_id).childNodes[0].CodeMirror.getValue();
		if(scrib.getDom("cell_type"+block_id).value=='code'){
			input="```javascript\n"+code+"\n```";
		}
		else{
			
			input="```doc\n"+code+"\n```";
		}
		
		nb=nb+"\n"+input;
	 	
 	});
	
 	return nb;
	
}

sandbox.loadJSNB=async function(nb){
	try{
		const main = await scrib.waitForDom("main");
		const bkup_html=main.innerHTML;
		const bkup_editors=sandbox.editors
		const bkup_statusData=sandbox.statusData;

		if(typeof(nb)=='string') nb=JSON.parse(nb);
		const run_on_load = nb.run_on_load || false;
		sandbox.editors={}
		main.innerHTML='';
		
		console.log("nb.hideCode",nb.hideCode);
		
		sandbox.statusData.num_blocks=0;
		for(let i=0;i<nb.cells.length;i++){
			x=nb.cells[i];
			await sandbox.insertCell(x['type']);
			const input_i=await scrib.waitForDom("input"+i);
			input_i.childNodes[0].CodeMirror.setValue(x['code']);
			const output_i=await scrib.waitForDom("output"+i);
			output_i.innerHTML=x['output'];
			const status_i=await scrib.waitForDom("status"+i);
			status_i.innerHTML=x['status'];
			
		};
		sandbox.statusData.num_blocks=nb.cells.length;
		
		if (run_on_load) {
			await scrib.waitForDom("libs-loaded");
			await sandbox.runAll();
		}
		if(sandbox.statusData.running_embedded || nb.hideCode){
			document.querySelectorAll(".code").forEach(a=>a.style.display = "none");
	  		document.querySelectorAll(".status").forEach(a=>a.style.display = "none");
	  		document.querySelectorAll(".cell-menu").forEach(a=>a.style.display = "none");
	  		document.querySelectorAll("article").forEach(a=>{
	  			a.ondblclick = "";
	  			if(a.lastElementChild.innerHTML.length===0) a.style.display='none';
	  		});
	  		
		}
		document.activeElement.blur(); 
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;
		
	}catch(err){
		console.log(err.stack);
		sandbox.editors=bkup_editors;
		main.innerHTML=bkup_html;
		return ;
	}
	
	

}

sandbox.getHTML=function(view){
 	
 	const main=scrib.getDom("main");
 	const blocks=main.childNodes;
	let html='<html>\n<head>\n'
	
	const cells=sandbox.getNB().cells;
	let css= [];

	for (var sheeti= 0; sheeti<document.styleSheets.length; sheeti++) {
		let href=document.styleSheets[sheeti].href;
		if (href!=undefined && href !=null && href.length>0)
		html+="<link rel='stylesheet' href='"+href+"'>\n";
	}
	if(view=='html+js') {
		for (var scripti= 0; scripti<document.scripts.length; scripti++) {
			let src=document.scripts[scripti].src;
			if (src!=undefined && src !=null && src>0)
			html+="<script  src='"+scr+"'></script>\n"
		}
	}
	
	html+='<title>______title:Scribbler Notebook</title>\n</head>\n<body>\n<br>\n<div class="container">'; 	
 	blocks.forEach(x=>{
 		const block_id=x.id.replace("block","")
 		let input ='';
 		let output=scrib.getDom("result"+block_id).outerHTML;
	 	if(view=='nb') {
	 		if(scrib.getDom("cell_type"+block_id).value=='code'){
	 			input=scrib.getDom("input"+block_id).outerHTML;
	 		}
	 	}
	 	if(view=='html+js') {
	 		if(scrib.getDom("cell_type"+block_id).value=='code'){
		 		const code=scrib.getDom("input"+block_id).childNodes[0].CodeMirror.getValue();
		 		input="\n<script>\n"+code+"\n</script>\n";
		 	}
		 	
		 	let output=scrib.getDom("output"+block_id).outerHTML;
	 	}
	 	
	 	
	 	
	 	
	 	
	 	html=html+"\n"+input+"\n"+output;
	 	
 	});
 	html=html+"</div></body></html>"
 	return html	
}


sandbox.runAll=async function(){
	const main=scrib.getDom("main");
	const blocks=main.childNodes;
	for(let blockNum =0; blockNum<blocks.length;blockNum++){
		try{
			await worker.run(blocks[blockNum].id.replace('block',""));
			console.log(blocks[blockNum].id);
		}catch(err){
			console.log(err.stack);
		}
	}
	
}



sandbox.messageHandler=async function(action,data,call_bk){

	if(action == "sandbox.runAll") sandbox.runAll();
	if(action=="sandbox.loadJSNB"){
		sandbox.loadJSNB(data);
	}
	if(action=="sandbox.insertCell"){
		sandbox.insertCell(data['type']);
	}
		
}



sandbox.initialize=async function(){
	console.log("Initializing sanbox...");
	var url='';
	try{ url=window.location.href.split("#")[1];} catch(e){url=''}
  	if(url!=undefined && url.length>1 ){
  		if(!scrib.isInIFrame()){
	  		alert("Alert!!! The page is loading without an Iframe. Your cookies etc could be compromised. If you are the publisher of this notebook, please put this in a sandboxed iframe in a page and share the link of the page.");
	  		return;
  		}
  		console.log("Loading from url inside Sandbox");
  		sandbox.statusData.running_embedded=true;
  		if(url.split(":")[0].trim()=='github') {
			const link=url.split(":")[1];
			var i = link.indexOf('/');
			var user = link.slice(0,i); 
			var rest = link.slice(i+1);
			
			var i = rest.indexOf('/');
			var repo = rest.slice(0,i);
			var path = rest.slice(i+1);
			

			
			
			url=`https://raw.githubusercontent.com/${user}/${repo}/HEAD/${path}`;
			
  		}

		const reponse=await fetch(url);	
 		const nb=await reponse.text();
 		await sandbox.loadJSNB(nb);

  		document.querySelectorAll(".code").forEach(a=>a.style.display = "none");
  		document.querySelectorAll(".status").forEach(a=>a.style.display = "none");
  		document.querySelectorAll(".cell-menu").forEach(a=>a.style.display = "none");
  		document.querySelectorAll(".output").forEach(a=>a.ondblclick = "");

  		return;
  	}	  	


	if(scrib.isInIFrame()){
	  	
		 window.addEventListener('message', function(event) {
		 	
		      if (event.source === window.parent) {
		        const message = event.data;		
			sandbox.messageHandler(message.action,message.data,message.call_bk);
		
		      }
		    });
		   
		//Send notebook back on specific port if requested with port
		window.addEventListener('message',e=>{
			if(e.ports && e.data ) {
			  if(e.data.action=='sandbox.getNB'){
			          const data =  sandbox.getNB();
			          // respond to main window
			          e.ports[0].postMessage(data);
			   }
			   if(e.data.action=='sandbox.getHTML'){
			          const data =  sandbox.getHTML(e.data.view);
			          // respond to main window
			          e.ports[0].postMessage(data);
			   }
		        }
		})
	}
}

/** Making sandbox immutable so that user generated scripts cannot change the functions **/

Object.freeze(sandbox);
