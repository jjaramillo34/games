import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/TicTacToe.css";

const TicTacToe = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [status, setStatus] = useState("Next player: X");
  const [gameMode, setGameMode] = useState(null);
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);
  const [isThinking, setIsThinking] = useState(false);

  const handleClick = (index) => {
    if (squares[index] || calculateWinner(squares) || isThinking) return;

    const newSquares = squares.slice();
    newSquares[index] = isXNext ? "X" : "O";
    setSquares(newSquares);

    const winner = calculateWinner(newSquares);
    if (winner) {
      setStatus(`Winner: ${winner}`);
      if (winner === "X") {
        setXWins(xWins + 1);
      } else {
        setOWins(oWins + 1);
      }
    } else if (newSquares.every((square) => square !== null)) {
      setStatus("Tie");
    } else {
      if (gameMode === "computer" && !isXNext) {
        setIsThinking(true);
        setStatus("Computer is thinking...");
        setTimeout(() => computerMove(newSquares), 2000);
      } else {
        setIsXNext(!isXNext);
        setStatus(`Next player: ${isXNext ? "O" : "X"}`);
      }
    }
  };

  const computerMove = (newSquares) => {
    let emptyIndices = newSquares
      .map((value, index) => (value === null ? index : null))
      .filter((val) => val !== null);
    let randomIndex =
      emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    newSquares[randomIndex] = "O";
    setSquares(newSquares);

    const winner = calculateWinner(newSquares);
    if (winner) {
      setStatus(`Winner: ${winner}`);
      if (winner === "X") {
        setXWins(xWins + 1);
      } else {
        setOWins(oWins + 1);
      }
    } else if (newSquares.every((square) => square !== null)) {
      setStatus("Tie");
    } else {
      setIsXNext(true);
      setStatus("Next player: X");
    }
    setIsThinking(false);
  };

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
    setStatus("Next player: X");
  };

  const startGame = (mode) => {
    setGameMode(mode);
    resetGame();
  };

  return (
    <div className="tic-tac-toe">
      {!gameMode ? (
        <div className="menu">
          <button onClick={() => startGame("human")} data-aos="fade-up">
            Play with Human
          </button>
          <button onClick={() => startGame("computer")} data-aos="fade-up">
            Play with Computer
          </button>
        </div>
      ) : (
        <>
          <div className="status" data-aos="fade-down">
            {status}
          </div>
          <div className="scoreboard" data-aos="fade-down">
            <div>X Wins: {xWins}</div>
            <div>O Wins: {oWins}</div>
          </div>
          <div className="board">
            {squares.map((square, index) => (
              <div
                key={index}
                className="square"
                onClick={() => handleClick(index)}
                data-aos="flip-left"
              >
                {square}
              </div>
            ))}
          </div>
          <button className="reset" onClick={resetGame} data-aos="fade-up">
            Reset
          </button>
        </>
      )}
    </div>
  );
};

const calculateWinner = (squares) => {
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
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

export default TicTacToe;
