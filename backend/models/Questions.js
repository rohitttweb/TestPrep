import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: { type: [String], required: true, validate: v => v.length === 4 },
    correct_ans: { type: String, required: true },
    maintopic: { type: String, required: true },
    subtopic: { type: String, required: true }
});

const Questions = mongoose.model('Questions', questionSchema);
export default Questions;

