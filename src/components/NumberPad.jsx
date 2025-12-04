import React from 'react';

function NumberPad({ selectedCell, onCellChange, initialPuzzle, noteMode, board, notes }) {
  const handleNumberClick = (number) => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;
    if (initialPuzzle[row][col] !== 0) return;
    
    if (noteMode) {
      // In note mode, toggle the note (onCellChange already handles this)
      onCellChange(row, col, number);
    } else {
      // In normal mode, toggle the value
      const currentValue = board[row][col];
      if (currentValue === number) {
        // If same number is clicked, clear it
        onCellChange(row, col, 0);
      } else {
        // Otherwise, set the new value
        onCellChange(row, col, number);
      }
    }
  };

  const isDisabled = !selectedCell || (selectedCell && initialPuzzle[selectedCell[0]]?.[selectedCell[1]] !== 0);

  // Determine which number is highlighted
  const getHighlightedNumber = () => {
    if (!selectedCell) return null;
    const [row, col] = selectedCell;
    
    if (noteMode) {
      // In note mode, highlight if the cell has notes (but we can't highlight a specific number easily)
      // For now, we'll highlight if any notes exist
      const cellKey = `${row}-${col}`;
      const currentNotes = notes[cellKey] || new Set();
      return currentNotes.size > 0 ? 'has-notes' : null;
    } else {
      // In normal mode, highlight the current cell value
      return board[row][col] || null;
    }
  };

  const highlightedNumber = getHighlightedNumber();

  return (
    <div className="number-pad">
      <div className="number-pad-row">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
          const isHighlighted = noteMode 
            ? (highlightedNumber === 'has-notes' && notes[`${selectedCell?.[0]}-${selectedCell?.[1]}`]?.has(num))
            : (highlightedNumber === num);
          
          return (
            <button
              key={num}
              className={`number-pad-button ${isHighlighted ? 'highlighted' : ''}`}
              onClick={() => handleNumberClick(num)}
              disabled={isDisabled}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default NumberPad;

