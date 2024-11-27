import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { SettingsProvider } from "../components/context/SettingsContext";
import ReadingPage from "./ReadingPage";
import "../index.css";

export default function Reader() {
  const { book, chapterNumber } = useParams();
  const [Bookinfo, setBookinfo] = useState({});

  useEffect(() => {
    axios
      .get(
        `${
          process.env.REACT_APP_BACKEND_LOCALHOST
        }reading/book/${book}/chapter/${chapterNumber}`
      )
      .then((response) => {
        setBookinfo(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [book, chapterNumber]);

  return (
    <SettingsProvider book={Bookinfo}>
      <ReadingPage />
    </SettingsProvider>
  );
}
