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
SPEED = 9

# Define obstacles (example: list of rectangles [x, y, width, height])
OBSTACLES = [
    [100, 100, 200, 50],
    [400, 300, 100, 100],
    # Add more obstacles as needed
]

def check_collision(x, y):
    for obstacle in OBSTACLES:
        if (x < obstacle[0] + obstacle[2] and
            x + CHARACTER_WIDTH > obstacle[0] and
            y < obstacle[1] + obstacle[3] and
            y + CHARACTER_HEIGHT > obstacle[1]):
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
    app.run(debug=True) #