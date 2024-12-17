import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import logo from "../../assets/DQ_LOGO.png";
import LogoutButton from "../../components/LogoutButton/LogoutButton";


function Sidebar({ role }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <div>
        <div className="sidebar-logo">
          <img src={logo} alt="DQ LOGO" />
        </div>
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
        </div>

        <LogoutButton handleLogout={handleLogout}/>
      </ul>
    </div>
  );
}

export default Sidebar;
