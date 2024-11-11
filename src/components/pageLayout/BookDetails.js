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
  Avatar,
} from "@mui/material";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Star, StarBorder, StarHalf } from "@mui/icons-material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

import { Link } from "react-router-dom"; // Import Link from react-router-dom

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
export const calculateMeanRating = (reviews) => {
  if (reviews && reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1); // Return the average, rounded to 1 decimal place
  }
  return 0; // Return 0 if no reviews are present
};
const BookDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const [book, setBook] = useState(null);
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/main/books/with-genres/${id}/`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };

    fetchBook();
  }, [id]);

  if (!book) return <Typography>Loading...</Typography>;

  const handleAddToLibrary = () => {
    alert(`${book.book_name} has been added to your library!`);
  };

  const handleReadBook = () => {
    navigate(`/book/read/${id}`);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleBack = () => {
    if (!query) navigate(`/`);
    else navigate(`/search?query=${query}`);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating); // Number of full stars
    const halfStars = rating % 1 !== 0; // Is there a half star?
    const emptyStars = 5 - fullStars - (halfStars ? 1 : 0); // Empty stars to make up 5 stars

    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <Star key={`full-${index}`} style={{ color: "#ff9800" }} />
        ))}
        {halfStars && <StarHalf style={{ color: "#ff9800" }} />}{" "}
        {/* Use StarHalf for the half star */}
        {[...Array(emptyStars)].map((_, index) => (
          <StarBorder key={`empty-${index}`} style={{ color: "#ff9800" }} />
        ))}
      </>
    );
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
        onClick={handleBack}
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
        {book.book_cover && (
          <CardMedia
            component="img"
            height="400"
            image={book.book_cover}
            alt={book.book_name}
            style={{
              width: "auto",
              flexShrink: 0,
              borderRadius: "10px 0 0 10px",
              aspectRatio: "3 / 4",
              objectFit: "cover",
              maxWidth: "250px",
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
              {book.book_name}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {book.author}
            </Typography>
            <Typography variant="body2" style={{ marginBottom: "20px" }}>
              {book.book_description}
            </Typography>
            <Typography variant="body2" style={{ fontWeight: "bold" }}>
              Genres: {book.genres.join(", ")}
            </Typography>
            <Typography
              variant="body2"
              style={{ fontWeight: "bold", marginTop: "10px" }}
            >
              Overall Rating: {calculateMeanRating(book.reviews)} / 5
            </Typography>

            <Typography
              variant="body2"
              style={{ fontWeight: "bold", marginTop: "10px" }}
            >
              {renderStars(calculateMeanRating(book.reviews))}
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
        <Typography variant="body2">{book.book_description}</Typography>
      </Box>

      {/* Table of Contents Section */}
      <Box hidden={value !== 1}>
        {/* Assuming book.chapters exists; adapt as needed */}
        <List style={{ maxHeight: window.innerHeight * 0.5, overflow: "auto" }}>
          {book.chapters &&
            book.chapters.map((chapter, index) => (
              <ListItem button key={index}>
                <Link
                  to={`/book/read/${id}&chapter=${chapter.chapter_number}`} // Create the URL path
                  style={{ textDecoration: "none", color: "inherit" }} // Optional styling to remove default link styles
                >
                  <ListItemText primary={`${chapter.chapter_title}`} />
                </Link>
              </ListItem>
            ))}
        </List>
      </Box>

      {/* Reviews Section */}
      <Box
        hidden={value !== 2}
        style={{
          maxHeight: window.innerHeight * 0.5, // Set a max height for the reviews section
          overflowY: "auto", // Enable vertical scrolling
        }}
      >
        <Typography
          variant="h6"
          style={{ fontWeight: "bold", marginTop: "20px" }}
        >
          User Reviews:
        </Typography>
        {/* Assuming book.reviews exists; adapt as needed */}
        {book.reviews && book.reviews.length > 0 ? (
          book.reviews.map((review, index) => (
            <Card
              key={index}
              style={{
                marginBottom: "10px",
                backgroundColor: "#f1f1f1",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  {/* Profile picture with default user icon */}
                  <Avatar
                    alt={review.username || "Unknown User"}
                    style={{
                      width: "40px",
                      height: "40px",
                      marginRight: "10px",
                      borderRadius: "50%",
                      backgroundColor: "#f4f4f4",
                    }}
                  >
                    <AccountCircleIcon
                      style={{ fontSize: "40px", color: "#ccc" }}
                    />
                  </Avatar>

                  {/* Username */}
                  <Typography
                    variant="body2"
                    style={{ fontWeight: "bold", fontSize: "14px" }}
                  >
                    {review.username || "Unknown User"}
                  </Typography>
                </div>

                {/* Review text */}
                <Typography variant="body2" style={{ marginBottom: "10px" }}>
                  {review.review}
                </Typography>

                {/* Rating */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  {[...Array(5)].map((_, i) => {
                    if (i < Math.floor(review.rating)) {
                      return <Star key={i} style={{ color: "#FFD700" }} />;
                    } else if (i < Math.ceil(review.rating)) {
                      return <StarHalf key={i} style={{ color: "#FFD700" }} />;
                    } else {
                      return (
                        <StarBorder key={i} style={{ color: "#FFD700" }} />
                      );
                    }
                  })}
                </div>

                {/* Rating number */}
                <Typography variant="caption" color="textSecondary">
                  ({review.rating.toFixed(1)}/5)
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>No reviews available.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default BookDetails;
