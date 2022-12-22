
run=function(_block_id){
	console.log("Running cell ",_block_id)
	
	show =function(x){
		show_in_dom(x,"output"+_block_id)
	}
	curr_cell=function(){
		return get_dom("output"+_block_id);
	}
	console.log("hi ",get_dom("cell_type"+_block_id).checked)
	get_dom("status"+_block_id).innerHTML='[*]'
	get_dom("output"+_block_id).innerHTML=''
	
	code=editors[i].getValue()
	try{
		if(get_dom("cell_type"+_block_id).checked){
			get_dom("result"+_block_id).style.display = "block";
			eval(code)
			status_data.block_run+=1;
			
			get_dom("status"+_block_id).innerHTML='['+status_data.block_run+']'
		}
		else{
			get_dom("status"+_block_id).innerHTML='';
			get_dom("output"+_block_id).innerHTML=code;
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

