import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination/Pagination";
import apiService from "../../Shared/apiService";
import EditButton from "../../components/EditButton/EditButton";
import SearchBar from "../../components/SearchBar/SearchBar";

function PageList() {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const pagesPerPage = 10;

  const fetchPages = (page = 1, search = "") => {
    setLoading(true);
    apiService
      .get(`/api/pages`, {
        params: { page, limit: pagesPerPage, search },
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
    fetchPages(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="page-list">
      <p className="page-title">Page Listing</p>

      {/* Search Bar */}
      <div className="header-controls">
        <p></p>
        <SearchBar
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search Pages..."
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
                  {page.Tag} -- {" "}
                  {page.Details.find((detail) => detail.Key === "Title")?.Value ||
                    "Untitled"}
                </td>
                <td>
                  <Link to={`/pages/${page._id}`}>
                    <EditButton/>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Reusable Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default PageList;
