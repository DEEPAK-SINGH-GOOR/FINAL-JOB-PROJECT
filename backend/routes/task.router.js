const {Router} = require("express")
const { getAllTasks, addTask, getTaskById, getTasksByClientId } = require("../controllers/task.controller");
const verifyToken = require("../middlewares/token");

const taskRouter = Router()

taskRouter.get("/",getAllTasks);
taskRouter.get("/:id",getTaskById);
taskRouter.get("/client/:clientId",getTasksByClientId);

taskRouter.post("/create",verifyToken,addTask);

module.exports = taskRouter