document.addEventListener('DOMContentLoaded', () => {
    const editorContainer = document.getElementById('editor');
    const targetLanguage = document.getElementById('targetLanguage');
    const convertButton = document.getElementById('convertButton');
    const debugButton = document.getElementById('debugButton'); // Add this line
    const qualityCheckButton = document.getElementById('qualityCheckButton'); // Add this line
    const outputCode = document.getElementById('outputCode');
    const copyButton = document.getElementById('copyButton');
    let editor;

    // Load the Monaco Editor
    require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor/min/vs' }});
    require(['vs/editor/editor.main'], function() {
        editor = monaco.editor.create(editorContainer, {
            value: '',
            language: 'javascript',
            theme: 'vs-dark'
        });
    });

    convertButton.addEventListener('click', async () => {
        const code = editor.getValue();
        const language = targetLanguage.value;

        const response = await fetch('http://localhost:3001/convert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, language })
        });

        if (!response.ok) {
            console.error('Request failed:', response.statusText);
            const errorData = await response.json();
            console.log('Error data:', errorData);
            return;
        }

        const data = await response.json();
        outputCode.textContent = data.response;
    });

    debugButton.addEventListener("click", async function() {
        const inputCode = editor.getValue(); // Get code from the editor

        // Send the code to the "/debug" endpoint for debugging
        const response = await sendDebugRequest(inputCode);
        outputCode.textContent = response.response;
    });

    qualityCheckButton.addEventListener("click", async function() {
        const inputCode = editor.getValue(); // Get code from the editor

        // Send the code to the "/quality" endpoint for quality checking
        const response = await sendQualityCheckRequest(inputCode);
        outputCode.textContent = response.response;
    });
    copyButton.addEventListener('click', () => {
        const outputText = outputCode.textContent;
        copyToClipboard(outputText);
        alert('Output code copied to clipboard!');
    });

    // Function to send a debug request to the backend
    async function sendDebugRequest(code) {
        const debugEndpoint = "http://localhost:3001/debug";
        const requestData = { prompt: code };
        
        const response = await fetch(debugEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        });

        return response.json();
    }

    // Function to send a quality check request to the backend
    async function sendQualityCheckRequest(code) {
        const qualityEndpoint = "http://localhost:3001/quality";
        const requestData = { prompt: code };
        
        const response = await fetch(qualityEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        });

        return response.json();
    }

    function copyToClipboard(text) {
        const tempInput = document.createElement('textarea');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
    }
});


