const {Router} = require("express");
const { createAddress } = require("../controllers/adress.controller");
const verifyToken = require("../middlewares/token");
const { applyForTask, getAllApplys, getUserAppliedTasks, updateStatus } = require("../controllers/applied.controller");

const appliedRoute = Router();


appliedRoute.post("/",verifyToken,applyForTask);
appliedRoute.get("/user",verifyToken,getUserAppliedTasks);

appliedRoute.patch("/status",updateStatus)

module.exports = appliedRoute;