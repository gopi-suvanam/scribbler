if(typeof(scrib)=='undefined') var scrib={};
scrib.MAX_LENGTH_TO_SHOW=10000;
scrib.TIMEOUT_FOR_BLOCKING_CALLS=5000;
	


scrib.isInIFrame = function() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

scrib.getSecret=function(name){
	if(scrib.isSandboxed()) throw("The code is sandboxed. Please take it out of sandbox");
	
	
	let secretStore=localStorage.getItem('secrets');
	if(secretStore){
		secretStore=JSON.parse(secretStore);
		return secretStore[name];
	}
	

}

scrib.inputText = function() {
  return new Promise((resolve) => {
    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        resolve(inputElement.value);
        inputElement.setAttribute('readonly', true); // make it uneditable
      }
    });
    scrib.currCell().appendChild(inputElement);
    inputElement.focus();
  });
};


scrib.error=message=>{
	scrib.show("<p class='red'>"+message+"</p>");
}

scrib.showInDom=function(output,...objs){
	var to_show='';
	for(var i=0;i<objs.length;i+=1){
		obj=objs[i];
		if (typeof(obj)=='object') to_show+=JSON.stringify(obj,undefined,2)+" ";
		
		else to_show+=String(obj)+" ";
	}
	if (to_show.length<scrib.MAX_LENGTH_TO_SHOW)
		document.getElementById(output).innerHTML=document.getElementById(output).innerHTML+to_show;
	else
		document.getElementById(output).innerHTML=document.getElementById(output).innerHTML+"<p class='error'>Object too large to show.</p>";;

	if(to_show.length>0) document.getElementById(output).innerHTML=document.getElementById(output).innerHTML+"<br>";
}

scrib.getDom=x=>document.getElementById(x);
scrib.getDom = x=>document.getElementById(x);


scrib.loadScript = function(url,async){

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

load_script=(...args)=>{
	scrib.show("<span style='color:orange'>Warning! load_script() is being deprecated. Use scrib.loadScript().</span>");
	scrib.loadScript(...args);
}	



scrib.reloadScript = function(url,async){
	if(url.includes('?')) url=url+'&' +(Math.random() + 1).toString(36).substring(7);
	else url=url+'?' +(Math.random() + 1).toString(36).substring(7);
	return scrib.loadScript(url,async);

}




scrib.waitForDom=function(id) {
    return new Promise(resolve => {
	        if (scrib.getDom(id)) {
	            return resolve(scrib.getDom(id));
	        }

        const observer = new MutationObserver(mutations => {
            if (scrib.getDom(id)) {
                resolve(scrib.getDom(id));
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




  
scrib.downloadString=function(str, exportName,char_set){
    
	const blob = new Blob([str], { type: "text/plain" });
	
	const downloadAnchorNode = document.createElement("a");
	downloadAnchorNode.href = URL.createObjectURL(blob);


    downloadAnchorNode.setAttribute("download", exportName );
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
  
  

	
scrib.readFile=async function(url,callbk,failure){

  	 const reponse=await fetch(url);	
  	 const result=await reponse.text();
  	 return result;
	  
 }

scrib.isSandboxed=function(){
	if(document.domain=='') return true;
	if(document.domain==undefined) return true;
	if(document.domain==null) return true;
	if(document.domain.length==0) return true;
	return false;
}

scrib.uploadFile= async function(type){
     
	  const file_loader=document.createElement('input');
	  file_id= (Math.random() + 1).toString(36).substring(7);
	  file_loader.id= file_id;
	  file_loader.type="file";
	  file_loader.style.display='none';
	  document.body.appendChild(file_loader);

	await scrib.waitForDom(file_id);

	x= await new Promise(resolve => {
	 scrib.getDom(file_id).addEventListener("change",event => {

	 const fr = new FileReader();


			 fr.onload=async function(event){
			   		content=event.target.result;
			   		scrib.getDom(file_id).remove();
			   		resolve(content);

			 };
	
	    if(type=='text' || type==undefined || type==null)
	   fr.readAsText( scrib.getDom(file_id).files[0]);
	   else if(type='buffer')
	   fr.readAsArrayBuffer( scrib.getDom(file_id).files[0]);



	  });


		 scrib.getDom(file_id).click();
	});
  return(x);
 
}
load_file=scrib.uploadFile;

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


scrib.copyText=(textId)=>{
    // Get the text to be copied
    var text = document.getElementById(textId).innerText;

    // Create a temporary textarea element
    var textarea = document.createElement("textarea");

    // Set the value of the textarea to the text to be copied
    textarea.value = text;

    // Append the textarea to the document body
    document.body.appendChild(textarea);

    // Select the text inside the textarea
    textarea.select();

    // Copy the selected text to the clipboard
    document.execCommand("copy");

    // Remove the temporary textarea
    document.body.removeChild(textarea);

}


