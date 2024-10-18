import React from "react";
import { Routes, Route } from "react-router-dom";
// ... other imports
import "./index.css";

//utilities

//components
import PageLayout from "./components/pageLayout/Navbar";

//pages
import Test from "./pages/Test";
// import Main from "./pages/Main";
import Login from "./pages/auth/Login";
// import Signup from "./pages/auth/Signup";
import BookList from "./pages/BookList";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/test" element={<Test />} />
        {/* <Route path="/auth/login" element={<Login />} /> */}
        <Route path="/book-lists" element={<BookList />} />
        {/* <Route path="/auth/signup" element={<Signup />} /> */}
        {/* <Route path="/" element={<Main />} /> */}
        {/* <Route path="/test" element={<Test />} /> */}
      </Routes>
    </div>
  );
}

