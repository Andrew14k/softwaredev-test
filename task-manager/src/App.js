import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state for creating a new task
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [dueDate, setDueDate] = useState('');

  // Fetch tasks from the backend when the component mounts
  useEffect(() => {
    axios.get('http://localhost:5000/tasks')
      .then((response) => {
        setTasks(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching tasks');
        setLoading(false);
        console.error(err);
      });
  }, []);

  // Handle form submission to create a new task
  const handleSubmit = (event) => {
    event.preventDefault();
    const newTask = {
      title,
      description,
      status,
      due_date: dueDate,
    };

    // Send POST request to backend to create a new task
    axios
      .post('http://localhost:5000/tasks', newTask)
      .then((response) => {
        // Add the new task to the task list without refreshing
        setTasks([...tasks, response.data]);
        setTitle('');
        setDescription('');
        setStatus('Pending');
        setDueDate('');
      })
      .catch((err) => {
        console.error('Error creating task:', err);
      });
  };

  return (
    <div>
      <h2>Task Manager</h2>

      {/* Task Submission Form */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div>
          <label>Due Date:</label>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <button type="submit">Create Task</button>
      </form>

      {/* Task List Section */}
      <h3>Task List</h3>

      {loading && <p>Loading tasks...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {tasks.length === 0 && !loading && !error ? (
        <p>No tasks available.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} style={{ marginBottom: '10px' }}>
              <h4>{task.title}</h4>
              <p>{task.description || 'No description available'}</p>
              <p><strong>Status:</strong> {task.status}</p>
              <p><strong>Due Date:</strong> {task.due_date}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
