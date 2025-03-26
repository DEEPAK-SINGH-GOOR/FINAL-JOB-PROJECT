import React, { useContext, useEffect } from "react";
import "./MyTasks.css";
import { StoreContext } from "../../context/StoreContext";

const MyTasks = () => {
    const { fetchAppliedTasks, userAppliedTasks, url } = useContext(StoreContext);

    useEffect(() => {
        fetchAppliedTasks();
    }, []);

    const myTasks = userAppliedTasks.filter(task => task.status === "accepted");

    return (
        <div className="my-tasks-container">
            <h2>My Accepted Tasks</h2>
            <div className="tasks-grid">
                {myTasks.length > 0 ? (
                    myTasks.map(task => (
                        <div key={task._id} className="task-card">
                            {task.taskId?.client?.image && (
                                <img
                                    src={`${url}/api/v1/images/${task.taskId.client.image.replace(/\\/g, "/").split("/").pop()}`}
                                    alt="Client Profile"
                                    className="task-image"
                                />
                            )}
                            <h3>{task.taskId?.title}</h3>
                            <p><b>Category:</b> {task.taskId?.category}</p>
                            <p><b>Description:</b> {task.taskId?.description}</p>
                            <p><b>Budget:</b> ₹{task.taskId?.budget}</p>
                            <p><b>Deadline:</b> {new Date(task.taskId?.deadline).toLocaleDateString()}</p>
                            <p><b>Client:</b> {task.taskId?.client?.username} ({task.taskId?.client?.email})</p>
                            <p><b>Required Skills:</b> {task.taskId?.skillsRequired?.join(", ")}</p>
                            <p><b>Status:</b> {task.status}</p>

                            <button className="submit-task-btn">Submit Task</button>
                        </div>
                    ))
                ) : (
                    <p>You have no accepted tasks.</p>
                )}
            </div>
        </div>
    );
};

export default MyTasks;
