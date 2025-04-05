import express from "express";
import { quizRoute } from "./quiz_Router.js";
import { userRoute } from "./user_Router.js";
import { progressRoute } from "./progress_Router.js";

export const router = express.Router();

// Quiz routes
router.use('/quiz', quizRoute);

// User authentication routes
router.use('/user', userRoute);

// Quiz progress routes
router.use('/progress', progressRoute);