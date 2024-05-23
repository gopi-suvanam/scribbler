//Web worker for running code in the web-worker

function webWorkerCode(){
	let scrib={};
	scrib.show=(data)=>{
		
		self.postMessage({'action':'show','data':data});
	};
	
	self.addEventListener('message', function(e) {
	  const { functionString, parameters,code } = e.data;
	  
	  try {
	    // Create a parameter list from the provided object
	    
	    // Use the Function constructor to create a function with dynamic parameter names
	    if(code==undefined){
		    eval('_myfunction='+functionString);
		    const result = _myfunction(...parameters);
		
		    // Send the result back to the main document
		    self.postMessage({'action':'result','data':result});
		}else{
			const result= eval(code);
		   	// Send the result back to the main document
		    self.postMessage({'action':'result','data':result});
		
		}
	  } catch (error) {
	    scrib.show("Error..."+error.message+functionString);
	    self.postMessage({ error: error.message });
	  }
	});
}
