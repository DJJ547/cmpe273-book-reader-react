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
  Grid2,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Rating,
} from "@mui/material";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Star, StarBorder, StarHalf } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";

// Function to calculate the mean rating
export const calculateMeanRating = (reviews) => {
  if (reviews && reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  }
  return 0;
};

const BookDetails = () => {
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const { id } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const [book, setBook] = useState(null);
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    const fetchBook = async () => {
      try {
        const response = await fetch(`/main/books/with-genres/${id}/`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setBook(data);
        setReviews(data.reviews || []);
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };

    fetchBook();

    return () => window.removeEventListener("resize", handleResize);
  }, [id]);

  if (!book) return <Typography>Loading...</Typography>;

  const handleAddToLibrary = () => {
    alert(`${book.book_name} has been added to your library!`);
  };

  const handleReadBook = () => {
    navigate(`/readingpage/${id}`);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleBack = () => {
    if (!query) navigate(`/`);
    else navigate(`/search?query=${query}`);
  };

  const handleWriteReview = () => {
    const newReview = {
      rating,
      comment: reviewComment,
      username: "Anonymous", // Update based on actual user data
    };

    // Add the new review to the list (you can replace this with an API call)
    setReviews([...reviews, newReview]);
    setOpenModal(false);
    setRating(0); // Reset rating
    setReviewComment(""); // Clear comment
  };

  return (
    <Container
      maxWidth="lg"
      style={{ padding: "5%", backgroundColor: "#f9f9f9", borderRadius: "8px" }}
    >
      <Button
        onClick={handleBack}
        variant="outlined"
        color="primary"
        style={{ marginBottom: "20px" }}
      >
        Back
      </Button>
      <Grid2 container spacing={2} alignItems="center">
        {/* Image Section */}
        <Grid2
          item
          xs={12}
          md={6}
          style={{ display: "flex", justifyContent: "center" }}
        >
          {book.book_cover && (
            <CardMedia
              component="img"
              image={book.book_cover}
              alt={book.book_name}
              style={{
                width: "50%", // Image takes 50% width on larger screens
                height: "auto", // height adjusts based on width
                objectFit: "cover", // ensures the image fills without stretching
              }}
            />
          )}
        </Grid2>

        {/* Description and Buttons Section */}
        <Grid2 item xs={12} md={6}>
          <CardContent>
            <Typography
              variant={isMobile ? "h6" : "h4"}
              style={{ fontWeight: "bold" }}
            >
              {book.book_name}
            </Typography>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              style={{ marginBottom: "10px" }}
            >
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
            {/* Display Average Rating */}
            <Rating
              value={Number(calculateMeanRating(book.reviews))}
              readOnly
              size="large"
              style={{ marginBottom: "20px" }}
            />

            <Typography
              variant="body2"
              style={{ fontWeight: "bold", marginTop: "10px" }}
            >
              Your Rating: {rating} / 5
            </Typography>
            {/* Editable Rating */}
            <Rating
              value={rating}
              onChange={(_, newValue) => setRating(newValue)}
              size="large"
              style={{ marginBottom: "20px" }}
            />

            <Grid2 container spacing={2} style={{ marginTop: "20px" }}>
              <Grid2 item xs={12} sm="auto">
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  fullWidth={isMobile}
                  onClick={handleReadBook}
                >
                  Read
                </Button>
              </Grid2>
              <Grid2 item xs={12} sm="auto">
                <Button
                  size="large"
                  variant="outlined"
                  color="secondary"
                  fullWidth={isMobile}
                  onClick={handleAddToLibrary}
                >
                  Add to Library
                </Button>
              </Grid2>
              <Grid2 item xs={12} sm="auto">
                <Button
                  size="large"
                  variant="contained"
                  color="success"
                  fullWidth={isMobile}
                  onClick={() => setOpenModal(true)} // Open modal on click
                >
                  Write a Review
                </Button>
              </Grid2>
            </Grid2>
          </CardContent>
        </Grid2>
      </Grid2>

      {/* Review Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Rating
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            size="large"
            style={{ marginBottom: "20px" }}
          />
          <TextField
            label="Your Review"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleWriteReview} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

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
        <List style={{ maxHeight: screenWidth * 0.4, overflow: "auto" }}>
          {book.chapters &&
            book.chapters.map((chapter, index) => (
              <ListItem button key={index}>
                <Link
                  to={`/readingpage/${id}&chapter=${chapter.chapter_number}`}
                  style={{ textDecoration: "none", color: "inherit" }}
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
        style={{ maxHeight: screenWidth * 0.4, overflowY: "auto" }}
      >
        <Typography
          variant="h6"
          style={{ fontWeight: "bold", marginTop: "20px" }}
        >
          User Reviews:
        </Typography>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <Card
              key={index}
              style={{
                marginBottom: "10px",
                backgroundColor: "#f1f1f1",
                borderRadius: "8px",
                boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar style={{ backgroundColor: "#3f51b5" }}>
                    {review.username[0].toUpperCase() || "Anonymous"}
                  </Avatar>
                  <Typography
                    variant="body2"
                    style={{ fontWeight: "bold", marginRight: "10px" }}
                  >
                    {review.username || "Anonymous"}
                  </Typography>
                </div>
                <Rating
                  value={review.rating}
                  readOnly
                  size="small"
                  style={{ marginBottom: "10px" }}
                />
                <Typography
                  variant="body2"
                  style={{ marginTop: "10px", fontSize: "14px" }}
                >
                  {review.review}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            No reviews yet.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default BookDetails;
