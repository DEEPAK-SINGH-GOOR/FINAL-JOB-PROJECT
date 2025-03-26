import React, { useState, useEffect, useContext } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Bounce, toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";

const Login = () => {
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    console.log(token);

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log(decoded);

        setIsLoggedIn(true);
      } catch (error) {
        console.error("Invalid token:", error);
        Cookies.remove("token");
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${url}/api/v1/users/login`, data);
      console.log("Login successful:", res.data);

      if (res.data.token) {
        Cookies.set("token", res.data.token, { expires: 7 });
      }

      toast.success("Login Successful!", {
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

      navigate("/");
    } catch (error) {
      let errorMessage = "Something went wrong!";

      if (error.response) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage, {
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

  const handleLogout = () => {
    Cookies.remove("token");
    setRole(null);
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h1>{isLoggedIn ? "Welcome Back" : "Login"}</h1>

          {!isLoggedIn ? (
            <>
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

              <p>
                Don't have an account? <span><Link to="/signup">Signup here</Link></span>
              </p>

              <p>
                <span><Link to="/forgot-password">Forgot Password?</Link></span>
              </p>

              <button type="submit" className="button">Login</button>
            </>
          ) : (
            <button onClick={handleLogout} className="button">Logout</button>
          )}

          {message && <p className="message">{message}</p>}

          {isLoggedIn && role === "admin" && (
            <p>
              <Link to="/dashboard">Assign & Dashboard</Link>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
