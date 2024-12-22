import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { produce } from "immer";
import {
  CheckCircleIcon,
  LightBulbIcon,
  ArrowPathIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import _ from "lodash";
import GameLayout from "../layouts/GameLayout";

const NumberMaster = () => {
  const { t } = useTranslation();
  const [gameMode, setGameMode] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [board, setBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [notes, setNotes] = useState({});
  const [isNotesMode, setIsNotesMode] = useState(false);
  const [gameState, setGameState] = useState("setup"); // setup, playing, paused, complete
  const [stats, setStats] = useState({
    time: 0,
    moves: 0,
    hints: 0,
    accuracy: 100,
  });

  // Game modes configuration
  const gameModes = [
    {
      id: "classic",
      name: t("numberMaster.modes.classic"),
      description: t("numberMaster.modes.description.classic"),
      icon: "🎯",
    },
    {
      id: "speed",
      name: t("numberMaster.modes.speed"),
      description: t("numberMaster.modes.description.speed"),
      icon: "⚡",
    },
    {
      id: "puzzle",
      name: t("numberMaster.modes.puzzle"),
      description: t("numberMaster.modes.description.puzzle"),
      icon: "🧩",
    },
  ];

  // Difficulty levels configuration
  const difficultyLevels = [
    {
      id: "easy",
      name: t("numberMaster.difficulty.easy"),
      description: t("numberMaster.difficulty.description.easy"),
      icon: "🌱",
    },
    {
      id: "medium",
      name: t("numberMaster.difficulty.medium"),
      description: t("numberMaster.difficulty.description.medium"),
      icon: "🌿",
    },
    {
      id: "hard",
      name: t("numberMaster.difficulty.hard"),
      description: t("numberMaster.difficulty.description.hard"),
      icon: "🌳",
    },
    {
      id: "expert",
      name: t("numberMaster.difficulty.expert"),
      description: t("numberMaster.difficulty.description.expert"),
      icon: "🏆",
    },
  ];

  // Initialize game board based on mode and difficulty
  const initializeGame = () => {
    let newBoard = [];
    const size = difficulty === "expert" ? 12 : 9;

    // Create empty board
    for (let i = 0; i < size; i++) {
      newBoard[i] = Array(size).fill(null);
    }

    // Add initial numbers based on difficulty
    const fillCount = {
      easy: Math.floor(size * size * 0.4),
      medium: Math.floor(size * size * 0.3),
      hard: Math.floor(size * size * 0.2),
      expert: Math.floor(size * size * 0.15),
    }[difficulty];

    // Generate valid Sudoku puzzle
    newBoard = generateSudoku(size, fillCount);
    setBoard(newBoard);
    setGameState("playing");
  };

  // Generate a valid Sudoku puzzle
  const generateSudoku = (size, fillCount) => {
    // This is a simplified version. In a real implementation,
    // you'd want a more sophisticated algorithm to generate valid Sudoku puzzles
    const board = Array(size)
      .fill()
      .map(() => Array(size).fill(null));

    // For now, just fill some random cells with valid numbers
    let count = 0;
    while (count < fillCount) {
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      const num = Math.floor(Math.random() * size) + 1;

      if (board[row][col] === null && isValidMove(board, row, col, num)) {
        board[row][col] = num;
        count++;
      }
    }

    return board;
  };

  // Check if a move is valid according to Sudoku rules
  const isValidMove = (board, row, col, num) => {
    const size = board.length;
    const boxSize = size === 12 ? 4 : 3;

    // Check row
    for (let x = 0; x < size; x++) {
      if (board[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < size; x++) {
      if (board[x][col] === num) return false;
    }

    // Check box
    const boxRow = Math.floor(row / boxSize) * boxSize;
    const boxCol = Math.floor(col / boxSize) * boxSize;
    for (let i = 0; i < boxSize; i++) {
      for (let j = 0; j < boxSize; j++) {
        if (board[boxRow + i][boxCol + j] === num) return false;
      }
    }

    return true;
  };

  // Handle cell click
  const handleCellClick = (row, col) => {
    if (gameState !== "playing") return;

    setSelectedCell({ row, col });
  };

  // Handle number input
  const handleNumberInput = (number) => {
    if (!selectedCell || gameState !== "playing") return;

    const { row, col } = selectedCell;

    if (isNotesMode) {
      // Handle notes mode
      setNotes(
        produce(notes, (draft) => {
          const key = `${row}-${col}`;
          if (!draft[key]) draft[key] = [];
          const index = draft[key].indexOf(number);
          if (index === -1) {
            draft[key].push(number);
            draft[key].sort();
          } else {
            draft[key].splice(index, 1);
          }
        })
      );
    } else {
      // Handle normal number input
      if (isValidMove(board, row, col, number)) {
        setBoard(
          produce(board, (draft) => {
            draft[row][col] = number;
          })
        );
        setStats(
          produce(stats, (draft) => {
            draft.moves++;
          })
        );

        // Check if puzzle is complete
        if (isBoardComplete()) {
          setGameState("complete");
        }
      }
    }
  };

  // Check if the board is complete
  const isBoardComplete = () => {
    return board.every((row, i) =>
      row.every((cell, j) => cell !== null && isValidMove(board, i, j, cell))
    );
  };

  // Get hint
  const getHint = () => {
    if (!selectedCell || gameState !== "playing") return;

    setStats(
      produce(stats, (draft) => {
        draft.hints++;
      })
    );

    // In a real implementation, you'd want to calculate a real hint
    // For now, just show a message
    alert(t("numberMaster.messages.hint"));
  };

  // Render game mode selection
  const renderModeSelection = () => (
    <GameLayout
      title={t("numberMaster.title")}
      description={t("numberMaster.description")}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {gameModes.map((mode) => (
          <motion.button
            key={mode.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300"
            onClick={() => setGameMode(mode.id)}
          >
            <span className="text-4xl mb-4 block">{mode.icon}</span>
            <h3 className="text-xl font-semibold mb-2">{mode.name}</h3>
            <p className="text-sm text-gray-300">{mode.description}</p>
          </motion.button>
        ))}
      </div>
    </GameLayout>
  );

  // Render difficulty selection
  const renderDifficultySelection = () => (
    <GameLayout title={t("numberMaster.difficulty.title")}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {difficultyLevels.map((level) => (
          <motion.button
            key={level.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300"
            onClick={() => {
              setDifficulty(level.id);
              initializeGame();
            }}
          >
            <span className="text-4xl mb-4 block">{level.icon}</span>
            <h3 className="text-xl font-semibold mb-2">{level.name}</h3>
            <p className="text-sm text-gray-300">{level.description}</p>
          </motion.button>
        ))}
      </div>
    </GameLayout>
  );

  // Render game board
  const renderBoard = () => (
    <GameLayout>
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setIsNotesMode(!isNotesMode)}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isNotesMode ? "bg-blue-500/50" : "bg-white/10"
            }`}
          >
            <PencilIcon className="w-6 h-6" />
          </button>
          <button
            onClick={getHint}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
          >
            <LightBulbIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="text-sm">
          <span className="mr-4">
            {t("numberMaster.stats.time")}: {formatTime(stats.time)}
          </span>
          <span className="mr-4">
            {t("numberMaster.stats.moves")}: {stats.moves}
          </span>
          <span>
            {t("numberMaster.stats.hints")}: {stats.hints}
          </span>
        </div>
      </div>

      <div
        className="grid gap-1 mb-4"
        style={{
          gridTemplateColumns: `repeat(${board.length}, minmax(0, 1fr))`,
        }}
      >
        {board.map((row, i) =>
          row.map((cell, j) => (
            <motion.button
              key={`${i}-${j}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`aspect-square flex items-center justify-center text-lg font-semibold rounded bg-white/10 hover:bg-white/20 transition-all duration-300 ${
                selectedCell?.row === i && selectedCell?.col === j
                  ? "ring-2 ring-blue-500"
                  : ""
              }`}
              onClick={() => handleCellClick(i, j)}
            >
              {cell ||
                (notes[`${i}-${j}`]?.length > 0 ? (
                  <div className="grid grid-cols-3 gap-0.5 p-1 text-xs opacity-50">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                      <span key={n}>
                        {notes[`${i}-${j}`]?.includes(n) ? n : ""}
                      </span>
                    ))}
                  </div>
                ) : (
                  ""
                ))}
            </motion.button>
          ))
        )}
      </div>

      <div className="grid grid-cols-5 gap-2 mb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <motion.button
            key={number}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 rounded bg-white/10 hover:bg-white/20 transition-all duration-300"
            onClick={() => handleNumberInput(number)}
          >
            {number}
          </motion.button>
        ))}
        {board.length === 12 &&
          [10, 11, 12].map((number) => (
            <motion.button
              key={number}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 rounded bg-white/10 hover:bg-white/20 transition-all duration-300"
              onClick={() => handleNumberInput(number)}
            >
              {number}
            </motion.button>
          ))}
      </div>
    </GameLayout>
  );

  // Format time display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameState === "playing") {
      timer = setInterval(() => {
        setStats(
          produce(stats, (draft) => {
            draft.time++;
          })
        );
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  // Render game state
  if (!gameMode) {
    return renderModeSelection();
  }

  if (!difficulty) {
    return renderDifficultySelection();
  }

  return renderBoard();
};

export default NumberMaster;
