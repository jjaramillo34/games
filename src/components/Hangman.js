import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchRandomWord,
  getWordDefinition,
  preloadWords,
} from "../services/dictionaryService";

const Hangman = () => {
  const { t, i18n } = useTranslation();
  const [word, setWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState("playing"); // playing, won, lost
  const [difficulty, setDifficulty] = useState("medium");
  const [definition, setDefinition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const maxWrongGuesses = 6;

  useEffect(() => {
    const initGame = async () => {
      setIsLoading(true);
      try {
        // Preload some words for better user experience
        await preloadWords(i18n.language);
        await startNewGame();
      } catch (error) {
        console.error("Error initializing game:", error);
      }
      setIsLoading(false);
    };

    initGame();
  }, [i18n.language]);

  const startNewGame = async () => {
    setIsLoading(true);
    try {
      const newWord = await fetchRandomWord(i18n.language, difficulty);
      setWord(newWord);
      setGuessedLetters(new Set());
      setWrongGuesses(0);
      setGameStatus("playing");
      const wordDef = await getWordDefinition(newWord, i18n.language);
      setDefinition(wordDef);
    } catch (error) {
      console.error("Error starting new game:", error);
    }
    setIsLoading(false);
  };

  const handleGuess = (letter) => {
    if (gameStatus !== "playing" || guessedLetters.has(letter)) return;

    const newGuessedLetters = new Set(guessedLetters).add(letter);
    setGuessedLetters(newGuessedLetters);

    if (!word.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      if (newWrongGuesses >= maxWrongGuesses) {
        setGameStatus("lost");
      }
    } else {
      const isWon = word
        .split("")
        .every((letter) => newGuessedLetters.has(letter));
      if (isWon) {
        setGameStatus("won");
      }
    }
  };

  const renderWord = () => {
    return word.split("").map((letter, index) => (
      <motion.span
        key={index}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.1 }}
        className="mx-1 text-4xl font-bold"
      >
        {guessedLetters.has(letter) ? letter : "_"}
      </motion.span>
    ));
  };

  const renderKeyboard = () => {
    const keyboard =
      i18n.language === "es"
        ? "abcdefghijklmnñopqrstuvwxyzáéíóú"
        : "abcdefghijklmnopqrstuvwxyz";

    return keyboard.split("").map((letter) => (
      <motion.button
        key={letter}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`m-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
          guessedLetters.has(letter)
            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
        onClick={() => handleGuess(letter)}
        disabled={guessedLetters.has(letter) || gameStatus !== "playing"}
      >
        {letter.toUpperCase()}
      </motion.button>
    ));
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
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">{t("hangman")}</h1>
          <div className="flex justify-center space-x-4 mb-4">
            {["easy", "medium", "hard"].map((level) => (
              <button
                key={level}
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
                {t(level)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center">
            <div className="mb-8">{renderHangman()}</div>
            <div className="mb-8 min-h-[3rem]">{renderWord()}</div>
          </div>

          <div>
            <div className="flex flex-wrap justify-center mb-8">
              {renderKeyboard()}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {gameStatus !== "playing" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center mt-8"
            >
              <h2 className="text-2xl font-bold mb-4">
                {gameStatus === "won" ? t("youWon") : t("youLost")}
              </h2>
              {gameStatus === "lost" && (
                <p className="mb-4">
                  {t("theWordWas")}: <span className="font-bold">{word}</span>
                </p>
              )}
              {definition && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-bold mb-2">{t("wordDefinition")}:</h3>
                  {definition.definitions.slice(0, 2).map((def, index) => (
                    <div key={index} className="mb-2">
                      <p className="italic text-gray-600">{def.partOfSpeech}</p>
                      <p>{def.definition}</p>
                      {def.example && (
                        <p className="text-sm text-gray-500">
                          {t("example")}: {def.example}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={startNewGame}
                className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                {t("playAgain")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Hangman;
