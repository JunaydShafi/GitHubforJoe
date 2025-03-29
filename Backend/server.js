import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();


app.use(express.static(path.join(__dirname, "../frontend")));

app.use(express.static(path.join(__dirname,'..?frontend')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", "index.html"));
});

app.get('/appointment', (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", "appointment.html"));
});


<!-- app.get('/style.css', (req, res) => { res.sendFile(path.join(__dirname, "../Frontend", "style.css"));}); -->

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

app.get('/backend/website.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'website.js'));
});


app.get('/forgotpass', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "forgotpass.html"));

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


app.get('/images/:imageName', (req, res) => {
    const { imageName } = req.params;
    res.sendFile(path.join(__dirname, "../Frontend", "images", imageName));
});

app.listen(5000, () => {
    console.log("Server is ready at http://localhost:5000");
});
