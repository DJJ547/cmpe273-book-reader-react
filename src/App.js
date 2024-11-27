// src/App.js
import React from "react";
import {Route, Routes, useLocation, useParams } from "react-router-dom";
import Navbar from "./components/pageLayout/Navbar";
import MainPage from "./components/pageLayout/MainPage";
import SearchPage from "./components/pageLayout/SearchPage";
import BookDetails from "./components/pageLayout/BookDetails";

//utilities

//components

//pages
import Test from "./pages/Test";
import ReadingPage from "./pages/ReadingPage";
import Reader from "./pages/Reader";
// import Main from "./pages/Main";
import Login from "./pages/auth/Login";
// import Signup from "./pages/auth/Signup";
import Library from "./pages/Library";
import TestGetBookContent from "./components/test/TestGetBookContent";
// ... other imports

export default function App() {
  const location = useLocation();
  const hideNavbar = location.pathname.includes('/chapter');
  return (
    <div>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* <Route path="/test" element={<Test />} /> */}
        <Route path="/book/:book/chapter/:chapterNumber" element={<Reader />} />
        {/* <Route path="/test" element={<Test />} /> */}
        <Route path="/" element={<MainPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/library" element={<Library/>} />
        {/* <Route path="/auth/login" element={<Login />} /> */}
        {/* <Route path="/auth/signup" element={<Signup />} /> */}
      </Routes>
    </div>
  );
}
