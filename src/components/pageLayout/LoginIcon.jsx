import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/context/AuthContext";
import { Icon } from "semantic-ui-react";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const LoginIcon = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  // Handle logout manually by clearing the user session and revoking the Google session
  const handleLogout = () => {
    setDropdownVisible(false);
    logout();
    // Check if Google Identity Services is available and initialized
    if (window.google && window.google.accounts && window.google.accounts.id) {
      // Ensure revoke is called after the library is initialized
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID, // Your Google Client ID here
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="top-0 right-0 p-4">
      {!isAuthenticated && !user ? (
        <button
          onClick={() => navigate("/auth/login")} // Call login function on button click
          className="bg-blue-500 text-white py-2 px-4 rounded-lg"
        >
          Login
        </button>
      ) : (
        <div className="relative">
          {/* Avatar */}
          <button
            className="flex items-center space-x-2 focus:outline-none"
            onClick={() => setDropdownVisible(!dropdownVisible)}
          >
            {user.is_google ? (
              <img
                src={user.avatar}
                alt={user.first_name + " " + user.last_name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <Icon
                name="user circle"
                size="big"
                className="w-10 h-10 text-gray-500"
              />
            )}
            <span>{user.first_name + " " + user.last_name}</span>
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
  );
};

export default LoginIcon;
