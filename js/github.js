

var get_file_sha=async function (token,user,repo,path){
  
  var url=`https://api.github.com/repos/${user}/${repo}/contents/${path}`;
  result=null;
  await fetch(url, {
      method: 'GET',
      headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'}
    }).then(response=>parse_response(response))
      .then(
		function(data){result=data['sha']}
	
     ).catch(error=>null);
  return result;
}

var get_file_content=async function (token,user,repo,path){
  
  var url=`https://api.github.com/repos/${user}/${repo}/contents/${path}`;
  result=null;
  await fetch(url, {
      method: 'GET',
      headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'}
    }).then(response=>parse_response(response))
      .then(
		function(data){result=atob(data['content'])}
	
     );
  return result;
}


var upload_file_to_git=async function (token, content,user,repo,path) {
	var url=`https://api.github.com/repos/${user}/${repo}/contents/${path}`
	file_sha=await get_file_sha(token,user,repo,path);
    var data = JSON.stringify({
        "message": "JSNB File Uploded to Git by User",
        "content": `${btoa(content)}`,
	    'sha':file_sha
    });
  await fetch(url, {
      method: 'PUT',
      headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'},
      body: data
    }).then(
		response=>parse_response(response)
  )
      .then(function(data){result=data;});
	return result;
        
}

var get_repos=async function (token,user) {
  var repos=[];
  if(user==null) {
	url=`https://api.github.com/user/repos`
  }
  else{
	url=`https://api.github.com/users/${user}/repos`;
  }
  await fetch(url, {
      method: 'GET',
      headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'}
    }).then(response=>parse_response(response))
      .then(
	
	function(data){
	  	
			data.forEach(function(x){
			  			repos.push(x['name'])
			});
		}
	
     );
  return repos;
        
}


var get_user=async function (token) {  
  await fetch(`https://api.github.com/user`, {
      method: 'GET',
      headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'}
    }).then(response=>parse_response(response))
      .then(
		function(data){login=data['login']}
	
     );
  return login;
}

update_owner= function(){
	var token = get_dom("token").value;
	get_user(token).then(x=>{
		get_dom("user").value=x;
		update_repos();
		});
	

}
update_repos=function(){
	var token = get_dom("token").value;
	var user=get_dom("user").value;
	
	get_repos(token,user).then(repos=>{
		var str='';
		repos.forEach(x=>{
			str += '<option value="'+x+'" />'; // Storing options in variable
		})
		get_dom('repos').innerHTML  =  str;
		
	});

}
load_from_git=function(){
	file_details['source']='github';
	file_details['token']=get_dom("token").value;
	file_details['user']=get_dom("user").value;
	file_details['repo']=get_dom("repo").value;
	file_details['path']=get_dom("path").value;
	get_file_content(file_details['token'],file_details['user'],file_details['repo'],file_details['path'])
	.then(
		nb=>{
			load_jsnb(nb);
			closeModal(get_dom('git-import-export'));
			const nextURL = `#github:${file_details['user']}/${file_details['repo']}/${file_details['path']}`;
			const nextTitle = 'JavaScript Notebook';
			const nextState = { additionalInformation: 'Updated the URL with JS' };
			window.history.pushState(nextState, nextTitle, nextURL);

			
		}
	)
	.catch(error=>alert("Error: "+error));
	
		
}

 initialize_from_git= async function(link){
	var i = link.indexOf('/');
	var user = link.slice(0,i); 
	var rest = link.slice(i+1);
	
	var i = rest.indexOf('/');
	var repo = rest.slice(0,i);
	var path = rest.slice(i+1);
	
	get_dom("user").value=user;
	get_dom("repo").value=repo;
	get_dom("path").value=path;
	
	
	url=`https://raw.githubusercontent.com/${user}/${repo}/main/${path}`;
	
	 try{
		 var response= await fetch(url, {method: 'GET'});
		 console.log(response);
		  var data=await parse_response(response);
		load_jsnb(data);
		
		
	}catch(error){
		console.log(error);
		openModal(get_dom('git-import-export'));
	}
			  
  
	
}
upload_to_git=function(){
	file_details['source']='github';
	file_details['token']=get_dom("token").value;
	file_details['user']=get_dom("user").value;
	file_details['repo']=get_dom("repo").value;
	file_details['path']=get_dom("path").value;
	
	//nb=get_nb();
	
	// Send a message object to the iframe
   	console.log("sending message get_nb,upload_to_git");
   	console.log("status",status);
      const message = {	
        action:"get_nb",
        data:"",
        call_bk:"upload_to_git"
      };
      
      sandbox.contentWindow.postMessage(message, '*');
      
     
	
}