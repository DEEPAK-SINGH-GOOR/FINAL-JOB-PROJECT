import React, { useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const token = Cookies.get("token");
  const navigate = useNavigate();
  let decoded;
  let imagePath = "";

  if (token) {
    decoded = jwtDecode(token)
    if (decoded.image) {
      const filename = decoded.image.split("\\").pop().split("/").pop();
      imagePath = `http://localhost:8090/api/v1/images/${filename}`;
    }
  }

  const logout = () => {
    Cookies.remove("token");
    navigate("/");
    window.location.reload()
  };

  return (
    <div className="main-nav">
      <div className="nav-left">
        <img
          src="https://brandlogos.net/wp-content/uploads/2017/01/freelancer-logo.png"
          alt="Logo"
        />
      </div>
      <div className="nav-middle">
        <Link to="/">Home</Link>
        {token ? (decoded.role === "admin" ? <Link to="/assign">Assign</Link> : null) : null}
        {token ? <Link onClick={logout}>Logout</Link> : <Link to="/login">Login</Link>}
        {token ? `Hello👋 ${decoded?.username}` : <Link to="/signup">Signup</Link>}
      </div>
      <div className="nav-right">
        {token ? (decoded.role === "admin" ? <Link to="/dashboard" className="nav-dashboard">Dashboard</Link> : null) : null}
          {
            imagePath?
              <Link to="/profile" className="nav-profile">
                <img className="profile-image" src={imagePath} alt="Profile Pic" />
              </Link>
            :
              <Link to="/profile" className="nav-profile">
                <i className="fa-solid fa-circle-user"></i>
              </Link>
          }
          {/* <Link to="/profile" className="nav-profile">
            <i className="fa-solid fa-circle-user"></i>
          </Link> */}
      </div>
    </div>
  );
};

export default Navbar;
