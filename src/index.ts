import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import path from 'path';
import { Game } from './game';
import { Command, PlaceShipCommand, FireCommand, ShipType, Direction, Position } from './types';

/**
 * Parses a line from the input file into a Command object.
 * PLACE_SHIP <ShipType> <Position> <Direction>
 * FIRE <Position>
 * @param line The line string from the input file.
 * @returns A Command object or null if the line is empty/invalid.
 * @throws Error for invalid command formats or values.
 */
function parseCommand(line: string): Command | null {
  const parts = line.trim().split(/\s+/);
  if (parts.length === 0 || parts[0] === '') return null; // Ignore empty lines

  const commandType = parts[0].toUpperCase();

  if (commandType === 'PLACE_SHIP' && parts.length === 4) {
    const shipType = parts[1] as ShipType;
    const direction = parts[2].toLowerCase() as Direction;
    const positionStr = parts[3];

    // Validate ShipType
    if (!Object.values(ShipType).includes(shipType)) {
      throw new Error(`Invalid ShipType: ${parts[1]}. Valid types: ${Object.values(ShipType).join(', ')}`);
    }
    // Validate Direction
    if (direction !== Direction.Down && direction !== Direction.Right) {
      throw new Error(`Invalid Direction: ${parts[3]}. Valid directions: ${Direction.Down}, ${Direction.Right}`);
    }
    // Validate and parse Position (using Game.parsePosition for consistency)
    const position = Game.parsePosition(positionStr);

    return {
      type: 'PLACE_SHIP',
      shipType,
      position,
      direction,
    } as PlaceShipCommand;

  } else if (commandType === 'FIRE' && parts.length === 2) {
    const positionStr = parts[1];
    // Validate and parse Position
    const position = Game.parsePosition(positionStr);

    return {
      type: 'FIRE',
      position,
    } as FireCommand;

  } else {
    throw new Error(`Invalid command format: "${line}"`);
  }
}

/**
 * Main application function.
 */
async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('input', {
      alias: 'i',
      description: 'Path to the input file containing game commands',
      type: 'string',
      demandOption: true, // Make the input file mandatory
    })
    .help()
    .alias('help', 'h')
    .parse();

  const inputFile = path.resolve(argv.input); // Resolve to absolute path

  // Optional: Print the input file path
//   console.log(`Reading commands from: ${inputFile}`);

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file not found at ${inputFile}`);
    process.exit(1);
  }

  const game = new Game();

  try {
    const fileContent = fs.readFileSync(inputFile, 'utf-8');
    const lines = fileContent.split(/\r?\n/); // Split by newline, handling Windows/Unix endings

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      try {
        const command = parseCommand(line);
        if (command) {
            // console.log(`Executing: ${JSON.stringify(command)}`); // Optional: log command
          if (command.type === 'PLACE_SHIP') {
            const placeResult = game.placeShip(command);
            console.log(placeResult); // Print Ship Placed messages
          } else if (command.type === 'FIRE') {
            const result = game.fire(command);
            console.log(result); // Print Hit/Miss/Sunk messages
          }
        }
      } catch (error: any) {
        console.error(`Error processing line ${i + 1} ("${line}"): ${error.message}`);
        // Decide whether to stop processing or continue
        // process.exit(1); // Option: Stop on first error
      }
    }
    console.log("Game Over");

  } catch (error: any) {
    console.error(`Error reading or processing file: ${error.message}`);
    process.exit(1);
  }
}

// Run the main function
main().catch(err => {
  console.error("An unexpected error occurred:", err);
  process.exit(1);
}); 