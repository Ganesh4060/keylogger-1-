# Keylogger Awareness & Detection System

This project is an educational tool designed to demonstrate how keyloggers work and how they can be detected on a Windows system. It provides a web-based interface to launch a simulated keylogger, scan for suspicious processes, and learn about keylogger threats and protection strategies.

## Features

- **Keylogger Demo:** Start and stop a simulated keylogger that records keystrokes to a local file.
- **Keylogger Detector:** Scan running processes for suspicious activity and terminate detected keyloggers.
- **Interactive Web UI:** Modern, responsive interface built with Flask and JavaScript.
- **Educational Content:** Learn about keylogger types, real-world incidents, statistics, and protection tips.

## Getting Started

### Prerequisites

- Python 3.8+
- [pip](https://pip.pypa.io/en/stable/)
- Windows OS (recommended for full functionality)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/keylogger-awareness.git
   cd keylogger-awareness/keylogger
   ```

2. **Install dependencies:**
   ```sh
   pip install flask psutil pynput
   ```

### Running the Application

1. **Start the server:**
   ```sh
   python server.py
   ```
2. **Open your browser and navigate to:**
   ```
   http://127.0.0.1:5000/
   ```

## Project Structure

- `server.py` - Main Flask server and API endpoints.
- `keylogger.py` - Simulated keylogger implementation.
- `keylogger_detector.py` - Process scanner and termination logic.
- `templates/` - HTML templates for web pages.
- `static/` - CSS and JavaScript assets.
- `keyfile.txt` - Log file for captured keystrokes.

## Usage

- **Keylogger Demo:**  
  Go to "Launch Keylogger Demo" and use the start/stop buttons to control the keylogger. View the log file path displayed on the page.

- **Detector:**  
  Go to "Launch Detector" and click "Start Scan" to detect running keyloggers. Terminate suspicious processes directly from the UI.

## Security & Disclaimer

This project is for educational and demonstration purposes only.  
**Do not use or deploy this code for malicious purposes.**  
Running a keylogger, even for testing, may trigger antivirus warnings.

## License

MIT License

## Credits

- [Flask](https://flask.palletsprojects.com/)
- [psutil](https://psutil.readthedocs.io/)
- [pynput](https://pynput.readthedocs.io/)

---

**Learn more about keylogger threats and how to protect yourself at