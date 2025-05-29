import { Game } from '../src/game';
import { ShipType, Direction, Position } from '../src/types';

describe('Game Logic', () => {
  let game: Game;

  // Helper to create position easily
  const pos = (gridPos: string): Position => Game.parsePosition(gridPos);

  beforeEach(() => {
    game = new Game();
  });

  describe('Initialization', () => {
    it('should create a 10x10 board', () => {
      const board = game['board']; // Access private member for testing
      expect(board).toHaveLength(10);
      board.forEach(row => {
        expect(row).toHaveLength(10);
      });
    });

    it('should initialize all board cells correctly (no ship, not hit)', () => {
      const board = game['board'];
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
          expect(board[r][c]).toEqual({ shipType: null, isHit: false });
        }
      }
    });

    it('should initialize with no ships placed', () => {
      const ships = game['ships']; // Access private member for testing
      expect(ships.size).toBe(0);
    });
  });

  // --- Ship Placement Tests ---
  describe('placeShip', () => {
    it('should place a ship successfully in bounds (right)', () => {
      expect(() => game.placeShip({ type: 'PLACE_SHIP', shipType: ShipType.Destroyer, position: pos('A1'), direction: Direction.Right })).not.toThrow();
    });

    it('should place a ship successfully in bounds (down)', () => {
      expect(() => game.placeShip({ type: 'PLACE_SHIP', shipType: ShipType.Cruiser, position: pos('H8'), direction: Direction.Down })).not.toThrow(); // H8, I8, J8
    });

    it('should throw error if ship type is already placed', () => {
      game.placeShip({ type: 'PLACE_SHIP', shipType: ShipType.Destroyer, position: pos('A1'), direction: Direction.Right });
      expect(() => game.placeShip({ type: 'PLACE_SHIP', shipType: ShipType.Destroyer, position: pos('C1'), direction: Direction.Right }))
        .toThrow('Ship type Destroyer has already been placed.');
    });

    it('should throw error if placement goes out of bounds (right)', () => {
      expect(() => game.placeShip({ type: 'PLACE_SHIP', shipType: ShipType.Carrier, position: pos('A7'), direction: Direction.Right })) // A7,A8,A9,A10,A11(invalid)
        .toThrow('goes out of bounds at A11');
    });

    it('should throw error if placement goes out of bounds (down)', () => {
      expect(() => game.placeShip({ type: 'PLACE_SHIP', shipType: ShipType.Battleship, position: pos('H1'), direction: Direction.Down })) // H1,I1,J1,K1(invalid)
        .toThrow('goes out of bounds at K1');
    });

    it('should throw error if placement overlaps with another ship', () => {
      game.placeShip({ type: 'PLACE_SHIP', shipType: ShipType.Destroyer, position: pos('A1'), direction: Direction.Right }); // Occupies A1, A2
      expect(() => game.placeShip({ type: 'PLACE_SHIP', shipType: ShipType.Submarine, position: pos('A2'), direction: Direction.Down })) // Tries A2, B2, C2
        .toThrow('overlaps with another ship at A2');
    });
  });

  // --- Firing Tests ---
  describe('fire', () => {
    beforeEach(() => {
      // Place some ships for firing tests
      game.placeShip({ type: 'PLACE_SHIP', shipType: ShipType.Destroyer, position: pos('A1'), direction: Direction.Right }); // A1, A2
      game.placeShip({ type: 'PLACE_SHIP', shipType: ShipType.Submarine, position: pos('C5'), direction: Direction.Down });    // C5, D5, E5
    });

    it('should return "Miss" for a shot at an empty cell', () => {
      expect(game.fire({ type: 'FIRE', position: pos('B3') })).toBe('Miss');
    });

    it('should return "Hit" for a shot hitting a ship', () => {
      expect(game.fire({ type: 'FIRE', position: pos('A1') })).toBe('Hit');
    });

    it('should return "You sunk my Destroyer" when the last part is hit', () => {
      game.fire({ type: 'FIRE', position: pos('A1') }); // Hit 1
      expect(game.fire({ type: 'FIRE', position: pos('A2') })).toBe('You sunk my Destroyer!'); // Hit 2 (sunk)
    });
    
    it('should return "You sunk my Submarine" when the last part is hit', () => {
        game.fire({ type: 'FIRE', position: pos('C5') }); // Hit 1
        game.fire({ type: 'FIRE', position: pos('D5') }); // Hit 2
        expect(game.fire({ type: 'FIRE', position: pos('E5') })).toBe('You sunk my Submarine!'); // Hit 3 (sunk)
    });

    it('should throw error when firing at an invalid position (out of bounds)', () => {
      expect(() => pos('K11')).toThrow('Invalid position format: K11');
    });

    it('should throw error when firing at an already hit position (Miss)', () => {
      game.fire({ type: 'FIRE', position: pos('B3') }); // First shot (Miss)
      expect(() => game.fire({ type: 'FIRE', position: pos('B3') }))
        .toThrow('Position B3 has already been fired upon.');
    });

    it('should throw error when firing at an already hit position (Hit)', () => {
      game.fire({ type: 'FIRE', position: pos('A1') }); // First shot (Hit)
      expect(() => game.fire({ type: 'FIRE', position: pos('A1') }))
        .toThrow('Position A1 has already been fired upon.');
    });
  });
}); 