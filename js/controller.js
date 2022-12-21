status_data={
	num_blocks:0,
	
	block_run:0
}


run=function(i){
	console.log("Running cell ",i)
	
	show =function(x){
		show_in_dom(x,"output"+i)
	}
	get_dom("status"+i).innerHTML='[*]'
	get_dom("output"+i).innerHTML=''
	
	code=editors[i].getValue()
	try{
		eval(code)
		status_data.block_run+=1;
		get_dom("status"+i).innerHTML='['+status_data.block_run+']'
	}catch(err){
		get_dom("output"+i).innerHTML=get_dom("output"+i).innerHTML+"<p class='error'>"+err.message+"</p>";
		get_dom("status"+i).innerHTML='[-]'
	}
	console.log("Finished cell ",i)
}


var editors={}

delete_cell=function(i){
	get_dom("block"+i).remove();
	delete editors[i];
}
move_up=function(i){
	curr=get_dom("block"+i)
	prev=curr.previousSibling
	curr.parentNode.insertBefore(curr,prev);
}
move_down=function(i){
	curr=get_dom("block"+i)
	next=curr.nextSibling
	console.log(next.id);
	
	curr.parentNode.insertBefore(curr, next.nextSibling)
}

insert_cell=function(type,after){
	var i=status_data.num_blocks;
	var block_html=get_dom("code_block_template").innerHTML;
	block_html=block_html.replaceAll('_block_id',i);
	block_html= block_html.replaceAll(/(\r\n|\n|\r|\t)/gm, "");

	var div = document.createElement('div');
  	div.innerHTML = block_html; 
  	div.setAttribute('id','block'+i);
  	if(after==undefined){
  		get_dom("main").appendChild(div);
  	}else{
  		get_dom("block"+after).after(div)
  	}

	
	waitForDom("input"+i).then(input_div => {
	
		editors[i] = new CodeMirror(function(node){input_div.appendChild(node);
		}, {
		  value: "",
		   tabSize: 4,
			     mode: 'javascript',
			     theme: 'default',
			     lineNumbers: true,
			     //styleActiveSelected: true,
			     //styleActiveLine: true,
			     indentWithTabs: true,
			     matchBrackets: true,
			     highlightMatches: true,
			     extraKeys: {
			          'Ctrl-Enter': (cm) => { run(i);},
			          'Cmd-Enter': (cm) => {run(i); },
			          'Shift-Enter': (cm) => {run(i); },
			          'Ctrl-Del': (cm) => {delete_cell(i); },
			          'Alt-Enter': (cm) => {insert_cell('code',i);}			     
			          }
		});

	});
	
	
	
	

	status_data.num_blocks=i+1;



}


load_nb=function(){
	insert_cell('code');
	
};

toggle_dark_mode=function(){
   if(document.body.getAttribute("data-theme")=='light')
   document.body.setAttribute("data-theme",'dark');
   else document.body.setAttribute("data-theme",'light');
}


download_nb=function(){
 	var nb=JSON.parse(JSON.stringify(blank_nb));
 	nb.metadata.name=get_dom("nb_name").innerHTML;
 	
 	var main=get_dom("main");
 	var blocks=main.childNodes;
 	console.log(blocks.length);
 	
 	blocks.forEach(x=>{
	 	var code=x.childNodes[1].childNodes[0].CodeMirror.getValue();
	 	var result=x.childNodes[2];
	 	console.log(result)
	 	var status=result.childNodes[0].innerHTML;
	 	var output=result.childNodes[1].innerHTML;
	 	nb.cells.push({code:code,status:status,output:output,type:"code"})
	 	
 	});
 	
 	downloadObjectAsJson(nb,nb.metadata.name+'.jsnb');	
}



