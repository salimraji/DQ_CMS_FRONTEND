import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DetailItem from './DetailItem';
import './PageDetails.css';

function PageDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalType, setModalType] = useState(null); // Added for modal functionality

    useEffect(() => {
        const token = localStorage.getItem('tokennp')
        axios
        .get(`http://192.168.12.113:3000/api/pages/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
        })
            .then(response => {
                setPage(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Error fetching data:", error));
    }, [id]);

    const template1 = ['WORKSHOPS', 'BRANCHES', 'EMERGENCYNIMBERS'];

    const openModal = (tag) => {
        if (template1.includes(tag)) {
            setModalType("Modal1"); 
        } else {
            setModalType("Modal2"); 
        }
    };
    
    const closeModal = () => {
        setModalType(null);
    };

    if (loading) return <p>Loading...</p>;
    if (!page) return <p>Page not found.</p>;

    return (
        <div className="page-details-view">
            <h2>Page Details</h2>
            <button className="back-to-pages" onClick={() => navigate("/pages")}>Back to Pages</button>
            {(page.Tag !== "ABOUTUS" && page.Tag !== "POLICYMENU") && (
                <button onClick={() => openModal(page.Tag)}>+ Add Content</button>

            )}
            <div className="page-details">
                {page.Details.map((detail, index) => (
                    <DetailItem key={index} detail={detail} />
                ))}
            </div>

            {/* Modal 1 */}
            {modalType === "Modal1" && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>New Impression</h3>
                        <form>
                            <label>Name:</label>
                            <input type="text" placeholder="Enter Name" />
                            <label>Mobile:</label>
                            <input type="text" placeholder="Enter Mobile" />
                            <label>Contact Info:</label>
                            <input type="text" placeholder="Enter Contact Info" />
                            <label>Address:</label>
                            <input type="text" placeholder="Enter Address" />
                            <label>Longitude:</label>
                            <input type="text" placeholder="Enter Longitude" />
                            <label>Latitude:</label>
                            <input type="text" placeholder="Enter Latitude" />
                            <label>Order:</label>
                            <input type="text" placeholder="Enter Order" />
                            <button type="submit">Add Content</button>
                        </form>
                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}

            {/* Modal 2 */}
            {modalType === "Modal2" && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>New Walk Through Page</h3>
                        <form>
                            <label>Page Image:</label>
                            <input type="file" />
                            <label>Page Title:</label>
                            <input type="text" placeholder="Enter Page Title" />
                            <label>Description:</label>
                            <textarea placeholder="Enter Description"></textarea>
                            <label>Order:</label>
                            <input type="text" placeholder="Enter Order" />
                            <button type="submit">Add Content</button>
                        </form>
                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PageDetails;
