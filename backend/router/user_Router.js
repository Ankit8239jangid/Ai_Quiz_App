import express from "express";
import { User } from "../DB/index.js";
import { userInputValidater, verifyToken } from "../middleware/User.auth.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";

export const userRoute = express.Router();

// User signup route
userRoute.post("/signup", userInputValidater, async (req, res) => {
    try {
        const { username, password, firstname, lastname } = req.body;
        
        // Create new user
        const newUser = await User.create({
            username,
            password, // In a real app, you should hash the password
            firstname,
            lastname
        });

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: newUser._id,
                username: newUser.username,
                firstname: newUser.firstname,
                lastname: newUser.lastname
            }, 
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            success: true,
            message: "User created successfully",
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                firstname: newUser.firstname,
                lastname: newUser.lastname
            }
        });
    } catch (error) {
        console.error("User creation error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create user",
            error: error.message
        });
    }
});

// User login route
userRoute.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Find user by username
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        
        // Check password (in a real app, you would compare hashed passwords)
        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user._id,
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname
            }, 
            JWT_SECRET,
            { expiresIn: "7d" }
        );
        
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to login",
            error: error.message
        });
    }
});

// Get user profile
userRoute.get("/profile", verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        
        const user = await User.findById(userId).select("-password");
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Profile fetch error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
            error: error.message
        });
    }
});

// Update user profile
userRoute.put("/profile", verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const { firstname, lastname } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { firstname, lastname },
            { new: true }
        ).select("-password");
        
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message
        });
    }
});
