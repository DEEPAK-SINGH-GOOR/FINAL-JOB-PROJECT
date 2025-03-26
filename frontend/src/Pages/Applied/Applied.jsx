import React, { useEffect, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./Applied.css"

const AppliedTasksPage = () => {
    const { fetchAppliedTasks, userAppliedTasks } = useContext(StoreContext);

    useEffect(() => {
        fetchAppliedTasks();
    }, []);

    const pendingTasks = userAppliedTasks.filter(task => task.status === "pending");

    return (
        <div>
            <h2>My Applied Tasks</h2>
            {pendingTasks.length > 0 ? (
                pendingTasks.map(task => (
                    <div key={task._id} className="task-card">
                        <h3>{task.taskId?.title}</h3>
                        <p>{task.taskId?.description}</p>
                        <p><b>Status:</b> {task.status}</p>
                    </div>
                ))
            ) : (
                <p>You haven't applied for any pending tasks.</p>
            )}
        </div>
    );
};


export default AppliedTasksPage;
