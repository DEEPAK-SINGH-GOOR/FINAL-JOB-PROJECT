const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const generateToken = require("../utils/token");
const sendMail = require("../services/sendMail");
const OTP = require("../models/otp.model");
const Applied = require("../models/applied.model");
const taskModel = require("../models/task.model");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage }).single("profilePic");

const otps = new Map();
const signup = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "File upload failed", success: false });
        }

        try {
            const { username, email, password, role, mobileNo } = req.body;

            let user = await User.findOne({ email });

            if (user) {
                return res.status(400).json({ message: "User already exists", success: false });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const profilePic = req.file ? req.file.path : "";
            let userRole = role || "user";

            const newUser = await User.create({
                username,
                profilePic,
                email,
                password: hashedPassword,
                role: userRole,
                mobileNo,
                isVerified: role === "admin" ? false : true,
            });

            const token = await generateToken({
                id: newUser._id,
                image: newUser.profilePic,
                username: newUser.username,
                role: newUser.role,
                email: newUser.email,
                mobileNo: newUser.mobileNo,
            });

            if (role === "admin") {
                const otp = Math.floor(1000 + Math.random() * 9000);

                await OTP.create({ email, otp });

                let html = `<h1>Hello ${username},</h1>
                    <p>Your OTP for admin verification is: <b>${otp}</b></p>
                    <p>Enter this OTP to verify your account as an admin.</p>`;

                await sendMail(email, "Admin Role Verification", html);

                return res.status(201).json({
                    message: "OTP sent for admin verification. Please verify your email.",
                    success: true,
                    email,
                    token: token,
                });
            }

            res.status(201).json({
                message: "User registered successfully",
                success: true,
                user: newUser,
                token: token,
            });

        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
};

const verifyAdminOTP = async (req, res) => {
    const { email, otp } = req.body;

    const storedOtp = await OTP.findOne({ email });

    if (!storedOtp) {
        return res.status(400).json({ message: "OTP expired or not found", success: false });
    }

    if (storedOtp.otp !== parseInt(otp)) {
        return res.status(400).json({ message: "Invalid OTP", success: false });
    }

    let user = await User.findOneAndUpdate(
        { email },
        { role: "admin", isVerified: true },
        { new: true }
    );

    await OTP.deleteOne({ email });

    const token = await generateToken({
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email,
        mobileNo: user.mobileNo,
    });

    res.status(200).json({
        message: "Admin role verified successfully",
        success: true,
        user,
        token,
    });
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password", success: false });
        }

        const token = await generateToken({
            id: user._id,
            image: user.profilePic,
            username: user.username,
            role: user.role,
            email: user.email,
            mobileNo: user.mobileNo,
        });

        res.status(200).json({ 
            message: "User logged in successfully", 
            success: true, 
            user, 
            token 
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

const deleteUser = async(req,res)=>{
    let {id} = req.params;
    let user = await User.findByIdAndDelete(id)

    res.json({message: "User deleted successfully", success: true, user: user});
}

const getAllUsers = async(req,res)=>{
    let users = await User.find();
    res.json({message: "Users fetched successfully", success: true, users: users});
}

const getUserWithAddresses = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: No user ID found", success: false });
        }

        const userId = req.user.id;
        const user = await User.findById(userId).select("username email addresses");

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        res.json({ message: "User fetched successfully", success: true, user });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

const getUserById = async(req,res)=>{
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getApplicantsForTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const applications = await Applied.find({ taskId }).populate("userId", "username email profilePic");

        if (!applications.length) {
            return res.status(404).json({ message: "No applicants found for this task", success: false });
        }

        res.status(200).json({ success: true, applicants: applications });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

const updateUser = async(req,res)=>{
    let {id} = req.params;
    let updateUser = req.body;
    let user = await User.findByIdAndUpdate(id, updateUser, {new: true});
    res.json({message: "User updated successfully", success: true, user: user});
}

module.exports = { signup, login, verifyAdminOTP,deleteUser,getAllUsers,getUserWithAddresses,getUserById ,getApplicantsForTask,updateUser};
