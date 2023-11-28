status_data={
	num_blocks:0,
	block_run:0,
	running_embedded:false
}

blank_nb={
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

var editors={}

toggle_editor=function(i){
	if(get_dom("cell_type"+i).checked) return;
	
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
unfocus_editor=function(i){
	
	if(get_dom("cell_type"+i).checked) return;
	else{
		setTimeout(function(){
		    if(get_dom("cell_type"+i).checked) return;
		    run(i);
		}, 200);
		
		
	}
}
delete_cell=function(i){
	get_dom("block"+i).remove();
	delete editors[i];
}
move_up=function(i){
	curr=get_dom("block"+i)
	prev=curr.previousSibling
	curr.parentNode.insertBefore(curr,prev);
	
	input_dom=get_dom("input"+i)
	cm=input_dom.childNodes[0].CodeMirror;
	cm.focus();
	cm.setCursor(1,0)
}
move_down=function(i){
	curr=get_dom("block"+i)
	next=curr.nextSibling
	curr.parentNode.insertBefore(curr, next.nextSibling)
	
	input_dom=get_dom("input"+i)
	cm=input_dom.childNodes[0].CodeMirror;
	cm.focus();
	cm.setCursor(1,0)
}

goto_next_cell=function(i){
	curr=get_dom("block"+i);
	next=curr.nextSibling;
	if(next==null) return;
	next_block_id=next.id.replace("block","");
	goto_input_cell(next_block_id);
	
}
goto_input_cell=function(i){
	if(!get_dom("cell_type"+i).checked){
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

insert_cell=async function(type,after){
	var i=status_data.num_blocks;
	const userPreferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	
	// Apply the appropriate CodeMirror theme
	var code_theme = 'duotone-light';
	if (userPreferredTheme === 'dark') {
	   code_theme='cobalt'; // Apply a dark theme (adjust theme name)
	} 
	
	console.log(type,after,i);
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
		function(node)
		{input_div.appendChild(node);
		}, {
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
		     theme:code_theme,
		     extraKeys: {
		          'Ctrl-Enter': (cm) => { run(i)},
		          'Cmd-Enter': (cm) => {run(i)},
		          'Shift-Enter': (cm) => {run(i);goto_next_cell(i) },
		          'Alt-Enter': (cm) => {insert_cell('code',i);},
		           //'Alt-R':(cm)=>{run_all()},	
		           'Alt-D':(cm)=>{delete_cell(i)},	
		           'Alt-Up':(cm)=>{move_up(i)},	
		           'Alt-Down':(cm)=>{move_down(i)},		     
		          }
		});
		
		
		if(type=='code'){
  			get_dom('cell_type'+i).checked=true;
	  	}
	  	else{
	  		get_dom('cell_type'+i).checked=false;
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
	  	editors[i]=cm;

	}
	

	status_data.num_blocks=i+1;

}






toggle_dark_mode=function(){
   if(document.body.getAttribute("data-theme")=='light')
   document.body.setAttribute("data-theme",'dark');
   else document.body.setAttribute("data-theme",'light');
}

get_nb=function(){
	var nb=JSON.parse(JSON.stringify(blank_nb));
 	
 	var main=get_dom("main");
 	var blocks=main.childNodes;
 	
 	
 	blocks.forEach(x=>{
 		var block_id=x.id.replace("block","")
 		var menu=get_dom("cell_menu"+block_id);
	 	var code=get_dom("input"+block_id).childNodes[0].CodeMirror.getValue();
	 	var result=get_dom("result"+block_id);
	 	var status=get_dom("status"+block_id).innerHTML;
	 	var output=get_dom("output"+block_id).innerHTML;
	 	var type=get_dom("cell_type"+block_id).checked?'code':'html';
	 	nb.cells.push({code:code,status:status,output:output,type:type})
	 	
 	});
 	return nb;
	
}




load_jsnb=async function(nb){
	try{

		var main = await wait_for_dom("main");
		var bkup_html=main.innerHTML;
		var bkup_editors=editors
		var bkup_status_data=status_data;
		var run_on_load = nb.run_on_load || false;
		if(typeof(nb)=='string') nb=JSON.parse(nb);
		editors={}
		main.innerHTML='';
		
		status_data.num_blocks=0;
		for(let i=0;i<nb.cells.length;i++){
			console.log(i,"/",nb.cells.length);
			x=nb.cells[i];
			await insert_cell(x['type']);
			var input_i=await wait_for_dom("input"+i);
			input_i.childNodes[0].CodeMirror.setValue(x['code']);
			var output_i=await wait_for_dom("output"+i);
			output_i.innerHTML=x['output'];
			var status_i=await wait_for_dom("status"+i);
			status_i.innerHTML=x['status'];
			
		};
		status_data.num_blocks=nb.cells.length;
		
		if (run_on_load) {
			await wait_for_dom("libs-loaded");
			run_all();
		}
		if(status_data.running_embedded){
			document.querySelectorAll(".code").forEach(a=>a.style.display = "none");
	  		document.querySelectorAll(".status").forEach(a=>a.style.display = "none");
	  		document.querySelectorAll(".cell-menu").forEach(a=>a.style.display = "none");
	  		document.querySelectorAll(".output").forEach(a=>a.ondblclick = "");
		}
		document.activeElement.blur(); 
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;
		
	}catch(err){
		alert(err.message);
		console.log(err.stack);
		editors=bkup_editors;
		main.innerHTML=bkup_html;
		alert(err.message);
		return ;
	}
	
	

}

get_html=function(view){
 	
 	var main=get_dom("main");
 	var blocks=main.childNodes;
	var html='<html>\n<head>\n'
	
	var cells=get_nb().cells;
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
	 		if(get_dom("cell_type"+block_id).checked){
	 			input=get_dom("input"+block_id).outerHTML;
	 		}
	 	}
	 	if(view=='html+js') {
	 		if(get_dom("cell_type"+block_id).checked){
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

message_handler=async function(action,data,call_bk){

	if(action == "run_all") run_all();
	if(action=="load_jsnb"){
		load_jsnb(data);
	}
	if(action=="insert_cell"){
		insert_cell(data['type']);
	}
		
}
insitialize_sandbox=function(){
	console.log("Initializing sanbox...");
	
	try{ url=window.location.href.split("#")[1];} catch(e){url=''}
  	if(url!=undefined && url.length>1 ){
  		if(!in_iframe()){
	  		const confirmation =confirm("Alert!!! The page is loading without a sandboxed Iframe. Click ok only if you trust the link...");
	  		if(!confirmation) return;
  		}
  		console.log("Loading from url inside Sandbox");
  		status_data.running_embedded=true;
  		if(url.split(":")[0].trim()=='github') initialize_from_git(url.split(":")[1].trim());
  		else read_file(url,load_jsnb,err=>{alert(err.message)});
  		document.querySelectorAll(".code").forEach(a=>a.style.display = "none");
  		document.querySelectorAll(".status").forEach(a=>a.style.display = "none");
  		document.querySelectorAll(".cell-menu").forEach(a=>a.style.display = "none");

  		return;
  	}	  	


	if(in_iframe()){
	  	
		 window.addEventListener('message', function(event) {
		      if (event.source === window.parent) {
		        const message = event.data;		
			message_handler(message.action,message.data,message.call_bk);
		
		      }
		    });
		   
		//Send notebook back on specific port if requested with port
		window.addEventListener('message',e=>{
			if(e.ports && e.data ) {
			  if(e.data.action=='get_nb'){
			          const data =  get_nb();
			          // respond to main window
			          e.ports[0].postMessage(data);
			   }
			   if(e.data.action=='get_html'){
			          const data =  get_html(e.data.view);
			          // respond to main window
			          e.ports[0].postMessage(data);
			   }
		        }
		})
	}
}

in_iframe = function() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}