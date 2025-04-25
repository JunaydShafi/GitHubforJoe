import express from 'express';
import Job from '../models/Job.js';
import jwt from 'jsonwebtoken';

const router = express.Router();


// Middleware to verify JWT token and authenticate the user
router.use(async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header (Bearer token)

    if (!token) {
      return res.status(401).json({ error: 'No token provided, please log in.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = decoded; // Attach the user information to the request object
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(403).json({ error: 'Invalid token or session expired' });
  }
});

// GET /api/jobs
router.get('/', async (req, res) => {
  try {
    // Fetch jobs for the logged-in user (use req.user._id to get the logged-in user’s ID)
    const jobs = await Job.find({ customerId: req.user.id })
      .populate('vehicleId')  // Ensure this is working, or you can remove these if not needed
      .populate('mechanicId');

    if (jobs.length === 0) {
      return res.status(200).json([]); // Return an empty array if no jobs are found
    }

    return res.json(jobs);  // Return the jobs as the response
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

export default router;
