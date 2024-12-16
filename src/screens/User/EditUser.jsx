import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiService from "../../Shared/apiService"
import "./EditUser.css";

function EditUser() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiService.get(`/api/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        alert("Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await apiService.patch(`/api/users/${userId}`, { firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role });
      alert("User updated successfully.");
      navigate("/users");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  const handleChange = (field, value) => {
    setUser((prevUser) => ({ ...prevUser, [field]: value }));
  };

  if (loading) {
    return <div>Loading user details...</div>;
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <div className="edit-user-container">
      <form onSubmit={handleSave}>
        <label>
          First Name:
          <input
            type="text"
            value={user.firstName || ""}
            onChange={(e) => handleChange("firstName", e.target.value)}
            required
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            value={user.lastName || ""}
            onChange={(e) => handleChange("lastName", e.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={user.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
        </label>
        <label>
          Role:
          <select
            value={user.role || ""}
            onChange={(e) => handleChange("role", e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="Support">Support</option>
            <option value="Admin">Admin</option>
            <option value="Superadmin">Super Admin</option>
          </select>
        </label>
        <div className="edit-actions">
          <button type="submit">Save</button>
          <button type="button" onClick={() => navigate("/users")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditUser;
