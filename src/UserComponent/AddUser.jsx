import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "support", 
    password: "", 
  });

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://192.168.12.113:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json(); 
        alert(`Error saving user: ${errorData.message || "Unknown error occurred"}`);
        return;
      }

      alert("User added successfully.");
      navigate("/users");
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Error saving the user. Please try again.");
    }
  };

  return (
    <div className="add-user-container">
      <form onSubmit={handleSave}>
        <label>
          First Name:
          <input
            type="text"
            value={user.firstName}
            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            required
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            value={user.lastName}
            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            required
          />
        </label>
        <label>
          Username:
          <input
            type="text"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
        </label>
        <label>
          Role:
          <select
            value={user.role}
            onChange={(e) => setUser({ ...user, role: e.target.value })}
          >
            <option value="support">Support</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
        </label>
        <label>
          Password:
          <input
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            required
          />
        </label>
        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate("/users")}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default AddUser;
