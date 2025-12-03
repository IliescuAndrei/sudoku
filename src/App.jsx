import React, { useState, useEffect, useCallback } from 'react';
import SudokuGrid from './components/SudokuGrid';
import GameControls from './components/GameControls';
import { generatePuzzle } from './utils/sudokuGenerator';
import { getAllErrorCells, isSolved } from './utils/sudokuValidator';
import { solveSudoku } from './utils/sudokuSolver';

function App() {
  const [difficulty, setDifficulty] = useState('medium');
  const [puzzle, setPuzzle] = useState(null);
  const [solution, setSolution] = useState(null);
  const [board, setBoard] = useState(null);
  const [initialPuzzle, setInitialPuzzle] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [errorCells, setErrorCells] = useState(new Set());
  const [validationMessage, setValidationMessage] = useState(null);
  const [noteMode, setNoteMode] = useState(false);
  const [notes, setNotes] = useState({}); // Store notes as "row-col": Set([1,2,3...])

  // Initialize game
  const initializeGame = useCallback(() => {
    const { puzzle: newPuzzle, solution: newSolution } = generatePuzzle(difficulty);
    setPuzzle(newPuzzle);
    setSolution(newSolution);
    setBoard(newPuzzle.map(row => [...row]));
    setInitialPuzzle(newPuzzle.map(row => [...row]));
    setSelectedCell(null);
    setErrorCells(new Set());
    setValidationMessage(null);
    setNotes({});
    setNoteMode(false);
  }, [difficulty]);

  // Initialize on mount and when difficulty changes
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Update error cells when board changes (compare against solution)
  useEffect(() => {
    if (board && solution) {
      const errors = getAllErrorCells(board, solution);
      setErrorCells(errors);
    }
  }, [board, solution]);

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    // Game will reinitialize via useEffect
  };

  const handleNewGame = () => {
    initializeGame();
  };

  const handleCellSelect = (cell) => {
    setSelectedCell(cell);
  };

  const handleCellChange = (row, col, value) => {
    if (initialPuzzle[row][col] !== 0) return; // Can't change initial puzzle cells
    
    if (noteMode) {
      // Toggle note for this number
      const cellKey = `${row}-${col}`;
      setNotes(prevNotes => {
        const newNotes = { ...prevNotes };
        const currentNotes = newNotes[cellKey] || new Set();
        const newNoteSet = new Set(currentNotes);
        
        if (newNoteSet.has(value)) {
          newNoteSet.delete(value);
        } else {
          newNoteSet.add(value);
        }
        
        if (newNoteSet.size === 0) {
          delete newNotes[cellKey];
        } else {
          newNotes[cellKey] = newNoteSet;
        }
        
        return newNotes;
      });
    } else {
      // Normal value input
      setBoard(prevBoard => {
        const newBoard = prevBoard.map(r => [...r]);
        newBoard[row][col] = value;
        return newBoard;
      });
      
      // Clear notes when a value is entered
      const cellKey = `${row}-${col}`;
      setNotes(prevNotes => {
        const newNotes = { ...prevNotes };
        delete newNotes[cellKey];
        return newNotes;
      });
    }
    
    setValidationMessage(null);
  };

  const handleToggleNoteMode = () => {
    setNoteMode(prev => !prev);
  };

  const handleValidate = () => {
    if (!board || !solution) return;
    
    const errors = getAllErrorCells(board, solution);
    if (errors.size > 0) {
      setValidationMessage({
        type: 'error',
        text: 'There are errors in your solution. Please fix the highlighted cells.'
      });
    } else if (isSolved(board, solution)) {
      setValidationMessage({
        type: 'success',
        text: 'Congratulations! You solved the puzzle!'
      });
    } else {
      setValidationMessage({
        type: 'info',
        text: 'The puzzle is not yet complete, but there are no errors so far.'
      });
    }
  };

  const handleHint = () => {
    if (!board || !solution) return;
    
    // Find empty cells
    const emptyCells = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }
    
    if (emptyCells.length === 0) {
      setValidationMessage({
        type: 'info',
        text: 'The puzzle is already complete!'
      });
      return;
    }
    
    // Pick a random empty cell
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];
    
    // Fill it with the solution value
    setBoard(prevBoard => {
      const newBoard = prevBoard.map(r => [...r]);
      newBoard[row][col] = solution[row][col];
      return newBoard;
    });
    
    setSelectedCell([row, col]);
    setValidationMessage(null);
  };

  if (!board || !puzzle || !solution) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <h1>Sudoku Game</h1>
      <GameControls
        difficulty={difficulty}
        onDifficultyChange={handleDifficultyChange}
        onNewGame={handleNewGame}
        onValidate={handleValidate}
        onHint={handleHint}
        onToggleNoteMode={handleToggleNoteMode}
        noteMode={noteMode}
        validationMessage={validationMessage}
      />
      <SudokuGrid
        puzzle={puzzle}
        board={board}
        selectedCell={selectedCell}
        errorCells={errorCells}
        onCellSelect={handleCellSelect}
        onCellChange={handleCellChange}
        initialPuzzle={initialPuzzle}
        notes={notes}
        noteMode={noteMode}
      />
    </div>
  );
}

export default App;

