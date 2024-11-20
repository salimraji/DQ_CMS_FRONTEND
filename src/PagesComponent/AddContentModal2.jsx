import React, { useState } from 'react';
import axios from 'axios';

function AddContentModal2({ closeModal, pageId }) {
    const [formData, setFormData] = useState({
        image: null,
        title: '',
        description: '',
        order: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token'); 
            const formDataToSend = new FormData();
            formDataToSend.append('image', formData.image);
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('order', formData.order);

            const response = await axios.post(
                `http://192.168.12.113:3000/api/pages/${pageId}/add-detail`,
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
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
                <h3>New Walk Through Page</h3>
                <form onSubmit={handleSubmit}>
                    <label>Page Image:</label>
                    <input type="file" name="image" onChange={handleFileChange} />
                    <label>Page Title:</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Enter Page Title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                    <label>Description:</label>
                    <textarea
                        name="description"
                        placeholder="Enter Description"
                        value={formData.description}
                        onChange={handleChange}
                    ></textarea>
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
