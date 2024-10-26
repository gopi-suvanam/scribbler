

var get_file_sha=async function (token,user,repo,path){
  
  var url=`https://api.github.com/repos/${user}/${repo}/contents/${path}`;
  let result=null;
  const response = await fetch(url, {
      method: 'GET',
      headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'}
    });
   const data=await parse_response(response);

  return data['sha'];
}

var get_file_content=async function (token,user,repo,path){
  
  var url=`https://api.github.com/repos/${user}/${repo}/contents/${path}`;
  const response = await fetch(url, {
      method: 'GET',
      headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'}
    });
    const data=await parse_response(response);
   const result=atob(data['content']);
	
  return result;
}


var upload_file_to_git=async function (token, content,user,repo,path) {
	var url=`https://api.github.com/repos/${user}/${repo}/contents/${path}`
	let file_sha = null;

	  // Try to get the file SHA
	  try {
	    file_sha = await get_file_sha(token, user, repo, path);
	  } catch (error) {
	    console.log("File does not exist. Uploading a new file.");
	  }
	  
	    var data = JSON.stringify({
	        "message": "JSNB File Uploded to Git by User",
	        "content": `${btoa(content)}`,
		    'sha':file_sha
	    });
  const response =await fetch(url, {
      method: 'PUT',
      headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'},
      body: data
    });
    const result=await parse_response(response);
	return result;
        
}

var get_repos=async function (token,user) {
  const repos=[];
  if(user==null) {
	url=`https://api.github.com/user/repos`
  }
  else{
	url=`https://api.github.com/users/${user}/repos`;
  }
  const response = await fetch(url, {
      method: 'GET',
      headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'}
    });
  const data = await parse_response(response);
 
  data.forEach(x=>{
  	repos.push(x['name'])
  });
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
   scrib.getDom("username").innerHTML=data['name'];
   return login;
}

update_owner= async function(){
	const token = scrib.getDom("token").value;
	const user = await get_user(token);
	const today = new Date(); // Get the current date
	const thirtyDaysLater = new Date(today); // Create a new date object as a copy of today
	thirtyDaysLater.setDate(today.getDate() + 30); 
	localStorage.setItem("gh-token",token);
	scrib.getDom("user").value=user;
	update_repos();
}
update_repos=async function(){
	const token = scrib.getDom("token").value;
	const user=scrib.getDom("user").value;
	
	const repos=await get_repos(token,user);
	let str='';
	repos.forEach(x=>{
		str += '<option value="'+x+'" />'; // Storing options in variable
	})
	scrib.getDom('repos').innerHTML  =  str;
		

}
load_from_git=async function(){
	fileDetails['source']='github';
	fileDetails['token']=scrib.getDom("token").value;
	fileDetails['user']=scrib.getDom("user").value;
	fileDetails['repo']=scrib.getDom("repo").value;
	fileDetails['path']=scrib.getDom("path").value;
	const nb =await get_file_content(fileDetails['token'],fileDetails['user'],fileDetails['repo'],fileDetails['path']);
	load_jsnb(nb);
	closeModal(scrib.getDom('git-import-export'));
	const nextURL = `./?jsnb=github:${fileDetails['user']}/${fileDetails['repo']}/${fileDetails['path']}`;
	const nextTitle = 'JavaScript Notebook';
	const nextState = { additionalInformation: 'Updated the URL with JS' };
	window.history.pushState(nextState, nextTitle, nextURL);

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
	
	
	url=`https://raw.githubusercontent.com/${user}/${repo}/HEAD/${path}`;
	
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
		const nextURL = `./?jsnb=github:${fileDetails['user']}/${fileDetails['repo']}/${fileDetails['path']}`;
		const nextTitle = 'JavaScript Notebook';
		const nextState = { additionalInformation: 'Updated the URL with JS' };
		window.history.pushState(nextState, nextTitle, nextURL);
	}catch(error){
	
		alert("Error: "+error)
	} 
	
}

initialize_git=async function(){
    const token = localStorage.getItem("gh-token");


    if(token==null) return;
     scrib.getDom("token").value =token;
     update_owner();
     
}
