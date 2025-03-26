import React, { useContext, useState } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { Bounce, toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";

const Signup = () => {
  const {url} = useContext(StoreContext)
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(false);
  const [data, setData] = useState({
    username: "",
    profilePic: null,
    mobileNo: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setData((prevData) => ({
      ...prevData,
      profilePic: e.target.files[0],
    }));
  };
  
  console.log(`${url}/api/v1/users/signup`);
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("profilePic", data.profilePic);
    formData.append("mobileNo", data.mobileNo);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("role", admin ? "admin" : "user");
  
    try {
      
      const res = await axios.post(`${url}/api/v1/users/signup`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      console.log("Signup Successful:", res.data);
      
      if (res.data.token) {
        Cookies.set("token", res.data.token, { expires: 7, secure: true });
        console.log("Token set in cookies:", res.data.token);
      }
  
      toast.success("Signup Successful! Redirecting...", {
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
  
      setTimeout(() => {
        if (admin) {
          navigate("/verify");
        } else {
          navigate("/");
        }
      }, 2000);
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      toast.error("User already exists or invalid data", {
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
    <div className="login-container">
      <div className="form-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h1>Signup</h1>

          <input
            onChange={handleInputChange}
            name="username"
            value={data.username}
            type="text"
            placeholder="Enter username"
            required
          />

          <input
            onChange={handleInputChange}
            name="email"
            value={data.email}
            type="email"
            placeholder="Email address"
            required
          />

          <input
            onChange={handleInputChange}
            name="password"
            value={data.password}
            type="password"
            placeholder="Enter Password"
            required
          />

          <input
            onChange={handleInputChange}
            name="mobileNo"
            value={data.mobileNo}
            type="number"
            placeholder="Enter Mobile Number"
            required
          />

          <div className="profile-pic-signup">
            <label htmlFor="pp">Profile Pic:</label>
            <input
              onChange={handleFileChange}
              name="profilePic"
              type="file"
              id="pp"
              accept="image/*"
            />
          </div>

          <div className="admin-checkbox">
            <label>Signup as Admin</label>
            <input
              className="checkbox"
              type="checkbox"
              checked={admin}
              onChange={() => setAdmin(!admin)}
            />
          </div>

          <p>
            Already have an account?{" "}
            <span>
              <Link to="/login">Login here</Link>
            </span>
          </p>

          <button type="submit" className="button">Signup</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
