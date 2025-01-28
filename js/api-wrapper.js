APIWrapper={};
APIWrapper.call = async function(source,key,params){
	if(source==='google-ai-studio'){
		if(typeof(key)=='undefined') throw("Couldn't find the API key");
		const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${key}`;
		const data = {
		  "contents": [
			{
			  "parts": [
				{
				  "text": params.prompt
				}
			  ]
			}
		  ]
		};
		const response = await fetch(url, {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify(data)
		});

		const result= await response.json();
		if("error" in result) return result.error.message;	
		else return result.candidates[0].content.parts.map(part=>part.text).join("\n");	
	}
	if(source=='OpenVino'){
		const url = `http://localhost:5000/generate?prompt=${params.prompt}`;
		const response = await fetch(url);
		const result= await response.json();
		if("error" in result) throw "No reponse";
		else return result[0]['generated_text'];
				
	}
	throw("API not implemented");
}