import React from "react";
import { Routes, Route } from "react-router-dom";
// ... other imports
import "./index.css";

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
  return (
    <div>
      <Routes>
        <Route path="/test" element={<Test />} />
        <Route path="/readingpage" element={<Reader />} />
        {/* <Route path="/auth/login" element={<Login />} /> */}
        {/* <Route path="/auth/signup" element={<Signup />} /> */}
        {/* <Route path="/" element={<Main />} /> */}
        {/* <Route path="/test" element={<Test />} /> */}
      </Routes>
    </div>
  );
}

