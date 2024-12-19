/* eslint-disable react/prop-types */
import { useState } from 'react';
import './index.css';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status = '';
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board">
        {squares.map((value, index) => (
          <Square key={index} value={value} onSquareClick={() => handleClick(index)} />
        ))}
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMoves, setCurrentMoves] = useState(0);
  const [playerX, setPlayerX] = useState('');
  const [playerO, setPlayerO] = useState('');
  const [showModal, setShowModal] = useState(true);

  const xIsNext = currentMoves % 2 === 0;
  const currentSquares = history[currentMoves];

  function jumpTo(nextMove) {
    setCurrentMoves(nextMove);
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMoves + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMoves(nextHistory.length - 1);
  }

  function handleStartGame(event) {
    event.preventDefault(); // Prevent page reload
    const nameX = event.target.playerX.value.trim() || 'Player X';
    const nameO = event.target.playerO.value.trim() || 'Player O';

    setPlayerX(nameX);
    setPlayerO(nameO);
    setShowModal(false);
  }

  const moves = history.map((squares, move) => {
    const description = move > 0 ? 'Go to move #' + move : 'Go to game start';
    return (
      <li key={move} className="history-item">
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <>
      {showModal && (
        <div className="modal">
          <form className="modal-content" onSubmit={handleStartGame}>
            <h2>Welcome To Tic Tac Toe Games</h2>
            <label>
              Player X: 
              <input type="text" name="playerX" placeholder="Enter name for Player X" />
            </label>
            <label>
              Player O:
              <input type="text" name="playerO" placeholder="Enter name for Player O" />
            </label>
            <button type="submit">Start Game</button>
          </form>
        </div>
      )}

      {!showModal && (
        <div className="game">
          <div className="game-board">
            <h2>
              {playerX} (X) vs {playerO} (O)
            </h2>
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
          </div>
          <div className="game-info">
            <h3>History</h3>
            <ol>{moves}</ol>
          </div>
        </div>
      )}
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
