import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Container,
  Button,
  Tabs,
  Tab,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import mockBooks from "../../data/mockBooks";

const BookDetails = () => {
  const { id } = useParams();
  const location = useLocation(); // Get the current location
  const query = new URLSearchParams(location.search).get("query"); // Get the query from URL
  const [book, setBook] = useState(null);
  const [value, setValue] = useState(0);
  const navigate = useNavigate(); // useNavigate for navigation

  useEffect(() => {
    const fetchBook = async () => {
      const mockBook = mockBooks.find((b) => b.id === id);
      setBook(mockBook);
    };

    fetchBook();
  }, [id]);

  if (!book) return <Typography>Loading...</Typography>;

  const handleAddToLibrary = () => {
    alert(`${book.title} has been added to your library!`);
  };

  const handleReadBook = () => {
    alert(`Reading ${book.title}...`);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleBack = () => {
    // Navigate back to the Search Page with the query preserved
    navigate(`/search?query=${query}`);
  };

  return (
    <Container
      style={{
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        width: "85%",
        maxWidth: "1200px",
        margin: "auto",
      }}
    >
      <Button
        onClick={handleBack} // Updated back button to go back to Search Page
        variant="outlined"
        color="primary"
        style={{ margin: "20px 0" }}
      >
        Back
      </Button>

      <Card
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          width: "100%",
        }}
      >
        {book.image && (
          <CardMedia
            component="img"
            height="400" // Adjusted height for a larger cover
            image={book.image}
            alt={book.title}
            style={{
              width: "auto",
              flexShrink: 0,
              borderRadius: "10px 0 0 10px",
              aspectRatio: "3 / 4", // Maintain 3:4 aspect ratio
              objectFit: "cover",
              maxWidth: "250px", // Max width for the cover
            }}
          />
        )}
        <CardContent
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "20px",
            flexGrow: 1,
          }}
        >
          <div>
            <Typography
              variant="h4"
              style={{ fontWeight: "bold", marginBottom: "10px" }}
            >
              {book.title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {book.author}
            </Typography>
            <Typography variant="body2" style={{ margin: "10px 0" }}>
              Rating: {book.rating}
            </Typography>
            <Typography variant="body2" style={{ marginBottom: "10px" }}>
              Category: {book.category || "N/A"}
            </Typography>
            <Typography variant="body1" style={{ marginBottom: "20px" }}>
              {book.description}
            </Typography>
          </div>

          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleReadBook}
              style={{ marginRight: "10px", borderRadius: "20px" }}
            >
              Read
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleAddToLibrary}
              style={{ borderRadius: "20px" }}
            >
              Add to Library
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="book details tabs"
        indicatorColor="primary"
        style={{ marginTop: "20px" }}
      >
        <Tab label="Overview" />
        <Tab label="Table of Contents" />
        <Tab label="Reviews" />
      </Tabs>

      {/* Overview Section */}
      <Box hidden={value !== 0}>
        <Typography
          variant="h6"
          style={{ fontWeight: "bold", marginTop: "20px" }}
        >
          Story Overview:
        </Typography>
        <Typography variant="body2">{book.storyOverview}</Typography>
      </Box>

      {/* Table of Contents Section */}
      <Box hidden={value !== 1}>
        <Typography
          variant="h6"
          style={{ fontWeight: "bold", marginTop: "20px" }}
        >
          Chapters:
        </Typography>
        <List style={{ maxHeight: 200, overflow: "auto" }}>
          {book.chapters.map((chapter, index) => (
            <ListItem button key={index}>
              <ListItemText primary={chapter} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Reviews Section */}
      <Box hidden={value !== 2}>
        <Typography
          variant="h6"
          style={{ fontWeight: "bold", marginTop: "20px" }}
        >
          User Reviews:
        </Typography>
        {book.reviews.map((review, index) => (
          <Card
            key={index}
            style={{ marginBottom: "10px", backgroundColor: "#f1f1f1" }}
          >
            <CardContent>
              <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                {review.user}
              </Typography>
              <Typography variant="body2">{review.comment}</Typography>
              <Typography variant="caption" color="textSecondary">
                (Rating: {review.rating})
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default BookDetails;
