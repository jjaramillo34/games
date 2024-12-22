import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./i18n";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Home from "./components/Home";
import TicTacToe from "./components/TicTacToe";
import FizzBuzz from "./components/FizzBuzz";
import Hangman from "./components/Hangman";
import HighLowCardGame from "./components/HighLowCardGame";
import MemoryGame from "./components/MemoryGame";

const App = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const { i18n } = useTranslation();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith("es") ? "en" : "es";
    i18n.changeLanguage(newLang);
  };

  return (
    <Router>
      <div
        className={`min-h-screen flex flex-col ${
          isDarkTheme
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
            : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
        }`}
      >
        <Header
          isDarkTheme={isDarkTheme}
          setIsDarkTheme={setIsDarkTheme}
          currentLanguage={i18n.language}
          onLanguageChange={toggleLanguage}
        />
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/tictactoe" element={<TicTacToe />} />
            <Route path="/fizzbuzz" element={<FizzBuzz />} />
            <Route path="/hangman" element={<Hangman />} />
            <Route path="/highlow" element={<HighLowCardGame />} />
            <Route path="/memorygame" element={<MemoryGame />} />
            <Route path="/" element={<Home isDarkTheme={isDarkTheme} />} />
          </Routes>
        </main>
        <Footer isDarkTheme={isDarkTheme} />
      </div>
    </Router>
  );
};

export default App;
