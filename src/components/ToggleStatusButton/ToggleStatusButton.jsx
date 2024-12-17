import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import './ToggleStatusButton.css';

const ToggleStatusButton = ({ isActive: initialActive, onToggle }) => {
    const [isActive, setIsActive] = useState(initialActive);

    const handleClick = () => {
        setIsActive(current => !current);
        onToggle(isActive);
    };

    return (
        <button onClick={handleClick} className="status-toogle-button table-action-button">
            <FontAwesomeIcon icon={faPowerOff} color={isActive ? 'red' : 'green'} />
        </button>
    );
};

export default ToggleStatusButton;
