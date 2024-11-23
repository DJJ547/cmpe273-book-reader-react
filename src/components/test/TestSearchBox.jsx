import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const api_url = process.env.REACT_APP_BACKEND_LOCALHOST;

const TestSearchBox = ({page, page_size}) => {
  const [query, setQuery] = useState(() => sessionStorage.getItem("query") || "");
  const [books, setBooks] = useState(() => JSON.parse(sessionStorage.getItem("books")) || []);
  const [isVisible, setIsVisible] = useState(books.length > 0);
  const navigate = useNavigate(); 

  // Save query and books in sessionStorage when search results change
  useEffect(() => {
    sessionStorage.setItem("query", query);
    sessionStorage.setItem("books", JSON.stringify(books));
  }, [query, books]);

  const handleClose = () => {
    setIsVisible(false);
    setQuery("");
    setBooks([]);
    sessionStorage.removeItem("query");
    sessionStorage.removeItem("books");
  };

  const searchBooks = async () => {
    if (query.trim() === "") return;
    try {
      const response = await axios.get(`${api_url}api/search-books?q=${query}&page=${page}&page_size=${page_size}`);
      console.log(response);
      setBooks(response.data.books);
      setIsVisible(true);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleBookClick = (book) => {
    console.log("Book clicked:", book.google_id);
    // Navigate programmatically to the book details page, passing the book data
    navigate(`/book/${book.google_id}`, { state: { book } });
  };

  return (
    <div className="border border-solid border-black p-5 w-2/3 mx-auto">
      <h1 className="text-xl font-bold mb-4">Search Google Books</h1>
      <div className="flex">
        <input
          className="bg-slate-200 p-2 flex-grow rounded"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for books"
        />
        <button
          className="bg-indigo-500 text-white ml-4 px-4 py-2 rounded"
          onClick={searchBooks}
        >
          Search
        </button>
        <button
          className="bg-red-600 text-white ml-4 px-4 py-2 rounded"
          onClick={handleClose}
        >
          Reset
        </button>
      </div>

      {/* Display book results if visible */}
      {isVisible && books.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mt-5">
          {books.map((book) => (
            <div
              key={book.google_id}
              className="text-center cursor-pointer"
              onClick={() => handleBookClick(book)}
            >
              <img
                src={book.cover_url}
                alt={book.title}
                className="w-32 h-48 object-cover mx-auto mb-2"
              />
              <h3 className="text-sm font-medium">{book.title}</h3>
              <h4 className="text-sm font-small text-gray-500">{book.author}</h4>
            </div>
          ))}
        </div>
      )}

      {/* No books message */}
      {isVisible && books.length === 0 && (
        <div className="text-center mt-5">No books found for "{query}".</div>
      )}
    </div>
  );
};

export default TestSearchBox;
