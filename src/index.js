import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import { AuthProvider } from "./components/context/AuthContext";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID_JAI;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </Router>
);
