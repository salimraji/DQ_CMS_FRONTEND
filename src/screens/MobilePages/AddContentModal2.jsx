import React, { useState } from 'react';
import axios from 'axios';

function AddContentModal2({ pageId, closeModal }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        PageImage: '',
        order: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, PageImage: reader.result });
            };
            reader.readAsDataURL(file);
        }
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
                        'Content-Type': 'application/json',
                    },
                }
            );
            alert('Detail added successfully!');
            closeModal();
        } catch (error) {
            console.error('Error adding detail:', error.response?.data || error.message);
            alert('Failed to add detail.');
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>Add Detail</h3>
                <form onSubmit={handleSubmit}>

                    <div className='input-group'>
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className='input-group'>
                        <label>Description:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="4"
                        />
                    </div>
                    <div className='input-group'>
                        <label>Order:</label>
                        <input
                            type="number"
                            name="order"
                            value={formData.order}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className='input-group'>
                        <label>Image:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className='modal-actions'>
                        <button type="submit">Add Detail</button>
                        <button onClick={closeModal}>Close</button>
                    </div>

                </form>
                
            </div>
        </div>
    );
}

export default AddContentModal2;
