import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
const api_url = process.env.REACT_APP_BACKEND_LOCALHOST;

const TestGetPopularBooks = ({ genre, maxResults }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const fetchPopularBooks = async () => {
    try {
      const response = await axios.get(
        `${api_url}api/get-specific-books/?genre=${genre}&maxResults=${maxResults}`
      );
      setBooks(response.data.items || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching popular books:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularBooks();
  }, []);

  return (
    <div className="relative border border-solid border-black">
      <h1 className="text-xl text-bold">{genre}</h1>
      <div className="flex items-center">
        <button
          onClick={scrollLeft}
          className="p-2 bg-gray-300 hover:bg-gray-400 rounded-l"
          style={{ position: "absolute", left: 0, zIndex: 10 }}
        >
          &#8592; {/* Left Arrow */}
        </button>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div
            className="flex overflow-hidden"
            style={{ whiteSpace: "nowrap", width: "100%", padding: "0 40px" }}
            ref={scrollRef}
          >
            {books.length === 0 ? (
              <p>No ${genre} books found.</p>
            ) : (
              books.map((book) => (
                <div
                  key={book.id}
                  style={{
                    marginRight: "20px",
                    display: "inline-block",
                    width: "150px",
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  {book.volumeInfo.imageLinks?.thumbnail && (
                    <img
                      src={book.volumeInfo.imageLinks.thumbnail}
                      alt={book.volumeInfo.title}
                      style={{
                        height: "200px",
                        width: "150px",
                        objectFit: "cover",
                        marginBottom: "10px",
                        cursor: "pointer",
                        transition: "filter 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = "brightness(80%)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = "brightness(100%)";
                      }}
                    />
                  )}
                  <h3
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      width: "150px",
                    }}
                  >
                    {book.volumeInfo.title}
                  </h3>
                </div>
              ))
            )}
          </div>
        )}
        <button
          onClick={scrollRight}
          className="p-2 bg-gray-300 hover:bg-gray-400 rounded-r"
          style={{ position: "absolute", right: 0, zIndex: 10 }}
        >
          &#8594; {/* Right Arrow */}
        </button>
      </div>
    </div>
  );
};

export default TestGetPopularBooks;
