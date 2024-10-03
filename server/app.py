from flask import Flask, request
from flask_restful import Api, Resource
from flask_cors import CORS

app = Flask(__name__)
api = Api(app)
CORS(app)

# Define map boundaries
TILE_SIZE = 16
MAP_TILES_WIDTH = 50
MAP_TILES_HEIGHT = 45
MAP_WIDTH = MAP_TILES_WIDTH * TILE_SIZE
MAP_HEIGHT = MAP_TILES_HEIGHT * TILE_SIZE
CHARACTER_WIDTH = TILE_SIZE
CHARACTER_HEIGHT = TILE_SIZE

# Game constants
SPEED = 8 # Adjusted for smoother movement (1/4 of a tile)

# Define obstacles (list of [tile_x, tile_y, tiles_width, tiles_height])
OBSTACLES = [
    [6, 6, 12, 3],   # An obstacle from (6,6) to (18,9) in tile coordinates
    [25, 18, 6, 6],  # An obstacle from (25,18) to (31,24) in tile coordinates
    # Add more obstacles as needed
]

def check_collision(x, y):
    # Convert pixel coordinates to tile coordinates
    tile_x = x // TILE_SIZE
    tile_y = y // TILE_SIZE
    
    for obstacle in OBSTACLES:
        if (tile_x < obstacle[0] + obstacle[2] and
            tile_x + 1 > obstacle[0] and
            tile_y < obstacle[1] + obstacle[3] and
            tile_y + 1 > obstacle[1]):
            return True
    return False

class MoveCharacter(Resource):
    def post(self):
        data = request.get_json()
        current_x = data['x']
        current_y = data['y']
        direction = data['direction']

        new_x, new_y = current_x, current_y

        if direction == 'up':
            new_y = max(current_y - SPEED, 0)
        elif direction == 'down':
            new_y = min(current_y + SPEED, MAP_HEIGHT - CHARACTER_HEIGHT)
        elif direction == 'left':
            new_x = max(current_x - SPEED, 0)
        elif direction == 'right':
            new_x = min(current_x + SPEED, MAP_WIDTH - CHARACTER_WIDTH)

        if not check_collision(new_x, new_y):
            return {'x': new_x, 'y': new_y, 'walking': True, 'collision': False}, 200
        else:
            return {'x': current_x, 'y': current_y, 'walking': True, 'collision': True}, 200

class StopCharacter(Resource):
    def post(self):
        data = request.get_json()
        current_x = data['x']
        current_y = data['y']

        return {'x': current_x, 'y': current_y, 'walking': False}, 200

api.add_resource(MoveCharacter, '/move')
api.add_resource(StopCharacter, '/stop')

if __name__ == '__main__':
    app.run(debug=True)