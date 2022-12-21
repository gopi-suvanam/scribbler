
run=function(i){
	console.log("Running cell ",i)
	
	show =function(x){
		show_in_dom(x,"output"+i)
	}
	console.log("hi ",get_dom("cell_type"+i).checked)
	get_dom("status"+i).innerHTML='[*]'
	get_dom("output"+i).innerHTML=''
	
	code=editors[i].getValue()
	try{
		if(get_dom("cell_type"+i).checked){
			get_dom("result"+i).style.display = "block";
			eval(code)
			status_data.block_run+=1;
			
			get_dom("status"+i).innerHTML='['+status_data.block_run+']'
		}
		else{
			get_dom("status"+i).innerHTML='';
			get_dom("output"+i).innerHTML=code;
			get_dom("input"+i).style.display = "none";
			get_dom("cell_menu"+i).style.display = "none";
			get_dom("result"+i).style.display = "block";
		}
	}catch(err){
		get_dom("result"+i).style.display = "block";
		get_dom("output"+i).innerHTML=get_dom("output"+i).innerHTML+"<p class='error'>"+err.message+"</p>";
		get_dom("status"+i).innerHTML='[-]'
	}
	console.log("Finished cell ",i)
}

