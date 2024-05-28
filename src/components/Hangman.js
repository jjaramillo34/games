import React, { useState, useEffect } from "react";
import { initialize } from "@paunovic/random-words";
import "../styles/Hangman.css";

const RANDOM_EN = initialize({ countryCode: "us" });
const RANDOM_ES = initialize({ countryCode: "es" });

const HINTS_EN = {
  react: "A JavaScript library for building user interfaces.",
  hangman: "A word guessing game.",
  javascript: "A programming language used primarily for web development.",
  // Add more hints for other words as needed
};

const HINTS_ES = {
  react: "Una biblioteca de JavaScript para construir interfaces de usuario.",
  hangman: "Un juego de adivinanza de palabras.",
  javascript:
    "Un lenguaje de programación utilizado principalmente para el desarrollo web.",
  // Add more hints for other words as needed
};

const Hangman = () => {
  const [word, setWord] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [hint, setHint] = useState("");
  const [language, setLanguage] = useState("en");
  const [winCount, setWinCount] = useState(0);
  const [lossCount, setLossCount] = useState(0);
  const [message, setMessage] = useState("");
  const [previousWords, setPreviousWords] = useState([]);
  const [difficulty, setDifficulty] = useState("easy");

  useEffect(() => {
    fetchNewWord();
  }, [language, difficulty]);

  const fetchNewWord = () => {
    const randomWord = language === "en" ? RANDOM_EN.word() : RANDOM_ES.word();
    const wordLength = randomWord.length;

    let isValidWord = false;

    if (difficulty === "easy" && wordLength >= 3 && wordLength <= 6) {
      isValidWord = true;
    } else if (difficulty === "medium" && wordLength >= 7 && wordLength <= 10) {
      isValidWord = true;
    } else if (difficulty === "hard" && wordLength >= 11) {
      isValidWord = true;
    }

    if (!isValidWord) {
      fetchNewWord();
    } else {
      if (word) {
        setPreviousWords([...previousWords, word]);
      }
      setWord(randomWord);
      setGuesses([]);
      setWrongGuesses(0);
      setHint("");
      setMessage("");
    }
  };

  const handleGuess = (e) => {
    const guess = e.target.value.toLowerCase();
    const letterRegex = /^[a-zA-Z]$/;
    if (!letterRegex.test(guess)) {
      setMessage("Please enter a valid letter.");
    } else {
      if (guesses.includes(guess)) {
        setMessage(`You have already guessed "${guess}".`);
      } else {
        setGuesses([...guesses, guess]);
        setMessage("");
        if (!word.includes(guess)) {
          setWrongGuesses(wrongGuesses + 1);
        }
      }
    }
    e.target.value = "";
  };

  const handleHint = () => {
    const hints = language === "en" ? HINTS_EN : HINTS_ES;
    setHint(hints[word] || "No hint available.");
  };

  const isGameOver = wrongGuesses >= 10;
  const isGameWon = word.split("").every((letter) => guesses.includes(letter));

  useEffect(() => {
    if (isGameWon) {
      setWinCount(winCount + 1);
    } else if (isGameOver) {
      setLossCount(lossCount + 1);
    }
  }, [isGameWon, isGameOver]);

  const resetGame = () => {
    setWord("");
    setGuesses([]);
    setWrongGuesses(0);
    setHint("");
    setLanguage("en");
    setWinCount(0);
    setLossCount(0);
    setMessage("");
    setPreviousWords([]);
    setDifficulty("easy");
    fetchNewWord();
  };

  return (
    <div className="hangman game">
      <h1>Hangman</h1>
      <div className="button-container">
        <div>
          <button onClick={() => setLanguage("en")}>English</button>
          <button onClick={() => setLanguage("es")}>Spanish</button>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="easy"
              checked={difficulty === "easy"}
              onChange={() => setDifficulty("easy")}
            />
            Easy
          </label>
          <label>
            <input
              type="radio"
              value="medium"
              checked={difficulty === "medium"}
              onChange={() => setDifficulty("medium")}
            />
            Medium
          </label>
          <label>
            <input
              type="radio"
              value="hard"
              checked={difficulty === "hard"}
              onChange={() => setDifficulty("hard")}
            />
            Hard
          </label>
        </div>
        <div>
          <button onClick={fetchNewWord}>New Word</button>
          <button onClick={handleHint}>Hint</button>
          <button onClick={resetGame}>Reset Game</button>
        </div>
      </div>
      <svg height="250" width="200" className="hangman-drawing">
        {/* Base */}
        {wrongGuesses > 0 && <line x1="10" y1="240" x2="140" y2="240" />}
        {/* Vertical Pole */}
        {wrongGuesses > 1 && <line x1="40" y1="20" x2="40" y2="240" />}
        {/* Horizontal Pole */}
        {wrongGuesses > 2 && <line x1="40" y1="20" x2="120" y2="20" />}
        {/* Rope */}
        {wrongGuesses > 3 && <line x1="120" y1="20" x2="120" y2="50" />}
        {/* Head */}
        {wrongGuesses > 4 && <circle cx="120" cy="70" r="20" />}
        {/* Body */}
        {wrongGuesses > 5 && <line x1="120" y1="90" x2="120" y2="150" />}
        {/* Left Arm */}
        {wrongGuesses > 6 && <line x1="120" y1="110" x2="90" y2="130" />}
        {/* Right Arm */}
        {wrongGuesses > 7 && <line x1="120" y1="110" x2="150" y2="130" />}
        {/* Left Leg */}
        {wrongGuesses > 8 && <line x1="120" y1="150" x2="100" y2="190" />}
        {/* Right Leg */}
        {wrongGuesses > 9 && <line x1="120" y1="150" x2="140" y2="190" />}
      </svg>
      <div className="word">
        {word.split("").map((letter, index) => (
          <span key={index}>{guesses.includes(letter) ? letter : "_"}</span>
        ))}
      </div>
      <div className="guesses">
        {isGameOver ? (
          <div>You lose! The word was: {word}</div>
        ) : isGameWon ? (
          <div>You win!</div>
        ) : (
          <div>
            <p>Wrong guesses: {wrongGuesses}/10</p>
            <input
              type="text"
              maxLength="1"
              onChange={handleGuess}
              disabled={isGameOver || isGameWon}
            />
          </div>
        )}
      </div>
      <div className="previous-guesses">
        <p>Previous guesses:</p>
        {guesses.map((guess, index) => (
          <span
            key={index}
            className={word.includes(guess) ? "correct-guess" : "wrong-guess"}
          >
            {guess}
          </span>
        ))}
      </div>
      {message && <div className="message">{message}</div>}
      {hint && <div className="hint">Hint: {hint}</div>}
      <div className="scoreboard">
        <p>Wins: {winCount}</p>
        <p>Losses: {lossCount}</p>
      </div>
      <div className="previous-words">
        <p>Previous words:</p>
        {previousWords.map((word, index) => (
          <span key={index} className="previous-word">
            {word}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Hangman;
