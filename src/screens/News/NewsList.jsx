

import React, { useEffect, useState } from "react";
import apiService from "../../Shared/apiService";
import "./NewsList.css";
import AddNewsModal from "./AddNewsModal";
import ConfirmDeleteModal from "../../ConfirmDeleteModal";
import EditNewsModal from "./EditNewsModal"; 
import Pagination from "../../components/Pagination/Pagination";
import EditButton from "../../components/EditButton/EditButton";
import DeleteButton from "../../components/DeleteButton/DeleteButton";
import SearchBar from "../../components/SearchBar/SearchBar";

function NewsList() {
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [news, setNews] = useState([]);
    const [totalNews, setTotalNews] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedNews, setSelectedNews] = useState(null);
    const [newNews, setNewNews] = useState({
        title: "",
        content: "",
    });
    const [deleteNewsId, setDeleteNewsId] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const newsPerPage = 10;

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchInput);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchInput]);

    useEffect(() => {
        fetchNews(currentPage, debouncedSearch);
    }, [currentPage, debouncedSearch]);

    const fetchNews = (page = 1, search = "") => {
        apiService.get('/api/news', {
            params: { page, limit: newsPerPage, search },
        })
        .then(response => {
            setNews(response.data.news);
            setTotalNews(response.data.total);
        })
        .catch(error => console.error("Error fetching news:", error));
    };

    const totalPages = Math.ceil(totalNews / newsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDeleteClick = (id) => {
        setDeleteNewsId(id);
        setDeleteModalOpen(true);
    };

    const handleEditSave = () => {
        if (selectedNews) {
            apiService.put(`/api/news/${selectedNews._id}`, selectedNews)
            .then(() => {
                setEditModalOpen(false);
                fetchNews(currentPage, debouncedSearch);
            })
            .catch(error => console.error("Error saving news:", error));
        }
    };

    const handleAddNews = () => {
        apiService.post(`/api/news`, newNews)
        .then(() => {
            setAddModalOpen(false);
            fetchNews(currentPage, debouncedSearch);
            resetNewNews();
        })
        .catch(error => console.error("Error adding news:", error));
    };

    const resetNewNews = () => {
        setNewNews({
            title: "",
            content: "",
        });
    };

    const closeModal = () => {
        setAddModalOpen(false); 
    };

    const resetSelectedNews = () => {
        setSelectedNews(null);
    };

    return (
        <div className="news-list">
            <p className="page-title">News Listing</p>
            <div className="header-controls">
                <button
                    className="add-button"
                    onClick={() => {
                        resetNewNews();
                        setAddModalOpen(true);
                    }}
                >
                    + Add News
                </button>
                <SearchBar
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search News..."
                />
            </div>

            <table className="news-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {news.map(newsItem => (
                    <tr key={newsItem._id}>
                        <td>{newsItem.title}</td>
                        <td className="action-column">
                            <EditButton onClick={() => {
                                setSelectedNews(newsItem);
                                setEditModalOpen(true);
                            }} />
                            <DeleteButton onClick={() => handleDeleteClick(newsItem._id)} />
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

            <AddNewsModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    resetNewNews();
                    setAddModalOpen(false);
                }}
                onSubmit={handleAddNews}
                newNews={newNews}
                onNewsChange={(e) =>
                    setNewNews({ ...newNews, [e.target.name]: e.target.value })
                }
                existingNews={news} 
            />

            <EditNewsModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    resetSelectedNews();
                    setEditModalOpen(false);
                }}
                onSave={handleEditSave}
                selectedNews={selectedNews}
                onNewsChange={(e) =>
                    setSelectedNews({ ...selectedNews, [e.target.name]: e.target.value })
                }
                existingNews={news}  
            />

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => {
                    apiService.delete(`/api/news/${deleteNewsId}`)
                    .then(() => {
                        setDeleteModalOpen(false);
                        fetchNews(currentPage, debouncedSearch);
                    })
                    .catch(error => console.error("Error deleting news:", error));
                }}
            />
        </div>
    );
}

export default NewsList;
