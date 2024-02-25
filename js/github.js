

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
  const response=await fetch(`https://api.github.com/user`, {
      method: 'GET',
      headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'}
    });
   const data = await parse_response(response);
   const login=data['login'];
   username=data['name']
   scrib.getDom("username").innerHTML=username;
  return login;
}

update_owner= function(){
	var token = scrib.getDom("token").value;
	get_user(token).then(x=>{
		const today = new Date(); // Get the current date
		const thirtyDaysLater = new Date(today); // Create a new date object as a copy of today
		thirtyDaysLater.setDate(today.getDate() + 30); 
		localStorage.setItem("gh-token",token);
		scrib.getDom("user").value=x;
		update_repos();
		});
	

}
update_repos=function(){
	var token = scrib.getDom("token").value;
	var user=scrib.getDom("user").value;
	
	get_repos(token,user).then(repos=>{
		var str='';
		repos.forEach(x=>{
			str += '<option value="'+x+'" />'; // Storing options in variable
		})
		scrib.getDom('repos').innerHTML  =  str;
		
	});

}
load_from_git=function(){
	fileDetails['source']='github';
	fileDetails['token']=scrib.getDom("token").value;
	fileDetails['user']=scrib.getDom("user").value;
	fileDetails['repo']=scrib.getDom("repo").value;
	fileDetails['path']=scrib.getDom("path").value;
	get_file_content(fileDetails['token'],fileDetails['user'],fileDetails['repo'],fileDetails['path'])
	.then(
		nb=>{
			load_jsnb(nb);
			closeModal(scrib.getDom('git-import-export'));
			const nextURL = `#github:${fileDetails['user']}/${fileDetails['repo']}/${fileDetails['path']}`;
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
	
	scrib.getDom("user").value=user;
	scrib.getDom("repo").value=repo;
	scrib.getDom("path").value=path;
	
	
	url=`https://raw.githubusercontent.com/${user}/${repo}/main/${path}`;
	
	 try{
		 var response= await fetch(url, {method: 'GET'});
		 console.log(response);
		  var data=await parse_response(response);
		load_jsnb(data);
		
		
	}catch(error){
		console.log(error);
		openModal(scrib.getDom('git-import-export'));
	}
			  
  
	
}
upload_to_git=async function(){
	fileDetails['source']='github';
	fileDetails['token']=scrib.getDom("token").value;
	fileDetails['user']=scrib.getDom("user").value;
	fileDetails['repo']=scrib.getDom("repo").value;
	fileDetails['path']=scrib.getDom("path").value;
	
	
	// Send a message object to the iframe
   	let nb=await get_nb();
      	
	const content=JSON.stringify(nb,undefined,2);
	try{
		const upload_status= await upload_file_to_git(fileDetails['token'],content,fileDetails['user'],fileDetails['repo'],fileDetails['path']);
		alert("Successfully pushed");
		closeModal(scrib.getDom('git-import-export'));
		const nextURL = `#github:${fileDetails['user']}/${fileDetails['repo']}/${fileDetails['path']}`;
		const nextTitle = 'JavaScript Notebook';
		const nextState = { additionalInformation: 'Updated the URL with JS' };
		window.history.pushState(nextState, nextTitle, nextURL);
	}catch(error){
	
		alert("Error: "+error)
	} 
	
}

initialize_git=function(){
    const token = localStorage.getItem("gh-token");


    if(token==null) return;
     scrib.getDom("token").value =token;
     update_owner();
     
}