import React, { useEffect, useState } from "react";
import apiService from "../../Shared/apiService";
import "./LabelList.css";
import AddLabelModal from "./AddLabelModal";
import ConfirmDeleteModal from "../../ConfirmDeleteModal";
import EditLabelModal from "./EditLabelModal";
import Pagination from "../../components/Pagination/Pagination";
import EditButton from "../../components/EditButton/EditButton";
import DeleteButton from "../../components/DeleteButton/DeleteButton";
import SearchBar from "../../components/SearchBar/SearchBar";

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

  const fetchLabels = (page = 1, search = "") => {
    apiService
      .get(`/api/labels`, {
        params: { page, limit: labelsPerPage, search },
      })
      .then((response) => {
        setLabels(response.data.labels);
        setTotalLabels(response.data.total);
      })
      .catch((error) => {
        console.error("Error fetching labels:", error);
      });
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
      apiService
        .put(`/api/labels/${selectedLabel._id}`, selectedLabel)
        .then(() => {
          setModalOpen(false);
          fetchLabels(currentPage, debouncedSearch);
        })
        .catch((error) => console.error("Error saving label:", error));
    }
  };

  const handleAddLabel = () => {
    apiService
      .post(`/api/labels`, newLabel)
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
      <p className="page-title">Label Listing</p>
      <div className="header-controls">
        <button
          className="add-button"
          onClick={() => {
            resetNewLabel();
            setAddModalOpen(true);
          }}
        >
          + Add Label
        </button>
        <SearchBar
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search labels..."
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
                  <EditButton                   onClick={() => {
                    setSelectedLabel(label);
                    setModalOpen(true);
                  }}/>
                <DeleteButton onClick={() => handleDeleteClick(label._id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

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
          apiService
            .delete(`/api/labels/${deleteLabelId}`)
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
