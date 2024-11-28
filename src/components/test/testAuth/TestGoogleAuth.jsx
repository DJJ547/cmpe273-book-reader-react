import React, { useState, useEffect, useRef } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // Ensure you're importing jwtDecode correctly
const api_url = process.env.REACT_APP_BACKEND_LOCALHOST;

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const TestGoogleAuth = () => {
  const [user, setUser] = useState({});
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null); // Create a ref for the dropdown
  const [authCode, setAuthCode] = useState(null);

  // Load user from localStorage when component mounts
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser)); // Parse the stored user data
    }
  }, []);

  // Handle Google login success and get authorization code
  const handleLoginSuccess = async (codeResponse) => {
    try {
      const { code } = codeResponse; // Extract authorization code from response
      setAuthCode(code); // Save authorization code to state

      // Send the authorization code to the backend for token exchange
      const res = await fetch(`${api_url}auth/exchange-code/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      console.log("Access Token: ", data); // Access token from backend

      // Decode the ID token (if returned) to get user information
      const decoded = jwtDecode(data.id_token); // Decode ID token to extract user info
      const userData = {
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture,
        token: data.access_token, // Store access token for future API requests
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData)); // Save user in localStorage
    } catch (error) {
      console.error("Error during token exchange", error);
    }
  };

  // Handle Google login failure
  const handleLoginFailure = (response) => {
    console.error("Login failed", response);
  };

  // Use the new Google Identity Services to request an authorization code
  const login = useGoogleLogin({
    onSuccess: handleLoginSuccess,
    onError: handleLoginFailure,
    flow: "auth-code", // Request authorization code flow
    scope: "https://www.googleapis.com/auth/books", // Request Google Books API scope
  });

  // Handle logout manually by clearing the user session and revoking the Google session
  const handleLogout = () => {
    setUser(null);
    setDropdownVisible(false);
    localStorage.removeItem("user"); // Remove user from localStorage
  
    // Check if Google Identity Services is available and initialized
    if (window.google && window.google.accounts && window.google.accounts.id) {
      // Ensure revoke is called after the library is initialized
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,  // Your Google Client ID here
      });
  
      // Revoke Google token and disable auto-select
      window.google.accounts.id.revoke(user.email, () => {
        console.log("Logged out from Google");
      });
  
      window.google.accounts.id.disableAutoSelect(); // Disable auto-select of Google account for sign-in
    } else {
      console.error("Google Identity Services not initialized properly");
    }
  };

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="flex justify-between border border-solid border-black">
      <h1 className="text-xl text-bold">
        Test Google OAuth 2 Login and Reading List
      </h1>
      {/* <GoogleOAuthProvider clientId={CLIENT_ID}> */}
        <div className="top-0 right-0 p-4">
          {!user ? (
            <button
              onClick={() => login()} // Call login function on button click
              className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            >
              Sign in with Google
            </button>
          ) : (
            <div className="relative">
              {/* Avatar */}
              <button
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => setDropdownVisible(!dropdownVisible)}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <span>{user.name}</span>
              </button>

              {/* Dropdown Menu */}
              {dropdownVisible && (
                <div
                  ref={dropdownRef} // Attach ref to the dropdown
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50"
                >
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      {/* </GoogleOAuthProvider> */}
    </div>
  );
};

export default TestGoogleAuth;
