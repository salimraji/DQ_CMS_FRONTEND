import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ResetPassword from "./ResetPassword";
import apiService from "../../Shared/apiService";
import "./UserList.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faEdit } from '@fortawesome/free-solid-svg-icons';
import EditButton from '../../components/EditButton/EditButton';
import SearchBar from "../../components/SearchBar/SearchBar";
import ToggleStatusButton from "../../components/ToggleStatusButton/ToggleStatusButton";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiService.get("/api/users");
        const usersWithFullName = response.data.map((user) => ({
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

  const handleResetPassword = (userId) => {
    setSelectedUserId(userId);
    setShowResetPassword(true);
  };

  const handleSavePassword = async (password) => {
    try {
      await apiService.patch(`/api/users/${selectedUserId}`, { password });
      alert("Password reset successfully.");
      setShowResetPassword(false);
      setSelectedUserId(null);
    } catch (error) {
      console.error("Error resetting password:", error);
      alert(error.message || "An error occurred while resetting the password.");
    }
  };

  const handleEditUser = (userId) => {
    navigate(`/users/edit/${userId}`);
  };

  const handleAddUser = () => {
    navigate(`/users/add`);
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus;

      const response = await apiService.patch(`/api/users/${userId}/toggleStatus`);
      const updatedUser = response.data;

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, active: updatedUser.active } : user
        )
      );

      alert(`User ${newStatus ? "activated" : "deactivated"} successfully.`);
    } catch (error) {
      console.error(
        `Error ${newStatus ? "activating" : "deactivating"} user:`,
        error
      );
      alert(
        error.message ||
          `An error occurred while trying to ${
            newStatus ? "activate" : "deactivate"
          } the user.`
      );
    }
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
      <p className="page-title">Manage Users</p>
      <div className="header-controls">
        <button className="add-button" onClick={handleAddUser}>
          + Add User
        </button>
        <SearchBar
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          placeholder="Search users..."
        />
      </div>

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
            <tr key={user._id}>  
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.active ? "Active" : "Deactivated"}</td>
              <td>
                <button className="table-action-button" onClick={() => handleResetPassword(user._id)}>
                  <FontAwesomeIcon icon={faKey} />
                </button>
                <EditButton onClick={() => handleEditUser(user._id)} />
                <ToggleStatusButton isActive={user.active} onToggle={() => handleToggleUserStatus(user._id, user.active)}/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ResetPassword
        isVisible={showResetPassword}
        onClose={() => setShowResetPassword(false)}
        onSave={handleSavePassword}
      />
    </div>
  );
}

export default UserList;
