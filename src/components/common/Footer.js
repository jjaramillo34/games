import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Typography variant="body1" color="textSecondary" align="center">
        &copy; {new Date().getFullYear()} Game Menu. All Rights Reserved.
        <br />
        <span style={{ fontSize: "0.8em" }}>
          Built with ❤️ using React and Material-UI
        </span>
      </Typography>
    </Box>
  );
};

export default Footer;
