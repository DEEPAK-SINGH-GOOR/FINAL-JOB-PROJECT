const jwt = require('jsonwebtoken');

const generateToken = async(data)=>{
    try {
        const token = await jwt.sign(data,process.env.SECRET_KEY);
        return token;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = generateToken; 