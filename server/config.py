IMAGE_WIDTH = 800
IMAGE_HEIGHT = 720

# Tile configuration
TILE_SIZE = 16
MAP_TILES_WIDTH = IMAGE_WIDTH // TILE_SIZE
MAP_TILES_HEIGHT = IMAGE_HEIGHT // TILE_SIZE

# Map dimensions
MAP_WIDTH = MAP_TILES_WIDTH * TILE_SIZE
MAP_HEIGHT = MAP_TILES_HEIGHT * TILE_SIZE

# Character configuration
CHARACTER_WIDTH = TILE_SIZE
CHARACTER_HEIGHT = TILE_SIZE
SPEED = 2

# Path configuration - Each tuple is (start_x, start_y, end_x, end_y, width)
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