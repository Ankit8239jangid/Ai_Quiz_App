import express from "express";
import { quizRoute } from "./quiz_Router.js";

export const router = express.Router();
router.use('/quiz', quizRoute);    
   