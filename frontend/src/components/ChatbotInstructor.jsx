import React, { useState } from "react";
import axios from "axios";
const API_BASE_URL = process.env.API_URL || "http://localhost:3001";

const ChatbotInstructor = () => {
    const [topic, setTopic] = useState("aptitude");
    const [difficulty, setDifficulty] = useState("medium");
    const [response, setResponse] = useState("");

    // Fetch question from backend
    const sendMessage = async () => {
        try {
            const res = await axios.post(`${API_BASE_URL}/api/ai/learn`, { topic, difficulty });
            setResponse(res.data.choices[0].message.content);
        } catch (error) {
            console.error("Error:", error);
            setResponse("⚠️ Error fetching question. Please try again.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-base-100 rounded-xl text-center text-base-content">
            <h2 className="text-xl font-bold mb-4">AI Instructor</h2>

            {/* Topic Selection */}
            <div className="mb-4">
                <label className="block text-sm font-medium">Select Topic:</label>
                <select 
                    value={topic} 
                    onChange={(e) => setTopic(e.target.value)}
                    className="mt-1 block w-full p-2 border border-base-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
                >
                    <option value="aptitude">Aptitude</option>
                    <option value="reasoning">Reasoning</option>
                    <option value="verbal">Verbal</option>
                </select>
            </div>

            {/* Difficulty Selection */}
            <div className="mb-4">
                <label className="block text-sm font-medium">Select Difficulty:</label>
                <select 
                    value={difficulty} 
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="mt-1 block w-full p-2 border border-base-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
                >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>

            {/* Get Question Button */}
            <button 
                onClick={sendMessage} 
                className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus transition"
            >
                Get Question
            </button>

            {/* AI Response Display */}
            {response && (
                <div 
                    className="mt-6 p-4 bg-base-200 rounded-lg text-left whitespace-pre-wrap"
                >
                    {response}
                </div>
            )}
        </div>
    );
};

export default ChatbotInstructor;
