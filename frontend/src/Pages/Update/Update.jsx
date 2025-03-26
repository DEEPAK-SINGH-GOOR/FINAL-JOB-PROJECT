import React, { useContext, useState } from "react";
import "./Update.css"
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const Update = () => {
    const {url,userData} = useContext(StoreContext) 
    console.log(userData);
    
  const [formData, setFormData] = useState({
    username: userData.username,
    role: "user",
    mobileNo: userData.mobileNo,
    email: userData.email,
    experience:"",
    skills: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(formData);
    let res = await axios.patch(`${url}/api/v1/users/update/${userData.id}`,formData)
    console.log(res.data);
    
  };

  return (
    <div className="update-container">
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit} className="update-form">
        <label>Username:</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} required />

        <label>Mobile No:</label>
        <input type="number" name="mobileNo" value={formData.mobileNo} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Experience (Years):</label>
        <input type="number" name="experience" value={formData.experience} onChange={handleChange} />

        <label>Skills:</label>
        <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="Enter skills separated by commas" />

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Update;
