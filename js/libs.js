if(window){
	window.MAX_LENGTH_TO_SHOW=10000;
	window.TIMEOUT_FOR_BLOCKING_CALLS=5000;
}else{
	MAX_LENGTH_TO_SHOW=10000;
	TIMEOUT_FOR_BLOCKING_CALLS=5000;
}

show_in_dom=function(output,...objs){
	var to_show='';
	for(var i=0;i<objs.length;i+=1){
		obj=objs[i];
		if (typeof(obj)=='object') to_show+=JSON.stringify(obj,undefined,2)+" ";
		
		else to_show+=String(obj)+" ";
	}
	if (to_show.length<MAX_LENGTH_TO_SHOW)
		document.getElementById(output).innerHTML=document.getElementById(output).innerHTML+to_show;
	else
		document.getElementById(output).innerHTML=document.getElementById(output).innerHTML+"<p class='error'>Object too large to show.</p>";;

	if(to_show.length>0) document.getElementById(output).innerHTML=document.getElementById(output).innerHTML+"<br>";
}

get_dom=id=>document.getElementById(id);

load_script = function(url,async){

	if(async==undefined) async=true;
	if(async){
		if(document.head){
			return new Promise((resolve, reject) => {
			      const script = document.createElement('script');
			      script.src = url;
			      script.async = true;
			
			      script.onload = () => {
			        // The script was successfully loaded
			        resolve();
			      };
			
			      script.onerror = () => {
			        // An error occurred while loading the script
			        reject(new Error(`Failed to load script from ${url}. Check logs.`));
			      };
			
			      document.head.appendChild(script);
			    });
		 }else{
		 	throw("Asynchronous mode works only in the browser.")
		 }
	}else{
		
		  var xhr = new XMLHttpRequest();
		  xhr.open('GET', url, false); // Set the third parameter to false for synchronous request
		  xhr.send();
		
		  if (xhr.status === 200) {
		    return eval(xhr.responseText);
		   
		  } else {
		    throw('Error fetching script. Status:'+xhr.status);
		  }
	}

}

reload_script = function(url,async){
	if(url.includes('?')) url=url+'&' +(Math.random() + 1).toString(36).substring(7);
	else url=url+'?' +(Math.random() + 1).toString(36).substring(7);
	return load_script(url,async);

}


import_module=function(module,features){
	var script = document.createElement('script');
	script.type="module";
	if(features==null) import(module);
	else {
		script.innerHTML = `import {${Object.keys(features).join(',')}} from "${module}";`; 
		Object.keys(features).forEach(x=>{
			script.innerHTML+=`window['${features[x]}']=${x};` 
		})
		
	}

	document.head.appendChild(script);
	
	script.onerror = () => {
	      console.error("Failed to load module script with URL " + url);

	  };
}

function wait_for_dom(id) {
    return new Promise(resolve => {
	        if (get_dom(id)) {
	            return resolve(get_dom(id));
	        }

        const observer = new MutationObserver(mutations => {
            if (get_dom(id)) {
                resolve(get_dom(id));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}


function insert_after(el0, el1) {
   try{
    	el0.after(el1)
    }catch(err){
    	try{
    		console.log(err.message)
    		el0.parentNode.insertBefore(el1, el0.nextSibling);
    	}catch(err){
    		console.log(err.message)
    		el0.parentNode.appendChild(el1)
    	}
    	
    }
}




  
  download_string=function(str, exportName,char_set){
    
	const blob = new Blob([str], { type: "text/plain" });
	
	const downloadAnchorNode = document.createElement("a");
	downloadAnchorNode.href = URL.createObjectURL(blob);


    downloadAnchorNode.setAttribute("download", exportName );
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
  
  

	
read_file=function(url,callbk,failure){
	  var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() {
		  if (this.readyState == 4 && this.status == 200) {
			 callbk(xhttp.responseText);
		  }
		else{
		  
		}
	  };
	  xhttp.open("GET", url, true);
	  try{
	  	xhttp.send();
	  }catch(err){
	  	failure(err)
	  };
 }

is_sandboxed=function(){
	if(document.domain=='') return true;
	if(document.domain==undefined) return true;
	if(document.domain==null) return true;
	if(document.domain.length==0) return true;
	return false;
}

load_file= async function(){
     
	  const file_loader=document.createElement('input');
	  file_id= (Math.random() + 1).toString(36).substring(7);
	  file_loader.id= file_id;
	  file_loader.type="file";
	  file_loader.style.display='none';
	  document.body.appendChild(file_loader);

	await wait_for_dom(file_id);

	x= await new Promise(resolve => {
	 get_dom(file_id).addEventListener("change",event => {

	 const fr = new FileReader();


			 fr.onload=async function(event){
			   		content=event.target.result;
			   		get_dom(file_id).remove();
			   		resolve(content);

			 };

	   fr.readAsText( get_dom(file_id).files[0]);



	  });


		 get_dom(file_id).click();
	});
  return(x);
 
}


var parse_response=async response => {
        const isJson = response.headers.get('content-type')?.includes('application/json');
        const data = isJson ? await response.json() : await response.text();
        // check for error response
        if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
        }

        return data;
    }

/**** Cookie handling ******/ 
function set_cookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + "; " + expires + "; path=/";
}
function get_cookie(name) {
  const cookies = document.cookie.split('; ');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].split('=');
    if (cookie[0] === name) {
      return cookie[1];
    }
  }
  return null; // Cookie not found
}

/**** Run In Other Processors **********/
// Function to execute a function in the worker with dynamic parameters
run_in=function(processor,func, ...parameters) {
  if(is_sandboxed()) show("May not work in sandbox");
  if(processor=="web-worker" || processor=="webworker" || processor=="ww"){
	  const web_worker = new Worker('js/web-worker.js');
          functionString=func.toString();
	  return new Promise((resolve, reject) => {
	    web_worker.addEventListener('message', (e) => {
	        console.log(e);
	        resolve(e.data);
	      
	    });
	    web_worker.addEventListener('error', (e) => {
		  console.log(e);
	      reject(e.message);
	    });
	
	    web_worker.postMessage({ functionString, parameters });
	  });
   }else{
   	return new Promise((resolve,reject)=>{resolve(func(...parameters))});
   }
}


