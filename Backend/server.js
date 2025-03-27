//const express = require('express');
import express from "express";
import dotenv from "dotenv"; 
//import application from application;
import { connectDB } from "./config/db.js"; // make sure it is db.js and not just db

import path from "path";
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname,'..?frontend')));

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

app.get('/approval', (req,res)=>{
    res.sendFile(path.join(__dirname, "../frontend", "approval.html"));
})

app.get('/createJob',(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend","createJob.html"));
})

app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, "../frontend", "index.html"));
})

app.get('/signup', (req, res) => {
res.sendFile(path.join(__dirname, "../frontend", "signup.html"));
})

app.get('/createAccount', (req, res) => {
res.sendFile(path.join(__dirname, "../frontend", "createAccount.html"));
})

app.get('/backend/website.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'website.js'));
});

app.use(express.static(path.join(__dirname, '../frontend')));

    //app.get('images/JoesWallpaper.png', (req, res) => {
     //   res.sendFile(path.join(__dirname, "../frontend/images", "images/JoesWallpaper.png"));
      //  })

    //app.use(express.static(path.join(__dirname, 'frontend')));

dotenv.config();
//console.log(process.env.MONGO_URI)


app.listen(5000, () => {
    console.log("Server is ready at http://localhost:5000");
    connectDB();
});