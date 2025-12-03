// Check if a number placement is valid (no conflicts)
export function isValidPlacement(board, row, col, num) {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (x !== col && board[row][x] === num) {
      return false;
    }
  }
  
  // Check column
  for (let x = 0; x < 9; x++) {
    if (x !== row && board[x][col] === num) {
      return false;
    }
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const checkRow = boxRow + i;
      const checkCol = boxCol + j;
      if (checkRow !== row && checkCol !== col && board[checkRow][checkCol] === num) {
        return false;
      }
    }
  }
  
  return true;
}

// Get all cells that conflict with a given cell
export function getConflictingCells(board, row, col) {
  const conflicts = [];
  const num = board[row][col];
  
  if (num === 0) return conflicts;
  
  // Check row
  for (let x = 0; x < 9; x++) {
    if (x !== col && board[row][x] === num) {
      conflicts.push([row, x]);
    }
  }
  
  // Check column
  for (let x = 0; x < 9; x++) {
    if (x !== row && board[x][col] === num) {
      conflicts.push([x, col]);
    }
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const checkRow = boxRow + i;
      const checkCol = boxCol + j;
      if (checkRow !== row && checkCol !== col && board[checkRow][checkCol] === num) {
        conflicts.push([checkRow, checkCol]);
      }
    }
  }
  
  return conflicts;
}

// Get all error cells on the board (compare against solution)
export function getAllErrorCells(board, solution) {
  const errorCells = new Set();
  
  if (!solution) {
    return errorCells;
  }
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      // If cell is filled and doesn't match solution, it's an error
      if (board[row][col] !== 0 && board[row][col] !== solution[row][col]) {
        errorCells.add(`${row}-${col}`);
      }
    }
  }
  
  return errorCells;
}

// Check if the board is completely solved
export function isSolved(board, solution) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] !== solution[row][col]) {
        return false;
      }
    }
  }
  return true;
}

// Check if the board has any conflicts
export function hasConflicts(board) {
  return getAllErrorCells(board).size > 0;
}

