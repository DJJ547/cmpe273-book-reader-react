import React, { useState } from "react";
const api_url = process.env.REACT_APP_BACKEND_LOCALHOST;

const TestGetBookReviews = () => {
  const [bookTitle, setBookTitle] = useState("");
  const [reviews, setReviews] = useState([]);

  // Function to toggle visibility
  const handleClose = () => {
    setBookTitle("");
    setReviews([]);
  };

  const fetchBookReviews = async () => {
    try {
      const response = await fetch(
        `${api_url}api/get-book-reviews?title=${bookTitle}`
      );
      const data = await response.json();
      if (data.reviews) {
        setReviews(data.reviews);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Failed to fetch book reviews:", error);
    }
  };

  const renderStars = (averageRating) => {
    const totalStars = 5;
    const filledStars = Math.floor(averageRating);
    const hasHalfStar = averageRating - filledStars >= 0.5;

    return (
      <div className="flex items-center">
        {[...Array(filledStars)].map((_, index) => (
          <span key={index} className="text-yellow-500">
            &#9733;
          </span> // Gold star
        ))}
        {hasHalfStar && <span className="text-yellow-500/50">&#9733;</span>}
        {[...Array(totalStars - filledStars - (hasHalfStar ? 1 : 0))].map(
          (_, index) => (
            <span key={index} className="text-gray-400">
              &#9733;
            </span> // Grey star
          )
        )}
      </div>
    );
  };

  return (
    <div className="p-4 border border-solid border-black">
      <h1 className="text-xl text-bold">Get Book Ratings</h1>
      <input
        type="text"
        value={bookTitle}
        onChange={(e) => setBookTitle(e.target.value)}
        placeholder="Enter Book Title"
        className="border p-2 rounded mb-4"
      />
      <button
        onClick={fetchBookReviews}
        className="bg-blue-500 text-white px-4 py-2 rounded mx-5 hover:bg-blue-600"
      >
        Get Reviews
      </button>
      <button
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800"
        onClick={handleClose}
        style={{ marginTop: "20px" }}
      >
        Reset
      </button>

      <div>
        {reviews.map((review, index) => (
          <div key={index} className="border-b pb-4 mb-4">
            <h3 className="text-lg font-semibold">{review.title}</h3>
            <p>Authors: {review.authors?.join(", ")}</p>
            <p>Description: {review.description}</p>
            <div className="mt-2">
              {review.average_rating
                ? renderStars(review.average_rating)
                : "No Rating Available"}
            </div>
            <p className="text-gray-500">
              Ratings Count: {review.ratings_count}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestGetBookReviews;
