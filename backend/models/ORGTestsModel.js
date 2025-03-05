import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  testLength: { type: Number, default: 0 },
  questions: [
    {
      question: { type: String, required: true },
      options: { type: [String], required: true, validate: v => v.length === 4 },
      correctAnswer: { type: String, required: true }
    }
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
});

// Automatically set testLength before saving
testSchema.pre("save", function (next) {
  this.testLength = this.questions.length;
  next();
});

const ORGTestsModel = mongoose.model("ORGTests", testSchema); // Ensure this matches the ref in attemptSchema
export default ORGTestsModel;
