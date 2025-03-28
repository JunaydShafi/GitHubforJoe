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
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/products",(req, res) => { });


app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, "../frontend", "index.html"));
})

app.get('/backend/website.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'website.js'));
});


app.get('/forgotpass', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "forgotpass.html"));
    })

   app.get('/forgotpassconf', (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "forgotpassconf.html"));
        })

        app.get('/resetpass', (req, res) => {
            res.sendFile(path.join(__dirname, "../frontend", "resetpass.html"));
            })
    
            app.get('/success', (req, res) => {
                res.sendFile(path.join(__dirname, "../frontend", "success.html"));
                })

dotenv.config();
//console.log(process.env.MONGO_URI)


app.listen(5000, () => {
    console.log("Server is ready at http://localhost:5000");
    connectDB();
});