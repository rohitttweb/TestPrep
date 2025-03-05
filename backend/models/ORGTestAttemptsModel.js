import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: "ORGTests", required: true }, // Ensure the reference matches the model name
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  questions: [
    {
      question: String,
      options: [String], // 4 options (A, B, C, D)
      userselected: String,
      correctAnswer: String, // Correct option
    }
  ],
  score: { type: Number, required: true },
  totalScore: { type: Number, required: true },
  submittedEvent: { type: String, enum: ["submit_button", "window_blur", "timeout"] }, // ✅ New field
   
  attemptedAt: { type: Date, default: Date.now }
});




const ORGTestAttemptsModel  = mongoose.model("ORGTestAttempts", attemptSchema);
export default ORGTestAttemptsModel