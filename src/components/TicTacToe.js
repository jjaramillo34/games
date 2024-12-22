import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import GameLayout from "../layouts/GameLayout";

// Sound effects URLs
const MOVE_SOUND =
  "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3";
const WIN_SOUND =
  "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3";
const DRAW_SOUND =
  "https://assets.mixkit.co/active_storage/sfx/1427/1427-preview.mp3";

const TicTacToe = () => {
  const { t } = useTranslation();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [status, setStatus] = useState(`${t("ticTacToe.nextPlayer")}: X`);
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
        setStatus(`${t("ticTacToe.nextPlayer")}: ${!isXNext ? "X" : "O"}`);
        // Use setTimeout to show the computer is "thinking"
        const thinkingTime =
          difficulty === "easy" ? 500 : difficulty === "medium" ? 750 : 1000;
        setTimeout(() => {
          computerMove(newSquares);
        }, thinkingTime);
      }
      setIsXNext(!isXNext);
      setStatus(`${t("ticTacToe.nextPlayer")}: ${!isXNext ? "X" : "O"}`);
    }
  };

  const handleGameEnd = (winner, line = null) => {
    setWinningLine(line);
    if (winner) {
      playSound(WIN_SOUND);
      const resultText = `${winner} ${t("ticTacToe.wins")}!`;
      setStatus(resultText);
      setGameHistory([...gameHistory, resultText]);
      if (winner === "X") {
        setXWins(xWins + 1);
      } else {
        setOWins(oWins + 1);
      }
    } else {
      playSound(DRAW_SOUND);
      const resultText = t("ticTacToe.draw");
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
      setStatus(`${t("ticTacToe.nextPlayer")}: X`);
    }
    setIsThinking(false);
  };

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
    setStatus(`${t("ticTacToe.nextPlayer")}: X`);
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
    <GameLayout
      title={t("ticTacToe.title")}
      description={t("ticTacToe.description")}
    >
      {!gameMode ? (
        <div className="flex flex-col gap-4" data-aos="fade-up">
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold mb-2 text-cyan-400">
              {t("ticTacToe.selectMode")}
            </h2>
            <button
              onClick={() => startGame("human")}
              className="w-full px-6 py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 mb-3"
            >
              {t("ticTacToe.modes.human")}
            </button>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setDifficulty("easy");
                  startGame("computer");
                }}
                className="w-full px-6 py-4 text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {t("ticTacToe.modes.computerEasy")}
              </button>
              <button
                onClick={() => {
                  setDifficulty("medium");
                  startGame("computer");
                }}
                className="w-full px-6 py-4 text-lg font-semibold bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {t("ticTacToe.modes.computerMedium")}
              </button>
              <button
                onClick={() => {
                  setDifficulty("hard");
                  startGame("computer");
                }}
                className="w-full px-6 py-4 text-lg font-semibold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {t("ticTacToe.modes.computerHard")}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="game-container" data-aos="fade-up">
          <div className="flex justify-between items-center mb-4">
            <div className="stats text-lg">
              <p>
                X {t("ticTacToe.stats.wins")}: {xWins}
              </p>
              <p>
                O {t("ticTacToe.stats.wins")}: {oWins}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              >
                {t("ticTacToe.actions.reset")}
              </button>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
              >
                {showHistory
                  ? t("ticTacToe.actions.hideHistory")
                  : t("ticTacToe.actions.showHistory")}
              </button>
            </div>
          </div>

          <div className="game-board grid grid-cols-3 gap-2 mb-4">
            {squares.map((square, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: square ? 1 : 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`w-24 h-24 text-4xl font-bold flex items-center justify-center rounded-lg transition-colors ${
                  winningLine?.includes(i)
                    ? "bg-green-500"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                onClick={() => handleClick(i)}
              >
                {square}
              </motion.button>
            ))}
          </div>

          <div className="status text-xl font-semibold mb-4">{status}</div>

          {showHistory && (
            <div className="history mt-4">
              <h3 className="text-lg font-semibold mb-2">
                {t("ticTacToe.history.title")}
              </h3>
              <div className="space-y-1">
                {gameHistory.map((move, index) => (
                  <div key={index} className="p-2 bg-gray-700 rounded">
                    {t("ticTacToe.history.game", { number: index + 1 })}: {move}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={resetAll}
            className="mt-4 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
          >
            {t("ticTacToe.actions.newGame")}
          </button>
        </div>
      )}
    </GameLayout>
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
