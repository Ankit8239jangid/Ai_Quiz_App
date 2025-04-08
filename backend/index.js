import express from "express";
import DataBase from "./DB/index.js";
import { router } from "./router/router.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
    cors({
      origin: '' // replace with your actual frontend URL
    })
  );

app.use('/api/v1/', router);

app.get("/", (req, res) => {
    res.send("hyy i an ankit ");

});



DataBase();
app.listen(3000, () => {
    console.log("server is runing on 3000");
});