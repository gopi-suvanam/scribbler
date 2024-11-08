

function getSecret(name){
	let secretStore=localStorage.getItem('secrets');
	if(secretStore){
		secrets=JSON.parse(secretStore);
		return secrets[name];
	}
}

function setSecret(name,value){
	let secretStore=localStorage.getItem('secrets');
	if(secretStore){
		secrets=JSON.parse(secretStore);
	}
	else secrets={};
	
	secrets[name]=value;
	localStorage.setItem('secrets', JSON.stringify(secrets));
	return true;

	
}


function deleteSecret(name){
	let secretStore=localStorage.getItem('secrets');
	if(secretStore){
		secrets=JSON.parse(secretStore);
		if(delete secrets[name])
		return localStorage.setItem('secrets', JSON.stringify(secrets));

	}
}


function getSecretNames(){
	let secretStore=localStorage.getItem('secrets');
	if(secretStore){
		secrets=JSON.parse(secretStore);
		return Object.keys(secrets);
	}else{
		return [];
	}
}

