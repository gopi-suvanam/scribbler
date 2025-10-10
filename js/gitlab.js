// GitLab API integration for JavaScript Notebook

var gitlab_get_file_sha = async function (token, projectId, path, baseUrl = 'https://gitlab.com') {
    // GitLab API requires double encoding for file paths with special characters
    const encodedPath = encodeURIComponent(path).replace(/\./g, '%2E');
    const url = `${baseUrl}/api/v4/projects/${projectId}/repository/files/${encodedPath}`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return data.blob_id;
    } catch (error) {
        throw error;
    }
};

var gitlab_get_file_content = async function (token, projectId, path, baseUrl = 'https://gitlab.com') {
    // Try the raw API endpoint first (simpler and more reliable)
    const encodedPath = encodeURIComponent(path).replace(/\./g, '%2E');
    const rawUrl = `${baseUrl}/api/v4/projects/${projectId}/repository/files/${encodedPath}/raw`;
    
    console.log('GitLab Raw API URL:', rawUrl);
    
    try {
        const rawResponse = await fetch(rawUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (rawResponse.ok) {
            const content = await rawResponse.text();
            console.log('GitLab Raw API Success:', content.substring(0, 100) + '...');
            return content;
        }
    } catch (error) {
        console.log('Raw API failed, trying regular API:', error);
    }
    
    // Fallback to regular API with base64 decoding
    const url = `${baseUrl}/api/v4/projects/${projectId}/repository/files/${encodedPath}`;
    console.log('GitLab Regular API URL:', url);
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error('GitLab API Error:', response.status, errorText);
        throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('GitLab Regular API Response:', data);
    
    // GitLab returns content in base64, need to decode it
    if (data.content) {
        return atob(data.content.replace(/\n/g, ''));
    } else {
        throw new Error('No content found in GitLab response');
    }
};

var gitlab_upload_file = async function (token, content, projectId, path, commitMessage, baseUrl = 'https://gitlab.com') {
    // GitLab API requires double encoding for file paths with special characters
    const encodedPath = encodeURIComponent(path).replace(/\./g, '%2E');
    const url = `${baseUrl}/api/v4/projects/${projectId}/repository/files/${encodedPath}`;
    
    // Check if file exists
    let fileExists = false;
    try {
        await gitlab_get_file_sha(token, projectId, path, baseUrl);
        fileExists = true;
    } catch (error) {
        console.log("File does not exist. Creating a new file.");
    }
    
    // Proper base64 encoding for UTF-8 content
    const toBase64 = (str) => {
        return btoa(unescape(encodeURIComponent(str)));
    };
    
    const data = JSON.stringify({
        branch: 'main',
        content: toBase64(content),
        commit_message: commitMessage,
        encoding: 'base64'
    });
    
    const method = fileExists ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
        method: method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: data
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`GitLab API Error: ${response.status} - ${errorData.message || response.statusText}`);
    }
    
    return await response.json();
};

var gitlab_get_projects = async function (token, baseUrl = 'https://gitlab.com') {
    const projects = [];
    const url = `${baseUrl}/api/v4/projects?membership=true&per_page=100`;
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    data.forEach(project => {
        projects.push({
            id: project.id,
            name: project.name,
            path_with_namespace: project.path_with_namespace
        });
    });
    
    return projects;
};

