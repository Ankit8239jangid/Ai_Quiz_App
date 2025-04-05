import zod from "zod";
import { Quiz } from "../DB/quiz_Schema/quizSchema.js";

const QuestionSchema = zod.object({
    question: zod.string().min(3, "Question must be at least 3 characters long"),
    options: zod.array(zod.string()).min(2, "Each question must have at least 2 options"),
    correctAnswer: zod.string().min(1, "Correct answer must not be empty")
});

const QuizSchema = zod.object({
    title: zod.string().min(3, "Title must be at least 3 characters long"),
    timeLimit: zod.string().min(1, "Time limit must be at least 1 minute"),
    field: zod.string().min(3, "Field limit must be at least 3 characters long"),
    numQuestions: zod.number().min(1, "Number of questions must be at least 1"),
    questions: zod.array(QuestionSchema)
        .min(1, "Quiz must have at least one question")
});

const validateQuiz = async (req, res, next) => {
    try {
        const result = QuizSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: result.error.format()
            });
        }

        const existingQuiz = await Quiz.findOne({ title: req.body.title });
        if (existingQuiz) {
            return res.status(409).json({
                success: false,
                message: "Quiz with this title already exists"
            });
        }

        next();
    } catch (error) {
        console.error("Validation error:", error);
        return res.status(500).json({
            success: false,
            message: "Validation error",
            error: error.message
        });
    }
};

export default validateQuiz;