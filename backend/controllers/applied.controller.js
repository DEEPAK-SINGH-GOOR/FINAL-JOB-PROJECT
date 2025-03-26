const Applied = require("../models/applied.model");
const Task = require("../models/task.model");

const applyForTask = async (req, res) => {
    try {
        const { taskId } = req.body;
        const userId = req.user.id;

        const existingApplication = await Applied.findOne({ userId, taskId });
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this task", success: false });
        }

        const application = await Applied.create({ userId, taskId });

        res.status(201).json({
            message: "Application submitted successfully. The owner can see it in the dashboard.",
            success: true,
            application
        });

    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// const assignUserToTask = async (req, res) => {
//     try {
//         const { applicationId } = req.body;

//         const application = await Applied.findById(applicationId).populate("userId taskId");

//         if (!application) {
//             return res.status(404).json({ message: "Application not found", success: false });
//         }

//         application.status = "accepted";
//         await application.save();

//         const notification = await Notification.create({
//             userId: application.userId._id,
//             message: `You have been assigned the task: ${application.taskId.title}`,
//             isRead: false,
//         });

//         io.to(application.userId._id.toString()).emit("taskAssigned", {
//             message: `You have been assigned the task: ${application.taskId.title}`,
//             taskId: application.taskId._id,
//         });

//         res.status(200).json({
//             message: "User assigned successfully and notified.",
//             success: true,
//             application
//         });

//     } catch (error) {
//         res.status(500).json({ message: error.message, success: false });
//     }
// };


const getUserAppliedTasks = async (req, res) => {
    try {
        const userId = req.user.id;


        const appliedTasks = await Applied.find({ userId }).populate("taskId");

        if (!appliedTasks.length) {
            return res.status(404).json({ message: "No applied tasks found", success: false });
        }

        res.status(200).json({ success: true, appliedTasks });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};
const updateStatus = async (req, res) => {
    try {
        const { applicationId, status } = req.body;

        if (status === "rejected") {
            const deletedApplication = await Applied.findByIdAndDelete(applicationId);
            if (!deletedApplication) {
                return res.status(404).json({ message: "Application not found", success: false });
            }
            return res.status(200).json({ success: true, message: "Application rejected and deleted successfully" });
        }

        const application = await Applied.findByIdAndUpdate(applicationId, { status }, { new: true });
        if (!application) {
            return res.status(404).json({ message: "Application not found", success: false });
        }

        res.status(200).json({ success: true, message: "Status updated successfully", application });

    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

module.exports = { applyForTask, getUserAppliedTasks,updateStatus }