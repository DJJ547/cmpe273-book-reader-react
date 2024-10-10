// src/App.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/pageLayout/Navbar";
import MainPage from "./components/pageLayout/MainPage"; // Import MainPage
import SearchPage from "./components/pageLayout/SearchPage"; // Renamed SearchPage
import BookDetails from "./components/pageLayout/BookDetails";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/search" element={<SearchPage />} />{" "}
        {/* Search Page Route */}
        <Route path="/book/:id" element={<BookDetails />} />
      </Routes>
    </div>
  );
}

export default App;
