# Battleship CLI

A command-line interface for playing a simplified version of Battleship against pre-defined moves.

## Setup

1.  Ensure you have Node.js (version specified in `.nvmrc`) and npm installed.
2.  If using `nvm`, run `nvm use` in the project directory.
3.  Install dependencies:
    ```bash
    npm install
    ```

## Building

To compile the TypeScript code to JavaScript:

```bash
npm run build
```

This will output the compiled code to the `dist` directory.

## Running

### Development

To run the application directly using `ts-node` (useful during development):

```bash
npm run dev -- --input <path/to/input/file>
```

### Production

After building the project (`npm run build`), run the compiled JavaScript:

```bash
npm start -- --input <path/to/input/file>
```

Replace `<path/to/input/file>` with the actual path to your input file (e.g., `inputs/moves.txt`).

## Testing

To run the tests:

```bash
npm test
```

## Input File Format

*(Details about the input file format will be added here later)* 