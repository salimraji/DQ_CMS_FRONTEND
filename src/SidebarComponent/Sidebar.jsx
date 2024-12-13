import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import logo from "../assets/DQ_LOGO.png";


function Sidebar({ role }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="DQ LOGO" />
      </div>
      <ul className="sidebar-menu">
        <Link to="/pages">
          <li>Pages</li>
        </Link>
        <Link to="/news">
          <li>News</li>
        </Link>
        <Link to="/labels">
          <li>Labels</li>
        </Link>
        {(role === "admin" || role === "Admin") && (
          <Link to="/users">
            <li>Users</li>
          </Link>
        )}
        <li className="logout-button" onClick={handleLogout}>
          Logout
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
