import React, { useContext, useEffect } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import "./Requests.css";

const Requests = () => {
    const { findRequestByTaskId, requestUsers, url } = useContext(StoreContext);
    const { taskId } = useParams();

    console.log("Applicants Data:", requestUsers);

    useEffect(() => {
        if (taskId) {
            findRequestByTaskId(taskId);
        }
    }, [taskId]);

    const handleAccept = async (requestId) => {
        // console.log(requestId);
        let res = await axios.patch(`${url}/api/v1/apply/status/`, {
            applicationId: requestId,
            status: "accepted"
        })
        // console.log(res.data);
        window.location.reload()

    };

    const handleReject = async (requestId) => {
        let res = await axios.patch(`${url}/api/v1/apply/status/`, {
            applicationId: requestId,
            status: "rejected"
        })
        // console.log(res.data);
        window.location.reload()
    };

    return (
        <div className="requests-container">
            <h2>Applicants for Task</h2>

            {Array.isArray(requestUsers) && requestUsers.length > 0 ? (
                <ul className="applicant-list">
                    {requestUsers
                        .filter(user => user.status === "pending") 
                        .map((user) => (
                            <li key={user._id} className="applicant-card">
                                <h3>{user.userId?.username || "Unknown Name"}</h3>
                                <p><strong>Email:</strong> {user.userId?.email || "No Email"}</p>
                                <p><strong>Skills:</strong> {user.userId?.skills?.join(", ") || "Not Provided"}</p>
                                <p><strong>Experience:</strong> {user.userId?.experience || "No Experience Info"} years</p>

                                <div className="action-buttons">
                                    <button className="accept-btn" onClick={() => handleAccept(user._id)}>Accept</button>
                                    <button className="reject-btn" onClick={() => handleReject(user._id)}>Reject</button>
                                </div>
                            </li>
                        ))}
                </ul>
            ) : (
                <p>No users have applied for this task yet.</p>
            )}
        </div>
    );
};

export default Requests;
