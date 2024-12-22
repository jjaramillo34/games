import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./i18n";
import AOS from "aos";
import "aos/dist/aos.css";
import MainLayout from "./layouts/MainLayout";
import Home from "./components/Home";
import TicTacToe from "./components/TicTacToe";
import FizzBuzz from "./components/FizzBuzz";
import Hangman from "./components/Hangman";
import HighLowCardGame from "./components/HighLowCardGame";
import MemoryGame from "./components/MemoryGame";
import NumberMaster from "./components/NumberMaster";

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
      <MainLayout
        isDarkTheme={isDarkTheme}
        setIsDarkTheme={setIsDarkTheme}
        currentLanguage={i18n.language}
        onLanguageChange={toggleLanguage}
      >
        <Routes>
          <Route path="/tictactoe" element={<TicTacToe />} />
          <Route path="/fizzbuzz" element={<FizzBuzz />} />
          <Route path="/hangman" element={<Hangman />} />
          <Route path="/highlow" element={<HighLowCardGame />} />
          <Route path="/memorygame" element={<MemoryGame />} />
          <Route path="/numbermaster" element={<NumberMaster />} />
          <Route path="/" element={<Home isDarkTheme={isDarkTheme} />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