var gitlab_get_user = async function (token, baseUrl = 'https://gitlab.com') {
    const response = await fetch(`${baseUrl}/api/v4/user`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
};

// GitLab UI functions
var gitlab_update_owner = async function() {
    const token = scrib.getDom("gitlab-token").value;
    const baseUrl = scrib.getDom("gitlab-url").value || 'https://gitlab.com';
    
    if (!token) {
        alert("Please enter a GitLab access token");
        return;
    }
    
    try {
        const user = await gitlab_get_user(token, baseUrl);
        localStorage.setItem("gitlab-token", token);
        localStorage.setItem("gitlab-url", baseUrl);
        scrib.getDom("gitlab-username").innerHTML = user.name || user.username;
        scrib.getDom("gitlab-user").value = user.username;
        gitlab_update_projects();
    } catch (error) {
        console.error("GitLab connection error:", error);
        alert("Error connecting to GitLab: " + error.message);
    }
};

var gitlab_update_projects = async function() {
    const token = scrib.getDom("gitlab-token").value;
    const baseUrl = scrib.getDom("gitlab-url").value || 'https://gitlab.com';
    
    try {
        const projects = await gitlab_get_projects(token, baseUrl);
        let str = '';
        projects.forEach(project => {
            str += `<option value="${project.id}" data-name="${project.path_with_namespace}">${project.path_with_namespace}</option>`;
        });
        scrib.getDom('gitlab-projects').innerHTML = str;
    } catch (error) {
        alert("Error fetching projects: " + error.message);
    }
};

var gitlab_load_from_git = async function() {
    const token = scrib.getDom("gitlab-token").value;
    const baseUrl = scrib.getDom("gitlab-url").value || 'https://gitlab.com';
    const projectId = scrib.getDom("gitlab-project").value;
    const path = scrib.getDom("gitlab-path").value;
    
    if (!token || !projectId || !path) {
        alert("Please fill in all required fields (Token, Project, Path)");
        return;
    }
    
    try {
        console.log('Loading from GitLab:', { baseUrl, projectId, path });
        
        fileDetails['source'] = 'gitlab';
        fileDetails['token'] = token;
        fileDetails['baseUrl'] = baseUrl;
        fileDetails['projectId'] = projectId;
        fileDetails['path'] = path;
        
        const nbContent = await gitlab_get_file_content(token, projectId, path, baseUrl);
        console.log('Raw content from GitLab:', nbContent);
        
        let parsedNb;
        try {
            parsedNb = JSON.parse(nbContent);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            throw new Error('Invalid JSON format in the notebook file');
        }
        
        load_jsnb(parsedNb);
        closeModal(scrib.getDom('gitlab-import-export'));
        
        const nextURL = `./?jsnb=gitlab:${projectId}/${path}`;
        const nextTitle = 'JavaScript Notebook';
        const nextState = { additionalInformation: 'Updated the URL with JS' };
        window.history.pushState(nextState, nextTitle, nextURL);
        
        alert("Successfully loaded from GitLab!");
    } catch (error) {
        console.error("GitLab load error:", error);
        alert("Error loading from GitLab: " + error.message);
    }
};

var gitlab_upload_to_git = async function() {
    const token = scrib.getDom("gitlab-token").value;
    const baseUrl = scrib.getDom("gitlab-url").value || 'https://gitlab.com';
    const projectId = scrib.getDom("gitlab-project").value;
    const path = scrib.getDom("gitlab-path").value;
    const commitMessage = scrib.getDom("gitlab-commit-msg").value || "JSNB File Uploaded by User";
    
    if (!token || !projectId || !path) {
        alert("Please fill in all required fields (Token, Project, Path)");
        return;
    }
    
    try {
        fileDetails['source'] = 'gitlab';
        fileDetails['token'] = token;
        fileDetails['baseUrl'] = baseUrl;
        fileDetails['projectId'] = projectId;
        fileDetails['path'] = path;
        fileDetails['commitMessage'] = commitMessage;
        
        let nb = await get_nb();
        const content = JSON.stringify(nb, undefined, 2);
        
        const upload_status = await gitlab_upload_file(token, content, projectId, path, commitMessage, baseUrl);
        alert("Successfully pushed to GitLab");
        closeModal(scrib.getDom('gitlab-import-export'));
        
        const nextURL = `./?jsnb=gitlab:${projectId}/${path}`;
        const nextTitle = 'JavaScript Notebook';
        const nextState = { additionalInformation: 'Updated the URL with JS' };
        window.history.pushState(nextState, nextTitle, nextURL);
    } catch (error) {
        console.error("GitLab upload error:", error);
        alert("Error uploading to GitLab: " + error.message);
    }
};

var gitlab_initialize_from_git = async function(link) {
    // Parse gitlab:projectId/path format or gitlab:baseUrl/projectId/path format
    let baseUrl = 'https://gitlab.com';
    let projectId, path;
    
    console.log('Initializing GitLab from link:', link);
    
    // Check if link contains a custom GitLab URL
    if (link.includes('://')) {
        const parts = link.split('/');
        baseUrl = parts[0] + '//' + parts[1];
        projectId = parts[2];
        path = parts.slice(3).join('/');
    } else {
        const parts = link.split('/');
        projectId = parts[0];
        path = parts.slice(1).join('/');
    }
    
    console.log('Parsed GitLab info:', { baseUrl, projectId, path });
    
    scrib.getDom("gitlab-url").value = baseUrl;
    scrib.getDom("gitlab-project").value = projectId;
    scrib.getDom("gitlab-path").value = path;
    
    try {
        // Try to load without token first (public repos)
        const encodedPath = encodeURIComponent(path).replace(/\./g, '%2E');
        const url = `${baseUrl}/api/v4/projects/${projectId}/repository/files/${encodedPath}/raw`;
        
        console.log('Trying public GitLab URL:', url);
        
        const response = await fetch(url, { method: 'GET' });
        
        if (response.ok) {
            const data = await response.text();
            console.log('Public GitLab response:', data);
            try {
                const nb = JSON.parse(data);
                load_jsnb(nb);
                return;
            } catch (parseError) {
                console.error("Failed to parse notebook JSON:", parseError);
            }
        } else {
            console.log('Public access failed, status:', response.status);
        }
        
        // If failed, open the GitLab modal for authentication
        openModal(scrib.getDom('gitlab-import-export'));
    } catch (error) {
        console.log("Error loading from GitLab:", error);
        openModal(scrib.getDom('gitlab-import-export'));
    }
};

var gitlab_project_selected = function() {
    const projectInput = scrib.getDom("gitlab-project");
    const selectedOption = document.querySelector(`#gitlab-projects option[value="${projectInput.value}"]`);
    
    if (selectedOption) {
        // If user selected from datalist, use the project ID
        projectInput.value = selectedOption.value;
    }
};

var gitlab_initialize = async function() {
    const token = localStorage.getItem("gitlab-token");
    const baseUrl = localStorage.getItem("gitlab-url");
    
    if (token == null) return;
    
    scrib.getDom("gitlab-token").value = token;
    if (baseUrl) {
        scrib.getDom("gitlab-url").value = baseUrl;
    }
    gitlab_update_owner();
};