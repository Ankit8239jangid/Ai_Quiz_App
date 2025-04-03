import express from "express";
import { Quiz } from "../DB/quiz_Schema/quizSchema.js";
import validateQuiz from "../middleware/quiz.auth.js";

export const quizRoute = express.Router();

quizRoute.post("/create_quiz", validateQuiz, async (req, res) => {
    try {     
        const { title, timeLimit, numQuestions, questions, field } = req.body;

        // Validate that numQuestions matches actual questions length
        if (questions.length !== numQuestions) {
            return res.status(400).json({
                message: "Number of questions doesn't match the provided questions array"
            });
        }

        const newQuiz = await Quiz.create({
            title,
            timeLimit,
            field,
            numQuestions,
            questions
        });

        res.status(201).json({
            success: true,
            message: "Quiz created successfully",
            quiz: newQuiz
        });
    } catch (error) {
        console.error("Quiz creation error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create quiz",
            error: error.message
        });
    }
});

// Add a GET route to fetch quizzes
quizRoute.get("/", async (req, res) => {
    try {
        const quizzes = await Quiz.find({}).select('-questions.correctAnswer');
        res.status(200).json({
            success: true,
            quizzes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch quizzes",
            error: error.message
        });
    }
});