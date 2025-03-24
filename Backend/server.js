//const express = require('express');
import express from "express";
import dotenv from "dotenv"; 
import { connectDB } from "./config/db.js"; // make sure it is db.js and not just db

import path from "path";
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.get("/products",(req, res) => { });

app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, "../frontend", "index.html"));
})

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "signup.html"));
    })

app.get('/adminMain', (req,res)=>{
    res.sendFile(path.join(__dirname, "../frontend", "adminMain.html"));
})

app.get('/appointments', (req,res)=>{
    res.sendFile(path.join(__dirname, "../frontend", "appointments.html"));
})
app.get('/reviews', (req,res)=>{
    res.sendFile(path.join(__dirname, "../frontend", "reviews.html"));
})

app.get('/newEmployee', (req,res)=>{
    res.sendFile(path.join(__dirname, "../frontend", "newEmployee.html"));
})

app.get('/payroll', (req,res)=>{
    res.sendFile(path.join(__dirname, "../frontend", "payroll.html"));
})

dotenv.config();
//console.log(process.env.MONGO_URI)


app.listen(5000, () => {
    console.log("Server is ready at http://localhost:5000");
    connectDB();
});