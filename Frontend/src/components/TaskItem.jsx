import React, { useState } from "react";
import "./TaskItem.css";

const TaskItem = ({ task, onEdit, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Add safety check at the beginning
  if (!task) {
    return null; // Don't render anything if task is undefined
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEdit = () => {
    if (onEdit) onEdit(task);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) onDelete(task._id);
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  // Use default values if properties are missing
  const status = task.status || "pending";
  const title = task.title || "Untitled Task";
  const description = task.description || "No description";
  const createdAt = task.createdAt || new Date().toISOString();

  return (
    <>
      <div className={`task-item status-${status}`}>
        <div className="task-header">
          <h3>{title}</h3>
          <div className="task-actions">
            <button onClick={handleEdit} className="edit-btn">
              Edit
            </button>
            <button onClick={handleDeleteClick} className="delete-btn">
              Delete
            </button>
          </div>
        </div>

        

        <p className="task-description">{description}</p>

        <div className="task-footer">
          <span className={`task-status status-${status}`}>{status}</span>
          <span className="task-date">Created: {formatDate(createdAt)}</span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Delete Task</h3>
            <p>Are you sure you want to delete "{title}"?</p>
            <p className="modal-warning">This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={handleCancelDelete} className="modal-cancel-btn">
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="modal-delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskItem;
