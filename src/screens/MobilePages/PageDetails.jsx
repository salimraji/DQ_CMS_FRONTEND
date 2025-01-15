import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from "../../Shared/apiService"
import DetailItem from './DetailItem';
import AddContentModal1 from './AddContentModal1';
import AddContentModal2 from './AddContentModal2';
import './PageDetails.css';

function PageDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalType, setModalType] = useState(null);

    useEffect(() => {
        const fetchPageDetails = async () => {
            try {
                const response = await apiService.get(`/api/pages/${id}`);
                setPage(response.data);
            } catch (error) {
                console.error('Error fetching page details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPageDetails();
    }, [id]);

    const template1 = ['WORKSHOPS', 'BRANCHES', 'EMERGENCYNUMBERS'];

    const openModal = (tag) => {
        if (template1.includes(tag)) {
            setModalType('AddContentModal1');
        } else {
            setModalType('AddContentModal2');
        }
    };

    const closeModal = () => {
        setModalType(null);
    };

    if (loading) return <p>Loading...</p>;
    if (!page) return <p>Page not found.</p>;

    return (
        <div className="page-details-view">
            <h2>{page.Details.find((detail) => detail.Key === "Title")?.Value || 
            page.Details.find((detail) => detail.Key === "ContentTitle")?.Value ||
            "Untitled"}</h2>
            <div className="page-actions">
                <button className="back-to-pages" onClick={() => navigate('/pages')}>
                    Back
                </button>
                {page.Tag !== 'ABOUTUS' && page.Tag !== 'PRIVACYPOLICY' && (
                    <button onClick={() => openModal(page.Tag)}>+ Add Content</button>
                )}
            </div>

            <div className="page-details">
                {page.Details.map((detail, index) => (
                    <DetailItem page = {page} key={index} detail={detail} pageId={page._id} />
                ))}
            </div>

            {modalType === 'AddContentModal1' && <AddContentModal1 closeModal={closeModal} pageId={id} />}
            {modalType === 'AddContentModal2' && <AddContentModal2 closeModal={closeModal} pageId={id} />}
        </div>
    );
}

export default PageDetails;
