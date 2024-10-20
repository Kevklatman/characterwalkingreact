from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_cors import CORS

app = Flask(__name__)
api = Api(app)
CORS(app)

# Image dimensions
IMAGE_WIDTH = 800
IMAGE_HEIGHT = 720

# Game constants
TILE_SIZE = 16
MAP_TILES_WIDTH = IMAGE_WIDTH // TILE_SIZE
MAP_TILES_HEIGHT = IMAGE_HEIGHT // TILE_SIZE
MAP_WIDTH = MAP_TILES_WIDTH * TILE_SIZE
MAP_HEIGHT = MAP_TILES_HEIGHT * TILE_SIZE
CHARACTER_WIDTH = TILE_SIZE
CHARACTER_HEIGHT = TILE_SIZE
SPEED = 2

# Define the path segments as tuples (start_x, start_y, end_x, end_y, width)
PATH = [
    (390, 0, 390, 150, 20),
    (390, 150, 380, 150, 18),
    (380, 150, 380, 170, 18),
    (350, 170, 380, 170, 18),
    (350, 170, 350, 300, 18),
    (125, 300, 470, 300, 18),
    (125, 230, 125, 310, 18),
    (350, 300, 350, 490, 22),
    (160, 430, 160, 490, 20),
    (160, 490, 350, 490, 25),
    (200, 490, 200, 550, 20),
    (200, 550, 230, 550, 18),
    (230, 550, 230, 590, 18),
    (230, 590, 290, 590, 20),
    (290, 590, 290, 610, 20),
    (290, 610, 515, 610, 25),
    (515, 610, 515, 590, 20),
    (515, 590, 525, 590, 18),
    (525, 590, 525, 460, 20),
    (525, 460, 513, 460, 18),
    (513, 460, 513, 450, 18),
]

def point_line_distance(x, y, x1, y1, x2, y2):
    A = x - x1
    B = y - y1
    C = x2 - x1
    D = y2 - y1

    dot = A * C + B * D
    len_sq = C * C + D * D
    param = dot / len_sq if len_sq != 0 else -1

    if param < 0:
        xx = x1
        yy = y1
    elif param > 1:
        xx = x2
        yy = y2
    else:
        xx = x1 + param * C
        yy = y1 + param * D

    dx = x - xx
    dy = y - yy
    return (dx * dx + dy * dy) ** 0.5

def is_on_path(x, y):
    for start_x, start_y, end_x, end_y, path_width in PATH:
        distance = point_line_distance(x, y, start_x, start_y, end_x, end_y)
        if distance <= path_width / 2:
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
        else:
            return jsonify({"error": "Invalid direction"}), 400

        # Check if the new position is on the path
        if is_on_path(new_x + CHARACTER_WIDTH // 2, new_y + CHARACTER_HEIGHT // 2):
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

api.add_resource(MoveCharacter, '/move')
api.add_resource(StopCharacter, '/stop')

if __name__ == '__main__':
    app.run(debug=True)