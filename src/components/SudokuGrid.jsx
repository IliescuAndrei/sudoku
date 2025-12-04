import React, { useRef, useEffect } from 'react';

function SudokuGrid({ 
  puzzle, 
  board, 
  selectedCell, 
  errorCells, 
  onCellSelect, 
  onCellChange,
  initialPuzzle,
  notes,
  noteMode
}) {
  const inputRef = useRef(null);

  // Focus the hidden input when a cell is selected (triggers mobile keyboard)
  useEffect(() => {
    if (selectedCell && inputRef.current) {
      const [row, col] = selectedCell;
      if (initialPuzzle[row][col] === 0) {
        // Small delay to ensure the cell is rendered
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    }
  }, [selectedCell, initialPuzzle]);

  const handleCellClick = (row, col) => {
    // Only allow selection of empty or user-filled cells
    if (initialPuzzle[row][col] === 0) {
      onCellSelect([row, col]);
    }
  };

  const handleInputChange = (e) => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;
    if (initialPuzzle[row][col] !== 0) return;

    const value = e.target.value;
    
    // Handle single digit input
    if (value.length > 0) {
      const lastChar = value.slice(-1);
      if (lastChar >= '1' && lastChar <= '9') {
        onCellChange(row, col, parseInt(lastChar));
      }
    } else {
      // Empty input means delete
      if (!noteMode) {
        onCellChange(row, col, 0);
      }
    }
    
    // Clear the input after processing
    e.target.value = '';
  };

  const handleInputKeyDown = (e) => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;
    if (initialPuzzle[row][col] !== 0) return;

    if (e.key === 'Backspace' || e.key === 'Delete') {
      if (!noteMode) {
        onCellChange(row, col, 0);
      }
      e.target.value = '';
    } else if (e.key === 'ArrowUp' && row > 0) {
      e.preventDefault();
      onCellSelect([row - 1, col]);
    } else if (e.key === 'ArrowDown' && row < 8) {
      e.preventDefault();
      onCellSelect([row + 1, col]);
    } else if (e.key === 'ArrowLeft' && col > 0) {
      e.preventDefault();
      onCellSelect([row, col - 1]);
    } else if (e.key === 'ArrowRight' && col < 8) {
      e.preventDefault();
      onCellSelect([row, col + 1]);
    }
  };

  const handleKeyDown = (e, row, col) => {
    if (initialPuzzle[row][col] !== 0) return; // Can't edit initial puzzle cells
    
    if (e.key >= '1' && e.key <= '9') {
      onCellChange(row, col, parseInt(e.key));
    } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
      if (!noteMode) {
        onCellChange(row, col, 0);
      }
    } else if (e.key === 'ArrowUp' && row > 0) {
      e.preventDefault();
      onCellSelect([row - 1, col]);
    } else if (e.key === 'ArrowDown' && row < 8) {
      e.preventDefault();
      onCellSelect([row + 1, col]);
    } else if (e.key === 'ArrowLeft' && col > 0) {
      e.preventDefault();
      onCellSelect([row, col - 1]);
    } else if (e.key === 'ArrowRight' && col < 8) {
      e.preventDefault();
      onCellSelect([row, col + 1]);
    }
  };

  const getCellNotes = (row, col) => {
    const cellKey = `${row}-${col}`;
    return notes[cellKey] || new Set();
  };

  const renderNotes = (row, col) => {
    const cellNotes = getCellNotes(row, col);
    if (cellNotes.size === 0) return null;

    const notesArray = Array.from(cellNotes).sort((a, b) => a - b);
    const notesGrid = Array(9).fill(null).map((_, i) => {
      const num = i + 1;
      return notesArray.includes(num) ? num : null;
    });

    return (
      <div className="notes-grid">
        {notesGrid.map((note, idx) => (
          <span key={idx} className="note-number">
            {note || ''}
          </span>
        ))}
      </div>
    );
  };

  const isSelected = (row, col) => {
    return selectedCell && selectedCell[0] === row && selectedCell[1] === col;
  };

  const isError = (row, col) => {
    return errorCells.has(`${row}-${col}`);
  };

  const isInitial = (row, col) => {
    return initialPuzzle[row][col] !== 0;
  };

  const isSameRow = (row) => {
    return selectedCell && selectedCell[0] === row;
  };

  const isSameCol = (col) => {
    return selectedCell && selectedCell[1] === col;
  };

  const isSameBox = (row, col) => {
    if (!selectedCell) return false;
    const [selRow, selCol] = selectedCell;
    return (
      Math.floor(row / 3) === Math.floor(selRow / 3) &&
      Math.floor(col / 3) === Math.floor(selCol / 3)
    );
  };

  const getCellClass = (row, col) => {
    let classes = 'sudoku-cell';
    
    if (isInitial(row, col)) {
      classes += ' initial-cell';
    }
    
    if (isSelected(row, col)) {
      classes += ' selected-cell';
    } else if (selectedCell && (isSameRow(row) || isSameCol(col) || isSameBox(row, col))) {
      classes += ' highlighted-cell';
    }
    
    if (isError(row, col)) {
      classes += ' error-cell';
    }
    
    // Add border classes for 3x3 boxes
    if (row % 3 === 0 && row > 0) {
      classes += ' border-top';
    }
    if (col % 3 === 0 && col > 0) {
      classes += ' border-left';
    }
    
    return classes;
  };

  return (
    <>
      {/* Hidden input to trigger mobile keyboard */}
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        className="hidden-input"
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        value=""
        autoComplete="off"
        aria-label="Sudoku cell input"
      />
      <div className="sudoku-grid">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="sudoku-row">
            {row.map((cell, colIndex) => {
              const cellValue = cell === 0 ? '' : cell;
              const hasNotes = getCellNotes(rowIndex, colIndex).size > 0;
              const showNotes = cellValue === '' && hasNotes;
              
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={getCellClass(rowIndex, colIndex)}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                  tabIndex={isInitial(rowIndex, colIndex) ? -1 : 0}
                >
                  {showNotes ? (
                    renderNotes(rowIndex, colIndex)
                  ) : (
                    <span className="cell-value">{cellValue}</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

export default SudokuGrid;

