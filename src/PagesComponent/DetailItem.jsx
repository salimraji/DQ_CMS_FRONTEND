import React, { useState } from 'react';
import './DetailItem.css';

function DetailItem({ detail, pageId, onDelete }) {
    const [showChildren, setShowChildren] = useState(false);
    const [formData, setFormData] = useState(() =>
        detail.Children
            ? detail.Children.reduce((acc, child) => {
                acc[child.Key] = child.Value; 
                return acc;
            }, {})
            : {}
    );

    const handleDeleteDetail = async (detailValue) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://192.168.12.113:3000/api/pages/${pageId}/details`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ value: detailValue }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Detail deleted:', result);
                if (onDelete) onDelete(detail.Value);
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
                    value: detail.Value, 
                    updates: formData, 
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
        setFormData((prev) => ({
            ...prev,
            [key]: newValue, 
        }));
    };

    return (
        <div className="detail-item">
            <div className="detail-header" onClick={() => setShowChildren(!showChildren)}>
                <p>{detail.Value}</p>
                <button
                    className="delete-detail"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDetail(detail.Value);
                    }}
                >
                    Delete
                </button>
            </div>
            {showChildren && detail.Children && detail.Children.length > 0 && (
                <div className="children-container">
                    <div className="children">
                        <div className="child-item">
                            <label>{detail.Key}</label>
                            <input type="text" defaultValue={detail.Value} disabled />
                        </div>
                        {detail.Children.filter(child => child.Key !== 'ReferenceGuid').map((child, index) => (
                            <div key={index} className="child-item">
                                <label>{child.Key}</label>
                                <input
                                    type="text"
                                    value={formData[child.Key] || ''}
                                    onChange={(e) => handleInputChange(child.Key, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="children-footer">
                        <button onClick={handleSaveDetail}>Save</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DetailItem;
