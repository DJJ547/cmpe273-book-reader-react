// src/components/pageLayout/MainPage.js
import React, { useState } from "react";
import { Card, CardContent, Typography, CardMedia } from "@mui/material";
import Slider from "react-slick"; // Import the slider
import { Link } from "react-router-dom"; // Import Link for navigation
import mockBooks from "../../data/mockBooks"; // Mock data

const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "grey" }}
      onClick={onClick}
    />
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "grey" }}
      onClick={onClick}
    />
  );
};

const MainPage = () => {
  const [books] = useState(mockBooks);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Featured Books
      </Typography>

      <Slider {...settings}>
        {books && books.length > 0 ? (
          books.map((book) => (
            <Link
              to={`/book/${book.id}`}
              key={book.id}
              style={{ textDecoration: "none" }}
            >
              <Card style={{ margin: "10px", cursor: "pointer" }}>
                {book.image && (
                  <CardMedia
                    component="img"
                    height="200"
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
          ))
        ) : (
          <Typography>No books found</Typography>
        )}
      </Slider>
    </div>
  );
};

export default MainPage;
