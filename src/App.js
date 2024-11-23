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
// import Login from "./pages/auth/Login";
// import Signup from "./pages/auth/Signup";

export default function App() {
  const location = useLocation();
  const hideNavbar = location.pathname.includes('/chapter');
  return (
    <div>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/test" element={<Test />} />
        <Route path="/book/:book/chapter/:chapterNumber" element={<Reader />} />

        {/* <Route path="/auth/login" element={<Login />} /> */}
        {/* <Route path="/auth/signup" element={<Signup />} /> */}
        {/* <Route path="/" element={<Main />} /> */}
        {/* <Route path="/test" element={<Test />} /> */}
      </Routes>
    </div>
  );
}
