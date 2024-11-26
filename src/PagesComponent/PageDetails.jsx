import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
        const token = localStorage.getItem('token');
        axios
            .get(`http://192.168.12.113:3000/api/pages/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setPage(response.data);
                setLoading(false);
            })
            .catch((error) => console.error('Error fetching data:', error));
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
            <h2>Page Details</h2>
                <div className='page-actions'>
                    <button className="back-to-pages" onClick={() => navigate('/pages')}>
                        Back
                    </button>
                    {page.Tag !== 'ABOUTUS' && page.Tag !== 'PRIVACYPOLICY' && (
                        <button onClick={() => openModal(page.Tag)}>+ Add Content</button>
                    )}
                </div>

            <div className="page-details">
                {page.Details.map((detail, index) => (
                    <DetailItem key={index} detail={detail} pageId={page._id} />
                ))}
            </div>

            {modalType === 'AddContentModal1' && <AddContentModal1 closeModal={closeModal} pageId={id} />}
            {modalType === 'AddContentModal2' && <AddContentModal2 closeModal={closeModal} pageId={id} />}

        </div>
    );
}

export default PageDetails;
