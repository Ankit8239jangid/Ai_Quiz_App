import express from "express";
import { Quiz } from "../DB/quiz_Schema/quizSchema.js";
import validateQuiz from "../middleware/quiz.auth.js";
import { verifyToken } from "../middleware/User.auth.js";
import { generateTextResponse } from "../utils/Googel-Api.js";
export const quizRoute = express.Router();


quizRoute.post('/generate-ai-quiz', verifyToken, async (req, res) => {
    const { prompt, field = 'General Knowledge', numQuestions = 6 } = req.body;

    try {
        // Don't reassign the parameter, just pass it to the function
        let generatedQuiz = await generateTextResponse(prompt, field, numQuestions);



        // If response is a code block string, remove markdown and parse
        if (typeof generatedQuiz === 'string') {
            const cleaned = generatedQuiz.replace(/```(?:json)?|```/g, '').trim();

            try {
                generatedQuiz = JSON.parse(cleaned);
            } catch (parseError) {
                return res.status(400).json({
                    success: false,
                    message: 'Failed to parse generated quiz',
                    error: parseError.message,
                });
            }
        }

        const newQuiz = await Quiz.create({
            ...generatedQuiz,
            createdBy: req.userId,
        });
        res.status(201).json({
            success: true,
            message: 'Quiz generated and saved successfully',
            quiz: newQuiz,

        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to generate quiz',
            error: error.message,
        });
    }
});



quizRoute.post("/create_quiz", verifyToken, validateQuiz, async (req, res) => {
    try {
        const { title, timeLimit, numQuestions, questions, field } = req.body;

        // Validate that numQuestions matches actual questions length
        if (questions.length !== numQuestions) {
            return res.status(400).json({
                message: "Number of questions doesn't match the provided questions array"
            });
        }

        // Create the quiz with the generated response
        const newQuiz = await Quiz.create({
            title,
            timeLimit,
            field,
            numQuestions,
            questions,
            createdBy: req.userId,
        });

        res.status(201).json({
            success: true,
            message: "Quiz created successfully",
            quiz: newQuiz,
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


// Add a delete route to delete a quiz by ID
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

        // Generate a new text response if the quiz content has changed
        const { title, field, numQuestions, questions } = req.body;
        if (title || field || numQuestions || questions) {
            // Get the current quiz data and merge with updates
            const quizData = {
                title: title || quiz.title,
                field: field || quiz.field,
                numQuestions: numQuestions || quiz.numQuestions,
                questions: questions || quiz.questions
            };

            // Generate new response
            const generatedResponse = await generateTextResponse(quizData);

            // Add the generated response to the update data
            req.body.generatedResponse = generatedResponse;
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
            quiz: updatedQuiz,
            generatedResponse: updatedQuiz.generatedResponse
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

// Route to generate a quiz using AI based on a prompt
quizRoute.post("/generate-ai-quiz", verifyToken, async (req, res) => {
    try {
        const { prompt, field, numQuestions } = req.body;

        // Validate input
        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: "Prompt is required"
            });
        }

        // Generate the quiz using the AI function
        const generatedQuiz = await generateTextResponse(prompt, field || 'General Knowledge', numQuestions || 5);

        // Generate a text response for the quiz
        const generatedResponse = await generateTextResponse(generatedQuiz);

        // Add the user ID to the quiz data
        generatedQuiz.createdBy = req.userId;
        generatedQuiz.generatedResponse = generatedResponse;

        // Save the generated quiz to the database
        const newQuiz = await Quiz.create(generatedQuiz);

        res.status(201).json({
            success: true,
            message: "Quiz generated and saved successfully",
            quiz: newQuiz,
            generatedResponse
        });
    } catch (error) {
        console.error("Quiz generation error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate quiz",
            error: error.message
        });
    }
});

// Route to generate and retrieve a text response for a quiz
quizRoute.get("/generate-response/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        // Find the quiz
        const quiz = await Quiz.findById(id);

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }

        // Check if the quiz already has a generated response
        if (quiz.generatedResponse) {
            return res.status(200).json({
                success: true,
                generatedResponse: quiz.generatedResponse
            });
        }

        // Generate a new response
        const quizData = {
            title: quiz.title,
            field: quiz.field,
            numQuestions: quiz.numQuestions,
            questions: quiz.questions
        };

        const generatedResponse = await generateTextResponse(quizData);

        // Update the quiz with the new response
        quiz.generatedResponse = generatedResponse;
        await quiz.save();

        res.status(200).json({
            success: true,
            generatedResponse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to generate response",
            error: error.message
        });
    }
});



// add a route to get common fields for quizzes
quizRoute.get("/fields", async (req, res) => {
    try {
        const fields = await Quiz.distinct("field");
        res.status(200).json({
            success: true,
            fields
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch fields",
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


