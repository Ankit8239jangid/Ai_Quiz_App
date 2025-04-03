import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    timeLimit: { type: Number, required: true },
    field: { type: String, required: true },
    numQuestions: { type: Number, required: true },
    questions: [{
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: String, required: true },
    }],  // Embed questions directly
    createdAt: { type: Date, default: Date.now },
});

const Quiz = mongoose.model("Quiz", quizSchema);

// 🎯 User Quiz Progress Schema
const userQuizProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    score: { type: Number, default: 0 },
    failedAttempts: { type: Number, default: 0 },
    createReminder: { type: Boolean, default: false },
    reminderTime: { type: Date },
    attemptedAt: { type: Date, default: Date.now },
});

const UserQuizProgress = mongoose.model("UserQuizProgress", userQuizProgressSchema);

export { Quiz, UserQuizProgress };
