
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
		
			get_dom("result"+_block_id).style.display = "flex";
			
			
			get_dom("status"+_block_id).style.display="inline";
			
			get_dom("output"+_block_id).style.display="inline";
			get_dom("input"+_block_id).style.display = "block";
			const start_time_eval = Date.now();
			(async () => {
				
				
			
				show=(...args)=>show_in_dom(`output${_block_id}`,...args);
								
				opt=eval(code); // This is where the magic happens.
				if(opt!=undefined) show(opt);
					
			
				
			})()
			.then(()=>{
				const end_time_eval = Date.now();
				var execution_time=end_time_eval - start_time_eval;
			
				status_data.block_run+=1;
				execution_time=execution_time>1000?execution_time/1000.0+'s':execution_time+'ms';
				get_dom("status"+_block_id).innerHTML='['+status_data.block_run+']<br><span style="font-size:8px">'+execution_time+'<span>';
			});
		}
		else{
			get_dom("status"+_block_id).innerHTML='';
			
			get_dom("output"+_block_id).innerHTML=code;
			get_dom("status"+_block_id).style.display="none";
			get_dom("input"+_block_id).style.display = "none";
			get_dom("cell_menu"+_block_id).style.display = "none";
			get_dom("result"+_block_id).style.display = "flex";
		}
	}catch(err){
		console.log(err.stack)
		get_dom("result"+_block_id).style.display = "flex";
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

