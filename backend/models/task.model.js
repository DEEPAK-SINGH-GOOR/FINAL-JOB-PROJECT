const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    budget: Number,
    deadline: Date,
    category: String,
    skillsRequired: [String],
    client: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: String,
        email: String,
        image: String
    },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Task", TaskSchema);
