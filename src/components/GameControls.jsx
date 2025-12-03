import React from 'react';

function GameControls({ 
  difficulty, 
  onDifficultyChange, 
  onNewGame, 
  onValidate, 
  onHint,
  onToggleNoteMode,
  noteMode,
  validationMessage 
}) {
  return (
    <div className="game-controls">
      <div className="controls-section">
        <label htmlFor="difficulty">Difficulty:</label>
        <select 
          id="difficulty" 
          value={difficulty} 
          onChange={(e) => onDifficultyChange(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      
      <div className="controls-section">
        <button onClick={onNewGame} className="btn btn-primary">
          New Game
        </button>
        <button onClick={onHint} className="btn btn-secondary">
          Hint
        </button>
        <button onClick={onValidate} className="btn btn-secondary">
          Validate
        </button>
        <button 
          onClick={onToggleNoteMode} 
          className={`btn btn-secondary ${noteMode ? 'active' : ''}`}
        >
          {noteMode ? 'Note Mode ON' : 'Note'}
        </button>
      </div>
      
      {validationMessage && (
        <div className={`validation-message ${validationMessage.type}`}>
          {validationMessage.text}
        </div>
      )}
    </div>
  );
}

export default GameControls;

