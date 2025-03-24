import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
const app = express();
    app.get("/products", (req, res) => {});
    dotenv.config();
console.log(process.env.MONGO_URI);

app.listen(5000, () => {
    console.log("Server started at http://localhost:5000");
    connectDB();
    });