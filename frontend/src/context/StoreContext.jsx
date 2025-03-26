import React, { createContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
export const StoreContext = createContext(null);
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Bounce, toast } from 'react-toastify';

const StoreContextProvider = ({ children }) => {
    const url = "https://freelancer-ulh2.onrender.com";
    // const url = "http://localhost:8090";
    const token = Cookies.get("token")
    const [appliedTasks, setAppliedTasks] = useState([]);
    const [userAppliedTasks, setUserAppliedTasks] = useState([]);
    const [userData,setUserData] = useState([]);
    const [countRequests,setCountRequests] = useState([]);
    const [requestUsers, setRequestUsers] = useState([]);
    
    const decodeUserData = async()=>{
        if (!token) return;
        const decoded = jwtDecode(token);
        setUserData(decoded);

    }

    const findRequestByTaskId = async (taskId) => {
        try {
            const res = await axios.get(`${url}/api/v1/users/apply/task/${taskId}`);
            if (res.data) {
                setCountRequests(res.data.applicants.length);
                setRequestUsers(res.data.applicants);
            }
        } catch (error) {
            console.error(`Error fetching applicants for task ${taskId}:`, error);
        }
    };

    useEffect(()=>{
        decodeUserData();
        // findRequestByTaskId({taskId:"67d4299d838369244f4bbc39"})
    },[token])

    const fetchAppliedTasks = async () => {
        if (!token) return;
    
        try {
            const response = await axios.get(`${url}/api/v1/apply/user`, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            if (response.data.success) {
                setUserAppliedTasks(response.data.appliedTasks);
            }
        } catch (error) {
            console.error("Error fetching applied tasks:", error);
        }
    };
    

    const addToApplied = async (taskId) => {
        if (!token) {
            toast.error("Please Login To Apply!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            return;
        }
    
        let decoded;
        try {
            decoded = jwtDecode(token);
        } catch (error) {
            toast.error("Invalid Token! Please login again.");
            return;
        }
    
        try {
            const response = await axios.post(`${url}/api/v1/apply/`, { taskId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            if (response.data.success) {
                setAppliedTasks([...appliedTasks, taskId]);
    
                toast.success("Successfully Applied for the Task!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong.");
        }
    };
    
    const contextValue = {
        url,
        token,
        addToApplied,
        appliedTasks,
        fetchAppliedTasks,
        userAppliedTasks,
        userData,
        findRequestByTaskId,
        countRequests,
        requestUsers,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
