import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

function DataBase() {
    mongoose.connect(process.env.MONGO_URI)// apna database ko connect karo 

        .then(() => console.log("Database connected"))
        .catch(err => console.error("Database connection error:", err));
}

export default DataBase;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,

    },
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    }
});

export const User = mongoose.model('User', userSchema);

