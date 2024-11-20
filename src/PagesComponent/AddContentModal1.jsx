import React, { useState } from 'react';
import axios from 'axios';

function AddContentModal1({ closeModal, pageId }) {
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        contact: '',
        address: '',
        longitude: '',
        latitude: '',
        order: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token'); 
            const response = await axios.post(
                `http://192.168.12.113:3000/api/pages/${pageId}/add-detail`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert(response.data.message); 
            closeModal();
        } catch (error) {
            console.error('Error adding detail:', error.response?.data || error.message);
            alert('Error adding detail. Please try again.');
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>New Impression</h3>
                <form onSubmit={handleSubmit}>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter Name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <label>Mobile:</label>
                    <input
                        type="text"
                        name="mobile"
                        placeholder="Enter Mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                    />
                    <label>Contact Info:</label>
                    <input
                        type="text"
                        name="contact"
                        placeholder="Enter Contact Info"
                        value={formData.contact}
                        onChange={handleChange}
                    />
                    <label>Address:</label>
                    <input
                        type="text"
                        name="address"
                        placeholder="Enter Address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                    <label>Longitude:</label>
                    <input
                        type="text"
                        name="longitude"
                        placeholder="Enter Longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                    />
                    <label>Latitude:</label>
                    <input
                        type="text"
                        name="latitude"
                        placeholder="Enter Latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                    />
                    <label>Order:</label>
                    <input
                        type="text"
                        name="order"
                        placeholder="Enter Order"
                        value={formData.order}
                        onChange={handleChange}
                    />
                    <button type="submit">Add Content</button>
                </form>
                <button onClick={closeModal}>Close</button>
            </div>
        </div>
    );
}

export default AddContentModal1;