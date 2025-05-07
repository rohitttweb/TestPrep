import express from 'express';
import User from '../models/User.js';
import ORGTests from '../models/ORGTestsModel.js';
import ORGTestAttempts from '../models/ORGTestAttemptsModel.js';
import Questions from '../models/Questions.js';
import TestResult from '../models/TestResult.js';

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalOrganizations,
      totalTests,
      totalAttempts,
      totalQuestions,
      testAttemptsByUsers
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'org' }), // Assuming "role" exists
      ORGTests.countDocuments(),
      ORGTestAttempts.countDocuments(),
      Questions.countDocuments(),
      TestResult.countDocuments()
    ]);

    res.json({
      totalUsers,
      totalOrganizations,
      totalTests,
      totalAttempts,
      totalQuestions,
      testAttemptsByUsers
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;
