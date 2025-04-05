import express from "express";
import { Quiz } from "../DB/quiz_Schema/quizSchema.js";
import validateQuiz from "../middleware/quiz.auth.js";
import { verifyToken } from "../middleware/User.auth.js";

export const quizRoute = express.Router();

quizRoute.post("/create_quiz", verifyToken, validateQuiz, async (req, res) => {
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
            questions,
            createdBy: req.userId
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

// Add a GET route to fetch all quizzes
quizRoute.get("/all_quiz", async (_, res) => {
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


//Add a put route to update a quiz by ID
quizRoute.put("/update/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        // Check if the quiz exists and belongs to the user
        const quiz = await Quiz.findOne({ _id: id, createdBy: req.userId });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found or you don't have permission to update it"
            });
        }

        // Update the quiz
        const updatedQuiz = await Quiz.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedQuiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Quiz updated successfully",
            quiz: updatedQuiz
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update quiz",
            error: error.message
        });
    }
});



//Add a delete route to delete a quiz by ID
quizRoute.delete("/delete/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        // Check if the quiz exists and belongs to the user
        const quiz = await Quiz.findOne({ _id: id, createdBy: req.userId });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found or you don't have permission to delete it"
            });
        }

        // Delete the quiz
        await Quiz.findByIdAndDelete(id);
        // We already checked if the quiz exists above, so we don't need this check
        res.status(200).json({
            success: true,
            message: "Quiz deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete quiz",
            error: error.message
        });
    }
});


// Add a route to get quizzes created by the current user
quizRoute.get("/my-quizzes", verifyToken, async (req, res) => {
    try {
        const quizzes = await Quiz.find({ createdBy: req.userId }).select('-questions.correctAnswer');
        res.status(200).json({
            success: true,
            quizzes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch your quizzes",
            error: error.message
        });
    }
});

// Add a route to get a quiz with answers (for quiz creator)
quizRoute.get("/with-answers/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const quiz = await Quiz.findOne({ _id: id, createdBy: req.userId });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found or you don't have permission to view answers"
            });
        }

        res.status(200).json({
            success: true,
            quiz
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch quiz with answers",
            error: error.message
        });
    }
});

//Add a get route to fetch a quiz by ID (without answers for regular users)
quizRoute.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const quiz = await Quiz.findById(id).select('-questions.correctAnswer');
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }
        res.status(200).json({
            success: true,
            quiz
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch quiz",
            error: error.message
        });
    }
});