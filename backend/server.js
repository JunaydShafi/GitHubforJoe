import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";

// Set up __dirname with ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express
const app = express();

// Load .env
dotenv.config();
console.log(process.env.MONGO_URI);

// Middleware for parsing JSON
app.use(express.json());

// ✅ Connect to MongoDB
connectDB();

// ✅ Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "../Frontend/public")));

// ✅ Route to serve your HTML page
app.get("/employee-job-view", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/public/employee-job-view.html"));
});

// Example API route (you had this already)
app.get("/products", (req, res) => {
  res.json({ message: "This is your products route!" });
});

// Start server
app.listen(5000, () => {
  console.log("🚀 Server started at http://localhost:5000");
});
