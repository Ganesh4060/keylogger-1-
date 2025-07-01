let isKeyloggerActive = false;

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

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-keylogger');
    const stopBtn = document.getElementById('stop-keylogger');
    const backBtn = document.getElementById('back-to-home');
    
    if (startBtn) startBtn.addEventListener('click', toggleKeylogger);
    if (stopBtn) stopBtn.addEventListener('click', toggleKeylogger);
    if (backBtn) backBtn.addEventListener('click', () => {
        window.location.href = '/';
    });
}); 