show_in_dom=function(output,...objs){
	for(var i=0;i<objs.length;i+=1){
		obj=objs[i];
		if (typeof(obj)=='object') 
		document.getElementById(output).innerHTML=document.getElementById(output).innerHTML+JSON.stringify(obj,undefined,2)+" ";
		else 
		document.getElementById(output).innerHTML=document.getElementById(output).innerHTML+String(obj)+" ";
	}
	if(objs.length>0) document.getElementById(output).innerHTML=document.getElementById(output).innerHTML+"<br>";
}

get_dom=id=>document.getElementById(id);

load_script = function(url){
	var script = document.createElement('script');
	script.src = url;
	document.head.appendChild(script);

}

reload_script = function(url){
	var script = document.createElement('script');
	if(url.includes('?')) url=url+'&' +(Math.random() + 1).toString(36).substring(7);
	else url=url+'?' +(Math.random() + 1).toString(36).substring(7);
	script.src = url;
	document.head.appendChild(script);

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
	  console.log(script.outerHTML);
}

function waitForDom(id) {
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


function insertAfter(el0, el1) {
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

blank_nb={
  "metadata" : {
     "name":"Starting JS Notebook Example",
    "language_info": {
        "name" : "JavaScipt",
        "version": "8.0"
    }
  },
  "jsnbversion":"v0.1",
  "cells" : [],
  "source":"https://github.com/gopi-suvanam/jsnb"
}


downloadObjectAsJson=function(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj,undefined,2));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName );
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
  
  downloadStringAsHTML=function(str, exportName){
    var dataStr = "data:text/html;charset=utf-8," + encodeURIComponent(str);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName );
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
  
  
  handleFiles=function() {
	  const fileList = this.files; /* now you can work with the file list */
	  let f = fileList[0];
    
    		let reader = new FileReader();
    		reader.onload = (function(theFile) {
        return function(e) {
	          load_jsnb( e.target.result );
	        };
	      })(f);
	
	      // Read in the image file as a data URL.
	      reader.readAsText(f);
	      

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
