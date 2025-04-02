import jwt from "jsonwebtoken";
import { User } from "../DB/index.js";
import zod from "zod";
import dotenv from "dotenv";

dotenv.config();

// Using a fallback secret key if environment variable is not set
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";

const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6),
    firstname: zod.string(),
    lastname: zod.string(),
});

async function userInputValidater(req, res, next) {
    try {
        const { success } = signupSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ message: "Invalid input data" });
        }

        const existingUser = await User.findOne({ username: req.body.username });

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization token required" });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Token not provided" });
        }

        // Verify token and extract all payload data
        const decoded = jwt.verify(token, JWT_SECRET);

        // Set all decoded data to req.user
        req.user = decoded;

        // Also set userId specifically for backwards compatibility
        req.userId = decoded.userId;
        

        console.log("Decoded token payload:", decoded); // Debug log
        console.log("User ID from token:", decoded.userId); // Debug log

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
};

export { userInputValidater };
