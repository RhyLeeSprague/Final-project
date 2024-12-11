import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PageStyles.css';

const TaskTracker = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    dueDate: "",
    category: "",
    task: "",
    description: "",
    priority: "",
  });
  const [recommendedTask, setRecommendedTask] = useState("");

  const recommendations = [
    "3 minutes mindful stretching",
    "5 minute meditation",
    "3 minute box breathing",
    "Make your bed",
    "Breathe some fresh air"
  ];

  // Generate a recommended task on component mount
  React.useEffect(() => {
    const randomTask = recommendations[Math.floor(Math.random() * recommendations.length)];
    setRecommendedTask(randomTask);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTask = () => {
    setTasks((prev) => [...prev, { ...newTask, completed: false }]);
    setNewTask({ dueDate: "", category: "", task: "", description: "", priority: "" });
  };

  const handleDeleteTask = (index) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditTask = (index) => {
    const taskToEdit = tasks[index];
    setNewTask(taskToEdit);
    handleDeleteTask(index);
  };

  const handleToggleComplete = (index) => {
    setTasks((prev) =>
      prev.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const clearCompletedTasks = () => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  };

  return (
    <div className="page-container">
      <h1>Log and Organize Daily Tasks</h1>
      <p><strong>Recommended Task for Today:</strong> {recommendedTask}</p>
      <div className="task-inputs">
        <input
          type="date"
          name="dueDate"
          value={newTask.dueDate}
          onChange={handleInputChange}
          placeholder="Due Date"
        />
        <input
          type="text"
          name="category"
          value={newTask.category}
          onChange={handleInputChange}
          placeholder="Category"
        />
        <input
          type="text"
          name="task"
          value={newTask.task}
          onChange={handleInputChange}
          placeholder="Task"
        />
        <input
          type="text"
          name="description"
          value={newTask.description}
          onChange={handleInputChange}
          placeholder="Description/Notes"
        />
        <select
          name="priority"
          value={newTask.priority}
          onChange={handleInputChange}
        >
          <option value="">Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button onClick={handleAddTask} className="add-task-btn">Add Task</button>
      </div>
      <table className="tracker-table">
        <thead>
          <tr>
            <th>Due Date</th>
            <th>Category</th>
            <th>Task</th>
            <th>Description</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index}>
              <td>{task.dueDate || "N/A"}</td>
              <td>{task.category || "N/A"}</td>
              <td>{task.task || "N/A"}</td>
              <td>{task.description || "N/A"}</td>
              <td>{task.priority || "N/A"}</td>
              <td>
                {task.completed ? "✔️" : "⌛"}
              </td>
              <td>
                <button onClick={() => handleToggleComplete(index)}>Mark Complete</button>
                <button onClick={() => handleEditTask(index)}>Edit</button>
                <button onClick={() => handleDeleteTask(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={clearCompletedTasks} className="add-task-btn">
        Clear Completed Tasks
      </button>
      <button
        className="back-to-journaling-btn" // Custom class for placement
        onClick={() => navigate('/journaling')}
      >
        Back to Home
      </button>
    </div>
  );
};

export default TaskTracker;