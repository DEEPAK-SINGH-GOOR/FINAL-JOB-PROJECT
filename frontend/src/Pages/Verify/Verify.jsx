import React, { useState, useEffect } from "react";
import "./Verify.css";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Verify = () => {
  const [otp, setOtp] = useState("");
  const [decoded, setDecoded] = useState(null);
  let nav = useNavigate()

  useEffect(() => {
    try {
      const token = Cookies.get("token");
// console.log(token);

      if (token) {
        const decodedToken = jwtDecode(token);
        setDecoded(decodedToken);
      } else {
        console.log("No token found");
      }
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!decoded || !decoded.email) {
      console.error("Email not found in token.");
      return;
    }

    try {
      let res = await axios.post("http://localhost:8090/api/v1/users/verify", {
        email: decoded.email,
        otp: otp
      });

      console.log("Verification Successful:", res.data);
      nav('/')
    } catch (error) {
      console.error("Verification Failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="verify-container">
      <h2>Email Verification</h2>

      {decoded ? (
        <p>Logged in as: <strong>{decoded.email || "Unknown User"}</strong></p>
      ) : (
        <p style={{ color: "red" }}>Invalid or Expired Token</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>OTP</label>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="verify-btn">Verify</button>
      </form>
    </div>
  );
};

export default Verify;
