/**** Run In Other Processors **********/

web_workers=[]


// Function to execute a function in the worker with dynamic parameters
run_in=function(processor,func, ...parameters) {
  if(is_sandboxed()) show("May not work in sandbox");
  if(processor=="web-worker" || processor=="webworker" || processor=="ww"){
	return run_in_ww(func, ...parameters);
   }else{
   	return new Promise((resolve,reject)=>{resolve(func(...parameters))});
   }
}

run_in_ww=function(func, ...parameters) { 
  const web_worker = new Worker('js/web-worker.js');
  web_workers.push(web_worker);
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

terminateAllWorkers=function() {
  for (const web_worker of web_workers) {
    web_worker.terminate();
  }
  web_workers.length = 0; // Clear the array
}