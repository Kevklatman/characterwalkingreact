from dataclasses import dataclass
from typing import List, Tuple, Dict
import math
import time
import threading
import random
from flask import jsonify

@dataclass
class AICharacter:
    id: str
    x: float
    y: float
    direction: str
    character_type: str
    target_x: float
    target_y: float
    is_moving: bool
    speed: float = 2.0  # Increased speed to match player
    home_x: float = 0.0
    home_y: float = 0.0
    roam_radius: float = 20.0
    timer: threading.Timer = None
    steps_remaining: int = 0
    current_pattern: List[Tuple[str, int]] = None

class AIMovementSystem:
    def __init__(self, path_segments, map_width, map_height):
        self.path_segments = path_segments
        self.map_width = map_width
        self.map_height = map_height
        self.characters: Dict[str, AICharacter] = {}
        self.lock = threading.Lock()
        self.TILE_SIZE = 16  # Size of one movement step
        
        # Initialize NPCs with their home positions and characteristics
        self.add_character(
            "shopkeeper", 
            350, 170,
            "npc-1", 
            roam_radius=48,  # 3 tiles
            pause_chance=0.4,
            pause_time=(2, 4)
        )
        
        self.add_character(
            "wanderer", 
            125, 230, 
            "npc-2", 
            roam_radius=80,  # 5 tiles
            pause_chance=0.3,
            pause_time=(1, 3)
        )
        
        self.add_character(
            "trainer", 
            200, 490, 
            "npc-1", 
            roam_radius=64,  # 4 tiles
            pause_chance=0.35,
            pause_time=(2, 4)
        )
        
        self.running = True
        self.update_thread = threading.Thread(target=self._update_loop)
        self.update_thread.daemon = True
        self.update_thread.start()

    def _generate_movement_pattern(self) -> List[Tuple[str, int]]:
        """Generate a random movement pattern consisting of directions and step counts."""
        patterns = [
            # Various movement patterns
            [("up", 2), ("pause", 1), ("down", 1), ("pause", 1)],
            [("left", 2), ("pause", 1), ("right", 2), ("pause", 1)],
            [("up", 1), ("right", 1), ("pause", 1), ("left", 1), ("down", 1)],
            [("down", 2), ("pause", 1), ("up", 1), ("pause", 1)],
            [("right", 3), ("pause", 1), ("left", 3), ("pause", 1)],
            [("up", 1), ("pause", 1), ("up", 1), ("pause", 1), ("down", 2)],
            [("left", 1), ("pause", 1), ("left", 1), ("pause", 1), ("right", 2)],
        ]
        return random.choice(patterns)

    def add_character(self, id: str, start_x: float, start_y: float, character_type: str, 
                     roam_radius: float = 20.0, 
                     pause_chance: float = 0.2, pause_time: Tuple[float, float] = (2, 5)):
        character = AICharacter(
            id=id,
            x=start_x,
            y=start_y,
            direction="down",
            character_type=character_type,
            target_x=start_x,
            target_y=start_y,
            is_moving=False,
            home_x=start_x,
            home_y=start_y,
            roam_radius=roam_radius,
            timer=None,
            steps_remaining=0,
            current_pattern=None
        )
        character.pause_chance = pause_chance
        character.pause_time = pause_time
        with self.lock:
            self.characters[id] = character
        
        # Start with a random pattern
        self._start_new_pattern(character)

    def _start_new_pattern(self, char: AICharacter):
        """Start a new movement pattern for the character."""
        char.current_pattern = self._generate_movement_pattern()
        self._next_pattern_step(char)

    def _next_pattern_step(self, char: AICharacter):
        """Execute the next step in the current pattern."""
        if not char.current_pattern:
            self._start_new_pattern(char)
            return

        if not char.current_pattern:
            return

        direction, steps = char.current_pattern.pop(0)
        
        if direction == "pause":
            char.is_moving = False
            pause_duration = random.uniform(*char.pause_time)
            self._schedule_movement(char, pause_duration)
            return

        # Calculate new target position based on direction and steps
        new_x, new_y = char.x, char.y
        if direction == "up":
            new_y = char.y - (self.TILE_SIZE * steps)
        elif direction == "down":
            new_y = char.y + (self.TILE_SIZE * steps)
        elif direction == "left":
            new_x = char.x - (self.TILE_SIZE * steps)
        elif direction == "right":
            new_x = char.x + (self.TILE_SIZE * steps)

        # Check if new position is valid
        if self._is_position_valid(new_x, new_y, char):
            char.direction = direction
            char.target_x = new_x
            char.target_y = new_y
            char.is_moving = True
        else:
            # If invalid, start a new pattern
            self._start_new_pattern(char)

    def _is_position_valid(self, x: float, y: float, char: AICharacter) -> bool:
        """Check if a position is valid (on path and within roaming radius)."""
        if not self._is_on_path(x, y):
            return False
            
        # Check if within roaming radius
        dx = x - char.home_x
        dy = y - char.home_y
        distance = math.sqrt(dx * dx + dy * dy)
        if distance > char.roam_radius:
            return False
            
        return True

    def _schedule_movement(self, char: AICharacter, delay: float):
        """Schedule the next movement with proper timer cleanup."""
        if char.timer is not None:
            char.timer.cancel()
        
        delay = max(0.5, delay)
        char.timer = threading.Timer(delay, self._next_pattern_step, args=[char])
        char.timer.daemon = True
        char.timer.start()

    def _update_character_position(self, char: AICharacter, delta_time: float):
        """Update the character's position and handle movement state changes."""
        if not char.is_moving:
            return

        dx = char.target_x - char.x
        dy = char.target_y - char.y
        distance = math.sqrt(dx * dx + dy * dy)

        # If reached target
        if distance < 1:
            char.x = char.target_x
            char.y = char.target_y
            self._next_pattern_step(char)
            return

        # Move towards target
        speed = self.TILE_SIZE * 4 * delta_time  # Adjust speed to match player
        ratio = min(speed / distance, 1.0)
        char.x += dx * ratio
        char.y += dy * ratio

    # [Rest of the methods remain the same: _point_line_distance, _is_on_path, get_all_characters, cleanup, etc.]

    def _point_line_distance(self, x: float, y: float, x1: float, y1: float, x2: float, y2: float) -> float:
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
            return math.sqrt(dx * dx + dy * dy)

    def _is_on_path(self, x: float, y: float) -> bool:
        """Check if a point is within the valid path area."""
        CHARACTER_SIZE = 16
        center_x = x + CHARACTER_SIZE / 2
        center_y = y + CHARACTER_SIZE / 2

        for start_x, start_y, end_x, end_y, width in self.path_segments:
            distance = self._point_line_distance(center_x, center_y, start_x, start_y, end_x, end_y)
            if distance <= width / 2:
                return True
        return False

    def _update_loop(self):
        last_time = time.time()
        
        while self.running:
            current_time = time.time()
            delta_time = current_time - last_time
            last_time = current_time

            with self.lock:
                for char in self.characters.values():
                    self._update_character_position(char, delta_time)
            
            time.sleep(0.016)  # Approximately 60 FPS

    def get_all_characters(self) -> List[Dict]:
        """Return a list of all characters and their current states."""
        with self.lock:
            return [
                {
                    "id": char.id,
                    "x": char.x,
                    "y": char.y,
                    "direction": char.direction,
                    "characterType": char.character_type,
                    "isMoving": char.is_moving
                }
                for char in self.characters.values()
            ]

    def cleanup(self):
        """Cleanup timers and threads."""
        self.running = False
        with self.lock:
            for char in self.characters.values():
                if char.timer is not None:
                    char.timer.cancel()
        if self.update_thread.is_alive():
            self.update_thread.join()