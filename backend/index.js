import express from "express";
import DataBase from "./DB/index.js";
import { router } from "./router/router.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const allowedOrigins = ['https://ai-quiz-by-ankit.vercel.app'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, 
}));

app.use('/api/v1/', router);

app.get("/", (req, res) => {
    res.send("hyy i an ankit and this is a Ai-quiz App Api ");

});



DataBase();
app.listen(3000, () => {
    console.log("server is runing on 3000");
});