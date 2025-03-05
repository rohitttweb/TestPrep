import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, required: true },
    userSelectedAnswer: { type: String, default: "" },
});

const TestResultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    topic: { type: String, required: true },
    subTopic: { type: String, required: true },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    wrongAnswers: { type: Number, required: true },
    unattempted: { type: Number, required: true },
    score: { type: Number, required: true },
    submittedEvent: { type: String, enum: ["submit_button", "window_blur", "timeout"] }, // ✅ New field
    questions: { type: [QuestionSchema], required: true }, // Store all questions with answers
    submittedAt: { type: Date, default: Date.now },

});

const TestResult = mongoose.model("TestResult", TestResultSchema);

export default TestResult;
