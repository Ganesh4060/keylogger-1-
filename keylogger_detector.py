import psutil

class KeyloggerDetector:
    @staticmethod
    def detect_keyloggers():
        suspicious_processes = []
        for proc in psutil.process_iter(['pid', 'name', 'exe', 'cmdline']):
            try:
                cmdline = proc.info['cmdline'] or []
                if 'keylogger.py' in ' '.join(cmdline):
                    suspicious_processes.append(proc)
                # Check for common keylogger indicators
                if 'keylogger' in proc.info['name'].lower():
                    suspicious_processes.append(proc)
                elif proc.info['exe'] and 'keylogger' in proc.info['exe'].lower():
                    suspicious_processes.append(proc)
                elif cmdline and any('keylogger' in cmd.lower() for cmd in cmdline):
                    suspicious_processes.append(proc)
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                continue
        return suspicious_processes

    @staticmethod
    def terminate_process(pid):
        try:
            process = psutil.Process(pid)
            process.terminate()
            return True
        except Exception as e:
            print(f"Error terminating process {pid}: {e}")
            return False 