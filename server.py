from flask import Flask, render_template, jsonify, send_from_directory
import os
import psutil
from threading import Thread
app = Flask(__name__, 
            static_folder='static',
            template_folder='templates')

from keylogger import KeyLogger
from keylogger_detector import KeyloggerDetector

keylogger = KeyLogger()

# Keep track of the server status
server_running = True

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/keylogger')
def keylogger_page():
    log_file_path = os.path.abspath(keylogger.log_file)
    return render_template('keylogger.html', log_file_path=log_file_path)

@app.route('/detector')
def detector_page():
    return render_template('detector.html')

@app.route('/start-keylogger')
def start_keylogger():
    try:
        keylogger.start()
        return jsonify({'success': True, 'message': 'Keylogger started successfully'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

@app.route('/stop-keylogger')
def stop_keylogger():
    try:
        keylogger.stop()
        return jsonify({'success': True, 'message': 'Keylogger stopped successfully'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

@app.route('/scan')
def scan():
    try:
        detector = KeyloggerDetector()
        keyloggers = detector.detect_keyloggers()
        
        # Add running keylogger to detection if active
        if hasattr(keylogger, 'listener') and keylogger.listener and keylogger.listener.is_alive():
            keyloggers.append({
                'pid': os.getpid(),
                'name': 'Keylogger.py',
                'path': os.path.abspath(keylogger.log_file)
            })
            
        return jsonify({
            'success': True,
            'keyloggers': [
                {
                    'pid': getattr(proc, 'pid', proc.get('pid')),
                    'name': getattr(proc, 'name', proc.get('name')),
                    'path': getattr(proc, 'exe', proc.get('path', 'Unknown'))
                }
                for proc in keyloggers
            ]
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

@app.route('/terminate/<int:pid>')
def terminate(pid):
    try:
        # Don't allow termination of the current process
        if pid == os.getpid():
            return jsonify({
                'success': False, 
                'message': 'Cannot terminate the current process'
            })
            
        if psutil.pid_exists(pid):
            process = psutil.Process(pid)
            process.terminate()
            return jsonify({
                'success': True, 
                'message': f'Process {pid} terminated'
            })
        return jsonify({
            'success': False, 
            'message': 'Process not found'
        })
    except Exception as e:
        return jsonify({
            'success': False, 
            'message': str(e)
        })

def run_flask():
    app.run(debug=False, host='127.0.0.1', port=5000, use_reloader=False)

if __name__ == '__main__':
    # Run Flask in a separate thread
    flask_thread = Thread(target=run_flask)
    flask_thread.daemon = False  # This ensures the thread doesn't exit when the main thread ends
    flask_thread.start()
    
    try:
        # Keep the main thread running
        while server_running:
            flask_thread.join(1)  # Check every second
    except KeyboardInterrupt:
        print("\nShutting down the server...")
        server_running = False
        if keylogger.listener:
            keylogger.stop() 