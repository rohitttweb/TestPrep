import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import User from '../models/User.js'; 
import dotenv from 'dotenv';

dotenv.config(); // Load API key from .env

const router = express.Router();
router.use(express.json());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieParser()); 

const secret = process.env.JWT_SECRET

// Register route with role support
router.post('/register', async (req, res) => {
    try {
        const { name, username, password, role } = req.body;
        console.log(req.body)

        if (username.length < 5) return res.status(400).send("Username must be at least 5 characters long");
        if (password.length < 8) return res.status(400).send("Password must be at least 8 characters long");

        // Ensure role is valid
        const validRoles = ["user", "admin", "org"];
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }

        const newUser = new User({ name, username, password, role: role || "user" });
        await newUser.save();

        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

// Login route with role handling
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            secret,
            { expiresIn: '1h' }
        );

        res.status(200).json({ success: true, token, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

// Check if username exists
router.post('/isexist', async (req, res) => {
    try {
        const { __username } = req.body;
        const existingUser = await User.findOne({ username: __username });
        if (existingUser) {
            return res.status(400).json({ message: "Username is not available" });
        }
        res.status(200).json({ success: true, message: "Username is available" });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

router.get('/validate-token', (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Bearer token
    if (!token) {
        return res.status(401).json({ success: false, message: 'Token is missing' });
    }
    jwt.verify(token, secret, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid or expired token' });
        }
      
        // You can check if the user exists in your database (optional, but recommended)
        try {
            const user = await User.findById(decoded.id);  // Assuming the token contains the user's _id
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            // Token is valid, user found
            console.log("kjbhvgvjbknklm")
            const fetchedUser = {
                id : user._id,
                name : user.name,
                role: user.role,

            }
            return res.status(200).json({ success: true, user: fetchedUser, message: 'Token is valid' });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error' });
        }
    });
});

export default router;
