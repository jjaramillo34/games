import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import GameLayout from "../layouts/GameLayout";

// Dictionary of words for each difficulty level
const WORD_LISTS = {
  easy: [
    "cat",
    "dog",
    "sun",
    "hat",
    "run",
    "fun",
    "big",
    "red",
    "box",
    "cup",
    "pen",
    "map",
    "car",
    "bus",
    "toy",
    "day",
    "sky",
    "fly",
    "joy",
    "key",
  ],
  medium: [
    "house",
    "mouse",
    "plant",
    "train",
    "beach",
    "light",
    "phone",
    "music",
    "happy",
    "green",
    "table",
    "chair",
    "water",
    "paper",
    "clock",
    "bread",
    "smile",
    "dance",
    "cloud",
    "heart",
  ],
  hard: [
    "elephant",
    "computer",
    "mountain",
    "birthday",
    "rainbow",
    "library",
    "butterfly",
    "chocolate",
    "umbrella",
    "adventure",
    "dinosaur",
    "treasure",
    "princess",
    "football",
    "hospital",
    "vacation",
    "universe",
    "painting",
    "sandwich",
    "triangle",
  ],
};

// Dictionary of hints for each word
const WORD_HINTS = {
  // Easy words
  cat: "A common household pet that meows",
  dog: "A loyal pet that barks",
  sun: "It lights up the day",
  hat: "You wear it on your head",
  // ... add more hints for other words
};

const Hangman = () => {
  const { t, i18n } = useTranslation();
  const [word, setWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const [definition, setDefinition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const maxWrongGuesses = 6;

  useEffect(() => {
    const initGame = async () => {
      setIsLoading(true);
      try {
        await startNewGame();
      } catch (error) {
        console.error("Error initializing game:", error);
      }
      setIsLoading(false);
    };

    initGame();
  }, []);

  const getRandomWord = (difficulty) => {
    const wordList = WORD_LISTS[difficulty];
    return wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
  };

  const getWordHint = (word) => {
    return WORD_HINTS[word.toLowerCase()] || "No hint available";
  };

  const startNewGame = async () => {
    setIsLoading(true);
    try {
      const newWord = getRandomWord(difficulty);
      setWord(newWord);
      setGuessedLetters(new Set());
      setWrongGuesses(0);
      setGameOver(false);
      setIsWinner(false);
      setDefinition(getWordHint(newWord));
    } catch (error) {
      console.error("Error starting new game:", error);
    }
    setIsLoading(false);
  };

  const handleGuess = (letter) => {
    if (gameOver || guessedLetters.has(letter)) return;

    const newGuessedLetters = new Set(guessedLetters).add(letter);
    setGuessedLetters(newGuessedLetters);

    if (!word.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      if (newWrongGuesses >= maxWrongGuesses) {
        setGameOver(true);
        setIsWinner(false);
      }
    } else {
      const isWon = word
        .split("")
        .every((letter) => newGuessedLetters.has(letter));
      if (isWon) {
        setGameOver(true);
        setIsWinner(true);
      }
    }
  };

  const getHint = () => {
    // Reveal a random unguessed letter that's in the word
    const unguessedLetters = word
      .split("")
      .filter((letter) => !guessedLetters.has(letter));
    if (unguessedLetters.length > 0) {
      const randomLetter =
        unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];
      handleGuess(randomLetter);
    }
  };

  const renderHangman = () => {
    // Simple ASCII art representation of hangman states
    const hangmanStates = [
      `
  +---+
      |
      |
      |
      |
      |
=========`,
      `
  +---+
  O   |
      |
      |
      |
      |
=========`,
      `
  +---+
  O   |
  |   |
      |
      |
      |
=========`,
      `
  +---+
  O   |
 /|   |
      |
      |
      |
=========`,
      `
  +---+
  O   |
 /|\\  |
      |
      |
      |
=========`,
      `
  +---+
  O   |
 /|\\  |
 /    |
      |
      |
=========`,
      `
  +---+
  O   |
 /|\\  |
 / \\  |
      |
      |
=========`,
    ];

    return (
      <pre className="font-mono text-sm md:text-base whitespace-pre">
        {hangmanStates[wrongGuesses]}
      </pre>
    );
  };

  if (isLoading) {
    return (
      <GameLayout>
        <div className="flex justify-center items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout
      title={t("hangman.title")}
      description={t("hangman.description")}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center space-x-4 mb-8">
          {["easy", "medium", "hard"].map((level) => (
            <motion.button
              key={level}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setDifficulty(level);
                startNewGame();
              }}
              className={`px-4 py-2 rounded-lg font-semibold ${
                difficulty === level
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {t(`hangman.difficulty.${level}`)}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="flex flex-col items-center">
            <div className="font-mono text-sm md:text-base whitespace-pre mb-4">
              {renderHangman()}
            </div>
            <div className="text-xl font-bold mb-2">
              {t("hangman.stats.attempts")}: {6 - wrongGuesses}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold mb-4 tracking-wider">
              {word.split("").map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {guessedLetters.has(letter) ? letter : "_"}
                </motion.span>
              ))}
            </div>

            {definition && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-4 text-gray-300"
              >
                <div className="font-semibold mb-1">{t("hangman.hint")}:</div>
                <div>{definition}</div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-7 md:grid-cols-13 gap-2 mb-8">
          {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => (
            <motion.button
              key={letter}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleGuess(letter)}
              disabled={guessedLetters.has(letter)}
              className={`p-2 md:p-3 rounded-lg font-bold transition-colors duration-300 ${
                guessedLetters.has(letter)
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {letter}
            </motion.button>
          ))}
        </div>

        <div className="flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startNewGame}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors duration-300 font-semibold"
          >
            {t("hangman.actions.newGame")}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={getHint}
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-colors duration-300 font-semibold"
          >
            {t("hangman.actions.hint")}
          </motion.button>
        </div>

        {gameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <div className="bg-gray-800 p-8 rounded-xl text-center">
              <h2 className="text-2xl font-bold mb-4">
                {isWinner
                  ? t("hangman.messages.win")
                  : t("hangman.messages.lose", { word })}
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startNewGame}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-300 font-semibold"
              >
                {t("hangman.actions.playAgain")}
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </GameLayout>
  );
};

export default Hangman;
