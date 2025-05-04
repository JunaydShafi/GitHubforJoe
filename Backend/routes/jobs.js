import express from 'express';
import Job from '../models/Job.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose'; // ✅ good you already have this

const router = express.Router();

// Middleware to verify JWT token and authenticate the user
router.use(async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header (Bearer token)

    if (!token) {
      return res.status(401).json({ error: 'No token provided, please log in.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = decoded; // Attach the user info to the request
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(403).json({ error: 'Invalid token or session expired' });
  }
});

// ✅ FIX THIS ROUTE: Make it expect an employee ID
router.get('/employee/:id', async (req, res) => {
  try {
    const mechanicId = new mongoose.Types.ObjectId(req.params.id); // 🔥 fix: convert to ObjectId

    const jobs = await Job.find({ mechanicId })
      .populate('vehicleId')
      .populate('customerId');   // populate customer too if you want names

    if (jobs.length === 0) {
      return res.status(200).json([]); // Send empty array if no jobs
    }

    return res.json(jobs); // send jobs
  } catch (err) {
    console.error('Error fetching jobs for mechanic:', err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Route to start a job and set estimated time
router.patch('/start/:jobId', async (req, res) => {
  try {
    const { estimatedMinutes } = req.body;
    const jobId = req.params.jobId;

    const job = await Job.findByIdAndUpdate(
      jobId,
      {
        startDate: new Date(),
        estimatedMinutes: estimatedMinutes,
        status: "in progress"  // ← ADD THIS LINE
      },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (err) {
    console.error('Error starting job:', err);
    res.status(500).json({ error: 'Failed to start job' });
  }
});

router.patch('/stop/:jobId', async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const job = await Job.findByIdAndUpdate(
      jobId,
      {
        stopDate: new Date(),
        status: "paused"  // Optional: You could also just keep it "in progress" and just pause the timer
      },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (err) {
    console.error('Error stopping job:', err);
    res.status(500).json({ error: 'Failed to stop job' });
  }
});

export default router;