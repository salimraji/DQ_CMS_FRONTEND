import React, { useState } from 'react';
import './DetailItem.css';
import RichTextEditor from '../../components/RichTextEditor/RichTextEditor';
import DeleteButton from '../../components/DeleteButton/DeleteButton';
import ConfirmDeleteModal from '../../ConfirmDeleteModal'


const api_url = "http://192.168.12.113:3000"


function DetailItem({ detail, pageId, onDelete }) {
    const [showChildren, setShowChildren] = useState(false);
    const [originalValue] = useState(detail.Value);
    const [formData, setFormData] = useState(() => ({
        Value: detail.Value, 
        ...detail.Children.reduce((acc, child) => {
            acc[child.Key] = child.Value;
            return acc;
        }, {})
    }));
    const [isModalOpen, setModalOpen] = useState(false); 

    const handleDeleteDetail = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://192.168.12.113:3000/api/pages/${pageId}/details`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ value: originalValue }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Detail deleted:', result);
                if (onDelete) onDelete(detail.Value);
                setModalOpen(false);
            } else {
                console.error('Failed to delete detail');
            }
        } catch (error) {
            console.error('Error deleting detail:', error);
        }
    };

    const handleSaveDetail = async () => { 
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://192.168.12.113:3000/api/pages/${pageId}/details`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    value: originalValue,
                    updates: { ...formData, PageImage: formData['PageImage'] || detail.Children.find(c => c.Key === 'PageImage')?.Value },
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Detail updated:', result);
            } else {
                console.error('Failed to update detail');
            }
        } catch (error) {
            console.error('Error updating detail:', error);
        }
    };

    const handleInputChange = (key, newValue) => { 
        setFormData(prev => ({
            ...prev,
            [key]: newValue,
        }));
    };

    const handleImageChange = (e, key) => { 
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setFormData(prev => ({
                    ...prev,
                    [key]: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const openDeleteModal = () => setModalOpen(true); 
    const closeDeleteModal = () => setModalOpen(false); 

    return (
        <div className="detail-item">
            <div className="detail-header" onClick={() => setShowChildren(!showChildren)}>
                <p>{detail.Value}</p>
                <DeleteButton 
                    className='delete-button'
                    onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(); 
                    }}
                />
            </div>
            {showChildren && detail.Children && detail.Children.length > 0 && (
                <div className="children-container">
                    <div className="child-item">
                        <label>Main Value</label>
                        <input
                            type="text"
                            value={formData.Value}
                            onChange={(e) => handleInputChange('Value', e.target.value)}
                            className='main-value-input'
                        />
                    </div>
                    {detail.Children.some((child) => child.Key === 'PageImage') ? (
                        <div className="image-detail-container">
                            <div className="image-container">
                                {formData['PageImage'] ? (
                                    <img
                                    src={formData['PageImage'].startsWith('data:image') ? formData['PageImage'] : `${api_url}${formData['PageImage']}`}
                                        alt="Page"
                                        style={{ maxWidth: '200px', maxHeight: '200px', marginBottom: '10px' }}
                                    />
                                ) : (
                                    <p>No Image Selected</p>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, 'PageImage')}
                                />
                            </div>
                            <div className="details-container">
                                {detail.Children.filter((child) => child.Key !== 'PageImage' && child.Key !== 'ReferenceGuid').map((child, index) => (
                                    <div key={index} className="child-item">
                                        <label>{child.Key}</label>
                                        {['description', 'Description'].includes(child.Key) ? (
                                            <RichTextEditor
                                                content={formData[child.Key] || ''}
                                                onContentChange={(newContent) => handleInputChange(child.Key, newContent)}
                                            />
                                        ) : child.Value && child.Value.length > 30 ? (
                                            <textarea
                                                value={formData[child.Key] || ''}
                                                onChange={(e) => handleInputChange(child.Key, e.target.value)}
                                                rows={formData[child.Key]?.split('\n').length || 3}
                                                style={{ resize: 'vertical' }}
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                value={formData[child.Key] || ''}
                                                onChange={(e) => handleInputChange(child.Key, e.target.value)}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="children">
                            {detail.Children.filter((child) => child.Key !== 'ReferenceGuid').map((child, index) => (
                                <div key={index} className="child-item">
                                    <label>{child.Key}</label>
                                    {['description', 'Description'].includes(child.Key) ? (
                                        <RichTextEditor
                                            content={formData[child.Key] || ''}
                                            onContentChange={(newContent) => handleInputChange(child.Key, newContent)}
                                        />
                                    ) : child.Value && child.Value.length > 30 ? (
                                        <textarea
                                            value={formData[child.Key] || ''}
                                            onChange={(e) => handleInputChange(child.Key, e.target.value)}
                                            rows={formData[child.Key]?.split('\n').length || 3}
                                            style={{ resize: 'vertical' }}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            value={formData[child.Key] || ''}
                                            onChange={(e) => handleInputChange(child.Key, e.target.value)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="children-footer">
                        <button onClick={handleSaveDetail}>Save</button>
                    </div>
                </div>
            )}
            <ConfirmDeleteModal
                isOpen={isModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteDetail}
            />
        </div>
    );
}

export default DetailItem;
