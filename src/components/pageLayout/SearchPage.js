import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Grid,
  Button,
  Container,
  Paper,
} from "@mui/material";
import { useLocation, Link, useNavigate } from "react-router-dom"; // Import to handle URL query and Link
import mockBooks from "../../data/mockBooks"; // Mock data

const SearchPage = () => {
  const query = new URLSearchParams(useLocation().search).get("query");
  const [books, setBooks] = useState([]);
  const navigate = useNavigate(); // useNavigate for navigating back

  useEffect(() => {
    // Simulate filtering books based on the query
    if (query) {
      const filteredBooks = mockBooks.filter((book) =>
        book.title.toLowerCase().includes(query.toLowerCase())
      );
      setBooks(filteredBooks);
    } else {
      setBooks(mockBooks); // Default to showing all books if no query
    }
  }, [query]);

  return (
    <Container
      style={{
        padding: "20px",
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

      <Grid container spacing={3}>
        {books.length > 0 ? (
          books.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Link
                to={{
                  pathname: `/book/${book.id}`,
                  search: `?query=${query}`, // Include the search query in the URL
                }}
                style={{ textDecoration: "none" }}
              >
                <Card
                  style={{
                    margin: "10px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  {book.image && (
                    <CardMedia
                      component="img"
                      height="300" // Adjust height for a better aspect ratio
                      image={book.image}
                      alt={book.title}
                      style={{
                        borderTopLeftRadius: "12px",
                        borderTopRightRadius: "12px",
                      }} // Rounded corners
                    />
                  )}
                  <CardContent>
                    <Typography
                      variant="h6"
                      style={{ fontWeight: "bold", color: "#000" }}
                    >
                      {book.title}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      {book.author}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))
        ) : (
          <CardContent>
            <Typography variant="h6" style={{ color: "#888" }}>
              No books found
            </Typography>
          </CardContent>
        )}
      </Grid>
    </Container>
  );
};

export default SearchPage;
