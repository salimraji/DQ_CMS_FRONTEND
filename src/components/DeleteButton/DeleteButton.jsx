import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const DeleteButton = ({ onClick, className = "", disabled = false }) => {
  return (
    <button
      className={`table-action-button ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label="Delete"
    >
      <FontAwesomeIcon icon={faTrash} />
    </button>
  );
};

DeleteButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default DeleteButton;
