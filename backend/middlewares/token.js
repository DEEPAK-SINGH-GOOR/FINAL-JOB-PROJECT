const jwt = require('jsonwebtoken')


const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]
        
    if (!token) return res.status(403).json({ message: 'Access denied. No token provided.' })
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Access denied. Invalid token.' })
        req.user = user
        next()
    })
}

module.exports = verifyToken;