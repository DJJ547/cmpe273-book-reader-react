import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Grid2,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Slider from "react-slick"; // Import the slider
import { Link } from "react-router-dom"; // Import Link for navigation
import axios from "axios";
import { calculateMeanRating } from "./BookDetails";
const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "grey",
        borderRadius: "50%",
      }}
      onClick={onClick}
    />
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "grey",
        borderRadius: "50%",
      }}
      onClick={onClick}
    />
  );
};

const MainPage = () => {
  const [books, setBooks] = useState([]);
  const [category, setCategory] = useState("All");
  const [displayCount, setDisplayCount] = useState(15); // Default number of books to display

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("/main/books/with-genres/");
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  // Filter books based on selected category
  const filteredBooks =
    category === "All"
      ? books
      : books.filter(
          (book) =>
            book.genres &&
            book.genres.some(
              (genre) => genre.toLowerCase() === category.toLowerCase()
            )
        );

  // Limit to the top N books
  const displayedBooks = filteredBooks.slice(
    0,
    Math.min(displayCount, filteredBooks.length)
  );

  const sliderSettings = {
    dots: true,
    infinite: displayedBooks.length > 1, // Disable looping if there's less than or equal to displayCount
    speed: 500,
    slidesToShow: 5, // Always show the defined number of books
    slidesToScroll: 5,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // Set the autoplay speed in milliseconds (e.g., 3000ms = 3 seconds)
    pauseOnHover: true, // Pause autoplay when the user hovers over the slider
  };

  const truncateDescription = (description, maxChars) => {
    if (description && description.length > maxChars) {
      return `${description.substring(0, maxChars)}...`;
    }
    return description || "No description available";
  };
  const sortedBooks = books
    .map((book) => ({
      ...book,
      averageRating: calculateMeanRating(book.reviews),
    }))
    .sort((a, b) => b.averageRating - a.averageRating); // Sort books by rating in descending order
  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Featured Books
      </Typography>

      <ToggleButtonGroup
        value={category}
        exclusive
        onChange={(e, newCategory) => setCategory(newCategory)}
        aria-label="book category"
        style={{ marginBottom: "20px" }}
      >
        {[
          "All",
          "Thriller",
          "Post-apocalyptic",
          "Fantasy",
          "Comedy",
          "Sci-Fi",
          "Romance",
          "Action",
          "Historical",
          "Josei",
          "Xuanhuan",
          "Mystery",
          "Crime",
          "Martial Arts",
          "Adventure",
        ].map((genre) => (
          <ToggleButton
            key={genre}
            value={genre}
            aria-label={genre.toLowerCase()}
            style={{
              borderRadius: "20px",
              margin: "0 5px",
              backgroundColor: category === genre ? "#3f51b5" : "#f1f1f1",
              color: category === genre ? "white" : "black",
            }}
          >
            {genre}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <FormControl
        variant="outlined"
        style={{ marginBottom: "20px", minWidth: 120 }}
      >
        <InputLabel id="display-count-label">Books to Display</InputLabel>
        <Select
          labelId="display-count-label"
          value={displayCount}
          onChange={(e) => setDisplayCount(e.target.value)}
          label="Books to Display"
        >
          {[5, 10, 15, 20, 100].map((count) => (
            <MenuItem key={count} value={count}>
              {count}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Slider {...sliderSettings}>
        {displayedBooks.length > 0 ? (
          displayedBooks.map((book) => (
            <Link
              to={`/book/${book.id}`}
              key={book.id}
              style={{ textDecoration: "none" }}
            >
              <Card
                style={{
                  width: window.innerWidth * 0.15,
                  margin: "10px",
                  cursor: "pointer",
                  borderRadius: "20px",
                  overflow: "hidden",
                }}
              >
                {book.book_cover && (
                  <CardMedia
                    component="img"
                    image={book.book_cover}
                    alt={book.book_name}
                    style={{
                      width: window.innerWidth * 0.2 * (3 / 4), // Responsive width
                      height: window.innerWidth * 0.2, // Maintain 4:3 aspect ratio
                      objectFit: "cover",
                      borderRadius: "20px 20px 0 0",
                    }}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{book.book_name}</Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {book.author}
                  </Typography>
                  {/* <Typography variant="h6" style={{ fontWeight: "bold" }}>
                    Rating:
                    {calculateMeanRating(book.reviews) } / 5
                  </Typography> */}
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <Card
            style={{ margin: "10px", borderRadius: "20px", overflow: "hidden" }}
          >
            <CardContent style={{ textAlign: "center" }}>
              <Typography variant="h6">No Books Found</Typography>
            </CardContent>
          </Card>
        )}
      </Slider>

      <Typography variant="h4" gutterBottom style={{ marginTop: "40px" }}>
        Top Charts
      </Typography>
      <div style={{ maxWidth: "90vw", margin: "0 auto" }}>
        <Grid2 container spacing={2}>
          {sortedBooks.slice(0, 9).map((book) => (
            <Grid2 item xs={12} sm={6} md={4} key={book.id}>
              <Link to={`/book/${book.id}`} style={{ textDecoration: "none" }}>
                <Card
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    padding: "10px",
                    cursor: "pointer",
                    borderRadius: "20px",
                    height: "200px",
                    overflow: "hidden",
                  }}
                >
                  {book.book_cover && (
                    <CardMedia
                      component="img"
                      sx={{
                        borderRadius: "10px",
                        objectFit: "cover",
                      }}
                      style={{
                        width: window.innerWidth * 0.08 * (3 / 4), // Responsive width
                        height: window.innerWidth * 0.08, // Maintain 4:3 aspect ratio
                        objectFit: "cover",
                        borderRadius: "20px 20px 0 0",
                      }}
                      image={book.book_cover}
                      alt={book.book_name}
                    />
                  )}
                  <CardContent
                    sx={{
                      flex: "1 0 auto",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="h6" style={{ marginBottom: "4px" }}>
                      {book.book_name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="textSecondary"
                      style={{ marginBottom: "4px" }}
                    >
                      {book.author}
                    </Typography>
                    <Typography variant="body2" style={{ marginBottom: "4px" }}>
                      {truncateDescription(book.book_description, 70)}
                    </Typography>
                    {/* Display the average rating */}
                    <Typography variant="body2" style={{ fontWeight: "bold" }}>
                      Rating: {book.averageRating} / 5
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid2>
          ))}
        </Grid2>
      </div>
    </div>
  );
};

export default MainPage;
