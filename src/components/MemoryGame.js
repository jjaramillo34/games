import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import useSound from "use-sound";
import "../styles/MemoryGame.css";

const THEMES = {
  emojis: {
    pairs: [
      "🎮",
      "🎲",
      "🎯",
      "🎨",
      "🎭",
      "🎪",
      "🎢",
      "🎡",
      "🎠",
      "🎪",
      "🎨",
      "🎭",
      "🎯",
      "🎲",
      "🎮",
      "🎪",
      "🎢",
      "🎡",
      "🎠",
      "🎪",
      "🎨",
      "🎭",
      "🎯",
      "🎲",
      "🎮",
      "🎪",
      "🎢",
      "🎡",
      "🎠",
      "🎪",
      "🎨",
      "🎭",
    ],
  },
  animals: {
    pairs: [
      "🐶",
      "🐱",
      "🐭",
      "🐹",
      "🐰",
      "🦊",
      "🐻",
      "🐼",
      "🐨",
      "🐯",
      "🦁",
      "🐮",
      "🐷",
      "🐸",
      "🐵",
      "🦄",
      "🦋",
      "🐢",
      "🐍",
      "🦎",
      "🦕",
      "🦖",
      "🦔",
      "🐅",
      "🐆",
      "🐘",
      "🦒",
      "🦓",
      "🦍",
      "🦘",
      "🦛",
      "🐪",
    ],
  },
  fruits: {
    pairs: [
      "🍎",
      "🍐",
      "🍊",
      "🍋",
      "🍌",
      "🍉",
      "🍇",
      "🍓",
      "🫐",
      "🍈",
      "🍒",
      "🍑",
      "🥭",
      "🍍",
      "🥥",
      "🥝",
      "🍅",
      "🍆",
      "🥑",
      "🥦",
      "🥬",
      "🥒",
      "🌶",
      "🫑",
      "🥕",
      "🧄",
      "🧅",
      "🥔",
      "🍠",
      "🥐",
      "🥨",
      "🧀",
    ],
  },
  space: {
    pairs: [
      "🌎",
      "🌍",
      "🌏",
      "🌕",
      "🌖",
      "🌗",
      "🌘",
      "🌑",
      "🌒",
      "🌓",
      "🌔",
      "⭐",
      "🌟",
      "✨",
      "💫",
      "☄️",
      "🌞",
      "🌝",
      "🌛",
      "🌜",
      "🌙",
      "🪐",
      "🌍",
      "🌎",
      "🌏",
      "🌕",
      "🌖",
      "🌗",
      "🌘",
      "🌑",
      "🌒",
      "🌓",
    ],
  },
};

const DIFFICULTIES = {
  easy: { gridCols: "grid-cols-2 sm:grid-cols-4", pairs: 8 },
  medium: { gridCols: "grid-cols-3 sm:grid-cols-6", pairs: 18 },
  hard: { gridCols: "grid-cols-4 sm:grid-cols-8", pairs: 32 },
};

