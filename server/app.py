# app.py
from flask import Flask, jsonify
from flask_restful import Api
from flask_cors import CORS
from routes import MoveCharacter, StopCharacter
from ai_movement import AIMovementSystem
from config import PATH, MAP_WIDTH, MAP_HEIGHT
import atexit

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

if __name__ == '__main__':
    app.run(debug=True)