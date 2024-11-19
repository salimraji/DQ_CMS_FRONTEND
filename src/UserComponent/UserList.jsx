import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserList.css";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://192.168.12.113:3000/api/users");
        const data = await response.json();
        const usersWithFullName = data.map((user) => ({
          ...user,
          fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        }));

        setUsers(usersWithFullName);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleResetPassword = async (userId) => {
    try {
      await fetch(`http://192.168.12.113:3000/api/users/${userId}/reset-password`, {
        method: "POST",
      });
      alert("Password reset successfully.");
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };


  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const action = newStatus ? "activate" : "deactivate";
  
      const response = await fetch(`http://192.168.12.113:3000/api/users/${userId}/toggleStatus`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to change user`);
      }
  
      const updatedUser = await response.json();
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, active: newStatus } : user
        )
      );
  
      alert(`User ${action}d successfully.`);
    } catch (error) {
      console.error(`Error ${newStatus ? "activating" : "deactivating"} user:`, error);
      alert(error.message || `An error occurred while trying to ${newStatus ? "activate" : "deactivate"} the user.`);
    }
  };
  
  

  const handleEditUser = (userId) => {
    navigate(`/users/edit/${userId}`);
  };

  const handleAddUser = () => {
    navigate(`/users/add`);
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="user-list-container">
      <button className="add-user-button" onClick={handleAddUser}>
        + Add User
      </button>
      <input
        type="text"
        className="search-bar"
        placeholder="Search records"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table className="user-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.active ? 'Active' : 'Deactivated'}</td>
              <td>
                <button onClick={() => handleResetPassword(user._id)}>Reset Password</button>
                <button onClick={() => handleEditUser(user._id)}>Edit</button>
                <button onClick={() => handleToggleUserStatus(user._id, user.active)}>
                  {user.active ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
