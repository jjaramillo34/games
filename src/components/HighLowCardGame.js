import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import useSound from "use-sound";
import AOS from "aos";
import "aos/dist/aos.css";
import GameLayout from "../layouts/GameLayout";

const suits = ["hearts", "diamonds", "clubs", "spades"];
const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
const suitEmojis = {
  hearts: "♥️",
  diamonds: "♦️",
  clubs: "♣️",
  spades: "♠️",
};

const GAME_MODES = {
  CLASSIC: "classic",
  TIME_ATTACK: "timeAttack",
  TARGET_SCORE: "targetScore",
};

const DIFFICULTIES = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
};

const getRandomCard = () => {
  const suit = suits[Math.floor(Math.random() * suits.length)];
  const value = values[Math.floor(Math.random() * values.length)];
  return { suit, value };
};

const cardValue = (card) => {
  if (typeof card.value === "number") {
    return card.value;
  }
  switch (card.value) {
    case "J":
      return 11;
    case "Q":
      return 12;
    case "K":
      return 13;
    case "A":
      return 14;
    default:
      return 0;
  }
};

const HighLowCardGame = () => {
  const { t } = useTranslation();
  const [currentCard, setCurrentCard] = useState(getRandomCard());
  const [previousCard, setPreviousCard] = useState(null);
  const [message, setMessage] = useState("");
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showRules, setShowRules] = useState(false);
  const [gameMode, setGameMode] = useState(GAME_MODES.CLASSIC);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES.MEDIUM);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameActive, setIsGameActive] = useState(false);
  const [targetScore, setTargetScore] = useState(10);
  const [leaderboard, setLeaderboard] = useState([]);

  // Sound effects
  const [playCorrect] = useSound("/sounds/correct.mp3", { volume: 0.5 });
  const [playWrong] = useSound("/sounds/wrong.mp3", { volume: 0.5 });
  const [playCardFlip] = useSound("/sounds/card-flip.mp3", { volume: 0.3 });

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    let timer;
    if (isGameActive && gameMode === GAME_MODES.TIME_ATTACK && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGameActive, gameMode, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft]);

  const getDifficultyMultiplier = () => {
    switch (difficulty) {
      case DIFFICULTIES.EASY:
        return 1;
      case DIFFICULTIES.MEDIUM:
        return 1.5;
      case DIFFICULTIES.HARD:
        return 2;
      default:
        return 1;
    }
  };

  const handleGuess = (guess) => {
    if (!isGameActive && gameMode !== GAME_MODES.CLASSIC) {
      startGame();
      return;
    }

    playCardFlip();
    let newCard = getRandomCard();
    while (cardValue(newCard) === cardValue(currentCard)) {
      newCard = getRandomCard();
    }
    setPreviousCard(currentCard);

    const isCorrect =
      (guess === "higher" && cardValue(newCard) > cardValue(currentCard)) ||
      (guess === "lower" && cardValue(newCard) < cardValue(currentCard));

    if (isCorrect) {
      playCorrect();
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak(Math.max(bestStreak, newStreak));
      setMessage(t("highLowGame.messages.correct"));
      setWins(wins + 1);

      if (gameMode === GAME_MODES.TARGET_SCORE && wins + 1 >= targetScore) {
        endGame(true);
      }
    } else {
      playWrong();
      setMessage(t("highLowGame.messages.wrong"));
      setLosses(losses + 1);
      setStreak(0);

      if (gameMode !== GAME_MODES.CLASSIC) {
        endGame(false);
      }
    }

    setCurrentCard(newCard);
  };

  const startGame = () => {
    setIsGameActive(true);
    resetStats();
    if (gameMode === GAME_MODES.TIME_ATTACK) {
      setTimeLeft(60);
    }
  };

  const endGame = (won = false) => {
    setIsGameActive(false);
    const score = Math.floor(wins * getDifficultyMultiplier());
    updateLeaderboard(score);
    setMessage(won ? "You won!" : "Game Over!");
  };

  const resetStats = () => {
    setWins(0);
    setLosses(0);
    setStreak(0);
    setMessage("");
    setCurrentCard(getRandomCard());
    setPreviousCard(null);
  };

  const updateLeaderboard = (score) => {
    const newEntry = {
      score,
      date: new Date().toISOString(),
      mode: gameMode,
      difficulty,
    };
    setLeaderboard((prev) =>
      [...prev, newEntry].sort((a, b) => b.score - a.score).slice(0, 10)
    );
  };

  const getCardColor = (suit) => {
    return suit === "hearts" || suit === "diamonds"
      ? "text-red-500"
      : "text-gray-800";
  };

  return (
    <GameLayout
      title={t("highLowGame.title")}
      description={t("highLowGame.description")}
    >
      <div className="max-w-4xl mx-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowRules(!showRules)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors duration-300 mb-4"
        >
          {showRules ? t("highLowGame.hideRules") : t("highLowGame.showRules")}
        </motion.button>

        {showRules && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl"
          >
            <h2 className="text-2xl font-bold mb-4 text-emerald-400">
              {t("highLowGame.rules.title")}
            </h2>
            <ul className="space-y-2 text-gray-300">
              <li>• {t("highLowGame.rules.rule1")}</li>
              <li>• {t("highLowGame.rules.rule2")}</li>
              <li>• {t("highLowGame.rules.rule3")}</li>
            </ul>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col gap-2">
            <select
              className="bg-emerald-700 text-white rounded-lg p-2"
              value={gameMode}
              onChange={(e) => setGameMode(e.target.value)}
            >
              {Object.values(GAME_MODES).map((mode) => (
                <option key={mode} value={mode}>
                  {t(`highLowGame.modes.${mode}`)}
                </option>
              ))}
            </select>
            <select
              className="bg-emerald-700 text-white rounded-lg p-2"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              {Object.values(DIFFICULTIES).map((diff) => (
                <option key={diff} value={diff}>
                  {t(`highLowGame.difficulty.${diff}`)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center items-center gap-4">
            <div className="text-emerald-400">
              {t("highLowGame.stats.streak")}: {streak}
            </div>
            <div className="text-yellow-400">
              {t("highLowGame.stats.best")}: {bestStreak}
            </div>
          </div>

          {gameMode === GAME_MODES.TIME_ATTACK && (
            <div className="text-center">
              <div className="text-2xl font-bold">{timeLeft}s</div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {previousCard && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <div className="text-lg mb-2 text-emerald-400">
                {t("highLowGame.previousCard")}
              </div>
              <div className="w-32 h-48 bg-white rounded-xl flex items-center justify-center text-4xl shadow-xl">
                {previousCard}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <div className="text-lg mb-2 text-emerald-400">
              {t("highLowGame.currentCard")}
            </div>
            <div className="w-32 h-48 bg-white rounded-xl flex items-center justify-center text-4xl shadow-xl">
              {currentCard}
            </div>
          </motion.div>
        </div>

        <div className="text-xl text-center mb-6 h-8 text-emerald-400 font-semibold">
          {message}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300 font-semibold shadow-lg"
            onClick={() => handleGuess("higher")}
          >
            {t("highLowGame.actions.higher")}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg transition-all duration-300 font-semibold shadow-lg"
            onClick={() => handleGuess("lower")}
          >
            {t("highLowGame.actions.lower")}
          </motion.button>
        </div>

        <div className="flex justify-between items-center text-lg">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all duration-300 font-semibold"
            onClick={resetStats}
          >
            {t("highLowGame.actions.newRound")}
          </motion.button>
          <div className="flex gap-6">
            <div className="text-emerald-400">
              {t("highLowGame.stats.wins")}: {wins}
            </div>
            <div className="text-red-400">
              {t("highLowGame.stats.losses")}: {losses}
            </div>
          </div>
        </div>

        {leaderboard.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">
              {t("highLowGame.leaderboard.title")}
            </h3>
            <div className="grid grid-cols-4 gap-4 text-sm">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 p-2 rounded"
                >
                  <div className="font-bold">{entry.score}</div>
                  <div>{new Date(entry.date).toLocaleDateString()}</div>
                  <div>{t(`highLowGame.modes.${entry.mode}`)}</div>
                  <div>{t(`highLowGame.difficulty.${entry.difficulty}`)}</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </GameLayout>
  );
};

export default HighLowCardGame;
