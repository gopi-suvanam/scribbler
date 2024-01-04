

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
	if(get_dom("cell_type"+i).value=='code') return;
	
	
	{
		input_dom=get_dom("input"+i)
		input_dom.style.display = "block";
		get_dom("cell_menu"+i).style.display = "block";
		get_dom("result"+i).style.display = "none";
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
	if(get_dom("cell_type"+i).value=='code') return;
	else{
		setTimeout(function(){
		    if(get_dom("cell_type"+i).value=='code') return;
		    worker.run(i);
		}, 200);
		
		
	}
}
sandbox.deleteCell=function(i){
	get_dom("block"+i).remove();
	delete sandbox.editors[i];
}
sandbox.moveUp=function(i){
	curr=get_dom("block"+i)
	prev=curr.previousSibling
	curr.parentNode.insertBefore(curr,prev);
	
	input_dom=get_dom("input"+i)
	cm=input_dom.childNodes[0].CodeMirror;
	cm.focus();
	cm.setCursor(1,0)
}
sandbox.moveDown=function(i){
	curr=get_dom("block"+i)
	next=curr.nextSibling
	curr.parentNode.insertBefore(curr, next.nextSibling)
	
	input_dom=get_dom("input"+i)
	cm=input_dom.childNodes[0].CodeMirror;
	cm.focus();
	cm.setCursor(1,0)
}

sandbox.goToNextCell=function(i){

	curr=get_dom("block"+i);
	next=curr.nextSibling;
	if(next==null) {
		sandbox.insertCell('code');
		return;
	}
	next_block_id=next.id.replace("block","");

	sandbox.goToInputCell(next_block_id);
	
}

