from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_cors import CORS

app = Flask(__name__)
api = Api(app)
CORS(app)

# Image dimensions (replace with actual dimensions)
IMAGE_WIDTH = 800  # Replace with actual image width
IMAGE_HEIGHT = 720  # Replace with actual image height

# Game constants
TILE_SIZE = 16
MAP_TILES_WIDTH = IMAGE_WIDTH // TILE_SIZE
MAP_TILES_HEIGHT = IMAGE_HEIGHT // TILE_SIZE
MAP_WIDTH = MAP_TILES_WIDTH * TILE_SIZE
MAP_HEIGHT = MAP_TILES_HEIGHT * TILE_SIZE
CHARACTER_WIDTH = TILE_SIZE
CHARACTER_HEIGHT = TILE_SIZE
SPEED = 8

# Define the path segments as tuples (start_x, start_y, end_x, end_y)
PATH = [
    (125, 230, 125, 310),
    (125, 310, 470, 310),
    (350, 310, 350, 170),
    (350, 170, 380, 170),
    (390, 0, 390, 150),
    (390, 150, 380, 150),
    (380, 150, 380, 170),
    (350, 310, 350, 490),
    (350, 490, 160, 490),
    (160, 490, 160, 430),
    (200, 490, 200, 550),
    (200, 550, 230, 550),
    (230, 550, 230, 590),
    (230, 590, 290, 590),
    (290, 590, 290, 610),
    (290, 610, 515, 610),
    (515, 610, 515, 590),
    (515, 590, 525, 590),
    (525, 590, 525, 460),
    (525, 460, 513, 460),
    (513, 460, 513, 450),
]

def is_on_path(x, y, path_width=16):
    for start_x, start_y, end_x, end_y in PATH:
        # Check if the point (x, y) is within the path width of the line segment
        if start_x == end_x:  # Vertical line
            if (min(start_y, end_y) <= y <= max(start_y, end_y) and
                start_x - path_width <= x <= start_x + path_width):
                return True
        elif start_y == end_y:  # Horizontal line
            if (min(start_x, end_x) <= x <= max(start_x, end_x) and
                start_y - path_width <= y <= start_y + path_width):
                return True
    return False

def is_on_path(x, y, path_width=16):
    for start_x, start_y, end_x, end_y in PATH:
        # Check if the point (x, y) is within the path width of the line segment
        if start_x == end_x:  # Vertical line
            if (min(start_y, end_y) <= y <= max(start_y, end_y) and
                start_x - path_width <= x <= start_x + path_width):
                return True
        elif start_y == end_y:  # Horizontal line
            if (min(start_x, end_x) <= x <= max(start_x, end_x) and
                start_y - path_width <= y <= start_y + path_width):
                return True
    return False

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
        elif direction in ['upleft', 'upright', 'downleft', 'downright']:
            dx = SPEED // 2 if 'right' in direction else -SPEED // 2
            dy = SPEED // 2 if 'down' in direction else -SPEED // 2
            new_x = max(min(current_x + dx, MAP_WIDTH - CHARACTER_WIDTH), 0)
            new_y = max(min(current_y + dy, MAP_HEIGHT - CHARACTER_HEIGHT), 0)
        else:
            return jsonify({"error": "Invalid direction"}), 400

        # Check if the new position is on the path
        if is_on_path(new_x + CHARACTER_WIDTH // 2, new_y + CHARACTER_HEIGHT // 2):
            return {'x': new_x, 'y': new_y, 'walking': True, 'collision': False}, 200
        else:
            return {'x': current_x, 'y': current_y, 'walking': True, 'collision': True}, 200




class StopCharacter(Resource):
    def post(self):
        data = request.get_json()
        try:
            current_x = int(data['x'])
            current_y = int(data['y'])
        except (KeyError, ValueError):
            return jsonify({"error": "Invalid input data"}), 400

        return {'x': current_x, 'y': current_y, 'walking': False}, 200

api.add_resource(MoveCharacter, '/move')
api.add_resource(StopCharacter, '/stop')

if __name__ == '__main__':
    app.run(debug=True)