const CARD_SIZES = {
  easy: "text-4xl sm:text-5xl",
  medium: "text-3xl sm:text-4xl",
  hard: "text-2xl sm:text-3xl",
};

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const MemoryGame = () => {
  const { t } = useTranslation();
  const [theme, setTheme] = useState("emojis");
  const [difficulty, setDifficulty] = useState("easy");
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [bestScores, setBestScores] = useState({
    easy: Infinity,
    medium: Infinity,
    hard: Infinity,
  });
  const [showCongrats, setShowCongrats] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Sound effects
  const [playFlip] = useSound("/sounds/card-flip.mp3", { volume: 0.5 });
  const [playMatch] = useSound("/sounds/correct.mp3", { volume: 0.5 });
  const [playWrong] = useSound("/sounds/wrong.mp3", { volume: 0.3 });
  const [playWin] = useSound("/sounds/win.mp3", { volume: 0.5 });

  useEffect(() => {
    initializeGame();
  }, [theme, difficulty]);

  useEffect(() => {
    let timer;
    if (isPlaying && !isPaused) {
      timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, isPaused]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstIndex, secondIndex] = flippedCards;
      if (cards[firstIndex] === cards[secondIndex]) {
        setTimeout(() => {
          playMatch();
          setMatchedCards((prev) => [...prev, firstIndex, secondIndex]);
          checkGameCompletion([...matchedCards, firstIndex, secondIndex]);
          setFlippedCards([]);
          setTurns((prev) => prev + 1);
        }, 500);
      } else {
        setTimeout(() => {
          playWrong();
          setFlippedCards([]);
          setTurns((prev) => prev + 1);
        }, 1000);
      }
    }
  }, [flippedCards, cards, matchedCards]);

  const initializeGame = () => {
    const { pairs } = DIFFICULTIES[difficulty];
    const selectedPairs = THEMES[theme].pairs.slice(0, pairs);
    const gameCards = shuffleArray([...selectedPairs, ...selectedPairs]);
    setCards(gameCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setTurns(0);
    setTimeElapsed(0);
    setIsPlaying(false);
    setIsPaused(false);
    setShowCongrats(false);
  };

  const handleCardClick = (index) => {
    if (
      isPaused ||
      flippedCards.length === 2 ||
      flippedCards.includes(index) ||
      matchedCards.includes(index)
    )
      return;

    playFlip();
    if (!isPlaying) setIsPlaying(true);
    setFlippedCards((prev) => [...prev, index]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const checkGameCompletion = (newMatchedCards) => {
    if (newMatchedCards.length === cards.length) {
      setIsPlaying(false);
      const currentScore = turns;
      if (currentScore < bestScores[difficulty]) {
        setBestScores((prev) => ({ ...prev, [difficulty]: currentScore }));
        setShowCongrats(true);
        playWin();
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-800 to-purple-950 text-white p-4">
      <div className="w-full max-w-[95vw] 2xl:max-w-[1400px] bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-2xl">
        <motion.h1
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="text-3xl sm:text-4xl font-bold text-center mb-6 text-purple-400"
        >
          {t("memoryGame.title")}
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col gap-2">
            <select
              className="w-full bg-purple-700 text-white rounded-lg p-2"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              {Object.keys(THEMES).map((themeKey) => (
                <option key={themeKey} value={themeKey}>
                  {t(`memoryGame.themes.${themeKey}`)}
                </option>
              ))}
            </select>
            <select
              className="w-full bg-purple-700 text-white rounded-lg p-2"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              {Object.keys(DIFFICULTIES).map((diffKey) => (
                <option key={diffKey} value={diffKey}>
                  {t(`memoryGame.difficulty.${diffKey}`)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-purple-400">
                {t("memoryGame.stats.turns")}
              </div>
              <div className="text-2xl font-bold">{turns}</div>
            </div>
            <div>
              <div className="text-purple-400">
                {t("memoryGame.stats.timeElapsed")}
              </div>
              <div className="text-2xl font-bold">
                {formatTime(timeElapsed)}
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <div className="text-purple-400">
              {t("memoryGame.stats.bestScore")}:{" "}
              {bestScores[difficulty] === Infinity
                ? "-"
                : bestScores[difficulty]}
            </div>
          </div>
        </div>

        <div
          className={`grid ${DIFFICULTIES[difficulty].gridCols} gap-2 mb-6 mx-auto max-w-full aspect-square`}
        >
          {cards.map((card, index) => (
            <div key={index} className="aspect-square preserve-3d">
              <div
                className={`w-full h-full cursor-pointer ${
                  flippedCards.includes(index) || matchedCards.includes(index)
                    ? "flipped"
                    : ""
                }`}
                onClick={() => handleCardClick(index)}
              >
                <div className="card-inner">
                  <div className="card-front rounded-xl flex items-center justify-center">
                    <span className="text-3xl text-white/80">?</span>
                  </div>
                  <div className="card-back rounded-xl flex items-center justify-center">
                    <span className={`${CARD_SIZES[difficulty]}`}>{card}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors duration-300 font-semibold"
            onClick={initializeGame}
          >
            {t("memoryGame.actions.newGame")}
          </motion.button>
          {isPlaying && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors duration-300 font-semibold"
              onClick={() => setIsPaused(!isPaused)}
            >
              {t(
                isPaused
                  ? "memoryGame.actions.resume"
                  : "memoryGame.actions.pause"
              )}
            </motion.button>
          )}
        </div>

        {(showCongrats || isPaused) && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="bg-white/20 p-8 rounded-xl text-center"
            >
              {showCongrats ? (
                <>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                    {t("memoryGame.messages.complete")}
                  </h2>
                  <p className="text-lg sm:text-xl mb-6">
                    {t("memoryGame.messages.newHighScore")}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
                    onClick={() => setShowCongrats(false)}
                  >
                    {t("memoryGame.actions.newGame")}
                  </motion.button>
                </>
              ) : (
                <>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                    {t("memoryGame.messages.paused")}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
                    onClick={() => setIsPaused(false)}
                  >
                    {t("memoryGame.actions.resume")}
                  </motion.button>
                </>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryGame;
