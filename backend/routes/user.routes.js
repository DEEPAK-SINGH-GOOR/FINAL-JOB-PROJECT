const { Router } = require("express");
const { signup, login, verifyAdminOTP, getAllUsers, deleteUser, getUserWithAddresses, getUserById, getApplicantsForTask, updateUser } = require("../controllers/user.controller");
const verifyToken = require("../middlewares/token");

const userRouter = Router();

userRouter.get("/",getAllUsers)
userRouter.get("/all",getUserWithAddresses)
userRouter.get("/:id",getUserById)
userRouter.get("/apply/task/:taskId",getApplicantsForTask)

userRouter.post("/signup",signup);
userRouter.post("/login",login)
userRouter.post("/verify",verifyAdminOTP)
userRouter.patch("/update/:id",updateUser)

userRouter.delete("/:id",deleteUser)

module.exports = userRouter; 