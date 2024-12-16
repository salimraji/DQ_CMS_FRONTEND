import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";


const EditButton = ({ onClick, className, disabled }) => {
  return (
    <button
      className= 'table-action-button'
      onClick={onClick}
      disabled={disabled}
      aria-label="Edit"
    >
      <FontAwesomeIcon icon={faEdit} />
    </button>
  );
};

EditButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

EditButton.defaultProps = {
  className: "",
  disabled: false,
};

export default EditButton;
