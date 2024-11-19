import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DetailItem from './DetailItem';
import './PageDetails.css'
function PageDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://192.168.12.113:3000/api/pages/${id}`)
            .then(response => {
                setPage(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Error fetching data:", error));
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!page) return <p>Page not found.</p>;

    return (
        <div className="page-details-view">
            <h2>Page Details</h2>
            <button onClick={() => navigate("/pages")}>Back to Pages</button>
            <div className="page-details">
                {page.Details.map((detail, index) => (
                    <DetailItem key={index} detail={detail} />
                ))}
            </div>
        </div>
    );
}

export default PageDetails;
