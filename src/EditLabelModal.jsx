import React, { useState } from 'react';

function EditLabelModal({ isOpen, onClose, onSave, selectedLabel, onLabelChange, onDelete, activeTab, onTabChange }) {
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleSave = () => {
    const newErrors = {};
    if (!selectedLabel.Tag) newErrors.Tag = 'Key is required';
    if (!selectedLabel.English) newErrors.English = 'English value is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      onSave();
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Edit Label</h3>
        <div className="modal-body">
          <div className="tabs">
            {["English", "Arabic", "French", "Spanish", "German"].map((lang) => (
              <button key={lang} className={activeTab === lang ? "active" : ""} onClick={() => onTabChange(lang)}>
                {lang}
              </button>
            ))}
          </div>
          <div className="tab-content">
            <div>
              <label>Key</label>
              <input
                type="text"
                value={selectedLabel.Tag}
                readOnly
                className={`readonly-input ${errors.Tag ? 'input-error' : ''}`}
              />
              {errors.Tag && <span className="error-text">{errors.Tag}</span>}
            </div>
            <div>
              <label>Value in {activeTab}</label>
              <input
                type="text"
                name={activeTab}
                value={selectedLabel[activeTab] || ""}
                onChange={onLabelChange}
                className={activeTab === 'English' && errors.English ? 'input-error' : ''}
              />
              {activeTab === 'English' && errors.English && <span className="error-text">{errors.English}</span>}
            </div>
          </div>
        </div>
        <div className="modal-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default EditLabelModal;
