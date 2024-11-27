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
import axios from "axios";

import { ShelfModal } from "./AddToShelfModel";

import { RemoveShelfModal } from "./RemoveShelfModal";
import { useAuth } from "../context/AuthContext";

// Function to calculate the mean rating
export const calculateMeanRating = (reviews) => {
  if (reviews && reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  }
  return 0;
};

const BookDetails = () => {
  const { user } = useAuth();
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

  const [isInWishlist, setIsInWishlist] = useState(false); // Track if the book is in the wishlist
  const [isShelfModelOpen, setIsShelfModelOpen] = useState(false);
  const [isRemoveModelOpen, setIsRemoveModelOpen] = useState(false);

  const [isBookInShelf, setIsBookInShelf] = useState(false);
  const [addedToLibraryShelves, setAddedToLibraryShelves] = useState([]);
  // Function to handle adding/removing from wishlist
  const handleAddToWishlist = () => {
    if (isInWishlist) {
      removeBookFromWishlist();
    } else {
      addBookToWishlist();
    }
  };
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

  const fetchAddedToLibrary = async () => {
    try {
      const response = await axios.get(
        `/library/get_shelves_with_current_book/?user_id=${user.id}&book_id=${id}`
      );
      if (response.data.result) {
        setIsBookInShelf(response.data.result);
        setAddedToLibraryShelves(response.data.data);
      } else {
        setIsBookInShelf(response.data.result);
        setAddedToLibraryShelves([]);
      }
    } catch (error) {
      setIsBookInShelf(false);
      setAddedToLibraryShelves([]);
      console.error("Error adding book to wishlist:", error);
    }
  };

  const addBookToWishlist = async () => {
    try {
      const response = await axios.post(`/library/add_book_to_wishlist/`, {
        user_id: user.id,
        book_id: book.id,
      });
      if (response.data.result) {
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error("Error adding book to wishlist:", error);
    }
  };

  const removeBookFromWishlist = async () => {
    try {
      const response = await axios.delete(
        `/library/remove_book_from_wishlist/`,
        {
          params: {
            user_id: user.id,
            book_id: book.id,
          },
        }
      );
      if (response.data.result) {
        fetchAddedToLibrary();
      }
    } catch (error) {
      console.error("Error removing book from wishlist:", error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    fetchBook();
    fetchAddedToLibrary();
    return () => window.removeEventListener("resize", handleResize);
  }, [id]);

  if (!book) return <Typography>Loading...</Typography>;

  const handleAddToLibrary = () => {
    if (isBookInShelf) setIsRemoveModelOpen(true);
    else setIsShelfModelOpen(true);
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
      book_id: id,
      user_id: 1,
      review: reviewComment,
      rating: rating,
    };
    axios
      .post("/main/reviews/", newReview)
      .then((SUCCESS) => {})
      .catch((e) => {
        console.log("post review failed e", e);
      });
    // Add the new review to the list (you can replace this with an API call)
    fetchBook();
    setOpenModal(false);
    setRating(0); // Reset rating
    setReviewComment(""); // Clear comment
  };

  return (
    <Container
      maxWidth="lg"
      style={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}
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
                  {isBookInShelf ? "Remove from Libary" : " Add to Library"}
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

              <Grid2 item xs={12} sm="auto">
                <Button
                  color="info"
                  onClick={handleAddToWishlist}
                  size="large"
                  startIcon={
                    isInWishlist ? (
                      <svg
                        viewBox="0 0 24 24"
                        className="rLq5qb"
                        width="24"
                        height="24"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M17 3H7C5.8965 3 5.01075 3.8955 5.01075 5L5 21L12 18L19 21V5C19 3.8955 18.1045 3 17 3ZM10.4228 14.2L6.74775 10.525L8.2325 9.04025L10.4228 11.2305L15.8573 5.796L17.342 7.28075L10.4228 14.2Z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        className="rLq5qb"
                        width="24"
                        height="24"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7 3H17C18.1045 3 19 3.8955 19 5V21L12 18L5 21L5.01075 5C5.01075 3.8955 5.8965 3 7 3ZM12 15.824L17 18V5H7V18L12 15.824ZM13 7V9H15V11H13V13H11V11H9V9H11V7H13Z"
                        ></path>
                      </svg>
                    )
                  }
                >
                  {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
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
        <Tab label="Table of Contents" />
        <Tab label="Reviews" />
      </Tabs>
      {/* Table of Contents Section */}
      <Box hidden={value !== 0}>
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
        hidden={value !== 1}
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

      <RemoveShelfModal
        id={id}
        isOpen={isRemoveModelOpen}
        onClose={() => {
          setIsRemoveModelOpen(false);
        }}
        data={addedToLibraryShelves}
        fetchAddedToLibrary={fetchAddedToLibrary}
      />

      <ShelfModal
        id={id}
        isOpen={isShelfModelOpen}
        onClose={() => {
          setIsShelfModelOpen(false);
        }}
        fetchAddedToLibrary={fetchAddedToLibrary}
      />
    </Container>
  );
};

export default BookDetails;
