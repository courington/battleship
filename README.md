# Battleship 
The classic, grid-based game of naval warfare.

Each player starts with an empty 10x10 grid. Rows are identifed with the letters A-J, columns by the numbers 1-10. Each player places all of their ships on their grid. They then take turns firing at positions on the grid until either _all_ of their opponent's ships are sunk or their own ships are all sunk.

https://en.wikipedia.org/wiki/Battleship_(game)

## This project

Instead of a two-player version of the game this project is instead to implement a single player CLI version that accepts input files and produces the expected output as described below.

*To run this project see the [src/README.md](https://github.com/courington/battleship/tree/main/src#readme)*

### Board

```text
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10|
A |___|___|___|___|___|___|___|___|___|___|
B |___|___|___|___|___|___|___|___|___|___|
C |___|___|___|___|___|___|___|___|___|___|
D |___|___|___|___|___|___|___|___|___|___|
E |___|___|___|___|___|___|___|___|___|___|
F |___|___|___|___|___|___|___|___|___|___|
G |___|___|___|___|___|___|___|___|___|___|
H |___|___|___|___|___|___|___|___|___|___|
I |___|___|___|___|___|___|___|___|___|___|
J |___|___|___|___|___|___|___|___|___|___|
```

### Ships

| Class of ship | Size |
| --- | --- |
| Carrier | 5 |
| Battleship | 4 |
| Cruiser | 3 |
| Submarine | 3 |
| Destroyer | 2 |


## API

### Types and Values:

    Direction: down, right
    Position: ex. A10, B5, F9
    Ships: Carrier, Battleship, Cruiser, Submarine, Destroyer

### Commands:
```
PLACE_SHIP
FIRE
```

#### `PLACE_SHIP`
```
  Inputs:
    Ship
    Direction
    Position
  Output:
    "Placed {Ship}"
```

#### `FIRE`
```
  Input:
    Position
  Output:
    “Hit” |
    “Miss” |
    “You sunk my {Ship}!” |
    “Game Over”
```

### Example Input Sequence

```
PLACE_SHIP Destroyer right A1
PLACE_SHIP Carrier down B2
PLACE_SHIP Battleship right J4
PLACE_SHIP Submarine right E6
PLACE_SHIP Cruiser right H1

FIRE A4
FIRE E6
FIRE E7
FIRE E8
FIRE B1
...
```

### Example Output
```
Placed Destroyer
Placed Carrier
Placed Battleship
Placed Submarine
Placed Cruiser
Miss
Hit
Hit
Hit
You sunk my Submarine!
Miss
...
You sunk my Cruiser!
...
Hit
Hit
Hit
You sunk my Destroyer!
...
Game Over
```
