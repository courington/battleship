/**
 * Represents the type of ship.
 */
export enum ShipType {
  Carrier = 'Carrier',
  Battleship = 'Battleship',
  Cruiser = 'Cruiser',
  Submarine = 'Submarine',
  Destroyer = 'Destroyer',
}

/**
 * Represents the placement direction of a ship.
 */
export enum Direction {
  Down = 'down',
  Right = 'right',
}

/**
 * Represents a position on the game grid (e.g., A1, J10).
 * Rows are 0-9 (A-J), Columns are 0-9 (1-10).
 */
export interface Position {
  row: number; // 0-9 corresponding to A-J
  col: number; // 0-9 corresponding to 1-10
}

/**
 * Represents the state of a single ship on the board.
 */
export interface ShipState {
  type: ShipType;
  positions: Position[]; // All positions occupied by the ship
  hits: Position[]; // Positions that have been hit
  isSunk: boolean;
}

/**
 * Represents the PLACE_SHIP command structure.
 */
export interface PlaceShipCommand {
  type: 'PLACE_SHIP';
  shipType: ShipType;
  direction: Direction;
  position: Position;
}

/**
 * Represents the FIRE command structure.
 */
export interface FireCommand {
  type: 'FIRE';
  position: Position;
}

/**
 * Union type for all possible game commands.
 */
export type Command = PlaceShipCommand | FireCommand;

/**
 * Maps ShipType to its size (number of positions it occupies).
 */
export const ShipSizes: Record<ShipType, number> = {
  [ShipType.Carrier]: 5,
  [ShipType.Battleship]: 4,
  [ShipType.Cruiser]: 3,
  [ShipType.Submarine]: 3,
  [ShipType.Destroyer]: 2,
}; 