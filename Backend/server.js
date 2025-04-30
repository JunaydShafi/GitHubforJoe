import express from "express";
const app = express();
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from 'body-parser';
import loginRouter from './routes/login.js'; // Import the login route
import jobsRoutes from './routes/jobs.js'; // Import the jobs route
import Job from './models/Job.js';
import User from './models/User.js';
import bcrypt from "bcrypt";
import Vehicle from './models/Vehicles.js';
import nodemailer from 'nodemailer';
import AppointmentRequest from './models/AppointmentRequest.js';
import mongoose from 'mongoose';  // <--- ADD this at top if not already there


app.use(express.json());


app.get('/api/payroll', async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' });
    const data = employees.map(emp => {
      const { minutes, overtime, rate } = emp.payroll || {};
      const basePay = ((minutes || 0) / 60) * (rate || 0);
      const otPay = (overtime || 0) * (rate || 0) * 1.5;
      const total = basePay + otPay;



      return {
        name: emp.username,
        minutes,
        overtime,
        rate,
        total
      };
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load payroll' });
  }
});

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

  app.post('/api/jobs/create-from-appointment/:appointmentId', async (req, res) => {
    try {
      const { appointmentId } = req.params;
      const { mechanicId } = req.body;
  
      const appointment = await AppointmentRequest.findById(appointmentId);
  
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
  
      const newJob = new Job({
        customerId: appointment.customerId ? new mongoose.Types.ObjectId(appointment.customerId) : undefined,
        vehicleId: appointment.vehicleId,
        mechanicId,
        description: appointment.reason,
        status: 'pending',
        startDate: appointment.date
      });
  
      await newJob.save();
  
      res.status(201).json({ success: true, message: 'Job created successfully', job: newJob });
    } catch (err) {
      console.error('Error creating job from appointment:', err);
      res.status(500).json({ error: 'Server error creating job' });
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
        role: isAdmin ? 'admin' : 'employee',
        payroll: {
          hours: 0,
          overtime: 0,
          rate: 20
        }
      });
        
      await newUser.save();
      res.status(201).json({ success: true, message: 'Employee account created successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  /*
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
  */
  
  // Middleware
app.use(bodyParser.json());

// Use the login route
app.use('/api/auth', loginRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend")));
app.use(express.static(path.join(__dirname,'..?frontend')));
app.use('/js', express.static(path.join(__dirname, '../Frontend/js')));

// NEW - Find jobs for a specific customer
app.get('/api/jobs/customer/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const jobs = await Job.find({ customerId })
      .populate('vehicleId')
      .populate('mechanicId');

    res.json(jobs);
  } catch (err) {
    console.error('Error fetching customer jobs:', err);
    res.status(500).json({ error: 'Server error fetching customer jobs' });
  }
});
app.use('/api/jobs',jobsRoutes);





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

app.get('/api/payroll/:id', async (req, res) => {
  try {
    const emp = await User.findById(req.params.id);
    if (!emp || emp.role !== 'employee') return res.status(404).json({ error: 'Not found' });

    const { minutes, overtime, rate } = emp.payroll || {};
    const basePay = ((minutes || 0) / 60) * (rate || 0);
    const otPay = (overtime || 0) * (rate || 0) * 1.5;
    const total = basePay + otPay;

    res.json({ minutes, rate, total, overtime, otPay });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load payroll' });
  }
});

app.get('/api/payroll/:id/week', async (req, res) => {
  try {
    const { id } = req.params;
    const { start, end } = req.query;
    const startDate = new Date(start);
    const endDate = new Date(end);

    const emp = await User.findById(id);
    if (!emp || emp.role !== 'employee') return res.status(404).json({ error: 'Not found' });

    const jobs = await Job.find({
      mechanicId: id,
      status: 'complete',
      completedDate: { $gte: startDate, $lte: endDate }
    });

    const totalMinutes = jobs.reduce((sum, job) => {
      const start = new Date(job.startDate);
      const end = new Date(job.completedDate);
      return sum + (end - start) / (1000 * 60);
    }, 0);

    const rate = emp.payroll?.rate || 0;
    const total = (totalMinutes / 60) * rate;
    const otPay = (emp.payroll?.overtime || 0) * rate * 1.5;

    res.json({
      minutes: totalMinutes,
      rate,
      total,
      overtime: emp.payroll?.overtime || 0,
      otPay
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load weekly payroll for employee' });
  }
});

app.get('/api/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('vehicleId')
      .populate('mechanicId');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving job' });
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

app.get('/api/appointments/customer/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const appointments = await AppointmentRequest.find({ customerId: id });
    res.json(appointments);
  } catch (err) {
    console.error('❌ Error fetching customer appointments:', err);
    res.status(500).json({ error: 'Server error' });
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

app.get('/api/payroll/week', async (req, res) => {
  try {
    const { start, end } = req.query;
    const startDate = new Date(start);
    const endDate = new Date(end);

    const employees = await User.find({ role: 'employee' });
    const jobs = await Job.find({
      status: 'complete',
      completedDate: { $gte: startDate, $lte: endDate }
    });

    const payrollMap = {};

    for (const job of jobs) {
      const start = new Date(job.startDate);
      const end = new Date(job.completedDate);
      const mins = (end - start) / (1000 * 60);
      const empId = job.mechanicId.toString();

      payrollMap[empId] = (payrollMap[empId] || 0) + mins;
    }

    const results = employees.map(emp => {
      const minutes = payrollMap[emp._id.toString()] || 0;
      const rate = emp?.payroll?.rate || 0;
      const total = (minutes / 60) * rate;
      return {
        name: emp.username,
        minutes,
        rate,
        total: total.toFixed(2)
      };
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load weekly payroll' });
  }
});






app.patch('/api/jobs/:id/add-update', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (!req.body.message || req.body.message.trim() === "") {
      return res.status(400).json({ message: 'Update message cannot be empty' });
    }

    job.updates.push({ message: req.body.message });
    await job.save();

    res.json({ message: 'Update added successfully', job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding update' });
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

    // Calculate hours worked
    const start = new Date(job.startDate);
    const end = new Date(job.completedDate);
    const minutesWorked = (end - start) / (1000 * 60);

    // Add to employee's payroll
    const mechanic = await User.findById(job.mechanicId);
    if (mechanic && mechanic.role === 'employee') {
      mechanic.payroll.minutes = (mechanic.payroll.minutes || 0) + minutesWorked;
      await mechanic.save();
    }


    await job.save();
    res.json({ message: 'Job marked complete', job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error completing job' });
  }
});

app.patch('/api/payroll/:id', async (req, res) => {
  try {
    const { hours, overtime, rate } = req.body;
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'employee') return res.status(404).json({ message: 'Employee not found' });

    user.payroll = { hours, overtime, rate };
    await user.save();

    res.json({ message: 'Payroll updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error updating payroll' });
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
app.use(express.urlencoded({extended: true}));


  import Appointment from "./models/AppointmentRequest.js";
app.use(express.urlencoded({extended: true}));

import reviewRoutes from './routes/reviews.js';
app.use('/api/reviews', reviewRoutes);




app.post("/createAppointment", async (req, res) => {
  console.log("📥 Incoming appointment:", req.body);

  try {
    const { firstName, lastName, email, phone, vehicleId, reason, appointmentDate } = req.body;
    const customerId = req.session?.userId || req.body.customerId;  // ← this is how you get who made it (if you track session)

    const appointment = new Appointment({
      customerId,      // ✅ Save customer ID
      vehicleId,       // ✅ Save vehicle ID
      firstName,
      lastName,
      email,
      phone,
      reason,
      date: new Date(appointmentDate),
    });

    await appointment.save();
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
  


  // retreive customerRequestAppointment to output on admins view appointment START


  app.get("/api/admin/appointments", async (req, res) => {
    try {
      const appointments = await Appointment.find({ status: "pending" });
      res.json(appointments);
    } catch (error) {
      console.error("❌ Failed to fetch appointments:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  //retreive customerRequestAppointment to output on admins view appointment END

  // Backend Points STart
  app.post("/api/admin/appointments/:id/approve", async (req, res) => {
    try {
      const { id } = req.params;
      await Appointment.findByIdAndUpdate(id, { status: "approved" });
      res.json({ message: "Appointment approved" });
    } catch (err) {
      console.error("❌ Error approving:", err);
      res.status(500).json({ error: "Failed to approve" });
    }
  });
  
  app.post("/api/admin/appointments/:id/deny", async (req, res) => {
    try {
      const { id } = req.params;
      await Appointment.findByIdAndUpdate(id, { status: "denied" });
      res.json({ message: "Appointment denied" });
    } catch (err) {
      console.error("❌ Error denying:", err);
      res.status(500).json({ error: "Failed to deny" });
    }
  });
  //Backend points ENd

  //Page to view the database objects on admin/appointments
  app.get('/api/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find({});
        res.json(appointments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});



dotenv.config();

// Import nodemailer for email sending START

// Create transporter once and reuse
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

// DELETE appointment route (used in admin/appointments)
app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Send denial email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: appointment.email,
      subject: 'Appointment Denied - Joe\'s AutoShop',
      text: `Hello ${appointment.firstName} ${appointment.lastName},

Unfortunately, your appointment request for ${appointment.date} has been denied.
If you have any questions or would like to reschedule, please contact us at (916) 553-4249.

Best,
Joe's AutoShop Team`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email sending failed:', error);
      } else {
        console.log('Denial email sent:', info.response);
      }
    });

    res.json({ message: 'Appointment denied and deleted', appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST route to approve appointment and send approval email
app.post('/approve-appointment', async (req, res) => {
  const { appointmentId } = req.body;

  try {
    const appointment = await AppointmentRequest.findById(appointmentId);
    if (!appointment) {
      return res.status(404).send('Appointment not found');
    }

    console.log(`Appointment ${appointmentId} approved.`);

    // Step 1: Send approval email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: appointment.email,
      subject: 'Appointment Approved - Joe\'s AutoShop',
      text: `Hi ${appointment.firstName} ${appointment.lastName},

Your appointment on ${appointment.date} has been approved.
We look forward to seeing you!

Bring your car down to the shop on the requested date and time, if you need more information on where we are located check the homepage for more information.

Best,
Joe's AutoShop Team`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Approval email failed:', error);
        return res.status(500).send('Email failed to send');
      } else {
        console.log('Approval email sent:', info.response);
      }
    });

    // Step 2: Delete the appointment from the DB after email is sent
    await AppointmentRequest.findByIdAndDelete(appointmentId);
    console.log(`Appointment ${appointmentId} deleted after approval.`);

    res.send('Approval and email sent, appointment deleted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error approving appointment');
  }
});
// Approve appointment route END

//cleanup on email
app.delete('/api/appointments/clean/:id', async (req, res) => {
  try {
    const appointment = await AppointmentRequest.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ message: 'Appointment deleted after approval', appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting appointment after approval' });
  }
});


//to send info to database in createJob.html

app.post('/api/createJob', async (req, res) => {
  try {
    const { customerId, vehicleId, mechanicId, status, description, startDate } = req.body;

    const newJob = new Job({
      customerId,
      vehicleId,
      mechanicId,
      status,
      description,
      startDate
    });

    await newJob.save();

    res.status(201).json({ message: 'Job created successfully' });
  } catch (err) {
    console.error('Error creating job:', err);
    res.status(500).json({ error: 'Failed to create job' });
  }
});


//grab mechanics for createJob.html
app.get('/api/mechanics', async (req, res) => {
  const mechanics = await User.find({ role: 'employee' });
  res.json(mechanics);
});


app.listen(5000, () => {
    console.log("Server is ready at http://localhost:5000");
    connectDB();
});