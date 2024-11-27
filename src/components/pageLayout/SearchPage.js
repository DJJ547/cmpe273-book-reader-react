import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Grid2,
  Button,
  Container,
  CircularProgress,
} from "@mui/material";
import { useLocation, Link, useNavigate } from "react-router-dom"; // Import to handle URL query and Link
import { calculateMeanRating } from "./BookDetails";
import "semantic-ui-css/semantic.min.css";

import axios from "axios"; // Import axios for API calls

const SearchPage = () => {
  const query = new URLSearchParams(useLocation().search).get("query");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(""); // State for error handling
  const navigate = useNavigate(); // useNavigate for navigating back
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    const fetchBooks = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        const response = await axios.get(
          `/main/books/with-genres/search/?query=${query}`
        ); // Update the endpoint for search
        setBooks(response.data);
        setError(""); // Clear previous errors
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("No books found matching your search."); // Set error message
      } finally {
        setLoading(false); // Stop loading once done
      }
    };

    if (query) {
      fetchBooks();
    } else {
      setLoading(false); // Stop loading if there's no query
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [query]);

  return (
    <Container
      style={{
        backgroundColor: "#f7f7f7",
        borderRadius: "8px",
      }}
    >
      <Button
        variant="outlined"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "20px", borderRadius: "20px" }}
      >
        Back
      </Button>

      <Typography
        variant="h4"
        gutterBottom
        style={{ fontWeight: "bold", color: "#333" }}
      >
        Search Results for "{query}"
      </Typography>

      {loading ? (
        <CircularProgress /> // Show loading indicator
      ) : error ? (
        <Typography variant="h6" color="error">
          {error}
        </Typography> // Show error message
      ) : (
        <Grid2
          container
          spacing={3}
          style={{ maxHeight: screenHeight * 0.7, overflowY: "auto" }}
        >
          {books.length > 0 ? (
            books.map((book) => (
              <Grid2 item xs={12} sm={6} md={4} key={book.id}>
                <Link
                  to={`/book/${book.id}?query=${query}`} // Include the search query in the URL
                  style={{ textDecoration: "none" }}
                >
                  <Card
                    style={{
                      margin: "10px",
                      borderRadius: "12px",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                      transition: "transform 0.3s",
                      width:
                        screenWidth <= 768
                          ? "90vw"
                          : screenWidth * 0.2 * (3 / 4), // Larger width on mobile
                      height: screenWidth <= 768 ? "auto" : screenWidth * 0.25, // Auto height on mobile for flexibility
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    {book.book_cover && (
                      <CardMedia
                        component="img"
                        image={book.book_cover}
                        alt={book.book_name}
                        style={{
                          width:
                            screenWidth <= 768
                              ? "100%"
                              : screenWidth * 0.2 * (3 / 4), // Responsive width
                          height:
                            screenWidth <= 768 ? "auto" : screenWidth * 0.2, // Adjust height for mobile
                          objectFit: "cover",
                          borderRadius: "20px 20px 0 0",
                        }}
                      />
                    )}
                    <CardContent
                      style={{
                        padding: screenWidth <= 768 ? "16px" : "16px", // Adjust padding for mobile
                      }}
                    >
                      <Typography
                        variant="h6"
                        style={{
                          fontWeight: "bold",
                          color: "#000",
                          fontSize: screenWidth <= 768 ? "1.6rem" : "1.5rem", // Adjust font size for mobile
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap", // Prevent overflow of text
                        }}
                      >
                        {book.book_name}
                      </Typography>

                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        style={{
                          fontSize: screenWidth <= 768 ? "1.2rem" : "1.1rem", // Adjust font size for mobile
                          marginBottom: screenWidth <= 768 ? "10px" : "8px", // Adjust margin for spacing
                          color: screenWidth <= 768 ? "#333" : "#555", // Adjust color for better visibility
                        }}
                      >
                        {book.author}
                      </Typography>

                      <Typography
                        variant="body2"
                        style={{
                          fontWeight: "bold",
                          fontSize: screenWidth <= 768 ? "1.2rem" : "1.1rem", // Adjust font size for mobile
                          marginBottom: screenWidth <= 768 ? "10px" : "8px", // Adjust margin for spacing
                          color: screenWidth <= 768 ? "#333" : "#555", // Adjust color for better visibility
                        }}
                      >
                        Rating: {calculateMeanRating(book.reviews)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid2>
            ))
          ) : (
            <CardContent>
              <Typography variant="h6" style={{ color: "#888" }}>
                No books found
              </Typography>
            </CardContent>
          )}
        </Grid2>
      )}
    </Container>
  );
};

export default SearchPage;
