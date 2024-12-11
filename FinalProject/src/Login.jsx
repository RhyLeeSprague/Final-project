import axios from 'axios';
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./Login.css"; // Add custom styles for the login page
import { authAPI } from "./api/api"; // Import the API functions


const Login = ({ onAuthenticate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Handle login
  const handleLogin = async () => {
    try {
      const { token } = await authAPI.login({ email, password }); // Authenticate the user
      onAuthenticate(true); // Notify App that the user is authenticated
      navigate("/journaling"); // Redirect to journaling after successful login
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred. Please try again.');
    }
  };

    
      // Handle continue without account
  const handleContinueWithoutAccount = async () => {
    try {
      await fetch("http://localhost:3000/guest-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      onAuthenticate(true); // Activate guest mode
      navigate("/journaling"); // Redirect to journaling
    } catch (err) {
      setErrorMessage("Unable to proceed without an account. Please try again later.");
      console.error("Guest mode error:", err);
    }
  };

  return (
    <div className="login-container">
      <h1>Welcome</h1>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Log In</button>
        <button onClick={handleContinueWithoutAccount}>Continue Without Account</button>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default Login;