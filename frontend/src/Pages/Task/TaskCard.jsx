import React, { useContext } from "react";
import "./TaskCard.css";
import { StoreContext } from "../../context/StoreContext";

const TaskCard = ({ task, applyTask }) => {
  let imagePath = "";
  const {url} = useContext(StoreContext)

  if (task.client.image) {
    const filename = task.client.image.split("\\").pop().split("/").pop();
    imagePath = `${url}/api/v1/images/${filename}`;
  }

  return (
    <div className="task-card">
      <div className="task-card-left">
        <img
          src={imagePath}
          alt={task.client.username}
          className="client-image"
        />
      </div>

      <div className="task-card-content">
        <h2 className="task-title">{task.title}</h2>
        <p className="task-category">{task.category}</p>
        <p className="task-desc">{task.description}</p>
        <div className="task-details">
          <span>👤 {task.client.username}</span>
          <span>💰 {task.budget} INR</span>
          <span>📅 {new Date(task.deadline).toLocaleDateString()}</span>
        </div>
        <div className="task-skills">
          {task.skillsRequired.map((skill, index) => (
            <span key={index} className="skill-badge">{skill}</span>
          ))}
        </div>
        
        <button className="apply-button" onClick={() => applyTask(task._id)}>
          Apply
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
