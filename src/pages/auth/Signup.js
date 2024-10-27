// src/pages/auth/Signup.js
import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google"; // Google Signup component
import { jwtDecode } from "jwt-decode"; // To decode the JWT token
import {
  Button,
  Form,
  Grid,
  Segment,
  Divider,
  Header,
} from "semantic-ui-react";
import './Signup.css';

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Function to handle Google registration success
  const handleGoogleSignupSuccess = (response) => {
    const userObject = jwtDecode(response.credential);
    console.log("Signuped user:", userObject);
    // Implement your registration logic, e.g., store user information, redirect, etc.
  };

  // Function to handle Google registration failure
  const handleGoogleSignupFailure = (error) => {
    console.log("Google registration failed:", error);
  };

  // Function to handle regular registration
  const handleSignup = (e) => {
    e.preventDefault();
    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log("Email:", email);
    console.log("Password:", password);
    // Implement your registration logic, e.g., create account in your backend
  };

  return (
    <div className="signup-container">
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

            {/* Google Signup Button */}
            <GoogleLogin
              onSuccess={handleGoogleSignupSuccess}
              onError={handleGoogleSignupFailure}
            >
              <Button primary>Signup with Google</Button>
            </GoogleLogin>
          </Segment>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default Signup;
