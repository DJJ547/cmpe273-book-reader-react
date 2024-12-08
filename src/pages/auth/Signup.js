// src/pages/auth/Signup.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // To decode the JWT token
import {
  Button,
  Form,
  Grid,
  Segment,
  Divider,
  Header,
  Message,
} from "semantic-ui-react";
import "./Signup.css";
import axios from "axios";

const Signup = () => {
  const [error, setError] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // // Function to handle Google registration success
  // const handleGoogleSignupSuccess = (response) => {
  //   const userObject = jwtDecode(response.credential);
  //   console.log("Signuped user:", userObject);
  //   // Implement your registration logic, e.g., store user information, redirect, etc.
  // };

  // // Function to handle Google registration failure
  // const handleGoogleSignupFailure = (error) => {
  //   console.log("Google registration failed:", error);
  // };

  // Function to handle regular registration
  const handleSignup = (e) => {
    // e.preventDefault();
    // Implement your registration logic, e.g., create account in your backend
    builtInSignup();
  };

  // ======================API request====================================
  const builtInSignup = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_LOCALHOST}/auth/signup/`, {
        email: email,
        password: password,
        first_name: firstName,
        last_name: lastName,
      });
    } catch (error) {
      setError("There was a problem adding your new shelf.");
    }
  };

  return (
    <div className="signup-container">
      {error && (
        <Message
          negative
          onDismiss={() => setError("")}
          style={{
            position: "absolute",
            top: "0",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: "1000", // Optional: ensures it appears on top of other elements
            width: "80%", // Adjust as needed for your layout
            maxWidth: "600px", // Optional: constrain the width
          }}
        >
          <Message.Header>Error</Message.Header>
          <p>{error}</p>
        </Message>
      )}
      <div className="overlay"></div> {/* Transparent overlay */}
      <Grid centered>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header
            as="h1"
            textAlign="center"
            className="signup-header"
            style={{ marginBottom: "30px" }}
          >
            Create Your Account
          </Header>
          <Segment>
            <Form size="large" onSubmit={handleSignup}>
              <Form.Field>
                <label>First Name*</label>
                <input
                  type="text"
                  placeholder="Enter your first name"
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </Form.Field>
              <Form.Field>
                <label>Last Name*</label>
                <input
                  type="text"
                  placeholder="Enter your last name"
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </Form.Field>
              <Form.Field>
                <label>Email*</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Field>
              <Form.Field>
                <label>Password*</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Field>
              <Button
                fluid
                primary
                className="signup-button"
                style={{ marginBottom: "10px" }}
              >
                Create Your Account
              </Button>
            </Form>

            <Divider horizontal className="divider">
              /
            </Divider>

            <div
              style={{
                fontSize: "15px",
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              <span>Already have an account?</span>
              <Link
                to="/auth/login"
                style={{ color: "#007bff", textDecoration: "none" }}
              >
                {" "}
                Login
              </Link>
            </div>
          </Segment>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default Signup;
