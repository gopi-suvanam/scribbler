/**** Run In Other Processors **********/
/**** Currently supports WebWorkes 
      To add:
      		GPU
      		Cloud
      		Decentralized Distributed Computation
***/

const worker={};

worker.processHTML = function(code){
	if (code.includes("<style>")) 
		return code;
	const markdownPrompt = /^\/\/>\s*md/i;
	const isMarkDown=true;//markdownPrompt.test(code);
	if (isMarkDown){
		const updatedCode = marked.parse(code.replace(markdownPrompt,""));
		return marked.parse(updatedCode);
	}
	return code;
}
worker.type='browser';

worker.webworker=null;

worker.addWebWorker= ()=>{
	if(worker.webworker==undefined){
		  const workerScript="("+String(webWorkerCode)+")()";
		  const workerBlob = new Blob([workerScript], { type: 'application/javascript' });
		  const workerScriptUrl = URL.createObjectURL(workerBlob);
		  var web_worker = new Worker(workerScriptUrl);
		  worker.webworker=web_worker;
		}

}
worker.evaluate= async function(code){

	const htmlPrompt = /^\/\/>\s*html/i;
	if( htmlPrompt.test(code))
	{
		 const updatedCode = code.replace(htmlPrompt, "");
	     return updatedCode;
	}
	const modulePrompt = /^\/\/>\s*module/i;
	if( modulePrompt.test(code))
	{
		 const updatedCode = code.replace(modulePrompt, "");
	     const script = document.createElement("script");
		script.type = "module";
		script.textContent = code;  // Insert your code as the content
		document.body.appendChild(script);
		return '';
	}	
	const cssPrompt = /^\/\/>\s*css/i;
	if( cssPrompt.test(code))
	{
		 const updatedCode = code.replace(cssPrompt, "");
	     return "<style>"+updatedCode+"</style>";
	}
	
	const markdownPrompt = /^\/\/>\s*md/i;
	if( markdownPrompt.test(code))
	{
		 const inputBlock=scrib.currBlock;
		 sandbox.markdownToCells(code.replace(markdownPrompt,""));
		 scrib.getDom("input"+inputBlock).childNodes[0].CodeMirror.setValue('')
		 return '';
	     //return updatedCode;
	}
	
	const aiPrompt = /^\/\/>/i;
	if( aiPrompt.test(code)){
		 const aiReponse = await sandboxAI.query(code.replace(aiPrompt,""));
		 
		 const inputBlock=scrib.currBlock;
		 sandbox.markdownToCells(aiReponse.finalReply);
		 
		 scrib.getDom("input"+inputBlock).childNodes[0].CodeMirror.setValue('')
		 
		 //scrib.getDom("input"+inputBlock).childNodes[0].CodeMirror.setValue('')
		 
	     return '';//marked.parse(aiReponse.finalReply);
		 //return;
	}
	
	if(worker.type==='browser')
		

		try {
		
			return (0,eval)(code);
		}
		catch(err){
			
			
			if (/await is only valid in async/.test(err.message)){
				const asyncCode =  (0,eval)(' (async function() {' + code + '\n})');
				return await asyncCode();
				//return(0,eval)('(async () => {'+code+'})();')
			}else{
	
				throw err;
			}
			
		}
	if(worker.type==='webworker'){
		
		if(worker.webworker==undefined) worker.addWebWorker();
		return new Promise((resolve, reject) => {
		    worker.webworker.addEventListener('message', (e) => {
		    	const response=e.data;
		    	if(response.action=='result'){f
		    		
		        	resolve(response.data);
		        }else if(response.action=='show'){
		        	scrib.show(response.data);
		        
		        }
		      
		    });
		    worker.webworker.addEventListener('error', (e) => {
			  console.log(e);
		      reject(e.message);
		    });
		    
		    worker.webworker.postMessage({ code });
		  });

	
	}
	
	
}
worker.run= async function(_block_id){
	
	/*var show =function(x){
		show_in_dom(x,"output"+_block_id)
	}*/
	scrib.currCell=function(){
		return scrib.getDom("output"+_block_id);
	}
	
	scrib.currBlock=_block_id;
	
	scrib.getDom("run-button"+_block_id).setAttribute("data-tooltip","Running the cell");
	scrib.getDom("status"+_block_id).innerHTML='[*]'
	scrib.getDom("output"+_block_id).innerHTML=''
	
	scrib.getDom("run-button"+_block_id).innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`;
	
	const code=sandbox.editors[_block_id].getValue()
	

		try{
			if(scrib.getDom("cell_type"+_block_id).value=='code'){
			
				if (sandbox.statusData.running_embedded){
					scrib.getDom("result"+_block_id).style.display = "flex";
					
					
					scrib.getDom("status"+_block_id).style.display="none";
					
					scrib.getDom("input"+_block_id).style.display = "none";
			  	}else{
	
					scrib.getDom("result"+_block_id).style.display = "flex";
					
					
					scrib.getDom("status"+_block_id).style.display="inline";
					
					scrib.getDom("output"+_block_id).style.display="inline";
					scrib.getDom("input"+_block_id).style.display = "block";
				}
				
				const start_time_eval = Date.now();
				
				scrib.show=(...args)=>scrib.showInDom(`output${_block_id}`,...args);
					
				show=(...args)=>{
					scrib.show("<span style='color:orange'>Warning! show() is being deprecated. Use scrib.show().</span>");
					scrib.show(...args);
				}		
				opt=await worker.evaluate(code); // This is where the magic happens.
				if(opt!=undefined) scrib.show(opt);
				
	
				const end_time_eval = Date.now();
				let execution_time=end_time_eval - start_time_eval;
			
				sandbox.statusData.block_run+=1;
				execution_time=execution_time>1000?execution_time/1000.0+'s':execution_time+'ms';
				scrib.getDom("status"+_block_id).innerHTML='['+sandbox.statusData.block_run+']<br><span style="font-size:8px">'+execution_time+'<span>';
				if(scrib.getDom("output"+_block_id).innerHTML.length==0 && sandbox.statusData.running_embedded)
					scrib.getDom("result"+_block_id).style.display='none';
				;
			}
			else{
				scrib.getDom("status"+_block_id).innerHTML='';
				
				scrib.getDom("output"+_block_id).innerHTML=worker.processHTML(code);;
				scrib.getDom("status"+_block_id).style.display="none";
				scrib.getDom("input"+_block_id).style.display = "none";
				scrib.getDom("cell_menu"+_block_id).style.display = "none";
				scrib.getDom("result"+_block_id).style.display = "flex";
			}
		}catch(err){
			console.log(err.stack)
			scrib.getDom("result"+_block_id).style.display = "flex";
			if(typeof(err)=='string') 
			scrib.getDom("output"+_block_id).innerHTML=scrib.getDom("output"+_block_id).innerHTML+"<p class='error'>"+err+"</p>";
			else
			scrib.getDom("output"+_block_id).innerHTML=scrib.getDom("output"+_block_id).innerHTML+"<p class='error'>"+err.message+"</p>";
			scrib.getDom("status"+_block_id).innerHTML='[-]'
		}
		
		scrib.getDom("run-button"+_block_id).setAttribute("data-tooltip","Finished running the cell");
		scrib.getDom("run-button"+_block_id).innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
		setTimeout(()=>{
			scrib.getDom("run-button"+_block_id).setAttribute("data-tooltip","Run again");
			}
		, 5000);

}

// Wrapper function to execute a function in the worker with dynamic parameters
worker.run_in=function(processor,func, ...parameters) {
  if(scrib.isSandboxed()) scrib.show("May not work in sandbox");
  if(processor=="web-worker" || processor=="webworker" || processor=="ww"){
	return worker.runInWW(func, ...parameters);
   }else{
   	return new Promise((resolve,reject)=>{resolve(func(...parameters))});
   }
}

// Function for running a function in a web-worker
// This will convert the function into string and send to the web-worker
worker.web_workers=[]
worker.runInWW=function(func, ...parameters) { 
  const workerScript="("+String(webWorkerCode)+")()";
  const workerBlob = new Blob([workerScript], { type: 'application/javascript' });
  const workerScriptUrl = URL.createObjectURL(workerBlob);
  const web_worker = new Worker(workerScriptUrl);

  //const web_worker = new Worker('js/web-worker.js');
  worker.web_workers.push(web_worker);
  functionString=func.toString();
  return new Promise((resolve, reject) => {
    web_worker.addEventListener('message', (e) => {
    	const response=e.data;
    	if(response.action=='result'){
    		web_worker.terminate();
        	resolve(response.data);
        }else if(response.action=='show'){
        	scrib.show(response.data);
        
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

//Object.freeze(worker);