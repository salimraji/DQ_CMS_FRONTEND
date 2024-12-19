import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import SideBar from "./screens/Sidebar/Sidebar";
import LabelList from "./screens/Label/LabelList";
import Login from "./screens/Login/Login";
import AddUser from "./screens/User/AddUser";
import EditUser from "./screens/User/EditUser";
import UserList from "./screens/User/UserList";
import PageList from "./screens/MobilePages/PageList";
import PageDetails from "./screens/MobilePages/PageDetails"
import NewsList from "./screens/News/NewsList";


import "./App.css";
import { jwtDecode } from "jwt-decode";

if (typeof global === 'undefined') {
  window.global = window;
}

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

const AppContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const savedRole = localStorage.getItem("role");

      if (token) {
        const isValid = validateToken(token);
        setIsAuthenticated(isValid);
        setRole(isValid ? savedRole : null);

        if (!isValid) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
        }
      } else {
        setIsAuthenticated(false);
        setRole(null);
      }

      setLoading(false);
    };

    checkAuth();

    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token && !validateToken(token)) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsAuthenticated(false);
        setRole(null);
      }
    }, 5000); 

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogin = (token, userRole) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", userRole);
    setIsAuthenticated(true);
    setRole(userRole);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setRole(null);
  };

  if (loading) {
    return <div className="loading-screen">Validating session...</div>;
  }

  return (
    <div className="app-container">
      {isAuthenticated && <SideBar role={role} onLogout={handleLogout} />}
      <div className={`content ${isAuthenticated ? "with-sidebar" : ""}`}>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/pages" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/labels"
            element={
              isAuthenticated ? <LabelList /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/users"
            element={
              isAuthenticated && role === "Admin" ? (
                <UserList />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/users/add"
            element={
              isAuthenticated && role === "Admin" ? (
                <AddUser />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/users/edit/:userId"
            element={
              isAuthenticated && role === "Admin" ? (
                <EditUser />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? "/pages" : "/login"} replace />
            }
          />

          <Route path="/pages" element={<PageList />} />
          <Route path="/pages/:id" element={<PageDetails />} />

          <Route
            path="/news"
            element = {
              isAuthenticated && role === "Admin" ? <NewsList /> : <Navigate to="/login" replace />
            }
          />

        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
