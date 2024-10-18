import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import Slider from "react-slick"; // Import the slider
import { Link } from "react-router-dom"; // Import Link for navigation
import mockBooks from "../../data/mockBooks"; // Mock data

const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "grey",
        borderRadius: "50%", // Rounded arrow button
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
        borderRadius: "50%", // Rounded arrow button
      }}
      onClick={onClick}
    />
  );
};

const MainPage = () => {
  const [books] = useState(mockBooks);
  const [category, setCategory] = useState("All");

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  // Filter books based on selected category
  const filteredBooks =
    category === "All"
      ? books
      : books.filter((book) => book.category === category);

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
        <ToggleButton
          value="All"
          aria-label="all"
          style={{
            borderRadius: "20px",
            margin: "0 5px",
            backgroundColor: category === "All" ? "#3f51b5" : "#f1f1f1",
            color: category === "All" ? "white" : "black",
          }}
        >
          All
        </ToggleButton>
        <ToggleButton
          value="Fiction"
          aria-label="fiction"
          style={{
            borderRadius: "20px",
            margin: "0 5px",
            backgroundColor: category === "Fiction" ? "#3f51b5" : "#f1f1f1",
            color: category === "Fiction" ? "white" : "black",
          }}
        >
          Fiction
        </ToggleButton>
        <ToggleButton
          value="Non-Fiction"
          aria-label="non-fiction"
          style={{
            borderRadius: "20px",
            margin: "0 5px",
            backgroundColor: category === "Non-Fiction" ? "#3f51b5" : "#f1f1f1",
            color: category === "Non-Fiction" ? "white" : "black",
          }}
        >
          Non-Fiction
        </ToggleButton>
        <ToggleButton
          value="Mystery"
          aria-label="mystery"
          style={{
            borderRadius: "20px",
            margin: "0 5px",
            backgroundColor: category === "Mystery" ? "#3f51b5" : "#f1f1f1",
            color: category === "Mystery" ? "white" : "black",
          }}
        >
          Mystery
        </ToggleButton>
        <ToggleButton
          value="Fantasy"
          aria-label="fantasy"
          style={{
            borderRadius: "20px",
            margin: "0 5px",
            backgroundColor: category === "Fantasy" ? "#3f51b5" : "#f1f1f1",
            color: category === "Fantasy" ? "white" : "black",
          }}
        >
          Fantasy
        </ToggleButton>
        <ToggleButton
          value="Science Fiction"
          aria-label="science fiction"
          style={{
            borderRadius: "20px",
            margin: "0 5px",
            backgroundColor:
              category === "Science Fiction" ? "#3f51b5" : "#f1f1f1",
            color: category === "Science Fiction" ? "white" : "black",
          }}
        >
          Sci-Fi
        </ToggleButton>
      </ToggleButtonGroup>

      <Slider {...sliderSettings}>
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
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
                  overflow: "hidden", // Prevent overflow
                }}
              >
                {book.image && (
                  <CardMedia
                    component="img"
                    height="300" // Height for 3:4 aspect ratio
                    image={book.image}
                    alt={book.title}
                    style={{
                      width: window.innerWidth * 0.15,
                      objectFit: "cover", // Maintain aspect ratio
                      borderRadius: "20px 20px 0 0", // Rounded top corners
                    }}
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
          ))
        ) : (
          <Typography>No books found</Typography>
        )}
      </Slider>

      <Typography variant="h4" gutterBottom style={{ marginTop: "40px" }}>
        Top Charts
      </Typography>

      <div style={{ maxWidth: "90vw", margin: "0 auto" }}>
        <Grid container spacing={2}>
          {filteredBooks.slice(0, 9).map((book, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Link to={`/book/${book.id}`} style={{ textDecoration: "none" }}>
                <Card
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    padding: "10px",
                    cursor: "pointer",
                    borderRadius: "20px",
                  }}
                >
                  {book.image && (
                    <CardMedia
                      component="img"
                      sx={{
                        width: 100,
                        height: 150, // Height for 3:4 aspect ratio
                        borderRadius: "10px", // Rounded corners
                        objectFit: "cover", // Maintain aspect ratio
                      }}
                      image={book.image}
                      alt={book.title}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6">{book.title}</Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      {book.author}
                    </Typography>
                    <Typography variant="body2">{book.rating} ⭐</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {book.price}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {book.overview}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default MainPage;
