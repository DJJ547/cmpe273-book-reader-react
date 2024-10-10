import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom"; // Import Link for navigation
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Container,
  Button, // Import Button for back navigation
} from "@mui/material";

import mockBooks from "../../data/mockBooks"; // Mock data

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      // Fetch book data using mock data for now
      const mockBook = mockBooks.find((b) => b.id === id);
      setBook(mockBook);
    };

    fetchBook();
  }, [id]);

  if (!book) return <Typography>Loading...</Typography>;

  return (
    <Container>
      <Button
        component={Link}
        to="/" // Navigate to the main page
        variant="contained"
        color="primary"
        style={{ margin: "20px 0" }}
      >
        Back to Search
      </Button>
      <Card style={{ marginTop: "20px" }}>
        {book.image && (
          <CardMedia
            component="img"
            height="400"
            image={book.image}
            alt={book.title}
          />
        )}
        <CardContent>
          <Typography variant="h4">{book.title}</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {book.author}
          </Typography>
          <Typography variant="body1">{book.description}</Typography>
          <Typography variant="h6">Story Overview:</Typography>
          <Typography variant="body2">{book.storyOverview}</Typography>
          <Typography variant="h6">Chapters:</Typography>
          <ul>
            {book.chapters.map((chapter, index) => (
              <li key={index}>{chapter}</li>
            ))}
          </ul>
          <Typography variant="h6">Reviews:</Typography>
          <ul>
            {book.reviews.map((review, index) => (
              <li key={index}>
                <strong>{review.user}:</strong> {review.comment} (Rating:{" "}
                {review.rating})
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BookDetails;
