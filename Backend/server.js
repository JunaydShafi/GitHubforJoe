import express from "express";
const app = express();
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Job from './models/Job.js';
import User from './models/User.js';
import bcrypt from "bcrypt";
import Vehicle from './models/Vehicles.js';
import nodemailer from 'nodemailer';


app.use(express.json());

app.post('/api/vehicles/add', async (req, res) => {
    try {
      const { customerId, make, model, year, vin, licensePlate } = req.body;
  
      const newVehicle = new Vehicle({
        customerId,
        make,
        model,
        year,
        vin,
        licensePlate
      });
  
      await newVehicle.save();
      res.status(201).json({ success: true, message: 'Vehicle added successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

app.post('/api/employees/create', async (req, res) => {
    try {
      const { email, password, username, phone, isAdmin } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        email,
        password: hashedPassword,
        username,
        phone,
        role: isAdmin ? 'admin' : 'employee'
      });
  
      await newUser.save();
      res.status(201).json({ success: true, message: 'Employee account created successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  
// Inline login route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ success: false, message: 'User not found' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });
  
      let redirectPage = '/customerMainPage.html';
if (user.role === 'employee') redirectPage = '/employee-dashboard.html';
if (user.role === 'admin') redirectPage = '/adminMain.html';

res.status(200).json({
  success: true,
  redirect: redirectPage, // ✅ use the correct path based on role
  userId: user._id
});

  
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend")));
app.use(express.static(path.join(__dirname,'..?frontend')));
app.use('/js', express.static(path.join(__dirname, '../Frontend/js')));

// API route: Get all jobs for a specific customer
app.get('/api/jobs/customer/:id', async (req, res) => {
    try {
      const jobs = await Job.find({ customerId: req.params.id })
        .populate('vehicleId')
        .populate('mechanicId');
      res.json(jobs);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
});

// API route: Get all jobs for a specific employee (mechanic)
app.get('/api/jobs/employee/:id', async (req, res) => {
  try {
    const jobs = await Job.find({ mechanicId: req.params.id })
      .populate('vehicleId')
      .populate('customerId');
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching jobs for employee' });
  }
});


// Admin: Get all vehicles
app.get('/api/vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('customerId', 'username');
    res.json(vehicles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching vehicles' });
  }
});

// Admin: Get all employees
app.get('/api/users/employees', async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' });
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching employees' });
  }
});

// Admin: Get all vehicles
app.get('/api/vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('customerId', 'username');
    res.json(vehicles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching vehicles' });
  }
});

// Admin: Get all employees
app.get('/api/users/employees', async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' });
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching employees' });
  }
});

app.patch('/api/jobs/:id/status', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    job.status = req.body.status;
    if (req.body.status === 'in progress' && !job.startDate) {
      job.startDate = new Date();
    }

    await job.save();
    res.json({ message: 'Status updated', job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating status' });
  }
});

app.patch('/api/jobs/:id/complete', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    job.status = 'complete';
    job.completedDate = new Date();

    if (req.body.updateMessage) {
      job.updates.push({ message: req.body.updateMessage });
    }

    await job.save();
    res.json({ message: 'Job marked complete', job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error completing job' });
  }
});


// Admin: Create a job
app.post('/api/jobs/create', async (req, res) => {
  try {
    const { vehicleId, mechanicId, description, status, appointmentDate } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    const mechanic = await User.findById(mechanicId);

    if (!vehicle) return res.status(400).json({ message: 'Vehicle not found' });
    if (!mechanic || mechanic.role !== 'employee') return res.status(400).json({ message: 'Invalid mechanic' });

    const newJob = new Job({
      customerId: vehicle.customerId,
      vehicleId,
      mechanicId,
      description,
      status,
      appointmentDate
    });

    await newJob.save();
    res.status(201).json({ message: 'Job created successfully', job: newJob });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating job' });
  }
});


// Landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

// JS file served from backend
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

// Signup route
app.post('/api/signup', async (req, res) => {
    try {
      const { email, password, username, phone } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).send('User already exists');
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        email,
        password: hashedPassword,
        username,
        phone,
        role: 'customer'
      });
  
      await newUser.save();
      res.status(201).send('Signup successful');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
});

// Login and Signup pages
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "DASHPORTAL.html"))
});
app.get('/forgotpass', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "forgotpass.html"));
});
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "signup.html"));
});
app.get('/createAccount', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "createAccount.html"));
});
app.get('/forgotpassconf', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "forgotpassconf.html"));
});
app.get('/resetpass', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "resetpass.html"));
});
app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "success.html"));
});

