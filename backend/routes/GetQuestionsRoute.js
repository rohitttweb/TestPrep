import express from 'express';
const router = express.Router();
import Question from '../models/Questions.js'; // Assuming the model is in a folder called `models`
// Function to add data to MongoDB
const addDataToMongo = async (question, options, correct_ans, maintopic, subtopic) => {
    try {
        const newQuestion = new Question({
            question,
            options,
            correct_ans,
            maintopic,
            subtopic
        });
        await newQuestion.save();
    } catch (error) {
        throw new Error(`Error adding data: ${error.message}`);
    }
};

// Function to fetch questions from MongoDB
const getQuestions = async (maintopic, subtopic, length) => {
    try {
        const questions = await Question.aggregate([
            { $match: { maintopic, subtopic } },
            { $sample: { size: length } }
        ]);

        return questions.map(q => ({
            id: q._id,
            question: q.question,
            options: q.options,
            ans: q.correct_ans,
            topic: q.maintopic
        }));
    } catch (error) {
        throw new Error(`Error fetching questions: ${error.message}`);
    }
};

// Route to fetch questions
router.get('/questions', async (req, res) => {
    const testTopic = req.query.Topic;
    const testSubTopic = req.query.subTopic;
    const testLength = Number(req.query.testlength);

    if (!testLength) {
        return res.status(400).json({ error: 'Invalid test length' });
    }

    try {
        const questions = await getQuestions(testTopic, testSubTopic, testLength);
        res.json({
            code: 200,
            success: 'Data fetched successfully',
            data: questions
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to add a question
router.post('/add', async (req, res) => {
    const { question, options, correct_ans, mainTopic, subTopic } = req.body;

    if (!question || !options || options.length !== 4 || !correct_ans || !mainTopic || !subTopic) {
        return res.status(400).json({ error: 'Invalid data provided' });
    }

    try {
        await addDataToMongo(question, options, correct_ans, mainTopic, subTopic);
        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// API to fetch all main topics and their subtopics
router.get('/topics', async (req, res) => {
    try {
        const topics = await Question.aggregate([
            {
                $group: {
                    _id: "$maintopic",
                    subTopics: { $addToSet: "$subtopic" },
                },
            },
            {
                $project: {
                    _id: 0,
                    mainTopic: "$_id",
                    subTopics: 1,
                },
            },
        ]);
     

        res.status(200).json(topics);
    } catch (error) {
        console.error("Error fetching topics:", error);
        res.status(500).json({ error: "Error fetching topics" });
    }
});
export default router

