import express from 'express';

const router = express.Router();
import User from "../models/User.js"; 
import authenticateToken from "../middleware/authMiddleware.js"; 

// Get user data
router.get("/profile", authenticateToken, async (req, res) => {
    try {

        const user = await User.findById(req.user._id).select("-password"); // Exclude password
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ user });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
// Update user profile
router.put("/profile", authenticateToken, async (req, res) => {
    try {
        const { name, email, bio } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, email, bio },
            { new: true }
        );

        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;