// Admin pages
app.get('/adminMain', (req,res)=>{
    res.sendFile(path.join(__dirname, "../frontend", "adminMain.html"));
});
app.get('/appointments', (req,res)=>{
    res.sendFile(path.join(__dirname, "../frontend", "appointments.html"));
});
app.get('/reviews', (req,res)=>{
    res.sendFile(path.join(__dirname, "../frontend", "reviews.html"));
});
app.get('/newEmployee', (req,res)=>{
    res.sendFile(path.join(__dirname, "../frontend", "newEmployee.html"));
});
app.get('/payroll', (req,res)=>{
    res.sendFile(path.join(__dirname, "../frontend", "payroll.html"));
});
app.get('/approval', (req,res)=>{
    res.sendFile(path.join(__dirname, "../frontend", "approval.html"));
});
app.get('/createJob',(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend","createJob.html"));
});

// Customer pages
app.get('/customerMainPage', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "customerMainPage.html"));
});
app.get('/customerJobsProfile', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "customerJobsProfile.html"));
});
app.get('/customerRequestAppointment', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "customerRequestAppointment.html"));
});
app.get('/myCars', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "myCars.html"));
});
app.get('/upcomingAppointment', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "upcomingAppointment.html"));
});
app.get('/jobProgress', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "jobProgress.html"));
});
app.get('/jobHistory', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "jobHistory.html"));
});
app.get('/jobReview', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "jobReview.html"));
});
app.get('/requestSent', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "requestSent.html"));
});
app.get('/carInfo', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "carInfo.html"));
});
app.get('/addCar', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "addCar.html"));
});

// Employee pages
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

  //customerRequestAppointment start----------------

  import Appointment from "./Models/AppointmentRequest.js";
app.use(express.urlencoded({extended: true}));

//test appointment router
app.post("/createAppointment", async (req, res) => {
  console.log("📥 Incoming appointment:", req.body); // ADD THIS LINE

  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    //res.status(201).json({ message: "Appointment saved!", appointment });
    res.redirect("/customerMainPage");
  } catch (err) {
    console.error("❌ Error saving appointment:", err);
    res.status(500).json({ error: "Failed to save appointment" });
  }
});
  //customerRequestAppointment end--------------
  app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'Email not found' });
  
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
      user.resetOtp = otp;
      user.otpExpires = otpExpires;
      await user.save();
  
      // ✉️ Send OTP via email using Nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,     // your email
          pass: process.env.EMAIL_PASS      // app password or email pass
        }
      });
  
      await transporter.sendMail({
        from: `"Joe's Auto" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Password Reset OTP',
        text: `Your OTP code is: ${otp} — valid for 10 minutes.`
      });
  
      res.json({ message: 'OTP sent' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error sending OTP' });
    }
  });
  
  // ✅ 2. Verify OTP
  app.post('/api/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user || user.resetOtp !== otp || user.otpExpires < new Date()) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }
  
      user.resetOtp = null;
      user.otpExpires = null;
      user.canReset = true; // flag to allow reset
      await user.save();
  
      res.json({ message: 'OTP verified' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Verification error' });
    }
  });
  
  // ✅ 3. Reset password
  app.post('/api/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user || !user.canReset) return res.status(403).json({ message: 'Not authorized to reset password' });
  
      const hashed = await bcrypt.hash(newPassword, 10);
      user.password = hashed;
      user.canReset = false;
      await user.save();
  
      res.json({ message: 'Password reset successful' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Password reset failed' });
    }
  });
  

dotenv.config();

app.listen(5000, () => {
    console.log("Server is ready at http://localhost:5000");
    connectDB();
});
