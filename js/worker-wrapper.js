/**** Run In Other Processors **********/
/**** Currently supports WebWorkes 
      To add:
      		GPU
      		Cloud
      		Decentralized Distributed Computation
***/

const worker={};

worker.run= function(_block_id){
	
	/*var show =function(x){
		show_in_dom(x,"output"+_block_id)
	}*/
	curr_cell=function(){
		return get_dom("output"+_block_id);
	}
	get_dom("run-button"+_block_id).setAttribute("data-tooltip","Running the cell");
	get_dom("status"+_block_id).innerHTML='[*]'
	get_dom("output"+_block_id).innerHTML=''
	
	get_dom("run-button"+_block_id).innerHTML="&#8856;";
	
	const code=sandbox.editors[_block_id].getValue()
	
	setTimeout(async ()=>{
		try{
			if(get_dom("cell_type"+_block_id).value=='code'){
			
				get_dom("result"+_block_id).style.display = "flex";
				
				
				get_dom("status"+_block_id).style.display="inline";
				
				get_dom("output"+_block_id).style.display="inline";
				get_dom("input"+_block_id).style.display = "block";
				const start_time_eval = Date.now();
				
				show=(...args)=>show_in_dom(`output${_block_id}`,...args);
					
								
				opt=eval(code); // This is where the magic happens.
				if(opt!=undefined) show(opt);
				
	
				const end_time_eval = Date.now();
				var execution_time=end_time_eval - start_time_eval;
			
				sandbox.statusData.block_run+=1;
				execution_time=execution_time>1000?execution_time/1000.0+'s':execution_time+'ms';
				get_dom("status"+_block_id).innerHTML='['+sandbox.statusData.block_run+']<br><span style="font-size:8px">'+execution_time+'<span>';
	
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
		
		get_dom("run-button"+_block_id).setAttribute("data-tooltip","Finished running the cell");
		get_dom("run-button"+_block_id).innerHTML="&#9658";
		setTimeout(()=>{
			get_dom("run-button"+_block_id).setAttribute("data-tooltip","Run again");
			}
		, 5000);
	},10);
}







// Wrapper function to execute a function in the worker with dynamic parameters
worker.run_in=function(processor,func, ...parameters) {
  if(is_sandboxed()) show("May not work in sandbox");
  if(processor=="web-worker" || processor=="webworker" || processor=="ww"){
	return run_in_ww(func, ...parameters);
   }else{
   	return new Promise((resolve,reject)=>{resolve(func(...parameters))});
   }
}

// Function for running a function in a web-worker
// This will convert the function into string and send to the web-worker
worker.web_workers=[]
worker.run_in_ww=function(func, ...parameters) { 
  const web_worker = new Worker('js/web-worker.js');
  worker.web_workers.push(web_worker);
  functionString=func.toString();
  return new Promise((resolve, reject) => {
    web_worker.addEventListener('message', (e) => {
    	const response=e.data;
    	if(response.action=='result'){
    		web_worker.terminate();
        	resolve(response.data);
        }else if(response.action=='show'){
        	show(response.data);
        
        }
      
    });
    web_worker.addEventListener('error', (e) => {
	  console.log(e);
	  web_worker.terminate();
      reject(e.message);
    });

    web_worker.postMessage({ functionString, parameters });
  });
}

worker.terminateAllWebWorkers=function() {
  for (const web_worker of worker.web_workers) {
    web_worker.terminate();
  }
  worker.web_workers.length = 0; // Clear the array
}


/** Making worker immutable so that user generated scripts cannot change the functions **/

Object.freeze(worker);