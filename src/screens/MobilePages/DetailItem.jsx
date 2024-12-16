import React, { useState } from 'react';
import RichTextEditor from '../../components/RichTextEditor/RichTextEditor';
import apiService from '../../Shared/apiService';
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

    const handleSaveDetail = async () => {
        try {
            const body = {
                value: detail.Value,
                updates: formData,
            };

            await apiService.patch(`/api/pages/${pageId}/details`, body);
            alert('Detail updated successfully.');
        } catch (error) {
            console.error('Error updating detail:', error);
            alert('Failed to update detail.');
        }
    };

    const handleInputChange = (key, newValue) => {
        setFormData((prev) => ({
            ...prev,
            [key]: newValue,
        }));
    };

    const handleDeleteDetail = async (detailValue) => {
        try {
            await apiService.delete(`/api/pages/${pageId}/details`, {
                value: detailValue,
            });

            if (onDelete) {
                onDelete(detail.Value);
            }

            alert('Detail deleted successfully.');
        } catch (error) {
            console.error('Error deleting detail:', error);
            alert('Failed to delete detail.');
        }
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
                    {detail.Children.map((child, index) => (
                        <div key={index} className="child-item">
                            <label>{child.Key}</label>
                            {child.Key.toLowerCase() === 'description' ? (
                                <RichTextEditor
                                    content={formData[child.Key]}
                                    onContentChange={(newValue) => handleInputChange(child.Key, newValue)}
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
                    <div className="children-footer">
                        <button onClick={handleSaveDetail}>Save</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DetailItem;
