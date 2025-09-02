APIWrapper={};

// API Provider Configurations
APIWrapper.providers = {
	'google-ai-studio': {
		url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
		model: 'gemini-1.5-flash-latest',
		authType: 'query', // API key in query parameter
		requestFormat: 'google',
		responseFormat: 'google'
	},
	'openai': {
		url: 'https://api.openai.com/v1/chat/completions',
		model: 'gpt-3.5-turbo',
		authType: 'bearer',
		requestFormat: 'openai',
		responseFormat: 'openai'
	},
	'groq': {
		url: 'https://api.groq.com/openai/v1/chat/completions',
		model: 'llama-3.3-70b-versatile',
		authType: 'bearer',
		requestFormat: 'openai',
		responseFormat: 'openai'
	},
	
};

// Request formatters
APIWrapper.formatRequest = {
	google: (prompt, config) => ({
		contents: [{
			parts: [{ text: prompt }]
		}]
	}),
	openai: (prompt, config) => ({
		model: config.model,
		messages: [{
			role: "user",
			content: prompt
		}],
		max_tokens: 2000,
		temperature: 0.7
	})
};

// Response parsers
APIWrapper.parseResponse = {
	google: (result) => {
		if("error" in result) return result.error.message;
		return result.candidates[0].content.parts.map(part=>part.text).join("\n");
	},
	openai: (result) => {
		if("error" in result) return result.error.message;
		return result.choices[0].message.content;
	}
};

APIWrapper.call = async function(source, key, params) {
	// Handle special cases (non-standard APIs)
	if(source === 'OpenVino') {
		const url = 'http://localhost:5000/generate';
		const response = await fetch(url, {
		    method: 'POST',
		    headers: { 'Content-Type': 'application/json' },
		    body: JSON.stringify(params)
		});
		const result = await response.json();
		if("error" in result) throw "No response";
		return result[0]['generated_text'];
	}
	
	// Get provider configuration
	const config = APIWrapper.providers[source];
	if (!config) {
		throw(`API provider "${source}" not implemented`);
	}
	
	// Validate API key
	if(typeof(key) === 'undefined') {
		throw(`Couldn't find the ${source} API key`);
	}
	
	// Prepare URL and headers
	let url = config.url;
	let headers = { 'Content-Type': 'application/json' };
	
	// Handle authentication
	if (config.authType === 'query') {
		url += `?key=${key}`;
	} else if (config.authType === 'bearer') {
		headers['Authorization'] = `Bearer ${key}`;
	}
	
	// Format request data
	const requestFormatter = APIWrapper.formatRequest[config.requestFormat];
	const data = requestFormatter(params.prompt, config);
	
	// Make API call
	const response = await fetch(url, {
		method: 'POST',
		headers: headers,
		body: JSON.stringify(data)
	});
	
	// Parse response
	const result = await response.json();
	const responseParser = APIWrapper.parseResponse[config.responseFormat];
	return responseParser(result);
};