import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar/SearchBar";

function PageList() {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const pagesPerPage = 10;
  const apiUrl = "http://192.168.12.113:3000";

  const fetchPages = (page = 1, search = "") => {
    setLoading(true);
    const token = localStorage.getItem("token");
    axios
      .get(`${apiUrl}/api/pages`, {
        params: { page, limit: pagesPerPage, search },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPages(response.data.pages);
        setTotalPages(Math.ceil(response.data.total / pagesPerPage));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPages(currentPage, searchInput);
  }, [currentPage, searchInput]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="page-list">
      <h2>Page Listing</h2>

      {/* Search Bar */}
      <div className="header-controls">
        <SearchBar
          placeholder="Search pages..."
          onSearch={(value) => {
            setSearchInput(value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Page Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.Guid}>
                <td>
                  {page.Tag} -- {page.Details.find((detail) => detail.Key === "Title")?.Value || "Untitled"}
                </td>
                <td>
                  <Link to={`/pages/${page._id}`}>
                    <button>Edit</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? "active" : ""}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PageList;
