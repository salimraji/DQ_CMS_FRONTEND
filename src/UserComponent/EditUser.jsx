import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";


function EditUser() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://192.168.12.113:3000/api/users/${userId}`); 
        const data = await response.json();
        setUser(data); 
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [userId]);

  // Handle form submission for saving changes
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://192.168.12.113:3000/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      alert("User updated successfully.");
      navigate("/users"); // Navigate back to the user list
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Handle input changes dynamically
  const handleChange = (field, value) => {
    setUser((prevUser) => ({ ...prevUser, [field]: value }));
  };

  // Show loading state if user data is not yet loaded
  if (!user) {
    return <div>Loading user details...</div>;
  }

  return (
    <div className="edit-user-container">
      <form onSubmit={handleSave}>
        <label>
          First Name:
          <input
            type="text"
            value={user.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            required
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            value={user.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={user.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
        </label>
        <label>
          Role:
          <select
            value={user.role}
            onChange={(e) => handleChange("role", e.target.value)}
          >
            <option value="Support">Support</option>
            <option value="Admin">Admin</option>
          </select>
        </label>
        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate("/users")}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditUser;