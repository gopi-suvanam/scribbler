show_in_dom=function(x,output){
	document.getElementById(output).innerHTML=document.getElementById(output).innerHTML+String(x)
}

get_dom=id=>document.getElementById(id);


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
  "cells" : []
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
