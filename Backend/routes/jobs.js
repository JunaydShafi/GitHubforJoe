import express from 'express';
import Job from '../models/Job.js';

const router = express.Router();

// const customerId = localStorage.getItem('userId')

// Mock auth middleware
router.use((req, res, next) => {
  req.user = { _id: job.find({customerId: req.user._id}), role: 'customer' }; // Replace with real auth
  next();
});

// GET /api/jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ customerId: req.user._id })
      .populate('vehicleId')
      .populate('mechanicId');

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

export default router;
