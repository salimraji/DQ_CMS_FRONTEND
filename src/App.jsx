import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SideBar from "./Sidebar";
import LabelList from "./LabelList";
import Login from "./Login";
import "./App.css";

import { jwtDecode }from "jwt-decode";

const validateToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; 
    return decoded.exp && decoded.exp > currentTime; 
  } catch (error) {
    console.error("Invalid token:", error);
    return false; 
  }
};



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");

      if (token) {
        const isValid = validateToken(token);
        setIsAuthenticated(isValid);

        if (!isValid) {
          localStorage.removeItem("token"); 
        }
      }

      setLoading(false); 
    };

    checkAuth();
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div className="loading-screen">Validating session...</div>;
  }

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && <SideBar onLogout={handleLogout} />}
        <div className={`content ${isAuthenticated ? "with-sidebar" : ""}`}>
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/labels" replace />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/labels"
              element={
                isAuthenticated ? (
                  <LabelList />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/news"
              element={
                isAuthenticated ? (
                  <div>News Page</div>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="*"
              element={<Navigate to={isAuthenticated ? "/labels" : "/login"} replace />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}



export default App;