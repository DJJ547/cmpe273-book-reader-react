import React, { useState, useEffect } from "react";
import axios from "axios";
const api_url = process.env.REACT_APP_BACKEND_LOCALHOST;

const TestSearchBoxPagination = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [maxResults, setMaxResults] = useState(10); // Default: 10 results per page
  const [totalItems, setTotalItems] = useState(0);

  const [isVisible, setIsVisible] = useState(true); // State to control visibility

  // Function to toggle visibility
  const handleClose = () => {
    setIsVisible(false);
    setQuery("");
  };

  // Function to fetch books based on the query and current page number
  const searchBooks = async () => {
    if (!query) return; // Don't search if query is empty
    try {
      const response = await axios.get(
        `${api_url}api/get-books-paginated?q=${query}&pageNumber=${pageNumber}&maxResults=${maxResults}`
      );
      setBooks(response.data.items || []);
      setTotalItems(response.data.totalItems || 0);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Navigate to the next page
  const handleNextPage = () => {
    if (pageNumber * maxResults < totalItems) {
      setPageNumber(pageNumber + 1);
    }
  };

  // Navigate to the previous page
  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  // Trigger search when query or page number changes
  useEffect(() => {
    searchBooks();
  }, [pageNumber]);

  // Reset to the first page and search again when a new query is entered
  const handleSearch = () => {
    setPageNumber(1);
    searchBooks();
  };

  return (
    <div className="border border-solid border-black">
      <h1 className="text-xl text-bold">Search Google Books with Pagination</h1>
      <input
        className="bg-slate-200"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for books"
      />
      <button className="bg-indigo-500 text-white ml-5" onClick={handleSearch}>
        Search
      </button>
      <button
        className="bg-red-600 text-white ml-5"
        onClick={handleClose}
        style={{ marginTop: "20px" }}
      >
        Reset
      </button>
      <div>
        {isVisible && (
          <div>
            {books.length === 0 && (
              <p>No books found. Please try a different search.</p>
            )}
            {books.map((book) => (
              <div key={book.id} style={{ marginBottom: "20px" }}>
                <h3>{book.volumeInfo.title}</h3>
                <p>{book.volumeInfo.authors?.join(", ")}</p>
                <p>{book.volumeInfo.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: "20px" }}>
        <button
          className="bg-slate-300 text-black ml-5"
          onClick={handlePreviousPage}
          disabled={pageNumber === 1}
        >
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>Page {pageNumber}</span>
        <button
          className="bg-slate-300 text-black ml-5"
          onClick={handleNextPage}
          disabled={pageNumber * maxResults >= totalItems}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TestSearchBoxPagination;
