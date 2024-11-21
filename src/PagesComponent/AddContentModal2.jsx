import React, { useState } from 'react';
import axios from 'axios';

function AddContentModal2({ closeModal, pageId }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image:'',
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
                    <label>Image</label>
                    <input
                        type="file"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                    />
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter Name"
                        value={formData.name}
                        onChange={handleChange}
                    />

                    <label>Description</label>
                    <input
                        type="text"
                        name="description"
                        placeholder="Enter description"
                        value={formData.description}
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

export default AddContentModal2;
