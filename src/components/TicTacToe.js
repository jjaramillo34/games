import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

// Sound effects URLs
const MOVE_SOUND =
  "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3";
const WIN_SOUND =
  "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3";
const DRAW_SOUND =
  "https://assets.mixkit.co/active_storage/sfx/1427/1427-preview.mp3";

const TicTacToe = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [status, setStatus] = useState("Next player: X");
  const [gameMode, setGameMode] = useState(null);
  const [difficulty, setDifficulty] = useState("easy");
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [winningLine, setWinningLine] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playSound = (url) => {
    if (soundEnabled) {
      new Audio(url)
        .play()
        .catch((error) => console.log("Audio playback failed:", error));
    }
  };

  const getEmptySquares = (board) => {
    return board
      .map((square, idx) => (square === null ? idx : null))
      .filter((idx) => idx !== null);
  };

  const getBestMove = (board) => {
    // For easy mode, occasionally make mistakes
    if (difficulty === "easy") {
      const emptySquares = getEmptySquares(board);
      // 30% chance to make a random move
      if (Math.random() < 0.3) {
        return emptySquares[Math.floor(Math.random() * emptySquares.length)];
      }
    }

    // For medium mode, sometimes make suboptimal moves
    if (difficulty === "medium") {
      const emptySquares = getEmptySquares(board);
      // 50% chance to make a random move
      if (Math.random() < 0.5) {
        return emptySquares[Math.floor(Math.random() * emptySquares.length)];
      }
    }

    // Minimax algorithm with alpha-beta pruning for better performance
    const minimax = (board, depth, alpha, beta, isMaximizing) => {
      const result = calculateWinner(board);

      if (result?.winner === "O") return 10 - depth;
      if (result?.winner === "X") return depth - 10;
      if (getEmptySquares(board).length === 0) return 0;

      if (isMaximizing) {
        let bestScore = -Infinity;
        for (let move of getEmptySquares(board)) {
          const newBoard = [...board];
          newBoard[move] = "O";
          const score = minimax(newBoard, depth + 1, alpha, beta, false);
          bestScore = Math.max(bestScore, score);
          alpha = Math.max(alpha, score);
          if (beta <= alpha) break;
        }
        return bestScore;
      } else {
        let bestScore = Infinity;
        for (let move of getEmptySquares(board)) {
          const newBoard = [...board];
          newBoard[move] = "X";
          const score = minimax(newBoard, depth + 1, alpha, beta, true);
          bestScore = Math.min(bestScore, score);
          beta = Math.min(beta, score);
          if (beta <= alpha) break;
        }
        return bestScore;
      }
    };

    // Check for immediate winning move
    for (let move of getEmptySquares(board)) {
      const newBoard = [...board];
      newBoard[move] = "O";
      if (calculateWinner(newBoard)?.winner === "O") {
        return move;
      }
    }

    // Check for immediate blocking move
    for (let move of getEmptySquares(board)) {
      const newBoard = [...board];
      newBoard[move] = "X";
      if (calculateWinner(newBoard)?.winner === "X") {
        return move;
      }
    }

    // If no immediate winning or blocking moves, use minimax
    let bestScore = -Infinity;
    let bestMove = null;

    for (let move of getEmptySquares(board)) {
      const newBoard = [...board];
      newBoard[move] = "O";
      const score = minimax(newBoard, 0, -Infinity, Infinity, false);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  };

  const handleClick = (index) => {
    if (squares[index] || calculateWinner(squares)?.winner || isThinking)
      return;

    const newSquares = squares.slice();
    newSquares[index] = isXNext ? "X" : "O";
    setSquares(newSquares);
    playSound(MOVE_SOUND);

    const result = calculateWinner(newSquares);
    if (result?.winner) {
      handleGameEnd(result.winner, result.line);
    } else if (getEmptySquares(newSquares).length === 0) {
      handleGameEnd(null); // Draw
    } else {
      if (gameMode === "computer" && isXNext) {
        setIsThinking(true);
        setStatus("Computer is thinking...");
        // Use setTimeout to show the computer is "thinking"
        const thinkingTime =
          difficulty === "easy" ? 500 : difficulty === "medium" ? 750 : 1000;
        setTimeout(() => {
          computerMove(newSquares);
        }, thinkingTime);
      }
      setIsXNext(!isXNext);
      setStatus(`Next player: ${!isXNext ? "X" : "O"}`);
    }
  };

  const handleGameEnd = (winner, line = null) => {
    setWinningLine(line);
    if (winner) {
      playSound(WIN_SOUND);
      const resultText = `${winner} wins!`;
      setStatus(resultText);
      setGameHistory([...gameHistory, resultText]);
      if (winner === "X") {
        setXWins(xWins + 1);
      } else {
        setOWins(oWins + 1);
      }
    } else {
      playSound(DRAW_SOUND);
      const resultText = "Game ended in a tie!";
      setStatus(resultText);
      setGameHistory([...gameHistory, resultText]);
    }
  };

  const computerMove = (board) => {
    const move = getBestMove(board);
    const newSquares = [...board];
    newSquares[move] = "O";
    setSquares(newSquares);
    playSound(MOVE_SOUND);

    const result = calculateWinner(newSquares);
    if (result?.winner) {
      handleGameEnd(result.winner, result.line);
    } else if (getEmptySquares(newSquares).length === 0) {
      handleGameEnd(null); // Draw
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
    setWinningLine(null);
    setIsThinking(false);
  };

  const resetAll = () => {
    resetGame();
    setXWins(0);
    setOWins(0);
    setGameHistory([]);
    setGameMode(null);
    setDifficulty("easy");
  };

  const startGame = (mode) => {
    setGameMode(mode);
    resetGame();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <h1 className="text-4xl font-bold mb-8 text-cyan-400 tracking-wider">
        Tic Tac Toe
      </h1>

      {!gameMode ? (
        <div className="flex flex-col gap-4 w-full max-w-md" data-aos="fade-up">
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold mb-2 text-cyan-400">
              Choose Game Mode
            </h2>
            <button
              onClick={() => startGame("human")}
              className="w-full px-6 py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 mb-3"
            >
              Play with Human
            </button>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setDifficulty("easy");
                  startGame("computer");
                }}
                className="w-full px-6 py-4 text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Play vs Computer (Easy)
              </button>
              <button
                onClick={() => {
                  setDifficulty("medium");
                  startGame("computer");
                }}
                className="w-full px-6 py-4 text-lg font-semibold bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Play vs Computer (Medium)
              </button>
              <button
                onClick={() => {
                  setDifficulty("hard");
                  startGame("computer");
                }}
                className="w-full px-6 py-4 text-lg font-semibold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Play vs Computer (Hard)
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <div
              className="text-2xl font-bold text-cyan-400 text-center"
              data-aos="fade-down"
            >
              {status}
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                soundEnabled
                  ? "bg-cyan-500 hover:bg-cyan-600"
                  : "bg-gray-600 hover:bg-gray-700"
              }`}
            >
              {soundEnabled ? "🔊" : "🔇"}
            </button>
          </div>

          <div
            className="flex justify-between items-center mb-6 px-4"
            data-aos="fade-down"
          >
            <div className="text-xl">
              <span className="text-blue-400 font-bold">X</span>
              <span className="text-gray-400 mx-2">vs</span>
              <span className="text-green-400 font-bold">O</span>
            </div>
            <div className="flex gap-4 text-lg">
              <div className="text-blue-400 font-semibold">Wins: {xWins}</div>
              <div className="text-green-400 font-semibold">Wins: {oWins}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {squares.map((square, index) => (
              <div
                key={index}
                onClick={() => handleClick(index)}
                className={`w-24 h-24 flex items-center justify-center bg-gray-800/50 backdrop-blur-sm border-2 
                  ${
                    square
                      ? "border-gray-600"
                      : "border-gray-700 hover:border-cyan-400"
                  }
                  ${
                    winningLine?.includes(index)
                      ? "animate-pulse border-yellow-400 bg-yellow-400/20"
                      : ""
                  }
                  text-4xl font-bold cursor-pointer hover:bg-gray-700/50 transform hover:scale-105 transition-all duration-300 rounded-lg shadow-lg`}
                data-aos="flip-left"
              >
                <span
                  className={`
                  ${square === "X" ? "text-blue-400" : "text-green-400"}
                  ${winningLine?.includes(index) ? "animate-bounce" : ""}
                  transform transition-transform duration-300
                `}
                >
                  {square}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <button
                className="flex-1 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                onClick={resetGame}
                data-aos="fade-up"
              >
                Reset Game
              </button>
              <button
                className="flex-1 px-6 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                onClick={() => setShowHistory(!showHistory)}
                data-aos="fade-up"
              >
                {showHistory ? "Hide History" : "Show History"}
              </button>
            </div>

            <button
              className="w-full px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              onClick={resetAll}
              data-aos="fade-up"
            >
              New Game
            </button>
          </div>

          {showHistory && gameHistory.length > 0 && (
            <div
              className="mt-6 p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg"
              data-aos="fade-up"
            >
              <h3 className="text-xl font-bold mb-3 text-cyan-400">
                Game History
              </h3>
              <div className="space-y-2">
                {gameHistory.map((result, index) => (
                  <div key={index} className="text-gray-300">
                    Game {index + 1}: {result}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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
      return { winner: squares[a], line: line };
    }
  }
  return null;
};

export default TicTacToe;
