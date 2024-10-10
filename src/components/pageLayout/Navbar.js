// src/components/Navbar.js
import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to the search page with the query as a URL parameter
    navigate(`/search?query=${searchTerm}`);
    setSearchTerm(""); // Clear the search input after submitting
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Google Books Clone
        </Typography>
        <form
          onSubmit={handleSearch}
          style={{ display: "flex", alignItems: "center" }}
        >
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search Books"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              marginRight: "10px",
              marginBottom: "10px",
              backgroundColor: "#e3f2fd", // Light blue background
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.23)", // Default border color
                },
                "&:hover fieldset": {
                  borderColor: "#1976d2", // Border color on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1976d2", // Border color when focused
                },
              },
            }}
          />
          <Button type="submit" color="inherit">
            Search
          </Button>
        </form>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
