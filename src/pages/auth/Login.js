// src/pages/auth/Login.js
import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google"; // Google Login component
import { jwtDecode } from "jwt-decode"; // To decode the JWT token
import {
  Button,
  Form,
  Grid,
  Segment,
  Divider,
  Header,
} from "semantic-ui-react";
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Function to handle Google login success
  const handleGoogleLoginSuccess = (response) => {
    const userObject = jwtDecode(response.credential);
    console.log("Logged in user:", userObject);
    // Implement your login logic, e.g., store user information, redirect, etc.
  };

  // Function to handle Google login failure
  const handleGoogleLoginFailure = (error) => {
    console.log("Google login failed:", error);
  };

  // Function to handle regular login
  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    // Implement your login logic, e.g., authenticate against your backend
  };

  console.log("debug Email:");
  
  return (
    <div className="login-container">
         <div className="overlay"></div> {/* Transparent overlay */}
      <Grid centered>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header
            as="h1"
            textAlign="center"
            className="login-header"
            style={{ marginBottom: "30px" }}
          >
            Login to Your Account
          </Header>
          <Segment>
            <Form size="large" onSubmit={handleLogin}>
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
                className="login-button"
                style={{ marginBottom: "10px" }}
              >
                Login to Your Account
              </Button>
            </Form>

            <Divider horizontal className="divider">
              /
            </Divider>

            {/* Google Login Button */}
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginFailure}
            >
              <Button primary>Log in with Google</Button>
            </GoogleLogin>
          </Segment>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default Login;
