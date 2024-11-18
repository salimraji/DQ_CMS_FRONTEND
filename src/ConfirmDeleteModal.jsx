function ConfirmDeleteModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;
  
    return (
      <div className="modal">
        <div className="modal-content">
          <h3>Confirm Deletion</h3>
          <p>Are you sure you want to delete this label?</p>
          <div className="modal-actions">
            <button onClick={onConfirm}>Delete</button>
            <button onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  export default ConfirmDeleteModal;
  