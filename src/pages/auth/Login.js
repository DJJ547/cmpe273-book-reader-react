// src/pages/auth/Login.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google"; // Google Login component
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
import "./Login.css";
import axios from "axios";
import { useAuth } from "../../components/context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Function to handle Google login success
  const handleGoogleLoginSuccess = (response) => {
    const userObject = jwtDecode(response.credential);
    console.log("Logged in user:", userObject);
    // Implement your login logic, e.g., store user information, redirect, etc.
    googleLogin(userObject);
  };

  // Function to handle Google login failure
  const handleGoogleLoginFailure = (error) => {
    console.log("Google login failed:", error);
    setError("Google login failed:", error);
    navigate("/auth/login");
  };

  // Function to handle regular login
  const handleBuiltInLogin = () => {
    // e.preventDefault();
    // Implement your login logic, e.g., authenticate against your backend
    builtInLogin();
  };

  //===================================== API requests ==========================================
  const builtInLogin = async () => {
    try {
      const response = await axios.post(`/auth/login/`, {
        email: email,
        password: password,
      });
      if (response.status === 200) {
        const userData = response.data.data;
        const user = {
          id: userData.id,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          is_google: false,
        };
        login(user);
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const googleLogin = async (obj) => {
    try {
      const response = await axios.post(`/auth/google_login/`, {
        email: obj.email,
        first_name: obj.given_name,
        last_name: obj.family_name,
      });
      if (response.status === 200) {
        const user = {
          id: response.data.user_id,
          email: obj.email,
          first_name: obj.given_name,
          last_name: obj.family_name,
          avatar: obj.picture,
          is_google: true,
        };
        login(user);
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  //=======================================UseEffect==========================================
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="login-container">
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
            className="login-header"
            style={{ marginBottom: "30px" }}
          >
            Login to Your Account
          </Header>
          <Segment>
            <Form size="large" onSubmit={handleBuiltInLogin}>
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
            {/* Google Login Button */}
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginFailure}
            >
              <Button primary>Log in with Google</Button>
            </GoogleLogin>

            <Divider horizontal className="divider">
              /
            </Divider>

            <Button
              fluid
              className="signup-button"
              style={{ marginBottom: "10px" }}
              onClick={() => navigate("/auth/signup")}
            >
              Signup for an Account
            </Button>
          </Segment>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default Login;
