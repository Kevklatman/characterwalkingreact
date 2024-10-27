# app.py
from flask import Flask, jsonify
from flask_restful import Api
from flask_cors import CORS
from routes import MoveCharacter, StopCharacter
from ai_movement import AIMovementSystem
from config import PATH, MAP_WIDTH, MAP_HEIGHT
import atexit
from flask import send_from_directory
import os

app = Flask(__name__)
api = Api(app)
CORS(app)

# Initialize AI system
ai_system = AIMovementSystem(PATH, MAP_WIDTH, MAP_HEIGHT)

# Register routes
api.add_resource(MoveCharacter, '/move')
api.add_resource(StopCharacter, '/stop')

@app.route('/ai-characters', methods=['GET'])
def get_ai_characters():
    characters = ai_system.get_all_characters()
    return jsonify(characters)

# Register cleanup
atexit.register(lambda: ai_system.cleanup())

@app.route('/audio/<path:filename>')
def serve_audio(filename):
    try:
        # Print the requested file path for debugging
        print(f"Requested audio file: {filename}")
        print(f"Looking in directory: {os.path.abspath('static/audio')}")
        
        # Check if file exists
        file_path = os.path.join('static/audio', filename)
        if os.path.exists(file_path):
            print(f"File found: {file_path}")
        else:
            print(f"File not found: {file_path}")
            
        return send_from_directory('static/audio', filename, mimetype='audio/mpeg')
    except Exception as e:
        print(f"Error serving audio: {str(e)}")
        return str(e), 500

# Add a route to check if the server can find the audio file
@app.route('/check-audio')
def check_audio():
    audio_path = os.path.join('static/audio', 'background.mp3')
    exists = os.path.exists(audio_path)
    return {
        'exists': exists,
        'path': audio_path,
        'absolute_path': os.path.abspath(audio_path)
    }

if __name__ == '__main__':
    app.run(debug=True)