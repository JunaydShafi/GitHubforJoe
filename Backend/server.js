//const express = require('express');
import express from "express";
import dotenv from "dotenv"; 
import { connectDB } from "./config/db.js"; // make sure it is db.js and not just db


const app = express();
app.get("/products",(req, res) => { });

dotenv.config();
//console.log(process.env.MONGO_URI)


app.listen(5000, () => {
    console.log("Server is ready at http://localhost:5000");
    connectDB();
});