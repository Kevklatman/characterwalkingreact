from math import sqrt
from config import CHARACTER_HEIGHT, CHARACTER_WIDTH

def point_line_distance(x, y, x1, y1, x2, y2):
    """Calculate the shortest distance between a point and a line segment."""
    A = x - x1
    B = y - y1
    C = x2 - x1
    D = y2 - y1

    dot = A * C + B * D
    len_sq = C * C + D * D
    param = dot / len_sq if len_sq != 0 else -1

    if param < 0:
        xx, yy = x1, y1
    elif param > 1:
        xx, yy = x2, y2
    else:
        xx = x1 + param * C
        yy = y1 + param * D

    dx = x - xx
    dy = y - yy
    return sqrt(dx * dx + dy * dy)

def is_on_path(x, y):
    """Check if a point is within the valid path area."""
    from config import PATH
    
    # Calculate center point of character
    center_x = x + CHARACTER_WIDTH // 2
    center_y = y + CHARACTER_HEIGHT // 2

    # Check distance to each path segment
    for start_x, start_y, end_x, end_y, width in PATH:
        distance = point_line_distance(center_x, center_y, start_x, start_y, end_x, end_y)
        if distance <= width / 2:
            return True
    return False