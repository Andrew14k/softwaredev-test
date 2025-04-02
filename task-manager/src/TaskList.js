import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks from the backend when the component mounts
  useEffect(() => {
    axios.get('http://127.0.0.1:5000/tasks')  // Adjust if your backend is running on a different port or address
      .then((response) => {
        setTasks(response.data);  // Set tasks data from response
        setLoading(false);  // Turn off loading once data is fetched
      })
      .catch((err) => {
        setError('Error fetching tasks');  // Set error message if there's a problem
        setLoading(false);  // Turn off loading even if there's an error
        console.error(err);
      });
  }, []);  // Empty dependency array means this effect runs once when the component mounts

  return (
    <div>
      <h2>Task List</h2>
      
      {loading && <p>Loading tasks...</p>}  {/* Show loading message while fetching data */}
      {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Show error message if there's an error */}
      
      {tasks.length === 0 && !loading && !error ? (
        <p>No tasks available.</p>  // Display message if no tasks are found
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} style={{ marginBottom: '10px' }}>
              <h3>{task.title}</h3>
              <p>{task.description ? task.description : 'No description available'}</p>
              <p><strong>Status:</strong> {task.status || 'No status available'}</p>
              <p><strong>Due Date:</strong> {task.due_date || 'No due date set'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
