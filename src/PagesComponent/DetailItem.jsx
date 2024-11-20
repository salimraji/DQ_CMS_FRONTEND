import React, { useState } from 'react';
import './DetailItem.css';

function DetailItem({ detail }) {
    const [showChildren, setShowChildren] = useState(false);

    return (
        <div className="detail-item">
            <div className="detail-header" onClick={() => setShowChildren(!showChildren)}>
                <p>{detail.Value}</p>
                <button className="delete-detail">Delete</button>
            </div>
            {showChildren && detail.Children && detail.Children.length > 0 && (
                <div className='children-container'>
                    <div className="children">
                        <div className='child-item'>
                            <label>{detail.Key}</label>
                            <input type="text" defaultValue={detail.Value} />
                        </div>
                        {detail.Children.filter(child => child.Key !== "ReferenceGuid").map((child, index) => (
                            <div key={index} className="child-item">
                                <label>{child.Key}</label>
                                <input type="text" defaultValue={child.Value} />
                            </div>
                        ))}
                    </div>
                    <div className='children-footer'>
                        <button>Save</button>
                    </div>
                    
                </div>


            )}
        </div>
    );
}

export default DetailItem;

