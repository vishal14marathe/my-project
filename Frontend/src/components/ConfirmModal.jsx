import React from "react";
import "./ConfirmModal.css";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title || "Confirm Delete"}</h3>
        <p>{message || "Are you sure you want to delete this task?"}</p>
        <div className="modal-actions">
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button onClick={onConfirm} className="confirm-btn">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
