// src/App.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/pageLayout/Navbar";
import MainPage from "./components/pageLayout/MainPage";
import SearchPage from "./components/pageLayout/SearchPage";
import BookDetails from "./components/pageLayout/BookDetails";
import "semantic-ui-css/semantic.min.css";

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/book/:id" element={<BookDetails />} />
      </Routes>
    </div>
  );
}

export default App;
