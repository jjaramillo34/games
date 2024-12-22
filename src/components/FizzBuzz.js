import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import GameLayout from "../layouts/GameLayout";

const FizzBuzz = () => {
  const { t } = useTranslation();
  const [number, setNumber] = useState("");
  const [result, setResult] = useState("");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameMode, setGameMode] = useState("practice"); // practice, challenge, time-attack
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState([]);
  const [streak, setStreak] = useState(0);
  const [showRules, setShowRules] = useState(false);
  const [difficulty, setDifficulty] = useState("easy"); // easy, medium, hard
  const [feedback, setFeedback] = useState(null);
  const [animation, setAnimation] = useState("");

  useEffect(() => {
    let timer;
    if (isPlaying && gameMode === "time-attack" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, gameMode, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && gameMode === "time-attack") {
      endGame();
    }
  }, [timeLeft]);

  const getRandomNumber = () => {
    const ranges = {
      easy: { min: 1, max: 30 },
      medium: { min: 1, max: 100 },
      hard: { min: 1, max: 500 },
    };
    const { min, max } = ranges[difficulty];
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const getFizzBuzzAnswer = (num) => {
    if (num % 3 === 0 && num % 5 === 0) return "FizzBuzz";
    if (num % 3 === 0) return "Fizz";
    if (num % 5 === 0) return "Buzz";
    return num.toString();
  };

  const startGame = (mode) => {
    setGameMode(mode);
    setIsPlaying(true);
    setScore(0);
    setStreak(0);
    setHistory([]);
    if (mode === "time-attack") {
      setTimeLeft(60);
    }
    if (mode === "challenge") {
      generateNewChallenge();
    }
  };

  const endGame = () => {
    setIsPlaying(false);
    if (score > highScore) {
      setHighScore(score);
    }
    setFeedback({
      type: "info",
      message: t("gameOver", { score, highScore: Math.max(score, highScore) }),
    });
  };

  const generateNewChallenge = () => {
    const newNumber = getRandomNumber();
    setNumber(newNumber.toString());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseInt(number);

    if (isNaN(num)) {
      setFeedback({
        type: "error",
        message: t("enterValidNumber"),
      });
      return;
    }

    const correctAnswer = getFizzBuzzAnswer(num);
    const isCorrect = result.toLowerCase() === correctAnswer.toLowerCase();

    // Update history
    const historyEntry = {
      number: num,
      userAnswer: result,
      correctAnswer,
      isCorrect,
    };
    setHistory([historyEntry, ...history.slice(0, 9)]);

    if (isCorrect) {
      setScore(
        (prev) =>
          prev + (difficulty === "hard" ? 3 : difficulty === "medium" ? 2 : 1)
      );
      setStreak((prev) => prev + 1);
      setAnimation("correct");
      setFeedback({
        type: "success",
        message: t("correct"),
      });
    } else {
      setStreak(0);
      setAnimation("wrong");
      setFeedback({
        type: "error",
        message: t("incorrect", { correct: correctAnswer }),
      });
    }

    // Clear inputs after delay
    setTimeout(() => {
      setNumber("");
      setResult("");
      setAnimation("");
      if (gameMode === "challenge") {
        generateNewChallenge();
      }
    }, 1000);
  };

  const renderRules = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-8 p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl"
    >
      <h2 className="text-2xl font-bold mb-4 text-cyan-400">{t("rules")}</h2>
      <ul className="space-y-2 text-gray-300">
        <li>• {t("rule1")}</li>
        <li>• {t("rule2")}</li>
        <li>• {t("rule3")}</li>
        <li>• {t("rule4")}</li>
      </ul>
    </motion.div>
  );

  return (
    <GameLayout
      title={t("fizzBuzz.title")}
      description={t("fizzBuzz.description")}
    >
      <div className="max-w-4xl mx-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowRules(!showRules)}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors duration-300 mb-4"
        >
          {showRules ? t("fizzBuzz.hideRules") : t("fizzBuzz.showRules")}
        </motion.button>

        <AnimatePresence>{showRules && renderRules()}</AnimatePresence>

        {!isPlaying ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-4"
          >
            <h2 className="text-2xl font-bold text-center mb-4 text-cyan-400">
              {t("fizzBuzz.selectGameMode")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => startGame("practice")}
                className="p-6 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors duration-300"
              >
                {t("fizzBuzz.modes.practice")}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => startGame("challenge")}
                className="p-6 bg-green-500 hover:bg-green-600 rounded-xl transition-colors duration-300"
              >
                {t("fizzBuzz.modes.challenge")}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => startGame("time-attack")}
                className="p-6 bg-red-500 hover:bg-red-600 rounded-xl transition-colors duration-300"
              >
                {t("fizzBuzz.modes.timeAttack")}
              </motion.button>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4 text-cyan-400">
                {t("fizzBuzz.selectDifficulty")}
              </h3>
              <div className="flex justify-center gap-4">
                {["easy", "medium", "hard"].map((level) => (
                  <motion.button
                    key={level}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDifficulty(level)}
                    className={`px-6 py-3 rounded-lg transition-colors duration-300 ${
                      difficulty === level
                        ? "bg-purple-500"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    {t(`fizzBuzz.difficulty.${level}`)}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="text-xl">
                <span className="text-cyan-400">
                  {t("fizzBuzz.stats.score")}:{" "}
                </span>
                <span className="font-bold">{score}</span>
              </div>
              <div className="text-xl">
                <span className="text-cyan-400">
                  {t("fizzBuzz.stats.streak")}:{" "}
                </span>
                <span className="font-bold">{streak}</span>
              </div>
              {gameMode === "time-attack" && (
                <div className="text-xl">
                  <span className="text-cyan-400">
                    {t("fizzBuzz.stats.time")}:{" "}
                  </span>
                  <span className="font-bold">{timeLeft}s</span>
                </div>
              )}
            </div>

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4 mb-8"
              animate={animation}
              variants={{
                correct: { x: [0, 10, -10, 0], transition: { duration: 0.5 } },
                wrong: { x: [0, -10, 10, 0], transition: { duration: 0.5 } },
              }}
            >
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  value={gameMode === "challenge" ? number : number}
                  onChange={(e) =>
                    gameMode !== "challenge" && setNumber(e.target.value)
                  }
                  placeholder={t("fizzBuzz.placeholders.number")}
                  className="w-full p-4 bg-gray-800 rounded-lg border-2 border-gray-700 focus:border-cyan-400 transition-colors duration-300"
                  readOnly={gameMode === "challenge"}
                />
                <input
                  type="text"
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  placeholder={t("fizzBuzz.placeholders.answer")}
                  className="w-full p-4 bg-gray-800 rounded-lg border-2 border-gray-700 focus:border-cyan-400 transition-colors duration-300"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full p-4 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors duration-300 font-bold text-lg"
              >
                {t("fizzBuzz.actions.submit")}
              </motion.button>
            </motion.form>

            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={`p-4 rounded-lg mb-6 ${
                  feedback.type === "success"
                    ? "bg-green-500/20 text-green-400"
                    : feedback.type === "error"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-blue-500/20 text-blue-400"
                }`}
              >
                {feedback.message}
              </motion.div>
            )}

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-cyan-400">
                {t("fizzBuzz.history.title")}
              </h3>
              <div className="space-y-2">
                {history.map((entry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg ${
                      entry.isCorrect
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {t("fizzBuzz.history.entry", {
                      number: entry.number,
                      answer: entry.userAnswer,
                      correct: entry.correctAnswer,
                    })}
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={endGame}
              className="w-full mt-8 p-4 bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-300 font-bold text-lg"
            >
              {t("fizzBuzz.actions.endGame")}
            </motion.button>
          </motion.div>
        )}
      </div>
    </GameLayout>
  );
};

export default FizzBuzz;
