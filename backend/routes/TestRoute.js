import express from "express";
import TestResult from "../models/TestResult.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 📌 Route to submit test results
router.post("/submit", authMiddleware, async (req, res) => {
    try {
        const { topic, subTopic, totalQuestions, correctAnswers, wrongAnswers, unattempted, score, submittedEvent, questions } = req.body;
        const userId = req.user.id; // Get user ID from token

        if (!topic || !subTopic || !totalQuestions || !questions || questions.length === 0) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Save result in MongoDB
        const newResult = new TestResult({
            userId,
            topic,
            subTopic,
            totalQuestions,
            correctAnswers,
            wrongAnswers,
            unattempted,
            score,
            submittedEvent,
            questions, // Store questions with selected answers
        });

        await newResult.save();
        res.status(201).json({ message: "Test result submitted successfully", data: newResult });

    } catch (error) {
        console.error("Error submitting test:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Fetch all tests for a user
router.get("/attempts", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from token

        const tests = await TestResult.find({ userId }).sort({ submittedAt: -1 }); // Latest first

        res.json({ success: true, tests });
    } catch (error) {
        console.error("Error fetching tests:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.get("/overview", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const tests = await TestResult.find({ userId });

        const totalTests = tests.length;
        const totalQuestions = tests.reduce((acc, test) => acc + test.totalQuestions, 0);
        const correctAnswers = tests.reduce((acc, test) => acc + test.correctAnswers, 0);
        const wrongAnswers = tests.reduce((acc, test) => acc + test.wrongAnswers, 0);
        const unattempted = tests.reduce((acc, test) => acc + test.unattempted, 0);

        res.json({
            totalTests,
            totalQuestions,
            correctAnswers,
            wrongAnswers,
            unattempted,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch test overview" });
    }
});


export default router;
