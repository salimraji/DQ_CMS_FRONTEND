import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {


  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src="../public/DQ_LOGO.png" alt="DQ LOGO" />
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
          <li className="logout-button" onClick={handleLogout}>
            Logout
          </li>


      </ul>
    </div>
  );
}

export default Sidebar;
