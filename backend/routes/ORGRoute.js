import express from 'express';
const router = express.Router();
import ORGTestsModel from "../models/ORGTestsModel.js"
import authMiddleware from "../middleware/authMiddleware.js";

import ORGTestAttemptsModel from "../models/ORGTestAttemptsModel.js"

// Attempt a ORG test
router.post("/attempt", authMiddleware, async (req, res) => {
  try {
    const { testId, answers, submittedEvent } = req.body;
    // Fetch test details to get questions and correct answers
    const test = await ORGTestsModel.findById(testId);
    if (!test) {
      return res.status(404).json({ error: "Test not found" });
    }
    const userId = req.user._id
    let score = 0;
    const totalScore = test.questions.length;

    // Prepare attempt data
    const questionDetails = test.questions.map((question) => {
      const userAnswer = answers[question._id] || "";
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) score++;
      return { question: question.question, options: question.options, userselected: userAnswer, correctAnswer: question.correctAnswer};
    });

    // Store attempt in database
    const newAttempt = new ORGTestAttemptsModel({
      testId,
      userId,
      questions: questionDetails,
      score,
      totalScore,
      submittedEvent
    });

    await newAttempt.save();
    res.status(201).json({ message: "Test attempt saved successfully!", score, totalScore});

  } catch (error) {
    console.error("Error saving attempt:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Check if the user has already attempted the test
router.get("/attempts/:testId", authMiddleware, async (req, res) => {
  try {
    const { testId } = req.params;
    const userId = req.user.id; // Extracted from authMiddleware

    const existingAttempt = await ORGTestAttemptsModel.findOne({ userId, testId });

    if (existingAttempt) {
      return res.json({ attempted: true, message: "Test already attempted" });
    }

    res.json({ attempted: false });
  } catch (error) {
    console.error("Error checking test attempt:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/test/create", authMiddleware, async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    const createdBy = req.user._id;

    if (!title || !description || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "All fields are required, and at least one question must be provided." });
    }

    const newTest = new ORGTestsModel({ title, description, questions, createdBy });

    await newTest.save();

    res.json({ success: true, testId: newTest._id });
  } catch (error) {
    console.error("Error creating test:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch a single test
router.get("/test/:id", async (req, res) => {
  try {
    const test = await ORGTestsModel.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ error: "Test not found" });
    }
    res.json(test);
  } catch (error) {
    console.error("Error fetching test:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// List all tests created by the org user
router.get("/tests", authMiddleware, async (req, res) => {
  try {
    const tests = await ORGTestsModel.find({ createdBy: req.user._id });
    res.json({ tests });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tests." });
  }
});


// Fetch all attempts for a test
router.get("/test/:testId/attempts", authMiddleware, async (req, res) => {
  try {
    const { testId } = req.params;
    const userId = req.user.id; // Logged-in user's ID from token

    // Fetch the test to check ownership
    const test = await ORGTestsModel.findById(testId);
    if (!test) {
      return res.status(404).json({ error: "Test not found." });
    }

    // Check if the logged-in user is the creator
    if (test.createdBy.toString() !== userId) {
      return res.status(403).json({ error: "Access denied. You are not the owner of this test." });
    }

    // Fetch attempts only if user is owner
    const attempts = await ORGTestAttemptsModel.find({ testId }).populate("userId", "name");

    res.json({ attempts });
  } catch (error) {
    console.error("Error fetching attempts:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});


router.get('/:orgId/profile', async (req, res) => {
  const { orgId } = req.params;

  try {
    const totalTests = await ORGTestsModel.countDocuments({ createdBy: orgId });
    const testId = await ORGTestsModel.find({ createdBy: orgId }).distinct('_id');
    const totalAttempts = await ORGTestAttemptsModel.countDocuments({ testId });  

    res.json({
      orgId,
      totalTests,
      totalAttempts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch org profile stats' });
  }
});




export default router;

