import React, { useState, useEffect } from "react";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReadingList = async () => {
      const savedUser = localStorage.getItem("user");
      if (!savedUser) {
        setError("You must be logged in to access the reading list.");
        setLoading(false);
        return;
      }

      const user = JSON.parse(savedUser);
      const token = user.token;

      try {
        // Fetch user's reading list using the Google Books API
        const response = await fetch(
          "https://www.googleapis.com/books/v1/mylibrary/bookshelves/0/volumes", // 0 = 'My Books' shelf
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch reading list.");
        }

        const data = await response.json();
        setBooks(data.items || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReadingList();
  }, []);

  if (loading) {
    return <div>Loading your reading list...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="">
      <h1 className="text-xl text-bold">Your Reading List</h1>
      {books.length > 0 ? (
        <ul className="">
          {books.map((book) => (
            <li key={book.id} className="book-item">
              <img
                src={book.volumeInfo.imageLinks?.thumbnail || ""}
                alt={book.volumeInfo.title}
                className="book-thumbnail"
              />
              <div>
                <h3>{book.volumeInfo.title}</h3>
                <p>{book.volumeInfo.authors?.join(", ")}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div>No books found in your reading list.</div>
      )}
    </div>
  );
};

export default BookList;
