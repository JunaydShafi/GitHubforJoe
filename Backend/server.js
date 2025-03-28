import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, '../Frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", "index.html"));
});

app.get('/appointment', (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", "appointment.html"));
});

app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", "style.css"));
});

app.get('/images/:imageName', (req, res) => {
    const { imageName } = req.params;
    res.sendFile(path.join(__dirname, "../Frontend", "images", imageName));
});


// Environment variables (optional for DB connection)
//dotenv.config();
//connectDB();

// Start the server
app.listen(5000, () => {
    console.log("Server is ready at http://localhost:5000");
});
