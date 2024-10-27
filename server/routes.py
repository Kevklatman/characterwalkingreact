# routes.py
from flask import request, jsonify
from flask_restful import Resource
from config import (
    MAP_WIDTH, MAP_HEIGHT, CHARACTER_WIDTH, 
    CHARACTER_HEIGHT, SPEED
)
from utils import is_on_path

class MoveCharacter(Resource):
    def post(self):
        data = request.get_json()
        try:
            current_x = int(data['x'])
            current_y = int(data['y'])
            direction = data['direction']
        except (KeyError, ValueError):
            return jsonify({"error": "Invalid input data"}), 400

        new_x, new_y = current_x, current_y

        if direction == 'up':
            new_y = max(current_y - SPEED, 0)
        elif direction == 'down':
            new_y = min(current_y + SPEED, MAP_HEIGHT - CHARACTER_HEIGHT)
        elif direction == 'left':
            new_x = max(current_x - SPEED, 0)
        elif direction == 'right':
            new_x = min(current_x + SPEED, MAP_WIDTH - CHARACTER_WIDTH)
        else:
            return jsonify({"error": "Invalid direction"}), 400

        # Check if the new position is on the path
        if is_on_path(new_x, new_y):
            return {'x': new_x, 'y': new_y, 'walking': True, 'collision': False}, 200
        else:
            return {'x': current_x, 'y': current_y, 'walking': False, 'collision': True}, 200

class StopCharacter(Resource):
    def post(self):
        data = request.get_json()
        try:
            current_x = int(data['x'])
            current_y = int(data['y'])
        except (KeyError, ValueError):
            return jsonify({"error": "Invalid input data"}), 400

        return {'x': current_x, 'y': current_y, 'walking': False}, 200