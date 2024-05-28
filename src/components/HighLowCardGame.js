import React, { useState } from "react";
import { Button, Container, Typography, Paper, Box, Grid } from "@mui/material";
import "../styles/HighLowCardGame.css";

const suits = ["hearts", "diamonds", "clubs", "spades"];
const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
const suitEmojis = {
  hearts: "♥️",
  diamonds: "♦️",
  clubs: "♣️",
  spades: "♠️",
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
  const [currentCard, setCurrentCard] = useState(getRandomCard());
  const [previousCard, setPreviousCard] = useState(null);
  const [message, setMessage] = useState("");
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);

  const handleGuess = (guess) => {
    let newCard = getRandomCard();
    while (cardValue(newCard) === cardValue(currentCard)) {
      newCard = getRandomCard();
    }
    setPreviousCard(currentCard);

    if (
      (guess === "higher" && cardValue(newCard) > cardValue(currentCard)) ||
      (guess === "lower" && cardValue(newCard) < cardValue(currentCard))
    ) {
      setMessage("You guessed right!");
      setWins(wins + 1);
    } else {
      setMessage("You guessed wrong!");
      setLosses(losses + 1);
    }

    setCurrentCard(newCard);
  };

  const resetGame = () => {
    setCurrentCard(getRandomCard());
    setPreviousCard(null);
    setMessage("");
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} className="highlow-root">
        <Typography variant="h4" gutterBottom>
          High-Low Card Game
        </Typography>
        {previousCard && (
          <Box className="highlow-card previous-card">
            <Typography variant="h1">
              {previousCard.value} {suitEmojis[previousCard.suit]}
            </Typography>
          </Box>
        )}
        <Box className="highlow-card current-card">
          <Typography variant="h1">
            {currentCard.value} {suitEmojis[currentCard.suit]}
          </Typography>
        </Box>
        <Typography variant="h6">{message}</Typography>
        <Grid
          container
          spacing={2}
          className="highlow-controls"
          justifyContent="center"
        >
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleGuess("higher")}
              disabled={previousCard !== null && currentCard !== null}
            >
              Higher
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleGuess("lower")}
              disabled={previousCard !== null && currentCard !== null}
            >
              Lower
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="secondary" onClick={resetGame}>
              Reset
            </Button>
          </Grid>
        </Grid>
        <Box className="highlow-scoreboard">
          <Typography variant="h6">Wins: {wins}</Typography>
          <Typography variant="h6">Losses: {losses}</Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default HighLowCardGame;
