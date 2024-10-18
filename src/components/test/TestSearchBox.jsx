import React, { useState } from "react";
import axios from "axios";
const api_url = process.env.REACT_APP_BACKEND_LOCALHOST;

const TestSearchBox = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);

  const [isVisible, setIsVisible] = useState(true); // State to control visibility

  // Function to toggle visibility
  const handleClose = () => {
    setIsVisible(false);
    setQuery("");
  };

  const searchBooks = async () => {
    try {
      const response = await axios.get(`${api_url}api/get-books?q=${query}`);
      setBooks(response.data.items);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  return (
    <div className="border border-solid border-black">
      <h1 className="text-xl text-bold">Search Google Books</h1>
      <input
        className="bg-slate-200"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for books"
      />
      <button className="bg-indigo-500 text-white ml-5" onClick={searchBooks}>
        Search
      </button>
      <button className="bg-red-600 text-white ml-5" onClick={handleClose} style={{ marginTop: '20px' }}>Reset</button>
      <div>
        {isVisible && (
          <div>
            {books &&
              books.map((book) => (
                <div key={book.id}>
                  <h3>{book.volumeInfo.title}</h3>
                  <p>{book.volumeInfo.authors?.join(", ")}</p>
                  <p>{book.volumeInfo.description}</p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestSearchBox;
