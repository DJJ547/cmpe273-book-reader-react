import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { openDB } from "idb";
import axios from "axios";

const api_url = process.env.REACT_APP_BACKEND_LOCALHOST;

const TestGetBookContent = () => {
  const location = useLocation();
  const bookId = location.state?.book.google_id;
  const [bookData, setBookData] = useState(location.state?.book || null);
  const [fullContent, setFullContent] = useState(""); // Store full content here
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrLoadBookContent = async () => {
      // Initialize the database
      await initializeDB();

      // Try to get the book from IndexedDB
      const dbBook = await getBookFromIndexedDB(bookId);
      if (dbBook) {
        setBookData(dbBook);
        fetchBookContentFromUrl(dbBook.content_url); // Fetch full content if stored in IndexedDB
      } else {
        // Otherwise, fetch from the API
        fetchBookContentFromAPI();
      }
    };

    fetchOrLoadBookContent();
  }, []);

  // Initialize IndexedDB with google_id as the primary key
  const initializeDB = async () => {
    await openDB("BookContentDB", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("books")) {
          const store = db.createObjectStore("books", { keyPath: "google_id" });
          store.createIndex("timestamp", "timestamp");
        }
      },
    });
  };

  // Fetch book from IndexedDB by google_id
  const getBookFromIndexedDB = async (google_id) => {
    const db = await openDB("BookContentDB", 1);
    const book = await db
      .transaction("books")
      .objectStore("books")
      .get(google_id);
    return book;
  };

  // Save book data to IndexedDB and ensure only the 5 most recent books are kept
  const saveToIndexedDB = async (book) => {
    const db = await openDB("BookContentDB", 1);

    // First, store the book data with a timestamp
    book.timestamp = Date.now();
    const tx1 = db.transaction("books", "readwrite");
    await tx1.objectStore("books").put(book);
    await tx1.done;

    // Start a new transaction to prune older entries
    const tx2 = db.transaction("books", "readwrite");
    const store = tx2.objectStore("books");
    const allBooks = await store.index("timestamp").getAll();

    if (allBooks.length > 5) {
      const booksToDelete = allBooks
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(0, allBooks.length - 5);

      for (const bookToDelete of booksToDelete) {
        await store.delete(bookToDelete.google_id);
      }
    }

    await tx2.done;
  };

  // Fetch book content from API
  const fetchBookContentFromAPI = async () => {
    try {
      const response = await axios.get(`${api_url}api/fetch-book-content/`, {
        params: { id: bookId },
      });

      const data = response.data;
      console.log(data)
      const book = {
        google_id: bookId,
        title: data.title || "Unknown Title",
        coverUrl: data.cover_url || "",
        content_url: data.content_url || "",
      };

      setBookData(book);
      saveToIndexedDB(book); // Save fetched book content to IndexedDB
      fetchBookContentFromUrl(book.content_url); // Fetch full content from content_url
      setError("");
    } catch (err) {
      setBookData(null);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Error fetching book content"
      );
    }
  };

  // Fetch full book content from the provided content URL
  const fetchBookContentFromUrl = async (url) => {
    try {
      const response = await axios.get(url, { responseType: "text" }); // Fetch as plain text
      setFullContent(response.data); // Set the full content in state
    } catch (err) {
      setError("Error loading full book content.");
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {bookData ? (
        <div>
          <h2>{bookData.title}</h2>
          {bookData.coverUrl && (
            <img
              src={bookData.coverUrl}
              alt={`${bookData.title} cover`}
              style={{ width: "200px", height: "auto" }}
            />
          )}
          <p>{fullContent}</p> {/* Display full content here */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TestGetBookContent;
