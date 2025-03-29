import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";

// Set up __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express
const app = express();

// Load environment variables
dotenv.config();
console.log("Mongo URI:", process.env.MONGO_URI);

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Serve static files from Frontend/public
app.use(express.static(path.join(__dirname, "../Frontend/public")));



app.get("/employee-dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/public/employee-dashboard.html"));
});

app.get("/main-employee", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/public/main-employee.html"));
});

app.get("/employee-job-view", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/public/employee-job-view.html"));
});

app.get("/payroll-display", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/public/payroll-display.html"));
});


app.get("/products", (req, res) => {
  res.json({ message: "This is your products route!" });
});

// Catch-all for unknown routes
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
});

//handle port already in use errors (EADDRINUSE)
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use. Please close the previous server or restart your system.`);
    process.exit(1); // Exit cleanly so nodemon doesn't hang
  } else {
    throw err; // Let other errors bubble
  }
});

