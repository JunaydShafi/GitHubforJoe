import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import User from './user.js';
import bcrypt from 'bcrypt'; // or 'bcrypt', depending on which you installed


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();


app.use(express.static(path.join(__dirname, "../frontend")));

app.use(express.static(path.join(__dirname,'..?frontend')));

app.use('/js', express.static(path.join(__dirname, '../Frontend/js')));


// Main landing page

// API route: Get all jobs for a specific customer
  

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", "index.html"));
});

app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, "../frontend", "index.html"));
})

app.get('/backend/website.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'website.js'));
});


// a test page for main->make appt
app.get('/appointment', (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", "appointment.html"));
});


// Parse form body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/api/signup', async (req, res) => {
    const { email, password, username, phone } = req.body;
    
    try {
      // Hash the password before saving it
      const hashedPassword = await bcrypt.hash(password, 10);  // Ensure this is being done
      
      const newUser = new User({
        email,
        password: hashedPassword,
        username,
        phone,
      });
  
      await newUser.save();
      res.status(201).send('User created successfully');
    } catch (err) {
      res.status(500).send('Error creating user');
    }
  });


app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).send('User not found');
    }

    // Compare the entered password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Entered password:', password);
    console.log('Hashed password from DB:', user.password);
    


    if (!isMatch) {
      return res.status(400).send('Incorrect password');
    }

    // Continue with login (set session, token, etc.)
    res.status(200).send('Login successful');

  } catch (err) {
    res.status(500).send('Server error during login');
  }
});
  

// Login and Sign up pages

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "login.html"))
})
app.get('/forgotpass', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "forgotpass.html"));
})

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "signup.html"));
})

app.get('/createAccount', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "createAccount.html"));
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



// Admin pages

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



// Customer pages

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
    


// Employe Pages

app.get("/employee-dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/employee-dashboard.html"));
  });
  
  app.get("/main-employee", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/main-employee.html"));
  });
  
  app.get("/employee-job-view", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/employee-job-view.html"));
  });
  
  app.get("/payroll-display", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/payroll-display.html"));
  });
  
  const updatePasswords = async () => {
    const users = await User.find({});
    for (let user of users) {
        if (user.password && !user.password.startsWith('$2b$')) { // Check if it's plain text
            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;
            await user.save();
            console.log(`Updated password for user: ${user.email}`);
        }
    }
};

updatePasswords();




dotenv.config();
//console.log(process.env.MONGO_URI)


 /* app.get('/images/:imageName', (req, res) => {
    const { imageName } = req.params;
    res.sendFile(path.join(__dirname, "../Frontend", "images", imageName));
 });
*/
app.listen(5000, () => {
    console.log("Server is ready at http://localhost:5000");
    connectDB();
});