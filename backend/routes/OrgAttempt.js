import { Router } from "express";
import OrgTestAttempts from "../models/ORGTestAttemptsModel.js";
import authMiddleware from "../middleware/authMiddleware.js"; // Ensure the user is logged in
const router = Router();

// Save test attempt
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { userId, testId, answers } = req.body;

    const attempt = new OrgTestAttempts({
      userId,
      testId,
      answers,
    });

    await attempt.save();
    res.status(201).json({ success: true, message: "Test submitted successfully!" });
  } catch (error) {
    console.error("Error saving attempt:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
