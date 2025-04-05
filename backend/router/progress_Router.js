import express from "express";
import { UserQuizProgress } from "../DB/quiz_Schema/quizSchema.js";
import { Quiz } from "../DB/quiz_Schema/quizSchema.js";
import { verifyToken } from "../middleware/User.auth.js";

export const progressRoute = express.Router();

// Submit quiz answers and record progress
progressRoute.post("/submit", verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const { quizId, userAnswers } = req.body;
        
        // Find the quiz
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }
        
        // Calculate score
        let score = 0;
        const questions = quiz.questions;
        
        // Validate that userAnswers has the correct format
        if (!Array.isArray(userAnswers) || userAnswers.length !== questions.length) {
            return res.status(400).json({
                success: false,
                message: "Invalid answers format"
            });
        }
        
        // Calculate score
        for (let i = 0; i < questions.length; i++) {
            if (userAnswers[i] === questions[i].correctAnswer) {
                score++;
            }
        }
        
        // Calculate percentage score
        const percentageScore = (score / questions.length) * 100;
        
        // Check if user has attempted this quiz before
        let userProgress = await UserQuizProgress.findOne({ userId, quizId });
        
        if (userProgress) {
            // Update existing progress
            if (percentageScore > userProgress.score) {
                userProgress.score = percentageScore;
            } else {
                userProgress.failedAttempts += 1;
            }
            userProgress.attemptedAt = new Date();
            await userProgress.save();
        } else {
            // Create new progress record
            userProgress = await UserQuizProgress.create({
                userId,
                quizId,
                score: percentageScore,
                attemptedAt: new Date()
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Quiz submitted successfully",
            result: {
                score: percentageScore,
                totalQuestions: questions.length,
                correctAnswers: score
            },
            progress: userProgress
        });
    } catch (error) {
        console.error("Quiz submission error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to submit quiz",
            error: error.message
        });
    }
});

// Get user's quiz progress
progressRoute.get("/", verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        
        // Get all progress records for the user
        const progress = await UserQuizProgress.find({ userId })
            .populate('quizId', 'title field numQuestions timeLimit')
            .sort({ attemptedAt: -1 });
        
        res.status(200).json({
            success: true,
            progress
        });
    } catch (error) {
        console.error("Progress fetch error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch progress",
            error: error.message
        });
    }
});

// Get user's progress for a specific quiz
progressRoute.get("/:quizId", verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const { quizId } = req.params;
        
        // Get progress record for the specific quiz
        const progress = await UserQuizProgress.findOne({ userId, quizId })
            .populate('quizId', 'title field numQuestions timeLimit');
        
        if (!progress) {
            return res.status(404).json({
                success: false,
                message: "No progress found for this quiz"
            });
        }
        
        res.status(200).json({
            success: true,
            progress
        });
    } catch (error) {
        console.error("Quiz progress fetch error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch quiz progress",
            error: error.message
        });
    }
});

// Get user's quiz statistics
progressRoute.get("/stats/summary", verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        
        // Get all progress records for the user
        const progress = await UserQuizProgress.find({ userId });
        
        // Calculate statistics
        const totalQuizzes = progress.length;
        const completedQuizzes = progress.filter(p => p.score > 0).length;
        const averageScore = progress.reduce((sum, p) => sum + p.score, 0) / (totalQuizzes || 1);
        const highestScore = Math.max(...progress.map(p => p.score), 0);
        
        // Get recent attempts
        const recentAttempts = await UserQuizProgress.find({ userId })
            .populate('quizId', 'title field')
            .sort({ attemptedAt: -1 })
            .limit(5);
        
        res.status(200).json({
            success: true,
            stats: {
                totalQuizzes,
                completedQuizzes,
                averageScore,
                highestScore,
                recentAttempts
            }
        });
    } catch (error) {
        console.error("Stats fetch error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch statistics",
            error: error.message
        });
    }
});

// Set reminder for a quiz
progressRoute.post("/reminder/:quizId", verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const { quizId } = req.params;
        const { reminderTime } = req.body;
        
        // Find or create progress record
        let progress = await UserQuizProgress.findOne({ userId, quizId });
        
        if (progress) {
            // Update existing record
            progress.createReminder = true;
            progress.reminderTime = new Date(reminderTime);
            await progress.save();
        } else {
            // Create new record
            progress = await UserQuizProgress.create({
                userId,
                quizId,
                createReminder: true,
                reminderTime: new Date(reminderTime)
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Reminder set successfully",
            progress
        });
    } catch (error) {
        console.error("Reminder set error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to set reminder",
            error: error.message
        });
    }
});
