import express from "express";
import DataBase from "./DB/index.js";
import { router } from "./router/router.js";
import cors from "cors";
import dotenv from "dotenv";
import { generateImageResponse, generateTextResponse } from "./utils/Googel-Api.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/v1/', router);

app.get("/", (req, res) => {
    res.send("hyy i an ankit ");

});


// app.post('/ai', async (req, res) => {
//     const { prompt } = req.body;
//     const response = await generateTextResponse(prompt);
//     res.json({ response });
// });

// app.post('/ai/image', async (req, res) => {
//     const { prompt, imagePath } = req.body;
//     const response = await generateImageResponse(imagePath, prompt);
//     res.json({ response });

// })


DataBase();
app.listen(3000, () => {
    console.log("server is runing on 3000");
});