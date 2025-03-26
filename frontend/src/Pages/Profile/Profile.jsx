import React, { useContext, useEffect, useState } from "react";
import "./Profile.css";
import Cookies from "js-cookie";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { StoreContext } from "../../context/StoreContext";
import { Link } from "react-router-dom";

const Profile = () => {
  const { url } = useContext(StoreContext);
  const token = Cookies.get("token");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      fetchUserData(decoded.id);
    }
  }, [token]);

  const fetchUserData = async (userId) => {
    console.log(userId);
    try {
      const response = await axios.get(`${url}/api/v1/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data.user);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Profile Details</h2>
        {userData?.profilePic && (
          <img
            src={`${url}/api/v1/images/${userData.profilePic.split("\\").pop()}`}
            alt="Profile"
            className="profile-pic"
          />
        )}
        <p><strong>Username:</strong> {userData?.username}</p>
        <p><strong>Email:</strong> {userData?.email}</p>
        <p><strong>Mobile No:</strong> {userData?.mobileNo}</p>
        <p><strong>Role:</strong> {userData?.role}</p>

        <h3>Addresses:</h3>
        {userData?.addresses?.length > 0 ? (
          <ul>
            {userData.addresses.map((address, index) => (
              <li key={index}>
                <strong>{address.companyName}</strong> - {address.street}, {address.city}, {address.state}, {address.country} - {address.zipCode}
              </li>
            ))}
          </ul>
        ) : (
          <p>No addresses found.</p>
        )}

        {userData?.role === 'admin' && (!userData.addresses || userData.addresses.length === 0) && (
          <Link to="/complite" className="complete-profile-link">
            <span>Complete Your Profile To Get Started <i className="fa-solid fa-arrow-right"></i></span>
          </Link>
        )}

        {userData?.role === 'user' && (
          <Link to="/update" className="update-profile-link">
            <button className="update-profile-button">Update</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Profile;
