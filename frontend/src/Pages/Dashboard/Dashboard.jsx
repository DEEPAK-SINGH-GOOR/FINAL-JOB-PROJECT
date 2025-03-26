import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Dashboard.css";

const Dashboard = () => {
  const { url, userData } = useContext(StoreContext);
  const [tasks, setTasks] = useState([]);
  const [requestCounts, setRequestCounts] = useState({});
  const navigate = useNavigate(); 

  const getAdminsTasks = async () => {
    try {
      const res = await axios.get(`${url}/api/v1/tasks/client/${userData.id}`);
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchRequestCounts = async () => {
    const counts = {};
    for (const task of tasks) {
      try {
        const response = await axios.get(`${url}/api/v1/users/apply/task/${task._id}`);
        counts[task._id] = response.data.applicants.length || 0;
      } catch (error) {
        console.error(`Error fetching request count for task ${task._id}:`, error);
        counts[task._id] = 0;
      }
    }
    setRequestCounts(counts);
  };

  const handleRequestClick = (taskId) => {
    navigate(`/requests/${taskId}`); 
  };

  useEffect(() => {
    getAdminsTasks();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      fetchRequestCounts();
    }
  }, [tasks]);

  return (
    <div className="dashboard-container">
      <h2>Your Assigned Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks assigned yet.</p>
      ) : (
        <div className="tasks-list">
          {tasks.map((task) => (
            <div key={task._id} className="task-card">
              <h3>{task.title}</h3>
              <p><strong>Category:</strong> {task.category}</p>
              <p><strong>Budget:</strong> ${task.budget}</p>
              <p><strong>Deadline:</strong> {new Date(task.deadline).toDateString()}</p>

              <div className="request-container">
                <button
                  className="request-btn"
                  onClick={() => handleRequestClick(task._id)}
                >
                  Requests
                  <span className="notification-dot">{requestCounts[task._id] || 0}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
