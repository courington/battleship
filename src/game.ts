import {
  ShipType,
  Direction,
  Position,
  ShipState,
  ShipSizes,
  PlaceShipCommand,
  FireCommand,
} from './types';

// Assuming a 10x10 grid (Rows A-J, Columns 1-10)
const GRID_SIZE = 10;

/**
 * Represents the state of a cell on the grid.
 */
interface GridCell {
  shipType: ShipType | null; // Type of ship occupying the cell, if any
  isHit: boolean;
}

/**
 * Manages the Battleship game state and logic.
 */
export class Game {
  private board: GridCell[][];
  private ships: Map<ShipType, ShipState>;

  constructor() {
    this.board = this.initializeBoard();
    this.ships = new Map<ShipType, ShipState>();
  }

  /**
   * Initializes the game board with empty cells.
   */
  private initializeBoard(): GridCell[][] {
    const board: GridCell[][] = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      board[r] = [];
      for (let c = 0; c < GRID_SIZE; c++) {
        board[r][c] = { shipType: null, isHit: false };
      }
    }
    return board;
  }

  /**
   * Places a ship on the board based on the command.
   * @param command The PlaceShipCommand details.
   * @throws Error if placement is invalid (out of bounds, overlaps, ship already placed).
   */
  placeShip(command: PlaceShipCommand): string {
    const { shipType, direction, position } = command;
    const shipSize = ShipSizes[shipType];

    // 1. Check if ship type already placed
    if (this.ships.has(shipType)) {
      throw new Error(`Ship type ${shipType} has already been placed.`);
    }

    // 2. Calculate ship positions
    const shipPositions: Position[] = [];
    for (let i = 0; i < shipSize; i++) {
      let { row, col } = position;
      if (direction === Direction.Down) {
        row += i;
      } else { // Direction.Right
        col += i;
      }
      shipPositions.push({ row, col });
    }

    // 3. Validate positions (bounds and overlap)
    for (const pos of shipPositions) {
      // Check bounds
      if (!this.isValidPosition(pos)) {
        throw new Error(
          `Placement for ${shipType} starting at ${Game.formatPosition(position)} ${direction} goes out of bounds at ${Game.formatPosition(pos)}.`
        );
      }
      // Check overlap
      if (this.board[pos.row][pos.col].shipType !== null) {
        throw new Error(
          `Placement for ${shipType} starting at ${Game.formatPosition(position)} ${direction} overlaps with another ship at ${Game.formatPosition(pos)}.`
        );
      }
    }

    // 4. Place the ship on the board and update state
    const newShipState: ShipState = {
      type: shipType,
      positions: shipPositions,
      hits: [],
      isSunk: false,
    };
    this.ships.set(shipType, newShipState);

    for (const pos of shipPositions) {
      this.board[pos.row][pos.col].shipType = shipType;
    }

    // Optional: Log successful placement
    // console.log(`Successfully placed ${shipType} at ${Game.formatPosition(position)} direction ${direction}`);
    return `Placed ${shipType}`;
  }

  /**
   * Processes a fire command.
   * @param command The FireCommand details.
   * @returns "Hit", "Miss", or "You sunk my {ShipType}".
   * @throws Error if the targeted position is invalid or already fired upon.
   */
  fire(command: FireCommand): string {
    const { position } = command;

    // 1. Validate position
    if (!this.isValidPosition(position)) {
      throw new Error(`Invalid fire position: ${Game.formatPosition(position)} is out of bounds.`);
    }

    const { row, col } = position;
    const targetCell = this.board[row][col];

    // 2. Check if already hit
    if (targetCell.isHit) {
       // Decide on behavior: ignore, error, or specific message? Let's throw an error.
      throw new Error(`Position ${Game.formatPosition(position)} has already been fired upon.`);
    }

    // 3. Mark the cell as hit
    targetCell.isHit = true;

    // 4. Check for hit or miss
    const hitShipType = targetCell.shipType;

    if (hitShipType === null) {
      // 4a. Miss
      return "Miss";
    } else {
      // 4b. Hit
      const shipState = this.ships.get(hitShipType);
      if (!shipState) {
        // Should not happen if board state is consistent
        throw new Error(`Internal error: Ship state not found for type ${hitShipType} at hit position.`);
      }

      // Record the hit
      shipState.hits.push(position); 

      // Check if sunk
      const shipSize = ShipSizes[hitShipType];
      if (shipState.hits.length === shipSize) {
        shipState.isSunk = true;
        // Check if all ships are sunk (optional game end condition)
        // this.checkAllShipsSunk(); 
        return `You sunk my ${hitShipType}!`;
      } else {
        return "Hit";
      }
    }
  }

  // --- Helper Methods (to be implemented) ---

  /**
   * Checks if a position is within the grid boundaries.
   * @param pos The position to check.
   * @returns True if the position is valid, false otherwise.
   */
  private isValidPosition(pos: Position): boolean {
    return pos.row >= 0 && pos.row < GRID_SIZE && pos.col >= 0 && pos.col < GRID_SIZE;
  }

  /**
   * Converts grid coordinates (e.g., A1, C10) to a Position object.
   * @param gridPos String representation (e.g., "A1").
   * @returns Position object { row: number, col: number }.
   * @throws Error if the format is invalid.
   */
  static parsePosition(gridPos: string): Position {
     // TODO: Implement parsing logic (e.g., regex or manual parsing)
    // console.log(`Placeholder: Parsing position ${gridPos}`); // Removed placeholder log
     // Assumes A1 format, needs proper validation/conversion
     const rowChar = gridPos.charAt(0).toUpperCase();
     const colStr = gridPos.substring(1);
     const row = rowChar.charCodeAt(0) - 'A'.charCodeAt(0);
     const col = parseInt(colStr, 10) - 1;
     if (isNaN(row) || isNaN(col) || row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) {
        throw new Error(`Invalid position format: ${gridPos}`);
     }
     return { row, col };
  }

   /**
    * Converts a Position object back to grid coordinates (e.g., "A1").
    * @param pos Position object.
    * @returns String representation (e.g., "A1").
    */
  static formatPosition(pos: Position): string {
    const rowChar = String.fromCharCode('A'.charCodeAt(0) + pos.row);
    const colStr = (pos.col + 1).toString();
    return `${rowChar}${colStr}`;
  }
} 