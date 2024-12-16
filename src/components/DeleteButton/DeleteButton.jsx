import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";


const DeleteButton = ({ onClick, className, disabled }) => {
  return (
    <button
      className= 'table-action-button'
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

DeleteButton.defaultProps = {
  className: "",
  disabled: false,
};

export default DeleteButton;
