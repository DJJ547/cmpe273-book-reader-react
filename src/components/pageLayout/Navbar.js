import React, { useState, useEffect } from "react";
import { Menu, Input, Icon } from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file
import "semantic-ui-css/semantic.min.css";

import { useAuth } from "../../components/context/AuthContext";
import LoginIcon from "./LoginIcon";

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false); // Toggle for search input
  const [fontSize, setFontSize] = useState("20px"); // State for font size
  const navigate = useNavigate();

  // Function to update font size based on window width
  const updateFontSize = () => {
    const width = window.innerWidth;
    if (width < 480) {
      setFontSize("12px"); // Small font size for mobile
    } else if (width < 768) {
      setFontSize("16px"); // Medium font size for tablets
    } else {
      setFontSize("18px"); // Default font size
    }
  };

  useEffect(() => {
    // Update font size on initial render
    updateFontSize();
    // Add resize event listener
    window.addEventListener("resize", updateFontSize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateFontSize);
    };
  }, []);

  const handleSearch = () => {
    if (searchTerm) {
      navigate(`/search?query=${searchTerm}`);
      setSearchTerm(""); // Clear the input
      setIsSearchActive(false); // Close the search box after submitting
    }
  };

  const handleIconClick = () => {
    setIsSearchActive(true); // Show search input when the icon is clicked
  };

  // Handle Esc key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isSearchActive) {
        if (e.key === "Escape") {
          setSearchTerm(""); // Clear the input on Escape
          setIsSearchActive(false); // Hide the search box
        } else if (e.key === "Enter") {
          handleSearch(); // Trigger search on Enter key
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchActive, searchTerm]); // Add searchTerm as a dependency

  return (
    <Menu
      style={{
        backgroundColor: "#ADD8E6",
        color: "black",
        fontSize,
        top: "0",
        left: "0",
        right: "0",
        zIndex: 1000,
      }}
    >
      {/* Light blue background */}
      <Menu.Item header>
        <img
          src={`${process.env.PUBLIC_URL}/webReaderLogo.png`}
          alt="Web Reader Logo"
          style={{ height: "40px", marginRight: "10px" }}
        />
        Web Reader
      </Menu.Item>
      <Menu.Menu position="left">
        <Menu.Item as={Link} to="/">
          Home
        </Menu.Item>
        {isAuthenticated && user && Object.keys(user).length > 0 && (
          <Menu.Item as={Link} to={`/library/${user.id}`}>
            Library
          </Menu.Item>
        )}
      </Menu.Menu>
      <div
        className={`search-container ${isSearchActive ? "active" : ""}`}
        style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}
      >
        {isSearchActive ? (
          <Input
            type="search" // Set the input type to search
            placeholder="Search Books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearch(); // Trigger search on Enter key
              }
            }}
            autoFocus
            style={{
              width: 0.4 * window.innerWidth,
              transition: "width 0.3s",
              fontSize: "inherit", // Use the inherited font size
            }} // Adjust width and transition
          />
        ) : (
          <Icon
            color="black" // Set the icon color to black for better contrast
            name="search"
            size="large"
            onClick={handleIconClick} // Show search input on click
            style={{ cursor: "pointer" }}
          />
        )}
      </div>
      <LoginIcon />
    </Menu>
  );
};

export default Navbar;
