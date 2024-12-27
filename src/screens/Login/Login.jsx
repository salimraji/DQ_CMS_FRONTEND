import { useState } from "react";
import "./Login.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';



function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://192.168.12.113:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token && data.active) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role); 
        onLogin(data.token, data.role);
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <img className="dq-logo" src="src\assets\DQ_LOGO.png" alt="Logo" />
        <p className="cms-title">Content Management System</p>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
  <div className="form-group">
    <div className="login-input-container">
      <FontAwesomeIcon icon={faUser} className="faUser" />
      <input
          type="text"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
      />
    </div>

    <div className="login-input-container">
      <FontAwesomeIcon icon={faLock} className="faLock" />
      <input
          type="password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
      />
    </div>

    <button type="submit" className="signin-button">Sign In</button>
  </div>
</form>

      </div>
    </div>
  );
}

export default Login;