sandbox.goToInputCell=function(i){
	
	if(!(get_dom("cell_type"+i).value==='code')){
		input_dom=get_dom("input"+i)
		input_dom.style.display = "block";
		get_dom("cell_menu"+i).style.display = "block";
		get_dom("result"+i).style.display = "none";
		cm=input_dom.childNodes[0].CodeMirror;
		cm.focus();
		cm.setCursor(1,0)
		
	}else{
		input_dom=get_dom("input"+i)
		cm=input_dom.childNodes[0].CodeMirror;
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
	var i=sandbox.statusData.num_blocks;
	
	
	// Apply the appropriate CodeMirror theme
	
	var block_html=get_dom("code_block_template").innerHTML;
	block_html=block_html.replaceAll('_block_id',i);
	block_html= block_html.replaceAll(/(\r\n|\n|\r|\t)/gm, "");

	var div = document.createElement('div');
  	div.innerHTML = block_html; 
  	div.setAttribute('id','block'+i);

  	//
  	if(after==undefined){
  		get_dom("main").appendChild(div);
  		
  	}else{
  		get_dom("block"+after).after(div)
  	}

	var input_div=await wait_for_dom("input"+i); 
	{
	
		cm = new CodeMirror(
			node=>{input_div.appendChild(node);}, 
			sandbox.codeMirrorOptions
		);
		cm.i=i;
		get_dom('cell_type'+i).value=type;

		if(type=='code'){
  			
	  	}
	  	else{
	  		get_dom('result'+i).style.display='flex';
	  		get_dom('input'+i).style.display='none';
	  		get_dom('status'+i).style.display='none';
	  		get_dom("cell_menu"+i).style.display = "none";
	  		if(type=='style') {
	  			get_dom('input'+i).childNodes[0].CodeMirror.setValue("<style>\n\n</style>");
	  		}
	  	}
	  	cm.focus();
		cm.setCursor(1,0);
	  	sandbox.editors[i]=cm;

	}
	

	sandbox.statusData.num_blocks=i+1;

}






toggleDarkMode=function(){
   if(document.body.getAttribute("data-theme")=='light')
   document.body.setAttribute("data-theme",'dark');
   else document.body.setAttribute("data-theme",'light');
}

sandbox.getNB=function(){
	let nb=JSON.parse(JSON.stringify(blankNB));
 	
 	let main=get_dom("main");
 	let blocks=main.childNodes;
 	
 	
 	blocks.forEach(x=>{
 		let block_id=x.id.replace("block","")
 		let menu=get_dom("cell_menu"+block_id);
	 	let code=get_dom("input"+block_id).childNodes[0].CodeMirror.getValue();
	 	let result=get_dom("result"+block_id);
	 	let status=get_dom("status"+block_id).innerHTML;
	 	let output=get_dom("output"+block_id).innerHTML;
	 	let type=get_dom("cell_type"+block_id).value;
	 	nb.cells.push({code:code,status:status,output:output,type:type})
	 	
 	});
 	return nb;
	
}



sandbox.loadJSNB=async function(nb){
	try{

		var main = await wait_for_dom("main");
		var bkup_html=main.innerHTML;
		var bkup_editors=sandbox.editors
		var bkup_statusData=sandbox.statusData;
		var run_on_load = nb.run_on_load || false;
		if(typeof(nb)=='string') nb=JSON.parse(nb);
		sandbox.editors={}
		main.innerHTML='';
		
		sandbox.statusData.num_blocks=0;
		for(let i=0;i<nb.cells.length;i++){
			x=nb.cells[i];
			await sandbox.insertCell(x['type']);
			var input_i=await wait_for_dom("input"+i);
			input_i.childNodes[0].CodeMirror.setValue(x['code']);
			var output_i=await wait_for_dom("output"+i);
			output_i.innerHTML=x['output'];
			var status_i=await wait_for_dom("status"+i);
			status_i.innerHTML=x['status'];
			
		};
		sandbox.statusData.num_blocks=nb.cells.length;
		
		if (run_on_load) {
			await wait_for_dom("libs-loaded");
			sandbox.runAll();
		}
		if(sandbox.statusData.running_embedded){
			document.querySelectorAll(".code").forEach(a=>a.style.display = "none");
	  		document.querySelectorAll(".status").forEach(a=>a.style.display = "none");
	  		document.querySelectorAll(".cell-menu").forEach(a=>a.style.display = "none");
	  		document.querySelectorAll(".output").forEach(a=>a.ondblclick = "");
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
 	
 	var main=get_dom("main");
 	var blocks=main.childNodes;
	var html='<html>\n<head>\n'
	
	var cells=sandbox.getNB().cells;
	var css= [];

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
 		var block_id=x.id.replace("block","")
 		var input ='';
 		var output=get_dom("result"+block_id).outerHTML;
	 	if(view=='nb') {
	 		if(get_dom("cell_type"+block_id).value=='code'){
	 			input=get_dom("input"+block_id).outerHTML;
	 		}
	 	}
	 	if(view=='html+js') {
	 		if(get_dom("cell_type"+block_id).value=='code'){
		 		let code=get_dom("input"+block_id).childNodes[0].CodeMirror.getValue();
		 		input="\n<script>\n"+code+"\n</script>\n";
		 	}
		 	
		 	var output=get_dom("output"+block_id).outerHTML;
	 	}
	 	
	 	
	 	
	 	
	 	
	 	html=html+"\n"+input+"\n"+output;
	 	
 	});
 	html=html+"</div></body></html>"
 	return html	
}


sandbox.runAll=function(){
	var main=get_dom("main");
	blocks=main.childNodes;
	blocks.forEach(x=>{
		try{
			worker.run(x.id.replace('block',""))
		}catch(err){
			console.log(err.stack)
		}
	});
	
	
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
sandbox.initialize=function(){
	console.log("Initializing sanbox...");
	
	try{ url=window.location.href.split("#")[1];} catch(e){url=''}
  	if(url!=undefined && url.length>1 ){
  		if(!in_iframe()){
	  		const confirmation =confirm("Alert!!! The page is loading without a sandboxed Iframe. Click ok only if you trust the link...");
	  		if(!confirmation) return;
  		}
  		console.log("Loading from url inside Sandbox");
  		sandbox.statusData.running_embedded=true;
  		if(url.split(":")[0].trim()=='github') initialize_from_git(url.split(":")[1].trim());
  		else read_file(url,sandbox.loadJSNB,err=>{console.log(err.message)});
  		document.querySelectorAll(".code").forEach(a=>a.style.display = "none");
  		document.querySelectorAll(".status").forEach(a=>a.style.display = "none");
  		document.querySelectorAll(".cell-menu").forEach(a=>a.style.display = "none");

  		return;
  	}	  	


	if(in_iframe()){
	  	
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
