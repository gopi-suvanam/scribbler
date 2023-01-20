
run=function(_block_id){
	console.log("Running cell ",_block_id)
	
	/*var show =function(x){
		show_in_dom(x,"output"+_block_id)
	}*/
	curr_cell=function(){
		return get_dom("output"+_block_id);
	}
	console.log("hi ",get_dom("cell_type"+_block_id).checked)
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
			show_string=`show=x=>show_in_dom(x,"output"+${_block_id});`;
			Function(show_string+code)(); // This is where the magic happens.
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
		get_dom("output"+_block_id).innerHTML=get_dom("output"+_block_id).innerHTML+"<p class='error'>"+err.message+"</p>";
		get_dom("status"+_block_id).innerHTML='[-]'
	}
	console.log("Finished cell ",_block_id)
}

run_all=function(){
	var main=get_dom("main");
	blocks=main.childNodes;
	blocks.forEach(x=>{
		try{
			run(x.id.replace('block',""))
		}catch(err){
			console.log(err.stack)
		}
	});
	
	
}

