import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../components/context/AuthContext";
import { SettingsProvider } from "../components/context/SettingsContext";
import ReadingPage from "./ReadingPage";
import {
  openDatabase,
  addOrUpdateItem,
  getAllItems,
  deleteOldestItem,
} from "../services/indexedDB";
import "../index.css";
import { ConnectingAirportsOutlined } from "@mui/icons-material";

export default function Reader() {
  const { isAuthenticated, user } = useAuth();
  const { book_name, chapter_id } = useParams();
  const [Bookinfo, setBookinfo] = useState({});

  const updateBookHistory = async () => {
    try {
      const response = await axios.put(`/library/update_book_history/`, {
        user_id: user.id,
        book_name: Bookinfo.book_name,
        chapter_id: chapter_id,
      });

      return response.data.result;
    } catch (error) {
      console.error("Error updating book history:", error);
    }
  };

  const fetchChapter = async () => {
    const dbName = "BookCacheDB";
    const storeName = "chapters";
    const key = `${book_name}-${chapter_id}`;

    try {
      const db = await openDatabase(dbName, storeName);

      // Fetch all cache items to ensure we don't exceed 50
      const allItems = await getAllItems(db, storeName);
      if (allItems.length >= 50) {
        await deleteOldestItem(db, storeName); // Remove the oldest record
      }

      // Check if the chapter is already in cache
      const cachedChapter = allItems.find((item) => item.key === key);
      if (cachedChapter) {
        console.log(
          `found cached book data with book_name:${book_name} and chapter_id:${chapter_id}`
        );
        setBookinfo(cachedChapter.value); // Use cached value
      } else {
        // Fetch from the backend if not cached
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_LOCALHOST}reading/book/${book_name}/chapter/${chapter_id}`
        );
        setBookinfo(response.data);

        // Cache the chapter
        await addOrUpdateItem(db, storeName, key, response.data);
      }
    } catch (error) {
      console.error("Error handling cache:", error);
    }
  };

  useEffect(() => {
    fetchChapter();
    if (isAuthenticated) {
      updateBookHistory();
    }
  }, [isAuthenticated, book_name, chapter_id]);

  return (
    <SettingsProvider book={Bookinfo}>
      <ReadingPage />
    </SettingsProvider>
  );
}
