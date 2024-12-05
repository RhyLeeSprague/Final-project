import React from 'react';
import './PageStyles.css';

const TaskTracker = () => {
  return (
    <div className="page-container">
      <h1>Log and Organize Daily Tasks</h1>
      <p>Track your tasks to stay organized and productive.</p>
      <ul className="task-list">
        <li>✔️ Finish journal entry</li>
        <li>✔️ Complete coding assignment</li>
        <li>⏳ Plan tomorrow's schedule</li>
      </ul>
      <button className="add-task-btn">Add a New Task</button>
    </div>
  );
};

export default TaskTracker;