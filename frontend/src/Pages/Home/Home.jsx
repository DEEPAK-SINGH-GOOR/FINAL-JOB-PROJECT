import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import "./Home.css";
import axios from 'axios';
import TaskCard from '../Task/TaskCard';
import { Link } from 'react-router-dom';

const Home = () => {
  let { url, addToApplied, fetchAppliedTasks, userAppliedTasks, token } = useContext(StoreContext);

  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const myTasks = userAppliedTasks.filter(task => task.status === "accepted");
  const pendingTasks = userAppliedTasks.filter(task => task.status === "pending");

  useEffect(() => {
    if (token) {
      fetchTasks();
      fetchAppliedTasks();
    }
  }, [token]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      let res = await axios.get(`${url}/api/v1/tasks`);
      setTasks(res.data.tasks);
      setFilteredTasks(res.data.tasks); // Initially set filtered tasks same as tasks
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchAppliedTasks();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    // Filter tasks based on search input (checking task title or description)
    const filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(value) ||
      task.description.toLowerCase().includes(value)
    );

    setFilteredTasks(filtered);
  };

  return (
    <div className='main-home-container'>
      <div className="little-nav">
        <div className="search-home">
          <div className="main-search">
            <div className='search-main'><i className="fa-solid fa-magnifying-glass"></i></div>
            <input
              name='search'
              value={search}
              onChange={handleSearchChange}
              id='search'
              type="text"
              placeholder="Search"
            />
          </div>
        </div>

        <div className="other-nav-list-home">
          <div className="icon-container">
            {pendingTasks.length > 0 && <span className="notification-dot">{pendingTasks.length}</span>}
            <Link to="/applied"><i className="fa-solid fa-bell"></i></Link>
          </div>
          <div className="icon-container">
            {myTasks.length > 0 && <span className="notification-dot">{myTasks.length}</span>}
            <Link to="/my-tasks"><i className="fa-solid fa-folder-open"></i></Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loader-main-home"><div className="loader-home"></div></div>
      ) : (
        <div className="home-main">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard key={task._id} task={task} applyTask={addToApplied} />
            ))
          ) : (
            <p className="no-tasks-message">No tasks found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
