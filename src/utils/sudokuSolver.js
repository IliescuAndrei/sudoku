// Backtracking algorithm to solve Sudoku puzzles
export function solveSudoku(board) {
  const emptyCell = findEmptyCell(board);
  
  // If no empty cell, puzzle is solved
  if (!emptyCell) {
    return true;
  }
  
  const [row, col] = emptyCell;
  
  // Try numbers 1-9
  for (let num = 1; num <= 9; num++) {
    if (isValidMove(board, row, col, num)) {
      board[row][col] = num;
      
      // Recursively try to solve
      if (solveSudoku(board)) {
        return true;
      }
      
      // Backtrack if solution not found
      board[row][col] = 0;
    }
  }
  
  return false;
}

// Find the first empty cell (0)
function findEmptyCell(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        return [row, col];
      }
    }
  }
  return null;
}

// Check if placing a number is valid
function isValidMove(board, row, col, num) {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) {
      return false;
    }
  }
  
  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) {
      return false;
    }
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxRow + i][boxCol + j] === num) {
        return false;
      }
    }
  }
  
  return true;
}

// Count number of solutions (to ensure unique solution)
export function countSolutions(board, limit = 2) {
  const emptyCell = findEmptyCell(board);
  
  if (!emptyCell) {
    return 1;
  }
  
  const [row, col] = emptyCell;
  let count = 0;
  
  for (let num = 1; num <= 9 && count < limit; num++) {
    if (isValidMove(board, row, col, num)) {
      board[row][col] = num;
      count += countSolutions(board, limit);
      board[row][col] = 0;
    }
  }
  
  return count;
}

