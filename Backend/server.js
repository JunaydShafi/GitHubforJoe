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

app.get('/customerMainPage', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "customerMainPage.html"));
    })

app.get('/customerJobsProfile', (req, res) => {
res.sendFile(path.join(__dirname, "../frontend", "customerJobsProfile.html"));
})

app.get('/customerRequestAppointment', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "customerRequestAppointment.html"));
    })

app.get('/myCars', (req, res) => {
res.sendFile(path.join(__dirname, "../frontend", "myCars.html"));
})

app.get('/upcomingAppointment', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "upcomingAppointment.html"));
    })

app.get('/jobProgress', (req, res) => {
res.sendFile(path.join(__dirname, "../frontend", "jobProgress.html"));
})

app.get('/jobHistory', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "jobHistory.html"));
    })

app.get('/jobReview', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "jobReview.html"));
    })

app.get('/requestSent', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "requestSent.html"));
    })

app.get('/carInfo', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "carInfo.html"));
    })

app.get('/addCar', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "addCar.html"));
    })
    
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "signup.html"));
    })

dotenv.config();
//console.log(process.env.MONGO_URI)


app.listen(5000, () => {
    console.log("Server is ready at http://localhost:5000");
    connectDB();
});