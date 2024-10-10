// src/components/pageLayout/SearchPage.js
import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, CardMedia, Grid2 } from "@mui/material";
import { useLocation, Link } from "react-router-dom"; // Import to handle URL query and Link
import mockBooks from "../../data/mockBooks"; // Mock data

const SearchPage = () => {
  const query = new URLSearchParams(useLocation().search).get("query");
  const [books, setBooks] = useState([]);

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
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Search Results for "{query}"
      </Typography>

      <Grid2 container spacing={2}>
        {books.length > 0 ? (
          books.map((book) => (
            <Grid2 item xs={12} sm={6} md={4} key={book.id}>
              <Link to={`/book/${book.id}`} style={{ textDecoration: "none" }}>
                <Card style={{ margin: "10px", width: "200px" }}>
                  {book.image && (
                    <CardMedia
                      component="img"
                      height="300" // Adjust height for a better aspect ratio
                      image={book.image}
                      alt={book.title}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6">{book.title}</Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      {book.author}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid2>
          ))
        ) : (
          <Typography>No books found</Typography>
        )}
      </Grid2>
    </div>
  );
};

export default SearchPage;
