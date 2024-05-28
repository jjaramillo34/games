import React from "react";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import "../App.css";

const Home = () => {
  return (
    <Container maxWidth="md" className="home-container">
      <Typography variant="h2" gutterBottom className="home-title">
        Welcome to the Game Menu
      </Typography>
      <Typography variant="body1" paragraph>
        This is a collection of games built using React and Material-UI. Click
        on the "Games" button in the header to see the list of games.
      </Typography>

      <Typography variant="h4" gutterBottom>
        Games
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Tic-Tac-Toe" />
        </ListItem>
        <ListItem>
          <ListItemText primary="FizzBuzz" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Hangman" />
        </ListItem>
        <ListItem>
          <ListItemText primary="High-Low Card Game" />
        </ListItem>
      </List>

      <Typography variant="body1" paragraph>
        Each game has its own rules and instructions. Have fun playing!
      </Typography>
      <Typography variant="body1" paragraph>
        Inspired by the book "React and Material-UI" by Vercel.
      </Typography>
      <Box mt={4}>
        <Typography variant="body1" paragraph>
          This project is with ❤️ for my Beautiful Wife and my Lovely Son,
          Daughter. With all the love in the world, from your husband and
          father,
        </Typography>
        <Typography variant="body1">
          Thank you for being my inspiration and motivation.
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;
