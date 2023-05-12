
run=function(_block_id){
	
	/*var show =function(x){
		show_in_dom(x,"output"+_block_id)
	}*/
	curr_cell=function(){
		return get_dom("output"+_block_id);
	}
	get_dom("status"+_block_id).innerHTML='[*]'
	get_dom("output"+_block_id).innerHTML=''
	
	code=editors[_block_id].getValue()
	try{
		if(get_dom("cell_type"+_block_id).checked){
		
			get_dom("result"+_block_id).style.display = "block";
			
			
			get_dom("status"+_block_id).style.display="block";
			
			get_dom("output"+_block_id).style.display="block";
			get_dom("input"+_block_id).style.display = "block";
			const start_time_eval = Date.now();
			show=(...args)=>show_in_dom(`output${_block_id}`,...args);
			opt=eval(code); // This is where the magic happens.
			try{
				//This is for displaying the last line by default.
				//The line will be displayed only if it does not have an assignment or a function call.
				//These are excluded to avoid side-effects.
				/*var last_line=code.trim().split(/\r?\n/).pop().replace(/;$/,"").split(";").pop();
				if(!last_line.replace("===","").replace("==","").includes("=") && !last_line.includes("("))
					eval(`show(${last_line})`);
				*/
				
				//We will use the output of eval to display in stead.. we will use the above code in case we ditch eval in some future time.
				if(opt!=undefined) show(opt);
				
			}catch(err){
				console.log(err)
			}
			const end_time_eval = Date.now();
			var execution_time=end_time_eval - start_time_eval;
			
			status_data.block_run+=1;
			execution_time=execution_time>1000?execution_time/1000.0+'s':execution_time+'ms'
			get_dom("status"+_block_id).innerHTML='['+status_data.block_run+']<br><span style="font-size:8px">'+execution_time+'<span>'
		}
		else{
			get_dom("status"+_block_id).innerHTML='';
			
			get_dom("output"+_block_id).innerHTML=code;
			get_dom("status"+_block_id).style.display="none";
			get_dom("input"+_block_id).style.display = "none";
			get_dom("cell_menu"+_block_id).style.display = "none";
			get_dom("result"+_block_id).style.display = "block";
		}
	}catch(err){
		console.log(err.stack)
		get_dom("result"+_block_id).style.display = "block";
		if(typeof(err)=='string') 
		get_dom("output"+_block_id).innerHTML=get_dom("output"+_block_id).innerHTML+"<p class='error'>"+err+"</p>";
		else
		get_dom("output"+_block_id).innerHTML=get_dom("output"+_block_id).innerHTML+"<p class='error'>"+err.message+"</p>";
		get_dom("status"+_block_id).innerHTML='[-]'
	}
}

run_all=function(){
	var main=get_dom("main");
	blocks=main.childNodes;
	blocks.forEach(x=>{
		console.log("running",x.id);
		try{
			run(x.id.replace('block',""))
		}catch(err){
			console.log(err.stack)
		}
	});
	
	
}

