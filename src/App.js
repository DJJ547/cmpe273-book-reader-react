import React from "react";
import { Routes, Route } from "react-router-dom";
//utilities

//components
import PageLayout from "./components/pageLayout/Navbar";

//pages
import Test from "./pages/Test";
// import Main from "./pages/Main";
import Login from "./pages/auth/Login";
// import Signup from "./pages/auth/Signup";
import Library from "./pages/Library";
import TestGetBookContent from "./components/test/TestGetBookContent";
// ... other imports

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/test" element={<Test />} />
        <Route path="/book/:id" element={<TestGetBookContent />} />
        {/* <Route path="/auth/login" element={<Login />} /> */}
        {/* <Route path="/auth/signup" element={<Signup />} /> */}
        <Route path="/library/:userId/" element={<Library/>} />
        {/* <Route path="/" element={<Main />} /> */}
        {/* <Route path="/test" element={<Test />} /> */}
      </Routes>
    </div>
  );
}

