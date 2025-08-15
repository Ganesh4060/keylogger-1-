// Global variables
let isKeyloggerActive = false;

// Keylogger controls
async function toggleKeylogger() {
    const startBtn = document.getElementById('start-keylogger');
    const stopBtn = document.getElementById('stop-keylogger');
    const statusText = document.getElementById('keylogger-status');
    
    try {
        if (!isKeyloggerActive) {
            const response = await fetch('/start-keylogger');
            const data = await response.json();
            
            if (data.success) {
                isKeyloggerActive = true;
                statusText.textContent = 'Status: Active';
                statusText.style.color = '#27AE60';
                startBtn.disabled = true;
                stopBtn.disabled = false;
            } else {
                throw new Error(data.message);
            }
        } else {
            const response = await fetch('/stop-keylogger');
            const data = await response.json();
            
            if (data.success) {
                isKeyloggerActive = false;
                statusText.textContent = 'Status: Inactive';
                statusText.style.color = '#E74C3C';
                startBtn.disabled = false;
                stopBtn.disabled = true;
            } else {
                throw new Error(data.message);
            }
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Detector functions
async function scanForKeyloggers() {
    const resultsDiv = document.getElementById('detection-results');
    resultsDiv.innerHTML = '<p>Scanning...</p>';
    
    try {
        const response = await fetch('/scan');
        const data = await response.json();
        
        if (data.success) {
            if (data.keyloggers.length > 0) {
                let html = '<h3>Detected Keyloggers:</h3><ul>';
                data.keyloggers.forEach(kl => {
                    html += `
                        <li>
                            PID: ${kl.pid}<br>
                            Name: ${kl.name}<br>
                            Path: ${kl.path}
                            <button onclick="terminateProcess(${kl.pid})" class="btn btn-stop">Terminate</button>
                        </li>`;
                });
                html += '</ul>';
                resultsDiv.innerHTML = html;
            } else {
                resultsDiv.innerHTML = '<p>No keyloggers detected.</p>';
            }
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        resultsDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}

async function terminateProcess(pid) {
    try {
        const response = await fetch(`/terminate/${pid}`);
        const data = await response.json();
        
        if (data.success) {
            alert('Process terminated successfully');
            scanForKeyloggers(); // Refresh the list
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Keylogger controls
    const startBtn = document.getElementById('start-keylogger');
    const stopBtn = document.getElementById('stop-keylogger');
    
    if (startBtn) startBtn.addEventListener('click', toggleKeylogger);
    if (stopBtn) stopBtn.addEventListener('click', toggleKeylogger);
    
    // Navigation to detector
    const gotoDetectorBtn = document.getElementById('goto-detector');
    if (gotoDetectorBtn) {
        gotoDetectorBtn.addEventListener('click', () => {
            window.location.href = '/detector';
        });
    }
});

document.getElementById('scan-again')?.addEventListener('click', () => {
    window.location.reload();
});

document.getElementById('go-back')?.addEventListener('click', () => {
    window.location.href = '/';
}); 