import React, { useContext, useEffect, useState } from "react";
import "./Assign.css"; // Import CSS file
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { Bounce, toast } from "react-toastify";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

const Assign = () => {
  const { url } = useContext(StoreContext);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    category: "",
    skillsRequired: [],
  });

  const [userHasAddress, setUserHasAddress] = useState(false);
  const token = Cookies.get("token");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      fetchUserData(decoded.id);
    }
  }, [token]);

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`${url}/api/v1/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.user.addresses && response.data.user.addresses.length > 0) {
        setUserHasAddress(true);
      } else {
        setUserHasAddress(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(",").map(skill => skill.trim());
    setFormData({ ...formData, skillsRequired: skillsArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = Cookies.get("token");

    try {
      let res = await axios.post(`${url}/api/v1/tasks/create`, formData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      toast.success(res.data.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      setFormData({
        title: "",
        description: "",
        budget: "",
        deadline: "",
        category: "",
        skillsRequired: [],
      });
    } catch (error) {
      console.error("Error Creating Task:", error.response ? error.response.data : error.message);

      toast.error(error.response?.data?.message || error.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  return (
    <div className="form-container">
      <h2>Job Submission Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>
        </div>

        <div className="form-group">
          <label>Budget</label>
          <input type="number" name="budget" value={formData.budget} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Deadline</label>
          <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Category</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Skills Required (comma-separated)</label>
          <input type="text" name="skillsRequired" onChange={handleSkillsChange} required />
        </div>

        <button type="submit" className="submit-btn" disabled={!userHasAddress}>
          Submit
        </button>
      </form>

      {!userHasAddress && (
        <div className="complete-profile">
          <p>You need to complete your profile before submitting a job.</p>
          <Link to="/complite" className="complete-profile-link">
            Complete Your Profile
          </Link>
        </div>
      )}

      <div className="skills-list">
        <h3>Skills Entered:</h3>
        <ul>
          {formData.skillsRequired.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Assign;
