import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import './ToggleStatusButton.css';

const ToggleStatusButton = ({ isActive: initialActive, onToggle }) => {
    const [isActive, setIsActive] = useState(initialActive);

    const handleClick = () => {
        setIsActive(current => {
            const newActive = !current;
            onToggle(newActive); 
            return newActive;
        });
    };
    
    

    return (
        <button onClick={handleClick} className="status-toogle-button table-action-button" style={{ color: isActive ? 'red' : 'green' }}>
            <FontAwesomeIcon icon={faPowerOff} />
        </button>
    );
};

export default ToggleStatusButton;
