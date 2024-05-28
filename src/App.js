import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "./App.css";
import TicTacToe from "./components/TicTacToe";
import FizzBuzz from "./components/FizzBuzz";
import Hangman from "./components/Hangman";

const App = () => {
  React.useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <Router>
      <div className="app">
        <nav className="menu">
          <Link to="/tictactoe" data-aos="fade-up">
            Tic-Tac-Toe
          </Link>
          <Link to="/fizzbuzz" data-aos="fade-up">
            FizzBuzz
          </Link>
          <Link to="/hangman" data-aos="fade-up">
            Hangman
          </Link>
        </nav>
        <div className="game-container">
          <Routes>
            <Route path="/tictactoe" element={<TicTacToe />} />
            <Route path="/fizzbuzz" element={<FizzBuzz />} />
            <Route path="/hangman" element={<Hangman />} />
            <Route path="/" element={<h1>Welcome to the Game Menu</h1>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
