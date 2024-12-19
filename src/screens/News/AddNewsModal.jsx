import React, { useState } from 'react';
import axios from 'axios';
import apiService from '../../Shared/apiService';

function AddNewsModal({ isOpen, onClose, onSubmit, newNews, onNewsChange, existingNews }) {
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Check for duplicate title
        const isDuplicate = existingNews.some(newsItem => newsItem.title.toLowerCase() === newNews.title.toLowerCase());
        if (isDuplicate) {
            setError("A news item with this title already exists.");
            return;
        }

        try {
            await apiService.post('/api/news', newNews);
            alert('News added successfully!');
            onClose(); // Ensure this function is correctly closing the modal
        } catch (error) {
            console.error('Error adding news:', error.response?.data || error.message);
            alert('Failed to add news.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>Add News</h3>
                {error && <div className="error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className='input-group'>
                        <label>Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={newNews.title}
                            onChange={onNewsChange}
                            required
                        />
                    </div>
                    <div className='input-group'>
                        <label>Link</label>
                        <input
                            name="link"
                            value={newNews.link}
                            onChange={onNewsChange}
                            rows="4"
                        />
                    </div>
                    <div className='input-group'>
                        <label>Image:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        onNewsChange({ target: { name: 'image', value: reader.result } });
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                    </div>
                    <div className='modal-actions'>
                        <button type="submit">Add News</button>
                        <button type="button" onClick={onClose}>Close</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddNewsModal;
