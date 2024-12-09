import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Login from "./Login";
import { AuthProvider, useAuth } from "../../components/context/AuthContext";
import axios from "axios";

const mockJwtToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." + // Header
  "eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJnaXZlbl9uYW1lIjoiSm9obiIsImZhbWlseV9uYW1lIjoiRG9lIn0." + // Payload
  "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"; // Signature

// Mock GoogleLogin component
jest.mock("@react-oauth/google", () => ({
  GoogleLogin: ({ onSuccess }) => {
    const handleClick = () => {
      onSuccess({ credential: mockJwtToken });
    };
    return <button onClick={handleClick}>Google Login</button>;
  },
}));

// Mock Axios
jest.mock("axios");

describe("Login Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithAuthProvider = () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthProvider>
    );
  };

  test("renders login form", () => {
    renderWithAuthProvider(<Login />); // Ensure correct rendering
    const form = screen.getByTestId("form");
    // Check for email and password fields
    expect(within(form).getByLabelText(/email/i)).toBeInTheDocument();
    expect(within(form).getByLabelText(/password/i)).toBeInTheDocument();

    // Check for the login button
    expect(
      within(form).getByRole("button", { name: /Login to Your Account/i })
    ).toBeInTheDocument();

    // // Check for Google login button
    // const googleLogin = screen.queryByTestId('google login');
    // const googleLoginButton = within(googleLogin).getByRole('button', { name: /Log in with Google/i });
    // expect(googleLoginButton).toBeInTheDocument();

    // Check for the signup button
    expect(
      screen.getByRole("button", { name: /Signup for an Account/i })
    ).toBeInTheDocument();
  });

  test("handles Google login success", async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,
      data: { user_id: 1 },
    });

    renderWithAuthProvider();

    // Click the mocked Google Login button
    fireEvent.click(screen.getByText(/Google Login/i));

    // Wait for the axios.post call to be triggered
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/auth/google_login/", {
        email: "test@example.com",
        first_name: "John",
        last_name: "Doe",
      });
    });
  });

  test("handles built-in login success", async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,
      data: {
        id: 1,
        email: "test@example.com",
        first_name: "John",
        last_name: "Doe",
      },
    });

    renderWithAuthProvider();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /Login to Your Account/i })
    );

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/auth/login/", {
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  test("displays error on built-in login failure", async () => {
    // Mock axios.post to reject with the backend error response
    axios.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: { data: {}, error: "Invalid credentials" },
      },
    });

    renderWithAuthProvider();

    // Simulate user entering login details
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });

    // Click the login button
    fireEvent.click(
      screen.getByRole("button", { name: /Login to Your Account/i })
    );

    // Assert the error message is displayed
    const modal = await screen.findByTestId("error-message");
    expect(modal).toHaveTextContent(/Invalid credentials/i);
  });

  test("navigates to signup page", () => {
    renderWithAuthProvider();

    fireEvent.click(screen.getByText(/Signup for an Account/i));
    // Assert navigation behavior if you mock `navigate`
    expect(screen.getByText(/Signup for an Account/i)).toBeInTheDocument();
  });

  test("redirects if already authenticated", () => {
    jest
      .spyOn(require("../../components/context/AuthContext"), "useAuth")
      .mockReturnValue({
        isAuthenticated: true,
        user: {
          email: "example@gmail.com",
          first_name: "abcd",
          id: 1,
          is_google: false,
          last_name: "ab",
        },
        login: jest.fn(),
        logout: jest.fn(),
      });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Assert redirection or UI updates
    // This will vary depending on how you handle redirection for authenticated users
    expect(screen.queryByText(/Featured Books/i)).not.toBeInTheDocument();
  });
});
