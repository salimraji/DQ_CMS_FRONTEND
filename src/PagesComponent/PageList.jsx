import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function PageList() {
    const [pages, setPages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const pagesPerPage = 10;
    const apiUrl = "http://192.168.12.113:3000";

    const fetchPages = (page = 1, search = "") => {
        setLoading(true);;
        const token = localStorage.getItem("token")
        axios.get(`${apiUrl}/api/pages`, {
            params: { page, limit: pagesPerPage, search },
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then(response => {
            setPages(response.data.pages);
            setTotalPages(Math.ceil(response.data.total / pagesPerPage));
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
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
        return () => clearTimeout(handler);
    }, [searchInput]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="page-list">
            <h2>Page Listing</h2>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pages.map(page => (
                        <tr key={page.Guid}>
                            <td>{page.Tag} -- {page.Details.find(detail => detail.Key === "Title")?.Value || "Untitled"}</td>
                            <td>
                                <Link to={`/pages/${page._id}`}>
                                    <button>Edit</button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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
                    .filter(page => page > 1 && page < totalPages)
                    .map(page => (
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
        </div>
    );
}

export default PageList;
