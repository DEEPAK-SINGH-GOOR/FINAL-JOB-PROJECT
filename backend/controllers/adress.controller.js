const User = require("../models/user.model");

const createAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const address = await User.findByIdAndUpdate(userId, { $push: { addresses: req.body } }, { new: true });
        res.json({ message: "Address added successfully", address, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

module.exports = { createAddress };
