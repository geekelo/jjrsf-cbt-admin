import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../Stylesheets/Login.css'
const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulated authentication (Replace this with API call)
    if (email === "admin@example.com" && password === "password123") {
      localStorage.setItem("authToken", "dummy-token");
      setIsLoggedIn(true);
      navigate("/"); // Redirect to the exams page
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="login-btn">Login</button>
      </form>
    </div>
  );
};

export default Login;
