import React from "react";
import TaskItem from "./TaskItem";
import "./TaskList.css";

const TaskList = ({ tasks, onEdit, onDelete }) => {
  // Check if tasks exists and is an array
  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks found. Create your first task!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => {
        // Add a safety check for each task
        if (!task || !task._id) {
          return null; // Skip invalid tasks
        }
        return (
          <TaskItem
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
};

export default TaskList;
