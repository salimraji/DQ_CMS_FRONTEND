import React, { useState } from 'react';
import './LabelList.css';

function AddLabelModal({ isOpen, onClose, onSubmit, newLabel, onLabelChange }) {
  const [errors, setErrors] = useState({});

  const handleClose = () => {
    setErrors({});
    onClose(); 
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!newLabel.Tag) newErrors.Tag = 'Key is required';
    if (!newLabel.English) newErrors.English = 'English value is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      onSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="add-modal-content">
        <h3>Add New Label</h3>
        <div className="add-modal-body">
          <div>
            <label>Key</label>
            <input
              type="text"
              name="Tag"
              value={newLabel.Tag}
              onChange={onLabelChange}
              className={errors.Tag ? 'input-error' : ''}
            />
            {errors.Tag && <span className="error-text">{errors.Tag}</span>}
          </div>

          {['English', 'Arabic', 'French', 'Spanish', 'German'].map((lang) => (
            <div key={lang}>
              <label>{lang}</label>
              <input
                type="text"
                name={lang}
                value={newLabel[lang]}
                onChange={onLabelChange}
                className={errors[lang] ? 'input-error' : ''}
              />
              {lang === 'English' && errors.English && <span className="error-text">{errors.English}</span>}
            </div>
          ))}
        </div>
        <div className="modal-actions">
          <button onClick={handleSubmit}>Add</button>
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default AddLabelModal;
