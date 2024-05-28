import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { Container, CssBaseline, Box } from "@mui/material";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Home from "./components/Home";
import TicTacToe from "./components/TicTacToe";
import FizzBuzz from "./components/FizzBuzz";
import Hangman from "./components/Hangman";
import HighLowCardGame from "./components/HighLowCardGame";
import BrickBreaker from "./components/BrickBreaker";
import "./App.css";

const App = () => {
  React.useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <Router>
      <CssBaseline />
      <Header />
      <Container component="main" sx={{ mt: 4, mb: 4 }}>
        <Box className="game-container">
          <Routes>
            <Route path="/tictactoe" element={<TicTacToe />} />
            <Route path="/fizzbuzz" element={<FizzBuzz />} />
            <Route path="/hangman" element={<Hangman />} />
            <Route path="/highlow" element={<HighLowCardGame />} />
            <Route path="/brickbreaker" element={<BrickBreaker />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Box>
      </Container>
      <Footer />
    </Router>
  );
};

export default App;
