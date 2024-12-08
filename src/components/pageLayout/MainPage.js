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
import "semantic-ui-css/semantic.min.css";

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
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_LOCALHOST}/main/books/with-genres/`);
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
    return () => window.removeEventListener("resize", handleResize);
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
  const sortedBooks =
    Array.isArray(books) && books.length > 0
      ? books
          .map((book) => ({
            ...book,
            averageRating: calculateMeanRating(book.reviews),
          }))
          .sort((a, b) => b.averageRating - a.averageRating) // Sort books by rating in descending order
      : [];

  return (
    <div className="p-8">
      <div></div>
      <Typography variant={screenWidth <= 768 ? "h5" : "h4"} gutterBottom>
        Featured Books
      </Typography>

      <div
        style={{
          display: "flex",
          alignItems: "center", // Align vertically
          "margin-bottom": "-4%",
        }}
      >
        <ToggleButtonGroup
          value={category}
          exclusive
          onChange={(e, newCategory) => setCategory(newCategory)}
          aria-label="book category"
          style={{
            marginBottom: "5%",
            overflowX: "auto", // Horizontal scroll for overflow
            width: screenWidth * 0.75,
            whiteSpace: "nowrap", // Prevent wrapping of buttons
            maxHeight: "150px", // Set a max height (adjust as needed)
            display: "flex",
            flexWrap: "nowrap", // Prevent wrapping of buttons onto the next line
          }}
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
                borderRadius: "50px", // Give a rounded but oval shape
                margin: screenWidth <= 768 ? "0 0.5em" : "0 0.75em", // Responsive margin based on screen size
                width: screenWidth <= 768 ? "70vw" : "200px", // Adjust width for mobile and desktop
                height: screenWidth <= 768 ? "35px" : "50px", // Adjust height for mobile and desktop
                backgroundColor: category === genre ? "#3f51b5" : "#f1f1f1",
                color: category === genre ? "white" : "black",
                fontSize: screenWidth <= 480 ? "0.8em" : "1em", // Adjust font size for smaller screens
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {genre}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        &nbsp;&nbsp;
        <FormControl
          variant="outlined"
          style={{
            marginBottom: "4%", // Smaller margin on mobile, larger on desktop
            minWidth: screenWidth * 0.15, // Adjust minWidth for mobile screens
          }}
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
      </div>

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
                  width:
                    screenWidth <= 768
                      ? screenWidth * 0.25 * (3 / 4)
                      : screenWidth * 0.2 * (3 / 4),
                  height: screenWidth * 0.25,
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
                      width:
                        screenWidth <= 768
                          ? screenWidth * 0.25 * (3 / 4)
                          : screenWidth * 0.2 * (3 / 4), // Responsive width
                      height:
                        screenWidth <= 768
                          ? screenWidth * 0.25
                          : screenWidth * 0.2, // Maintain 4:3 aspect ratio
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
            style={{
              margin: "10px",
              borderRadius: "20px",
              overflow: "hidden",
              width: screenWidth * 0.2 * (3 / 4), // Responsive width
              height: screenWidth * 0.2, // Maintain 4:3 aspect ratio
            }}
          >
            <CardContent style={{ textAlign: "center" }}>
              <Typography variant="h6">No Books Found</Typography>
            </CardContent>
          </Card>
        )}
      </Slider>

      <Typography
        variant={screenWidth <= 768 ? "h5" : "h4"}
        gutterBottom
        style={{ marginTop: "40px" }}
      >
        Top Charts
      </Typography>
      <div
        style={{
          maxWidth: "90vw",
          margin: "0 auto",
        }}
      >
        <Grid2 container spacing={2}>
          {sortedBooks.slice(0, 9).map((book) => (
            <Grid2 item xs={12} sm={6} md={4} key={book.id}>
              <Link to={`/book/${book.id}`} style={{ textDecoration: "none" }}>
                <Card
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    padding: "2.5%",
                    cursor: "pointer",
                    borderRadius: "20px",
                    height:
                      screenWidth <= 768
                        ? screenWidth * 0.3
                        : screenWidth * 0.1, // Maintain 4:3 aspect ratio
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
                        width:
                          screenWidth <= 768
                            ? screenWidth * 0.3 * (3 / 4)
                            : screenWidth * 0.1 * (3 / 4), // Responsive width
                        height:
                          screenWidth <= 768
                            ? screenWidth * 0.3
                            : screenWidth * 0.1, // Maintain 4:3 aspect ratio
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
                      {screenWidth <= 768
                        ? truncateDescription(book.book_description, 50)
                        : truncateDescription(book.book_description, 70)}
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
