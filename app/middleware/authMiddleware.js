const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel')

const authMiddleware = async (req, res, next) => {
    
    try {
        const token = req.cookies.token; 
        console.log('Auth Token:', token);
 
        if (!token) {
            return res.status(400).json({ msg: "Unauthorized Access" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await userModel.findById(decoded.id);
        next();
        
    } catch (error) {
        res.status(400).json({ msg: 'Something Went Wrong' });
        
    }
    
}



module.exports = { authMiddleware };