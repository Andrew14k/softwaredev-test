import React, { useState } from 'react';
import axios from 'axios';

const TaskForm = ({ setTasks }) => {
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    status: '',
    due_date: ''
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTaskData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://127.0.0.1:5000/tasks', newTaskData)
      .then((response) => {
        setTasks((prevTasks) => [...prevTasks, response.data]);
        setNewTaskData({ title: '', description: '', status: '', due_date: '' }); // Clear form
      })
      .catch((err) => {
        setError('Error creating task');
        console.error(err);
      });
  };

  return (
    <div>
      <h2>Create New Task</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={newTaskData.title}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        <label>
          Description:
          <input
            type="text"
            name="description"
            value={newTaskData.description}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Status:
          <input
            type="text"
            name="status"
            value={newTaskData.status}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        <label>
          Due Date:
          <input
            type="datetime-local"
            name="due_date"
            value={newTaskData.due_date}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <button type="submit">Create Task</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default TaskForm;
