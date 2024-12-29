

function getSecret(name){
	let secretStore=localStorage.getItem('secrets');
	if(secretStore){
		const secrets=JSON.parse(secretStore);
		return secrets[name];
	}
}

function setSecret(name,value){
	let secretStore=localStorage.getItem('secrets');
	let secrets={};
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
		const secrets=JSON.parse(secretStore);
		if(delete secrets[name])
		return localStorage.setItem('secrets', JSON.stringify(secrets));

	}
}


function getSecretNames(){
	let secretStore=localStorage.getItem('secrets');
	if(secretStore){
		const secrets=JSON.parse(secretStore);
		return Object.keys(secrets);
	}else{
		return [];
	}
}



function getAPIKey(service){
	let secretStoresecretStore=localStorage.getItem('api-keys');
	if(secretStore){
		const keys=JSON.parse(secretStore);
		return keys[service];
	}
}

function setAPIKey(service,key){
	let secretStore=localStorage.getItem('api-keys');
	let secrets={};
	if(secretStore){
		secrets=JSON.parse(secretStore);
	}
	else secrets={};
	
	secrets[service]=key;
	localStorage.setItem('api-keys', JSON.stringify(secrets));
	return true;

}