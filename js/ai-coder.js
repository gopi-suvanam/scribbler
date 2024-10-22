aiConfig={
	models:{
		"Qwen2.5-Coder-1.5B-Instruct":"Qwen2.5-Coder-1.5B-Instruct-q4f32_1-MLC",
		"Qwen2.5-Coder-7B-Instruct":"Qwen2.5-Coder-7B-Instruct-q4f32_1-MLC",
		"Mistral-7B-Instruct-v0.3":"Mistral-7B-Instruct-v0.3-q4f32_1-MLC",
		"Llama-3.2-1B-Instruct":"Llama-3.2-1B-Instruct-q4f16_0-MLC",
		"Llama-3.1-8B-Instruct":"Llama-3.1-8B-Instruct-q4f32_1-MLC"
	}
}

window.addEventListener("load", function() {
    // Get the select element
    const ulElement  = scrib.getDom("AI-Models");

    // Loop through the dictionary
    for (let key in aiConfig.models) {
      if ( aiConfig.models.hasOwnProperty(key)) {
        // Create a new li element
        const li = document.createElement("li");
        
        // Create an <a> element within the li
		  const a = document.createElement("a");

		  

		  // Set the inner text of the <a> to the dictionary value
		  a.textContent = key;

		  // Add the onclick event to the <a> element
		  a.setAttribute("onclick", `loadAI('${aiConfig.models[key]}')`);

		  // Append the <a> to the li element
		  li.appendChild(a);


        // Append the li to the dropdown
        ulElement.appendChild(li);
      }
    }
});
	
async function loadAI(model){
	webllm = await import("https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.72/lib/index.min.js");
	
	// Callback function to update model loading progress
	const progressBar = document.getElementById('ai-loading-progress-bar');
	const progressText = document.getElementById('ai-loading-progress-text');
	const aiContainer=document.getElementById('ai-loading');
	aiContainer.style.display='block';

	progressText.textContent = "Initializing : 0%"
	try{
		const initProgressCallback = (initProgress) => {
		  const progressValue = initProgress.progress;
		  progressBar.value = progressValue;
		  progressText.textContent = `Loading AI: ${Math.round(progressValue * 100)}%. It will take time for the first time. Next time it will be faster.`;
		}

		const selectedModel =  model;//"Qwen2.5-Coder-1.5B-Instruct-q4f16_1-MLC";
		
		const engine = await webllm.CreateMLCEngine(
		  selectedModel,
		  { initProgressCallback: initProgressCallback }, // engineConfig
		);
		window.llmEngine=engine;
		console.log("Loaded AI Model",model);
		progressText.style.color='green';
		progressText.textContent = "Model loaded: "+model;
		setTimeout(() => {
		  aiContainer.style.display = 'none';
		}, 5000);

	}
	catch(err){
		let errorMessage='';
		if(typeof(err)=='string') errorMessage=err;
		else errorMessage=err.message
		progressText.innerHTML = `<p class='error'>${errorMessage}</p>`
		
		setTimeout(() => {
		  aiContainer.style.display = 'none';
		}, 5000);
	}
	
}

async function queryAI(query,code,streaming=true){
	const specialFunctionsFetch =await  fetch("/SPECIAL-FUNCTIONS.md");
	const specialFunctions = await specialFunctionsFetch.text();
	let prompt=`User query: ${query} \n Exisitng code:\n ${code}`;
	
	const messages = [
	  { role: "system", 
	  content: `You are a helpful AI assistant for Scribbler - the JavaScript notebook tool. Answer the queries of users. In Scribbler you can use these special functions: ${specialFunctions}. You can also use top-level await in scribbler. \n Give only the code in one block. Give only JavaScrpt code. Do not give explanation other than as comments in the code. For showing output use scrib.show instead of console.log. Do not assume any other function definitions that what is given in the prompt.`  },
	  { role: "user", content: query},
	]

	// Chunks is an AsyncGenerator object
	const chunks = await llmEngine.chat.completions.create({
	  messages,
	  temperature: 1,
	  stream: streaming, // <-- Enable streaming
	  stream_options: { include_usage: true },
	});

	return chunks;
	
}

function channelInitAI(){
	
	// Listen for init message
	window.addEventListener('message', async (event) => {
		if (event.data['ai-query']) {
			const port2 = event.ports[0];
			if(typeof(llmEngine) === 'undefined')  port2.postMessage({error:new Error("AI not loaded")});
			try{
				const chunks = await queryAI(event.data['ai-query'],event.data['markedownNB']);
				let reply="";
				for await (const chunk of chunks) {
				  reply += chunk.choices[0]?.delta.content || "";
					port2.postMessage({"chunk": chunk.choices[0]?.delta.content || ""});
				}
				//console.log(reply);				
				// Send message back to iframe on port2
				port2.postMessage({"final-reply":reply});
			}catch(err){
				port2.postMessage({error:err});
			}
			
			
		}
	});
}

channelInitAI(); 