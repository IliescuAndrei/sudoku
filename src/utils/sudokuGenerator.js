import { solveSudoku, countSolutions } from './sudokuSolver.js';

// Generate a complete valid Sudoku solution
function generateCompleteSolution() {
  const board = Array(9).fill(null).map(() => Array(9).fill(0));
  
  // Fill diagonal 3x3 boxes first (they don't conflict with each other)
  fillDiagonalBoxes(board);
  
  // Solve the rest
  solveSudoku(board);
  
  return board;
}

// Fill the three diagonal 3x3 boxes
function fillDiagonalBoxes(board) {
  for (let box = 0; box < 9; box += 3) {
    fillBox(board, box, box);
  }
}

// Fill a 3x3 box with random numbers
function fillBox(board, row, col) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  shuffleArray(numbers);
  
  let index = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      board[row + i][col + j] = numbers[index++];
    }
  }
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Remove cells based on difficulty
function removeCells(board, difficulty) {
  const cellsToRemove = {
    easy: 20 + Math.floor(Math.random() * 6),    // 20-25 (more cells remain, easier)
    medium: 30 + Math.floor(Math.random() * 6),  // 30-35
    hard: 40 + Math.floor(Math.random() * 6)     // 40-45 (fewer cells remain, harder)
  };
  
  const targetRemovals = cellsToRemove[difficulty] || cellsToRemove.medium;
  const puzzle = board.map(row => [...row]);
  
  // Create list of all cell positions
  const positions = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      positions.push([row, col]);
    }
  }
  
  shuffleArray(positions);
  
  let removed = 0;
  for (const [row, col] of positions) {
    if (removed >= targetRemovals) break;
    
    const originalValue = puzzle[row][col];
    puzzle[row][col] = 0;
    
    // Check if puzzle still has unique solution
    const testPuzzle = puzzle.map(r => [...r]);
    const solutionCount = countSolutions(testPuzzle, 2);
    
    if (solutionCount === 1) {
      removed++;
    } else {
      // Restore value if removing it breaks uniqueness
      puzzle[row][col] = originalValue;
    }
  }
  
  return puzzle;
}

// Generate a Sudoku puzzle with specified difficulty
export function generatePuzzle(difficulty = 'medium') {
  // Generate complete solution
  const solution = generateCompleteSolution();
  
  // Remove cells to create puzzle
  const puzzle = removeCells(solution, difficulty);
  
  return {
    puzzle: puzzle,
    solution: solution
  };
}

