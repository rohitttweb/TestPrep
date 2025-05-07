import express from 'express';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config(); // Load API key from .env

const router = express.Router();
router.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: "Invalid 'messages' format. Must be a non-empty array." });
        }

        const systemMessage = {
            role: "system",
            content: `You are a Chat bot specializing in competitive exam preparation. 
            Provide brief explanations, and answer to given Question , and approch to solve that Question in minimum word as possible. Ensure your responses are 
            clear and helpful for learners.`
        };
        // Ensure every message has a valid string content
        const formattedMessages = messages.map(msg => ({
            role: "user",
            content: String(msg.content) // Ensures content is always a string
        }));

        const chatCompletion = await groq.chat.completions.create({
            "messages": [systemMessage, ...formattedMessages],
            "model": "llama3-70b-8192",
            "temperature": 0.7,
            "max_tokens": 300,
            "top_p": 1,
            "stream": false
        });

        res.json(chatCompletion);
    } catch (error) {
        console.error("Groq API Error:", error.response?.data || error.message);
        res.status(500).json({ error: error.message });
    }
});

router.post('/learn', async (req, res) => {
    try {
        const { topic, difficulty } = req.body; // Receive topic and difficulty from frontend

        if (!topic) {
            return res.status(400).json({ error: "Topic is required (e.g., aptitude, reasoning, verbal)." });
        }

        // Define the system instruction
        const systemMessage = {
            role: "system",
            content: `You are an AI instructor specializing in competitive exam preparation. 
            Provide detailed explanations, step-by-step solutions, and sample questions 
            for topics like Aptitude, Reasoning, and Verbal. Ensure your responses are 
            clear and helpful for learners.`
        };

        // Define the user query based on selected topic
        const userMessage = {
            role: "user",
            content: `Generate a ${difficulty || "medium"}-level question on ${topic}. 
            Explain the answer step by step and provide similar practice questions.`
        };

        // Construct the request
        const chatCompletion = await groq.chat.completions.create({
            messages: [systemMessage, userMessage],
            model: "llama3-70b-8192",
            temperature: 0.7,
            max_tokens: 500,
            top_p: 1,
            stream: false
        });

        res.json(chatCompletion);
    } catch (error) {
        console.error("Groq API Error:", error.response?.data || error.message);
        res.status(500).json({ error: error.message });
    }
});
export default router;
