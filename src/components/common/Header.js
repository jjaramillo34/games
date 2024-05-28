import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link } from "react-router-dom";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <a href="/" style={{ textDecoration: "none", color: "white" }}>
            Game Menu
          </a>
        </Typography>
        <Button color="inherit" onClick={handleClick}>
          Games
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem component={Link} to="/tictactoe" onClick={handleClose}>
            Tic-Tac-Toe
          </MenuItem>
          <MenuItem component={Link} to="/fizzbuzz" onClick={handleClose}>
            FizzBuzz
          </MenuItem>
          <MenuItem component={Link} to="/hangman" onClick={handleClose}>
            Hangman
          </MenuItem>
          <MenuItem component={Link} to="/highlow" onClick={handleClose}>
            High-Low Card Game
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
