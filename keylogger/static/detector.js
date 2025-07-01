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
                        <li class="keylogger-item">
                            <div class="keylogger-info">
                                <p><strong>PID:</strong> ${kl.pid}</p>
                                <p><strong>Name:</strong> ${kl.name}</p>
                                <p><strong>Path:</strong> ${kl.path}</p>
                            </div>
                        </li>`;
                });
                html += '</ul>';
                resultsDiv.innerHTML = html;
            } else {
                resultsDiv.innerHTML = '<p class="no-results">No keyloggers detected.</p>';
            }
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        resultsDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}

async function terminateProcess(pid, buttonElement) {
    try {
        buttonElement.disabled = true;
        buttonElement.textContent = 'Terminating...';
        
        const response = await fetch(`/terminate/${pid}`);
        const data = await response.json();
        
        if (data.success) {
            // Update the button and its parent li element
            const listItem = buttonElement.parentElement;
            listItem.style.backgroundColor = '#2c3e50';
            listItem.style.opacity = '0.7';
            buttonElement.textContent = 'Terminated';
            buttonElement.style.backgroundColor = '#95a5a6';
            
            // Show success message
            const messageDiv = document.createElement('div');
            messageDiv.className = 'success-message';
            messageDiv.textContent = 'Process terminated successfully';
            listItem.appendChild(messageDiv);
            
            // Refresh the scan after a short delay
            setTimeout(() => {
                scanForKeyloggers();
            }, 2000);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        buttonElement.disabled = false;
        buttonElement.textContent = 'Terminate';
        alert('Error: ' + error.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const scanBtn = document.getElementById('scan-button');
    if (scanBtn) scanBtn.addEventListener('click', scanForKeyloggers);

    const backBtn = document.getElementById('back-button');
    if (backBtn) backBtn.addEventListener('click', () => {
        window.location.href = '/';
    });
}); 