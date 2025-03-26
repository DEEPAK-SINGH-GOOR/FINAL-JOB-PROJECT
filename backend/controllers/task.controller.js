const Task = require("../models/task.model")

const addTask = async (req, res) => {
    try {
        const { title, description, budget, deadline, category, skillsRequired } = req.body;
        console.log(title, description, budget, deadline, category, skillsRequired);

        const newTask = await Task.create({
            title,
            description,
            budget,
            deadline,
            category,
            skillsRequired,
            client: {
                id: req.user.id,
                username: req.user.username,
                email: req.user.email,
                image: req.user.image
            }
        });

        res.status(201).send({ message: "Task created successfully", task: newTask, success: true });
    } catch (error) {
        res.status(400).send({ message: error.message, success: false });
    }
};


const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();

        res.send({ message: "Tasks retrieved successfully", tasks, success: true });
    } catch (error) {
        res.status(400).send({ message: error.message, success: false });
    }
};

const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).send({ message: "Task not found", success: false });
        }
        res.send({ message: "Task retrieved successfully", task:task, success: true });
    } catch (error) {
        res.status(400).send({ message: error.message, success: false });
    }
}

const getTasksByClientId = async (req, res) => {
    try {
        const { clientId } = req.params;
        const tasks = await Task.find({ "client.id": clientId });

        if (!tasks.length) {
            return res.status(404).send({ message: "No tasks found for this client", success: false });
        }

        res.send({ message: "Tasks retrieved successfully", tasks, success: true });
    } catch (error) {
        res.status(400).send({ message: error.message, success: false });
    }
};

module.exports = { addTask, getAllTasks, getTaskById, getTasksByClientId };


module.exports = { addTask, getAllTasks ,getTaskById,getTasksByClientId}