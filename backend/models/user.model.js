const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    profilePic: { type: String, default: "default_profile_pic.jpg" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    mobileNo: { type: Number, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    addresses: [],
    experience:{
        type:Number
    },
    skills:[{
        type:String
    }]
});

const forgotPassword = async(req,res)=>{
    
}

const User = mongoose.model('User', userSchema);
module.exports = User;
