import React, { useEffect, useState } from "react";
import axios from "axios";
import "./LabelList.css";
import AddLabelModal from "./AddLabelModal";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import EditLabelModal from "./EditLabelModal";

function LabelList() {
  const [labels, setLabels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLabels, setTotalLabels] = useState(0);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("English");
  const [isAddModal, setAddModalOpen] = useState(false);
  const [isDeleteModal, setDeleteModalOpen] = useState(false);
  const [newLabel, setNewLabel] = useState({
    key: "",
    English: "",
    Arabic: "",
    French: "",
    Spanish: "",
    German: "",
  });
  const [deleteLabelId, setDeleteLabelId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const labelsPerPage = 10;
  const apiUrl = "http://192.168.12.113:3000";

  const fetchLabels = (page = 1, search = "") => {
    axios
      .get(`${apiUrl}/api/labels`, {
        params: { page, limit: labelsPerPage, search },
      })
      .then((response) => {
        setLabels(response.data.labels);
        setTotalLabels(response.data.total);
      })
      .catch((error) => console.error("Error fetching labels:", error));
  };

  useEffect(() => {
    fetchLabels(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  const totalPages = Math.ceil(totalLabels / labelsPerPage);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (id) => {
    setDeleteLabelId(id);
    setDeleteModalOpen(true);
  };

  const handleEditSave = () => {
    if (selectedLabel) {
      axios
        .put(`${apiUrl}/api/labels/${selectedLabel._id}`, selectedLabel)
        .then(() => {
          setModalOpen(false);
          fetchLabels(currentPage, debouncedSearch);
        })
        .catch((error) => console.error("Error saving label:", error));
    }
  };

  const handleAddLabel = () => {
    axios
      .post(`${apiUrl}/api/labels`, newLabel)
      .then(() => {
        setAddModalOpen(false);
        fetchLabels(currentPage, debouncedSearch);
        resetNewLabel(); 
      })
      .catch((error) => console.error("Error adding label:", error));
  };

  const resetNewLabel = () => {
    setNewLabel({
      key: "",
      English: "",
      Arabic: "",
      French: "",
      Spanish: "",
      German: "",
    });
  };

  const resetSelectedLabel = () => {
    setSelectedLabel(null);
  };

  return (
    <div className="label-list">
      <h2>Label Listing</h2>
      <div className="header-controls">
        <button
          className="add-label-button"
          onClick={() => {
            resetNewLabel();
            setAddModalOpen(true);
          }}
        >
          Add Label
        </button>
        <input
          type="text"
          placeholder="Search labels..."
          value={searchInput}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <table className="label-table">
        <thead>
          <tr>
            <th>Key Word</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {labels.map((label) => (
            <tr key={label._id}>
              <td>{label.Tag}</td>
              <td className="action-column">
                <button
                  onClick={() => {
                    setSelectedLabel(label);
                    setModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button onClick={() => handleDeleteClick(label._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(1)}
          className={currentPage === 1 ? "active" : ""}
        >
          1
        </button>
        {currentPage > 4 && <span className="dots">...</span>}
        {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
          .filter((page) => page > 1 && page < totalPages)
          .map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={currentPage === page ? "active" : ""}
            >
              {page}
            </button>
          ))}
        {currentPage < totalPages - 3 && <span className="dots">...</span>}
        {totalPages > 1 && (
          <button
            onClick={() => handlePageChange(totalPages)}
            className={currentPage === totalPages ? "active" : ""}
          >
            {totalPages}
          </button>
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      <AddLabelModal
        isOpen={isAddModal}
        onClose={() => {
          resetNewLabel();
          setAddModalOpen(false);
        }}
        onSubmit={handleAddLabel}
        newLabel={newLabel}
        onLabelChange={(e) =>
          setNewLabel({ ...newLabel, [e.target.name]: e.target.value })
        }
      />

      <EditLabelModal
        isOpen={isModalOpen}
        onClose={() => {
          resetSelectedLabel();
          setModalOpen(false);
        }}
        onSave={handleEditSave}
        selectedLabel={selectedLabel}
        onLabelChange={(e) =>
          setSelectedLabel({ ...selectedLabel, [e.target.name]: e.target.value })
        }
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModal}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          axios
            .delete(`${apiUrl}/api/labels/${deleteLabelId}`)
            .then(() => {
              setDeleteModalOpen(false);
              fetchLabels(currentPage, debouncedSearch);
            })
            .catch((error) => console.error("Error deleting label:", error));
        }}
      />
    </div>
  );
}

export default LabelList;
