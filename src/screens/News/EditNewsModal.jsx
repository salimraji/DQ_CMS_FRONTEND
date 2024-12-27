import React, { useState, useEffect } from 'react';
import apiService from '../../Shared/apiService';
import './EditNewsModal.css';



function EditNewsModal({ isOpen, onClose, onSave, selectedNews, onNewsChange, existingNews }) {
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        title: '',
        link: '',
        image: ''
    });

    useEffect(() => {
        if (selectedNews) {
            setFormData({
                title: selectedNews.title || '',
                link: selectedNews.link || '',
                image: selectedNews.image || ''
            });
        }
    }, [selectedNews]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onNewsChange(e); // Ensure the parent component's state is updated
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
                onNewsChange({ target: { name: 'image', value: reader.result } });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isDuplicate = existingNews.some(newsItem => 
            newsItem.title.toLowerCase() === formData.title.toLowerCase() && newsItem._id !== selectedNews._id
        );
        if (isDuplicate) {
            setError("A news item with this title already exists.");
            return;
        }

        try {
            await apiService.put(`/api/news/${selectedNews._id}`, formData);
            alert('News updated successfully!');
            onSave(); 
        } catch (error) {
            console.error('Error updating news:', error.response?.data || error.message);
            alert('Failed to update news.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content edit-news">
                <h3>Edit News</h3>
                {error && <div className="error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className='input-group'>
                        <label>Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className='input-group'>
                        <label>Link:</label>
                        <input
                            name="link"
                            value={formData.link}
                            onChange={handleInputChange}
                            rows="4"
                        />
                    </div>
                    <div className='input-group'>
                        <label>Image:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {formData.image && <img src={formData.image} alt="Preview" height="170px" width="170px" />}
                    </div>
                    <div className='modal-actions'>
                        <button type="submit">Update</button>
                        <button type="button" onClick={onClose}>Close</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditNewsModal;
