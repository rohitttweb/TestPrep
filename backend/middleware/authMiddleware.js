import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Import User model

const authenticateToken = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract Bearer token

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        console.log("Decoded User:", decoded); // Debugging output

        req.user = await User.findById(decoded.id).select("-password"); // Attach user to request

        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }

        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token', error: error.message });
    }
};

export default authenticateToken;
